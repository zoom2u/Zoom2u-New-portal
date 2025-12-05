import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-600',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null
  alt?: string
  fallback?: string
}

export function Avatar({ className, size, src, alt, fallback, ...props }: AvatarProps) {
  const initials = fallback
    ? fallback
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : null

  return (
    <div className={cn(avatarVariants({ size, className }))} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="h-full w-full object-cover"
        />
      ) : initials ? (
        <span className="font-medium">{initials}</span>
      ) : (
        <User className="h-1/2 w-1/2" />
      )}
    </div>
  )
}

