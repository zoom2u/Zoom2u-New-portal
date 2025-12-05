import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}

export function Toast({ id, type, title, message, onClose }: ToastProps) {
  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg',
        styles[type]
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', iconStyles[type])} />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

