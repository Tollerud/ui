import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const meterTones = {
  default: 'bg-tollerud-yellow',
  success: 'bg-tollerud-success',
  warning: 'bg-tollerud-warning',
  error: 'bg-tollerud-error',
} as const

export interface MeterProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value */
  value: number
  /** Maximum value (defaults to 100) */
  max?: number
  /** Optional label rendered above the bar */
  label?: React.ReactNode
  /** Show the numeric value/percentage to the right of the label */
  showValue?: boolean
  tone?: keyof typeof meterTones
}

const Meter = forwardRef<HTMLDivElement, MeterProps>(
  ({ className, value, max = 100, label, showValue, tone = 'default', ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100))

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
        {(label || showValue) && (
          <div className="flex items-center justify-between text-xs">
            {label && <span className="text-tollerud-text-secondary">{label}</span>}
            {showValue && <span className="text-tollerud-text-muted tabular-nums">{Math.round(pct)}%</span>}
          </div>
        )}
        <div
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className="h-1.5 w-full overflow-hidden rounded-full bg-tollerud-surface-raised"
        >
          <div
            className={cn('h-full rounded-full transition-[width] duration-slow ease-out motion-reduce:transition-none', meterTones[tone])}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }
)
Meter.displayName = 'Meter'

export { Meter }
