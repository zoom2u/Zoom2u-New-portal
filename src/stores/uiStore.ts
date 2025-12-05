import { create } from 'zustand'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface Modal {
  id: string
  component: React.ComponentType<unknown>
  props?: Record<string, unknown>
}

interface UIState {
  // Sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  
  // Toasts
  toasts: Toast[]
  
  // Modals
  modals: Modal[]
  
  // Loading states
  globalLoading: boolean
  loadingMessage: string | null
  
  // Theme
  theme: 'light' | 'dark' | 'system'
  
  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  openModal: (modal: Omit<Modal, 'id'>) => void
  closeModal: (id: string) => void
  closeAllModals: () => void
  
  setGlobalLoading: (loading: boolean, message?: string) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  sidebarOpen: true,
  sidebarCollapsed: false,
  toasts: [],
  modals: [],
  globalLoading: false,
  loadingMessage: null,
  theme: 'light',
  
  // Sidebar actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  
  // Toast actions
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    
    // Auto-remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, duration)
    }
  },
  removeToast: (id) => set((state) => ({ 
    toasts: state.toasts.filter((t) => t.id !== id) 
  })),
  clearToasts: () => set({ toasts: [] }),
  
  // Modal actions
  openModal: (modal) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({ modals: [...state.modals, { ...modal, id }] }))
  },
  closeModal: (id) => set((state) => ({ 
    modals: state.modals.filter((m) => m.id !== id) 
  })),
  closeAllModals: () => set({ modals: [] }),
  
  // Loading actions
  setGlobalLoading: (globalLoading, loadingMessage = null) => 
    set({ globalLoading, loadingMessage }),
  
  // Theme actions
  setTheme: (theme) => set({ theme }),
}))

// Convenience hooks for toasts
export const useToast = () => {
  const addToast = useUIStore((state) => state.addToast)
  
  return {
    success: (title: string, message?: string) => 
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => 
      addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => 
      addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => 
      addToast({ type: 'info', title, message }),
  }
}

