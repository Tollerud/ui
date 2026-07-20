'use client'

import { type InputHTMLAttributes, forwardRef, useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, id, required, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    const autoErrorId = useId()
    const errorId = error ? autoErrorId : undefined

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-tollerud-text-muted">
            {label}
            {required && <span aria-hidden="true" className="ml-0.5 text-tollerud-error">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? 'text' : 'password'}
            required={required}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            className={cn(
              'w-full font-sans text-base px-3 py-2.5 pr-10 rounded',
              'bg-tollerud-surface-raised border',
              'text-tollerud-text-primary',
              'placeholder:text-tollerud-text-muted',
              'transition-[border-color] duration-fast',
              'focus:outline-none focus:border-tollerud-yellow focus:shadow-[0_0_0_1px_var(--tollerud-yellow-warm,#E8D500)]',
              error ? 'border-tollerud-error' : 'border-tollerud-border',
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-tollerud-text-muted hover:text-tollerud-text-secondary transition-colors duration-fast"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p id={errorId} className="text-xs text-tollerud-error mt-0.5">{error}</p>}
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
