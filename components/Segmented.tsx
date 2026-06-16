import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SegmentedOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface SegmentedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedOption[]
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md'
}

const Segmented = forwardRef<HTMLDivElement, SegmentedProps>(
  ({ className, options, value, onChange, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          'inline-flex items-center gap-0.5 rounded-lg p-1 bg-tollerud-surface-raised border border-tollerud-border',
          className
        )}
        {...props}
      >
        {options.map((opt, index) => {
          const active = opt.value === value
          return (
            <button
              key={`${String(opt.value)}-${index}`}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={opt.disabled}
              onClick={() => !opt.disabled && onChange(opt.value)}
              className={cn(
                'inline-flex items-center justify-center rounded-md font-medium leading-none transition-colors duration-[150ms]',
                size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3.5 text-sm',
                active
                  ? 'bg-tollerud-yellow text-tollerud-noir-black'
                  : 'text-tollerud-text-secondary hover:text-tollerud-text-primary',
                opt.disabled && 'opacity-40 pointer-events-none'
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  }
)
Segmented.displayName = 'Segmented'

export { Segmented }
