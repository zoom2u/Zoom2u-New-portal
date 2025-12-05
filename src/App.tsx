import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

// Layouts
import { Layout, AuthLayout, PublicLayout } from '@/components/layout/Layout'

// Public Pages
import { Landing } from '@/pages/Landing'

// Auth Pages
import { Login } from '@/pages/auth/Login'
import { Register } from '@/pages/auth/Register'

// Customer Pages
import { Dashboard } from '@/pages/Dashboard'
import { BookingWizard } from '@/pages/BookingWizard'
import { Deliveries } from '@/pages/Deliveries'

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminBookings } from '@/pages/admin/AdminBookings'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, profile, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'csa' || profile?.role === 'senior_csa'
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function AuthStateListener() {
  const { setUser, setProfile, setTenant, setLoading, logout } = useAuthStore()

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        // Fetch profile
        supabase
          .from('user_profiles')
          .select('*, tenants(*)')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setProfile(profile)
              if (profile.tenants) {
                setTenant(profile.tenants as never)
              }
            }
          })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*, tenants(*)')
            .eq('id', session.user.id)
            .single()
          
          if (profile) {
            setProfile(profile)
            if (profile.tenants) {
              setTenant(profile.tenants as never)
            }
          }
        } else if (event === 'SIGNED_OUT') {
          logout()
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setTenant, setLoading, logout])

  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthStateListener />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/track/:trackingId" element={<div>Tracking Page</div>} />
            <Route path="/services" element={<div>Services Page</div>} />
            <Route path="/pricing" element={<div>Pricing Page</div>} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<div>Forgot Password</div>} />
          </Route>

          {/* Protected Customer Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/book" element={<BookingWizard />} />
            <Route path="/deliveries" element={<Deliveries />} />
            <Route path="/deliveries/:id" element={<div>Delivery Details</div>} />
            <Route path="/history" element={<div>History Page</div>} />
            <Route path="/wallet" element={<div>Wallet Page</div>} />
            <Route path="/addresses" element={<div>Address Book</div>} />
            <Route path="/team" element={<div>Team Management</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
            <Route path="/profile" element={<div>Profile</div>} />
            <Route path="/company" element={<div>Company Settings</div>} />
            <Route path="/help" element={<div>Help & Support</div>} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/bookings/:id" element={<div>Admin Booking Details</div>} />
            <Route path="/admin/tenants" element={<div>Tenant Management</div>} />
            <Route path="/admin/drivers" element={<div>Driver Management</div>} />
            <Route path="/admin/pricing" element={<div>Pricing Configuration</div>} />
            <Route path="/admin/analytics" element={<div>Analytics Dashboard</div>} />
            <Route path="/admin/audit" element={<div>Audit Log</div>} />
            <Route path="/admin/settings" element={<div>Admin Settings</div>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
