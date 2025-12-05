import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(d, { dateStyle: 'short' })
}

export function generateTrackingId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'Z2U-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function calculateDeliveryPrice(
  distanceKm: number,
  baseFee: number,
  kmRate: number,
  serviceMultiplier = 1
): number {
  const basePrice = baseFee + (distanceKm * kmRate * serviceMultiplier)
  return Math.round(basePrice * 100) / 100
}

export function calculateBatchDeliveryPrice(
  totalRouteDistanceKm: number,
  numberOfDeliveries: number,
  batchBaseFee: number,
  kmRate: number
): { total: number; perDelivery: number } {
  const total = (batchBaseFee * numberOfDeliveries) + (totalRouteDistanceKm * kmRate)
  return {
    total: Math.round(total * 100) / 100,
    perDelivery: Math.round((total / numberOfDeliveries) * 100) / 100,
  }
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: 'status-pending',
    scheduled: 'status-scheduled',
    picked_up: 'status-picked-up',
    on_route: 'status-on-route',
    delivered: 'status-delivered',
    on_hold: 'status-on-hold',
    failed: 'status-failed',
    redelivered: 'status-redelivered',
  }
  return statusColors[status] || 'status-pending'
}

export function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    scheduled: 'Scheduled',
    picked_up: 'Picked Up',
    on_route: 'On Route',
    delivered: 'Delivered',
    on_hold: 'On Hold',
    failed: 'Failed Delivery',
    redelivered: 'Re-delivered',
  }
  return statusLabels[status] || status
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateAustralianPhone(phone: string): boolean {
  const phoneRegex = /^(\+61|0)[2-478](\d{8}|\d{4}\s\d{4})$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

