import { type SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  placeholder?: string
  /** Options as {value, label} pairs */
  options?: { value: string; label: string }[]
  children?: React.ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, placeholder, options, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-tia-text-muted">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            id={id}
            className={cn(
              'font-sans text-sm w-full appearance-none px-3 py-2.5 pr-9 rounded-lg',
              'bg-tia-surface-raised',
              'text-tia-text-primary',
              'transition-all duration-150 ease-out',
              error
                ? 'border-tia-error/70 focus:border-tia-error focus:shadow-[0_0_0_1px_#EF4444]'
                : 'border-tia-border focus:border-tia-yellow focus:shadow-[0_0_0_1px_#E8D500]',
              'border hover:border-tia-noir-400',
              'focus:outline-none',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          {/* Chevron indicator */}
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-tia-text-muted transition-transform duration-150 group-focus-within:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {error && (
          <p className="text-xs text-tia-error mt-0.5">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }