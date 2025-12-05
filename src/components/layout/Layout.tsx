import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ToastContainer } from '@/components/ui/Toast'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function Layout() {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        className="flex flex-col min-h-screen"
      >
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </motion.div>
      <ToastContainer />
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Outlet />
      </motion.div>
      <ToastContainer />
    </div>
  )
}

export function PublicLayout() {
  return (
    <div className={cn(
      "min-h-screen",
      "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
      "from-slate-100 via-slate-50 to-white"
    )}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            Zoom2u
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/services" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Services</a>
            <a href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            <a href="/track" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Track</a>
            <a href="/about" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </a>
            <a
              href="/register"
              className="btn-primary text-sm px-4 py-2"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}

