import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { Avatar } from '@/components/ui/Avatar'
import { formatCurrency } from '@/lib/utils'
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Wallet,
  Building2,
} from 'lucide-react'

export function Header() {
  const { profile, tenant, logout } = useAuthStore()
  const { toggleSidebar } = useUIStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-80">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search deliveries, tracking ID..."
            className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none w-full"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-slate-300 bg-white px-1.5 text-[10px] font-medium text-slate-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Wallet Balance */}
        {profile && (
          <Link
            to="/wallet"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
          >
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatCurrency(profile.wallet_balance)}
            </span>
          </Link>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-accent-500 rounded-full" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                </div>
                <div className="p-4 text-center text-sm text-slate-500">
                  No new notifications
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Avatar
              src={profile?.company_logo_url}
              fallback={profile?.full_name || profile?.email}
              size="sm"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-900 truncate max-w-[120px]">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate max-w-[120px]">
                {tenant?.name || 'Zoom2u'}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-slate-100">
                    <p className="font-medium text-slate-900">{profile?.full_name}</p>
                    <p className="text-sm text-slate-500">{profile?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/company"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Building2 className="h-4 w-4" />
                      Company Settings
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </div>
                  <div className="p-1.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        logout()
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

