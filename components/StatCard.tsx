import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { CardChange, type CardChangeDirection } from './Card'

export type StatCardTone = 'success' | 'error' | 'warning' | 'info'

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
  /** Colors the value and border to signal status (e.g. an over-budget figure). Independent of `accent`; takes precedence when both are set. */
  tone?: StatCardTone
  icon?: ReactNode
}

const toneStyles: Record<StatCardTone, { border: string; line: string; value: string }> = {
  success: {
    border: 'border-tollerud-success/25 hover:border-tollerud-success/50',
    line: 'via-tollerud-success/60',
    value: 'text-tollerud-success',
  },
  error: {
    border: 'border-tollerud-error/25 hover:border-tollerud-error/50',
    line: 'via-tollerud-error/60',
    value: 'text-tollerud-error',
  },
  warning: {
    border: 'border-tollerud-warning/25 hover:border-tollerud-warning/50',
    line: 'via-tollerud-warning/60',
    value: 'text-tollerud-warning',
  },
  info: {
    border: 'border-tollerud-info/25 hover:border-tollerud-info/50',
    line: 'via-tollerud-info/60',
    value: 'text-tollerud-info',
  },
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, accent, tone, icon, ...props }, ref) => {
    const toneStyle = tone ? toneStyles[tone] : undefined

    return (
      <div
        ref={ref}
        className={cn(
          'group relative rounded-lg border p-4',
          'bg-tollerud-surface-raised',
          'transition-all duration-fast ease-out',
          'hover:translate-y-[-1px]',
          toneStyle
            ? cn(toneStyle.border, 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]')
            : accent
              ? 'border-tollerud-yellow/20 hover:border-tollerud-yellow/40 hover:shadow-[0_0_20px_rgba(232,213,0,0.08)]'
              : 'border-tollerud-border hover:border-tollerud-noir-500 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
          className
        )}
        {...props}
      >
        {(toneStyle || accent) && (
          <span
            className={cn(
              'absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent to-transparent',
              toneStyle ? toneStyle.line : 'via-tollerud-yellow/60'
            )}
          />
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
            toneStyle ? toneStyle.value : accent ? 'text-tollerud-yellow' : 'text-tollerud-text-primary'
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
