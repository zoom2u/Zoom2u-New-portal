-- Zoom2u Multi-Tenanted Delivery Platform - Initial Schema
-- This migration creates the core database structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE delivery_status AS ENUM (
  'pending',
  'scheduled', 
  'picked_up',
  'on_route',
  'delivered',
  'on_hold',
  'failed',
  'redelivered'
);

CREATE TYPE service_type AS ENUM (
  'standard',
  'vip',
  'same_day',
  'large_freight',
  'interstate',
  'next_flight',
  'marketplace',
  'recurring',
  'sign_return',
  'pack_delivery',
  'document_shredding',
  'rubbish_removal',
  'special_request'
);

CREATE TYPE service_level AS ENUM ('vip', 'standard', 'same_day');

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'csa', 'senior_csa', 'customer', 'driver');

CREATE TYPE preference_type AS ENUM ('preferred', 'banned');

CREATE TYPE frequency_type AS ENUM ('daily', 'weekly', 'monthly');

CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'payment', 'refund');

CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected');

-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  custom_graphic_url TEXT,
  custom_message TEXT,
  primary_color VARCHAR(7) DEFAULT '#0284c7',
  secondary_color VARCHAR(7) DEFAULT '#f97316',
  default_base_fee DECIMAL(10,2) DEFAULT 9.90,
  default_km_rate DECIMAL(10,2) DEFAULT 1.80,
  batch_base_fee DECIMAL(10,2) DEFAULT 5.00,
  vip_cutoff_time TIME DEFAULT '17:00',
  same_day_cutoff_time TIME DEFAULT '12:00',
  standard_cutoff_time TIME DEFAULT '18:00',
  vip_sla_hours INTEGER DEFAULT 1,
  standard_sla_hours INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role user_role DEFAULT 'customer',
  company_name VARCHAR(255),
  company_logo_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  address_verified BOOLEAN DEFAULT FALSE,
  wallet_balance DECIMAL(10,2) DEFAULT 0.00,
  default_pickup_notes TEXT,
  default_dropoff_notes TEXT,
  invoicing_email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addresses table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  label VARCHAR(100) NOT NULL,
  street_address VARCHAR(500) NOT NULL,
  suburb VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postcode VARCHAR(10) NOT NULL,
  country VARCHAR(50) DEFAULT 'Australia',
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drivers table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  vehicle_type VARCHAR(50) NOT NULL,
  vehicle_registration VARCHAR(20) NOT NULL,
  license_number VARCHAR(50) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  rating DECIMAL(2, 1) DEFAULT 5.0,
  total_deliveries INTEGER DEFAULT 0,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Driver preferences (customer's preferred/banned drivers)
CREATE TABLE driver_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  preference_type preference_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, driver_id)
);

