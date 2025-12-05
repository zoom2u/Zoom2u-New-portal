import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import {
  LayoutDashboard,
  Package,
  Plus,
  History,
  Wallet,
  MapPin,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Building2,
  Truck,
  BarChart3,
  FileText,
  Shield,
} from 'lucide-react'

const customerNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/book', icon: Plus, label: 'New Booking' },
  { to: '/deliveries', icon: Package, label: 'My Deliveries' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/addresses', icon: MapPin, label: 'Address Book' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/bookings', icon: Package, label: 'All Bookings' },
  { to: '/admin/tenants', icon: Building2, label: 'Tenants' },
  { to: '/admin/drivers', icon: Truck, label: 'Drivers' },
  { to: '/admin/pricing', icon: FileText, label: 'Pricing' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/audit', icon: Shield, label: 'Audit Log' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const { profile, logout } = useAuthStore()
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore()
  const location = useLocation()

  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'csa' || profile?.role === 'senior_csa'
  const navItems = isAdmin && location.pathname.startsWith('/admin') ? adminNavItems : customerNavItems

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      className="fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <motion.div
          initial={false}
          animate={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto' }}
          className="overflow-hidden"
        >
          <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent whitespace-nowrap">
            Zoom2u
          </span>
        </motion.div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft
            className={cn(
              'h-5 w-5 transition-transform duration-300',
              sidebarCollapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-slate-800',
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                      : 'text-slate-400 hover:text-white'
                  )
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <motion.span
                  initial={false}
                  animate={{
                    opacity: sidebarCollapsed ? 0 : 1,
                    width: sidebarCollapsed ? 0 : 'auto',
                  }}
                  className="whitespace-nowrap overflow-hidden text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800">
        <NavLink
          to="/help"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <HelpCircle className="h-5 w-5 flex-shrink-0" />
          <motion.span
            initial={false}
            animate={{
              opacity: sidebarCollapsed ? 0 : 1,
              width: sidebarCollapsed ? 0 : 'auto',
            }}
            className="whitespace-nowrap overflow-hidden text-sm font-medium"
          >
            Help & Support
          </motion.span>
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors mt-1"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <motion.span
            initial={false}
            animate={{
              opacity: sidebarCollapsed ? 0 : 1,
              width: sidebarCollapsed ? 0 : 'auto',
            }}
            className="whitespace-nowrap overflow-hidden text-sm font-medium"
          >
            Log Out
          </motion.span>
        </button>
      </div>
    </motion.aside>
  )
}

