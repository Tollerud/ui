import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: { value: string; direction: 'up' | 'down' }
  accent?: boolean
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, accent, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative rounded-lg border p-4',
          'bg-tia-surface-raised',
          'transition-all duration-200 ease-out',
          'hover:translate-y-[-1px]',
          accent
            ? 'border-tia-yellow/20 hover:border-tia-yellow/40 hover:shadow-[0_0_20px_rgba(232,213,0,0.08)]'
            : 'border-tia-border hover:border-tia-noir-500 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
          className
        )}
        {...props}
      >
        {/* Accent top bar */}
        {accent && (
          <span className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-tia-yellow/60 to-transparent" />
        )}

        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-tia-text-muted">
            {label}
          </p>
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-[11px] font-semibold whitespace-nowrap',
                change.direction === 'up' ? 'text-tia-success' : 'text-tia-error'
              )}
            >
              <svg
                className={cn(
                  'w-3 h-3',
                  change.direction === 'down' && 'rotate-180'
                )}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              {change.value}
            </span>
          )}
        </div>

        <p
          className={cn(
            'text-2xl font-bold tracking-tight mt-1',
            accent ? 'text-tia-yellow' : 'text-tia-text-primary'
          )}
        >
          {value}
        </p>
      </div>
    )
  }
)
StatCard.displayName = 'StatCard'

export { StatCard }