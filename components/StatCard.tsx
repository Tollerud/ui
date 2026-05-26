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
          'rounded border p-4',
          accent ? 'border-tia-yellow/25' : 'border-tia-border',
          'bg-tia-surface-raised',
          className
        )}
        {...props}
      >
        <p className="text-xs font-medium uppercase tracking-wider text-tia-text-muted">
          {label}
        </p>
        <p className="text-2xl font-semibold text-tia-text-primary mt-0.5">
          {value}
        </p>
        {change && (
          <p
            className={cn(
              'text-xs font-medium mt-0.5',
              change.direction === 'up' ? 'text-tia-success' : 'text-tia-error'
            )}
          >
            {change.value}
          </p>
        )}
      </div>
    )
  }
)
StatCard.displayName = 'StatCard'

export { StatCard }
