import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'w-full rounded-lg border bg-white px-4 py-2.5 text-sm min-h-[100px] resize-y',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
              : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-error-500">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

