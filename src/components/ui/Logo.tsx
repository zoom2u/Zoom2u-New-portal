import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  className?: string
}

const sizeClasses = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
  xl: 'h-12',
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
}

export function Logo({ size = 'md', variant = 'full', className }: LogoProps) {
  // SVG Logo with smile
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 40 40"
        className={cn(sizeClasses[size], 'w-auto', className)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Smile arc */}
        <path
          d="M8 22C8 28.6274 13.3726 34 20 34C26.6274 34 32 28.6274 32 22"
          stroke="#00B4D8"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left eye (o) */}
        <circle cx="12" cy="14" r="6" fill="#5A5A5A" />
        {/* Right eye (o) */}
        <circle cx="28" cy="14" r="6" fill="#5A5A5A" />
        {/* Dot above 2 */}
        <circle cx="28" cy="6" r="3" fill="#00B4D8" />
      </svg>
    )
  }

  // Text-only logo
  if (variant === 'text') {
    return (
      <span className={cn('font-bold tracking-tight', textSizeClasses[size], className)}>
        <span style={{ color: '#5A5A5A' }}>Zoom</span>
        <span style={{ color: '#00B4D8' }}>2u</span>
      </span>
    )
  }

  // Full logo with SVG
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <svg
        viewBox="0 0 140 40"
        className={cn(sizeClasses[size], 'w-auto')}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Z */}
        <path
          d="M4 8H20L6 32H22"
          stroke="#5A5A5A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* First O with smile connection */}
        <circle cx="38" cy="20" r="12" fill="#5A5A5A" />
        <circle cx="38" cy="20" r="6" fill="white" />
        {/* Second O with smile connection */}
        <circle cx="66" cy="20" r="12" fill="#5A5A5A" />
        <circle cx="66" cy="20" r="6" fill="white" />
        {/* Smile arc connecting the Os */}
        <path
          d="M32 26C32 32 45 38 52 38C59 38 72 32 72 26"
          stroke="#00B4D8"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* M */}
        <path
          d="M82 32V8L92 24L102 8V32"
          stroke="#5A5A5A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* 2 */}
        <path
          d="M112 12C112 8 116 6 120 6C124 6 128 8 128 12C128 16 124 18 120 22L112 32H128"
          stroke="#00B4D8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Dot above 2 */}
        <circle cx="120" cy="2" r="2" fill="#00B4D8" />
        {/* U */}
        <path
          d="M132 8V24C132 28 134 32 140 32C146 32 148 28 148 24V8"
          stroke="#00B4D8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

// Simple text-based logo for use in headers
export function LogoText({ size = 'md', className }: Omit<LogoProps, 'variant'>) {
  return (
    <span className={cn('font-bold tracking-tight', textSizeClasses[size], className)}>
      <span style={{ color: '#5A5A5A' }}>Zoom</span>
      <span style={{ color: '#00B4D8' }}>2u</span>
    </span>
  )
}