-- Pricing plans
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  customer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  base_fee DECIMAL(10,2) NOT NULL,
  km_rate_standard DECIMAL(10,2) NOT NULL,
  km_rate_vip DECIMAL(10,2) NOT NULL,
  km_rate_same_day DECIMAL(10,2) NOT NULL,
  batch_base_fee DECIMAL(10,2) NOT NULL,
  platform_fee_percent DECIMAL(5,2) DEFAULT 15.00,
  booking_fee DECIMAL(10,2) DEFAULT 2.50,
  freight_protection_percent DECIMAL(5,2) DEFAULT 2.00,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliveries table (core transactional data)
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  tracking_id VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES user_profiles(id),
  driver_id UUID REFERENCES drivers(id),
  service_type service_type NOT NULL,
  service_level service_level NOT NULL,
  status delivery_status DEFAULT 'pending',
  
  -- Addresses
  pickup_address_id UUID REFERENCES addresses(id),
  dropoff_address_id UUID REFERENCES addresses(id),
  pickup_address_text VARCHAR(500) NOT NULL,
  dropoff_address_text VARCHAR(500) NOT NULL,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  dropoff_lat DECIMAL(10, 8),
  dropoff_lng DECIMAL(11, 8),
  
  -- Distance and timing
  distance_km DECIMAL(10, 2) NOT NULL DEFAULT 0,
  estimated_delivery_time TIMESTAMPTZ,
  actual_pickup_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,
  is_on_route BOOLEAN DEFAULT FALSE,
  
  -- Package details
  package_description TEXT,
  package_weight_kg DECIMAL(10, 2),
  package_dimensions VARCHAR(100),
  special_instructions TEXT,
  pickup_notes TEXT,
  dropoff_notes TEXT,
  
  -- Proof of delivery requirements
  requires_signature BOOLEAN DEFAULT FALSE,
  requires_photo BOOLEAN DEFAULT TRUE,
  
  -- Pricing
  driver_service_fee DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  booking_fee DECIMAL(10, 2) NOT NULL,
  freight_protection_fee DECIMAL(10, 2) DEFAULT 0,
  total_cost DECIMAL(10, 2) NOT NULL,
  customer_paid DECIMAL(10, 2) DEFAULT 0,
  driver_paid DECIMAL(10, 2) DEFAULT 0,
  
  -- Insurance
  freight_protection_enabled BOOLEAN DEFAULT FALSE,
  freight_value DECIMAL(10, 2),
  
  -- Proof of delivery
  signature_url TEXT,
  photo_urls TEXT[],
  delivery_location_lat DECIMAL(10, 8),
  delivery_location_lng DECIMAL(11, 8),
  
  -- Batch delivery
  batch_id UUID,
  is_batch_delivery BOOLEAN DEFAULT FALSE,
  
  -- Marketplace
  marketplace_job BOOLEAN DEFAULT FALSE,
  suggested_price DECIMAL(10, 2),
  winning_bid_id UUID,
  
  -- Driver preferences
  named_driver_requested BOOLEAN DEFAULT FALSE,
  preferred_driver_id UUID REFERENCES drivers(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace bids
CREATE TABLE marketplace_bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  bid_amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  status bid_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery audit log (immutable)
CREATE TABLE delivery_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  action VARCHAR(100) NOT NULL,
  previous_value JSONB,
  new_value JSONB,
  approval_status approval_status,
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Airport routes for Next Flight service
CREATE TABLE airport_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  origin_airport VARCHAR(100) NOT NULL,
  origin_code VARCHAR(10) NOT NULL,
  destination_airport VARCHAR(100) NOT NULL,
  destination_code VARCHAR(10) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  cubic_pricing_matrix JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recurring deliveries
CREATE TABLE recurring_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  customer_id UUID NOT NULL REFERENCES user_profiles(id),
  delivery_template JSONB NOT NULL,
  frequency frequency_type NOT NULL,
  next_run TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES user_profiles(id),
  receiver_id UUID NOT NULL REFERENCES user_profiles(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet transactions
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  type transaction_type NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  reference_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_deliveries_tenant ON deliveries(tenant_id);
CREATE INDEX idx_deliveries_customer ON deliveries(customer_id);
CREATE INDEX idx_deliveries_driver ON deliveries(driver_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_tracking ON deliveries(tracking_id);
CREATE INDEX idx_deliveries_created ON deliveries(created_at DESC);
CREATE INDEX idx_deliveries_batch ON deliveries(batch_id) WHERE batch_id IS NOT NULL;

CREATE INDEX idx_user_profiles_tenant ON user_profiles(tenant_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

CREATE INDEX idx_drivers_tenant ON drivers(tenant_id);
CREATE INDEX idx_drivers_available ON drivers(is_available) WHERE is_available = TRUE;

CREATE INDEX idx_audit_log_delivery ON delivery_audit_log(delivery_id);
CREATE INDEX idx_audit_log_created ON delivery_audit_log(created_at DESC);

CREATE INDEX idx_messages_delivery ON messages(delivery_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

CREATE INDEX idx_wallet_user ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_created ON wallet_transactions(created_at DESC);

-- Row Level Security Policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE airport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can view deliveries in their tenant
CREATE POLICY "Users can view tenant deliveries"
  ON deliveries FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Users can insert deliveries in their tenant
CREATE POLICY "Users can create deliveries"
  ON deliveries FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (user_id = auth.uid());

-- Users can manage their own addresses
CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  USING (user_id = auth.uid());

-- Users can view their wallet transactions
CREATE POLICY "Users can view own wallet"
  ON wallet_transactions FOR SELECT
  USING (user_id = auth.uid());

-- Users can view messages for their deliveries
CREATE POLICY "Users can view delivery messages"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  );

-- Function to generate tracking ID
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TRIGGER AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'Z2U-';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  NEW.tracking_id := result;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-generating tracking ID
CREATE TRIGGER set_tracking_id
  BEFORE INSERT ON deliveries
  FOR EACH ROW
  WHEN (NEW.tracking_id IS NULL)
  EXECUTE FUNCTION generate_tracking_id();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_deliveries_updated_at
  BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON pricing_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable realtime for deliveries
ALTER PUBLICATION supabase_realtime ADD TABLE deliveries;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Insert default tenant
INSERT INTO tenants (name, slug, custom_message)
VALUES ('Zoom2u', 'zoom2u', 'Welcome to Zoom2u - Australia''s leading delivery platform');

