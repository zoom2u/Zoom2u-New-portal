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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#00B4D8' }}>
      
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img 
              src="/images/Zoom2u Logo - Classic.png" 
              alt="Zoom2u" 
              className="h-10 w-auto"
            />
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
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-md transition-colors"
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

