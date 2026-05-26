import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-tia-text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'font-sans text-base px-3 py-2 rounded',
            'bg-tia-surface-raised border',
            'text-tia-text-primary',
            'placeholder:text-tia-text-muted',
            'transition-[border-color] duration-[150ms]',
            'focus:outline-none focus:border-tia-yellow focus:shadow-[0_0_0_1px_#E8D500]',
            error ? 'border-tia-error' : 'border-tia-border',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-tia-error mt-0.5">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
