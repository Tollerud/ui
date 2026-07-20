import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { CardChange, type CardChangeDirection } from './Card'

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: {
    value?: string
    direction: CardChangeDirection
    /** Override the color. Omit to use the default (up=success, down=error, flat=info). */
    tone?: 'success' | 'error' | 'warning' | 'info' | 'accent'
  }
  accent?: boolean
  icon?: ReactNode
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, accent, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative rounded-lg border p-4',
          'bg-tollerud-surface-raised',
          'transition-all duration-fast ease-out',
          'hover:translate-y-[-1px]',
          accent
            ? 'border-tollerud-yellow/20 hover:border-tollerud-yellow/40 hover:shadow-[0_0_20px_rgba(232,213,0,0.08)]'
            : 'border-tollerud-border hover:border-tollerud-noir-500 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
          className
        )}
        {...props}
      >
        {accent && (
          <span className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-tollerud-yellow/60 to-transparent" />
        )}

        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center text-tollerud-text-muted">
                {icon}
              </span>
            )}
            <p className="text-xs font-medium uppercase tracking-wider text-tollerud-text-muted">
              {label}
            </p>
          </div>
          {change && (
            <CardChange value={change.value} direction={change.direction} tone={change.tone} />
          )}
        </div>

        <p
          className={cn(
            'mt-1 text-2xl font-bold tracking-tight',
            accent ? 'text-tollerud-yellow' : 'text-tollerud-text-primary'
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
