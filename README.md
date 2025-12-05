# Zoom2u Multi-Tenanted Delivery & Logistics Platform

A comprehensive, enterprise-grade delivery and logistics platform built with React, TypeScript, and Supabase.

![Zoom2u Platform](https://via.placeholder.com/1200x600/0284c7/ffffff?text=Zoom2u+Delivery+Platform)

## 🚀 Features

### Multi-Tenancy
- Secure tenant isolation with database-level separation
- Customizable branding per tenant (logo, colors, messaging)
- Tenant-specific pricing plans and service configurations

### Delivery Services
- **Standard Delivery** - Small to medium packages with 3-hour SLA
- **VIP Express** - 1-hour priority delivery
- **Same Day** - Delivery by end of business day
- **Large Freight** - Heavy items and pallets
- **Interstate** - Cross-state logistics
- **Next Flight** - Airport-to-airport urgent delivery
- **Marketplace** - Driver bidding system
- **Recurring** - Scheduled daily/weekly/monthly deliveries
- **Sign & Return** - Document handling with signature capture
- **Pack & Delivery** - Custom quoting with photo upload
- **Special Services** - Document shredding, rubbish removal

### Customer Portal
- Quick quote without login (guest checkout)
- Full booking wizard with step-by-step guidance
- Batch delivery mode for high-volume operations
- Real-time tracking with driver communication
- Wallet system with Stripe integration
- Address book management
- Preferred/banned driver preferences
- Team member management

### Admin Portal
- High-performance booking dashboard with Redis caching
- Real-time status updates across all tenants
- Customer Service Agent (CSA) workflows
- Financial adjustment controls with approval system
- Comprehensive audit logging
- Service cutoff time configuration
- Dynamic pricing matrix management
- Airport route pricing configuration

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Payments**: Stripe
- **Forms**: React Hook Form + Zod validation

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zoom2u/Zoom2u-New-portal.git
cd Zoom2u-New-portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - Supabase URL and anon key
   - Stripe publishable key
   - Google Maps API key (optional, for address autocomplete)

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Database Setup

Run the Supabase migrations to set up the database schema:

```bash
# Using Supabase CLI
supabase db push
```

Or apply the migrations manually through the Supabase dashboard.

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, Header, etc.)
│   └── ui/              # Reusable UI components
├── lib/
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # Utility functions
├── pages/
│   ├── admin/           # Admin portal pages
│   └── auth/            # Authentication pages
├── stores/
│   ├── authStore.ts     # Authentication state
│   ├── deliveryStore.ts # Delivery/booking state
│   └── uiStore.ts       # UI state (toasts, modals, etc.)
├── types/
│   └── database.ts      # TypeScript types for database
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🔐 Authentication Flow

1. **Sign Up**: Email verification + address validation required
2. **Guest Checkout**: Quick quote → Book → Background account creation
3. **Login**: Email/password with session persistence
4. **Role-Based Access**: Customer, CSA, Senior CSA, Admin, Super Admin

## 💳 Payment Integration

- Stripe for all payments
- Direct debit setup for businesses
- Wallet top-up functionality
- Automated invoicing with itemized breakdown

## 📊 Pricing Structure

```
Total Cost = Base Fee + (Distance × KM Rate × Service Multiplier)
```

Components:
- **Driver Service Fee**: Amount paid to driver
- **Platform Fee**: Transaction handling fee
- **Booking Fee**: Platform usage fee
- **Freight Protection** (optional): 2% of declared value

## 🔄 Real-time Features

- Live delivery tracking
- Driver location updates
- Status change notifications
- In-app chat between customer and driver

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🚀 Deployment

Build the production bundle:

```bash
npm run build
```

Deploy the `dist` folder to your hosting provider of choice (Vercel, Netlify, Cloudflare Pages, etc.)

## 📄 License

Copyright © 2024 Zoom2u. All rights reserved.

## 🤝 Support

For support inquiries, please contact support@zoom2u.com.au
