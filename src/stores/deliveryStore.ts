import { create } from 'zustand'
import type { Delivery, DeliveryStatus, ServiceType, ServiceLevel, Address } from '@/types/database'

interface DeliveryFilters {
  status: DeliveryStatus | 'all'
  serviceType: ServiceType | 'all'
  dateRange: { start: Date | null; end: Date | null }
  search: string
}

interface BookingDraft {
  serviceType: ServiceType | null
  serviceLevel: ServiceLevel | null
  pickupAddress: Partial<Address> | null
  dropoffAddress: Partial<Address> | null
  packageDescription: string
  packageWeight: number | null
  specialInstructions: string
  pickupNotes: string
  dropoffNotes: string
  requiresSignature: boolean
  requiresPhoto: boolean
  freightProtection: boolean
  freightValue: number | null
  suggestedPrice: number | null
  isMarketplace: boolean
  preferredDriverId: string | null
  namedDriverRequested: boolean
}

interface BatchDelivery {
  dropoffAddress: string
  recipientName: string
  recipientPhone: string
  notes: string
}

interface DeliveryState {
  // Delivery list
  deliveries: Delivery[]
  selectedDelivery: Delivery | null
  isLoadingDeliveries: boolean
  filters: DeliveryFilters
  
  // Booking flow
  bookingDraft: BookingDraft
  batchDeliveries: BatchDelivery[]
  isBatchMode: boolean
  currentStep: number
  
  // Calculated values
  estimatedDistance: number | null
  estimatedPrice: number | null
  estimatedDeliveryTime: Date | null
  
  // Actions
  setDeliveries: (deliveries: Delivery[]) => void
  addDelivery: (delivery: Delivery) => void
  updateDelivery: (id: string, updates: Partial<Delivery>) => void
  selectDelivery: (delivery: Delivery | null) => void
  setLoadingDeliveries: (loading: boolean) => void
  setFilters: (filters: Partial<DeliveryFilters>) => void
  
  // Booking actions
  updateBookingDraft: (updates: Partial<BookingDraft>) => void
  resetBookingDraft: () => void
  setBatchMode: (isBatch: boolean) => void
  setBatchDeliveries: (deliveries: BatchDelivery[]) => void
  addBatchDelivery: (delivery: BatchDelivery) => void
  removeBatchDelivery: (index: number) => void
  setCurrentStep: (step: number) => void
  
  // Calculation actions
  setEstimatedDistance: (distance: number | null) => void
  setEstimatedPrice: (price: number | null) => void
  setEstimatedDeliveryTime: (time: Date | null) => void
}

const defaultBookingDraft: BookingDraft = {
  serviceType: null,
  serviceLevel: 'standard',
  pickupAddress: null,
  dropoffAddress: null,
  packageDescription: '',
  packageWeight: null,
  specialInstructions: '',
  pickupNotes: '',
  dropoffNotes: '',
  requiresSignature: false,
  requiresPhoto: true,
  freightProtection: false,
  freightValue: null,
  suggestedPrice: null,
  isMarketplace: false,
  preferredDriverId: null,
  namedDriverRequested: false,
}

const defaultFilters: DeliveryFilters = {
  status: 'all',
  serviceType: 'all',
  dateRange: { start: null, end: null },
  search: '',
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  // Initial state
  deliveries: [],
  selectedDelivery: null,
  isLoadingDeliveries: false,
  filters: defaultFilters,
  bookingDraft: defaultBookingDraft,
  batchDeliveries: [],
  isBatchMode: false,
  currentStep: 0,
  estimatedDistance: null,
  estimatedPrice: null,
  estimatedDeliveryTime: null,
  
  // Delivery list actions
  setDeliveries: (deliveries) => set({ deliveries }),
  addDelivery: (delivery) => set((state) => ({ 
    deliveries: [delivery, ...state.deliveries] 
  })),
  updateDelivery: (id, updates) => set((state) => ({
    deliveries: state.deliveries.map((d) => 
      d.id === id ? { ...d, ...updates } : d
    ),
  })),
  selectDelivery: (delivery) => set({ selectedDelivery: delivery }),
  setLoadingDeliveries: (isLoadingDeliveries) => set({ isLoadingDeliveries }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  
  // Booking actions
  updateBookingDraft: (updates) => set((state) => ({
    bookingDraft: { ...state.bookingDraft, ...updates },
  })),
  resetBookingDraft: () => set({ 
    bookingDraft: defaultBookingDraft,
    batchDeliveries: [],
    isBatchMode: false,
    currentStep: 0,
    estimatedDistance: null,
    estimatedPrice: null,
    estimatedDeliveryTime: null,
  }),
  setBatchMode: (isBatchMode) => set({ isBatchMode }),
  setBatchDeliveries: (batchDeliveries) => set({ batchDeliveries }),
  addBatchDelivery: (delivery) => set((state) => ({
    batchDeliveries: [...state.batchDeliveries, delivery],
  })),
  removeBatchDelivery: (index) => set((state) => ({
    batchDeliveries: state.batchDeliveries.filter((_, i) => i !== index),
  })),
  setCurrentStep: (currentStep) => set({ currentStep }),
  
  // Calculation actions
  setEstimatedDistance: (estimatedDistance) => set({ estimatedDistance }),
  setEstimatedPrice: (estimatedPrice) => set({ estimatedPrice }),
  setEstimatedDeliveryTime: (estimatedDeliveryTime) => set({ estimatedDeliveryTime }),
}))

