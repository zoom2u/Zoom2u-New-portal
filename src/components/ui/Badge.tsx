import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-700',
        primary: 'bg-primary-100 text-primary-700',
        secondary: 'bg-slate-100 text-slate-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        accent: 'bg-accent-100 text-accent-700',
        // Delivery status badges
        pending: 'bg-slate-100 text-slate-700',
        scheduled: 'bg-blue-100 text-blue-700',
        'picked-up': 'bg-indigo-100 text-indigo-700',
        'on-route': 'bg-amber-100 text-amber-700',
        delivered: 'bg-green-100 text-green-700',
        'on-hold': 'bg-orange-100 text-orange-700',
        failed: 'bg-red-100 text-red-700',
        redelivered: 'bg-purple-100 text-purple-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      dot: {
        true: 'pl-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

export function Badge({ className, variant, size, dot, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, dot, className }))} {...props}>
      {dot && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  )
}

export { badgeVariants }

