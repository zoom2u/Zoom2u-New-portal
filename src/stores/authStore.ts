import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'
import type { UserProfile, Tenant } from '@/types/database'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  tenant: Tenant | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setTenant: (tenant: Tenant | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      tenant: null,
      isLoading: false,  // Start as false to prevent stuck loading
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setProfile: (profile) => set({ profile }),
      setTenant: (tenant) => set({ tenant }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ 
        user: null, 
        profile: null, 
        tenant: null, 
        isAuthenticated: false,
        isLoading: false
      }),
    }),
    {
      name: 'zoom2u-auth',
      partialize: (state) => ({ 
        user: state.user,
        profile: state.profile,
        tenant: state.tenant,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

