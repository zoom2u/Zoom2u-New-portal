export type DeliveryStatus = 
  | 'pending'
  | 'scheduled'
  | 'picked_up'
  | 'on_route'
  | 'delivered'
  | 'on_hold'
  | 'failed'
  | 'redelivered'

export type ServiceType =
  | 'standard'
  | 'vip'
  | 'same_day'
  | 'large_freight'
  | 'interstate'
  | 'next_flight'
  | 'marketplace'
  | 'recurring'
  | 'sign_return'
  | 'pack_delivery'
  | 'document_shredding'
  | 'rubbish_removal'
  | 'special_request'

export type ServiceLevel = 'vip' | 'standard' | 'same_day'

export type UserRole = 'super_admin' | 'admin' | 'csa' | 'senior_csa' | 'customer' | 'driver'

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          custom_graphic_url: string | null
          custom_message: string | null
          primary_color: string | null
          secondary_color: string | null
          default_base_fee: number
          default_km_rate: number
          batch_base_fee: number
          vip_cutoff_time: string
          same_day_cutoff_time: string
          standard_cutoff_time: string
          vip_sla_hours: number
          standard_sla_hours: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tenants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tenants']['Insert']>
      }
      user_profiles: {
        Row: {
          id: string
          tenant_id: string
          email: string
          full_name: string
          phone: string | null
          role: UserRole
          company_name: string | null
          company_logo_url: string | null
          email_verified: boolean
          address_verified: boolean
          wallet_balance: number
          default_pickup_notes: string | null
          default_dropoff_notes: string | null
          invoicing_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at' | 'wallet_balance'>
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          tenant_id: string | null
          label: string
          street_address: string
          suburb: string
          state: string
          postcode: string
          country: string
          contact_name: string | null
          contact_phone: string | null
          contact_email: string | null
          pickup_notes: string | null
          delivery_notes: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['addresses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['addresses']['Insert']>
      }
      deliveries: {
        Row: {
          id: string
          tenant_id: string
          tracking_id: string
          customer_id: string
          driver_id: string | null
          service_type: ServiceType
          service_level: ServiceLevel
          status: DeliveryStatus
          pickup_address_id: string
          dropoff_address_id: string
          pickup_address_text: string
          dropoff_address_text: string
          pickup_lat: number | null
          pickup_lng: number | null
          dropoff_lat: number | null
          dropoff_lng: number | null
          distance_km: number
          estimated_delivery_time: string
          actual_pickup_time: string | null
          actual_delivery_time: string | null
          is_on_route: boolean
          package_description: string | null
          package_weight_kg: number | null
          package_dimensions: string | null
          special_instructions: string | null
          pickup_notes: string | null
          dropoff_notes: string | null
          requires_signature: boolean
          requires_photo: boolean
          driver_service_fee: number
          platform_fee: number
          booking_fee: number
          freight_protection_fee: number
          total_cost: number
          customer_paid: number
          driver_paid: number
          freight_protection_enabled: boolean
          freight_value: number | null
          signature_url: string | null
          photo_urls: string[] | null
          delivery_location_lat: number | null
          delivery_location_lng: number | null
          batch_id: string | null
          is_batch_delivery: boolean
          marketplace_job: boolean
          suggested_price: number | null
          winning_bid_id: string | null
          named_driver_requested: boolean
          preferred_driver_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['deliveries']['Row'], 'id' | 'tracking_id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['deliveries']['Insert']>
      }
      delivery_audit_log: {
        Row: {
          id: string
          delivery_id: string
          tenant_id: string
          user_id: string
          action: string
          previous_value: Record<string, unknown> | null
          new_value: Record<string, unknown> | null
          approval_status: 'pending' | 'approved' | 'rejected' | null
          approved_by: string | null
          approved_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['delivery_audit_log']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['delivery_audit_log']['Insert']>
      }
      pricing_plans: {
        Row: {
          id: string
          tenant_id: string
          customer_id: string | null
          name: string
          base_fee: number
          km_rate_standard: number
          km_rate_vip: number
          km_rate_same_day: number
          batch_base_fee: number
          platform_fee_percent: number
          booking_fee: number
          freight_protection_percent: number
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pricing_plans']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pricing_plans']['Insert']>
      }
      drivers: {
        Row: {
          id: string
          user_id: string
          tenant_id: string
          vehicle_type: string
          vehicle_registration: string
          license_number: string
          is_available: boolean
          current_lat: number | null
          current_lng: number | null
          rating: number
          total_deliveries: number
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['drivers']['Row'], 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_deliveries'>
        Update: Partial<Database['public']['Tables']['drivers']['Insert']>
      }
      driver_preferences: {
        Row: {
          id: string
          customer_id: string
          driver_id: string
          tenant_id: string
          preference_type: 'preferred' | 'banned'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['driver_preferences']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['driver_preferences']['Insert']>
      }
      marketplace_bids: {
        Row: {
          id: string
          delivery_id: string
          driver_id: string
          tenant_id: string
          bid_amount: number
          message: string | null
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['marketplace_bids']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['marketplace_bids']['Insert']>
      }
      airport_routes: {
        Row: {
          id: string
          tenant_id: string
          origin_airport: string
          origin_code: string
          destination_airport: string
          destination_code: string
          base_price: number
          cubic_pricing_matrix: Record<string, number>
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['airport_routes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['airport_routes']['Insert']>
      }
      recurring_deliveries: {
        Row: {
          id: string
          tenant_id: string
          customer_id: string
          delivery_template: Record<string, unknown>
          frequency: 'daily' | 'weekly' | 'monthly'
          next_run: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['recurring_deliveries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['recurring_deliveries']['Insert']>
      }
      messages: {
        Row: {
          id: string
          delivery_id: string
          sender_id: string
          receiver_id: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          tenant_id: string
          type: 'deposit' | 'withdrawal' | 'payment' | 'refund'
          amount: number
          balance_after: number
          description: string
          reference_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wallet_transactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['wallet_transactions']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      delivery_status: DeliveryStatus
      service_type: ServiceType
      service_level: ServiceLevel
      user_role: UserRole
    }
  }
}

// Convenience types
export type Tenant = Database['public']['Tables']['tenants']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Address = Database['public']['Tables']['addresses']['Row']
export type Delivery = Database['public']['Tables']['deliveries']['Row']
export type DeliveryAuditLog = Database['public']['Tables']['delivery_audit_log']['Row']
export type PricingPlan = Database['public']['Tables']['pricing_plans']['Row']
export type Driver = Database['public']['Tables']['drivers']['Row']
export type DriverPreference = Database['public']['Tables']['driver_preferences']['Row']
export type MarketplaceBid = Database['public']['Tables']['marketplace_bids']['Row']
export type AirportRoute = Database['public']['Tables']['airport_routes']['Row']
export type RecurringDelivery = Database['public']['Tables']['recurring_deliveries']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type WalletTransaction = Database['public']['Tables']['wallet_transactions']['Row']

