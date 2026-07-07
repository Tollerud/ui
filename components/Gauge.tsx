import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const gaugeTones = {
  default: 'var(--tollerud-yellow-warm, #E8D500)',
  success: 'var(--tollerud-success, #22C55E)',
  warning: 'var(--tollerud-warning, #E8D500)',
  error: 'var(--tollerud-error, #EF4444)',
} as const

export interface GaugeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number
  /** Range start (default 0). */
  min?: number
  /** Range end (default 100). */
  max?: number
  /** Caption under the value. */
  label?: ReactNode
  /** Formats the centered value (default: the raw number). */
  formatValue?: (value: number) => string
  /** Arc color — `default` (yellow), `success`, `warning`, `error`. */
  tone?: keyof typeof gaugeTones
  /** Diameter in px (default 160). */
  size?: number
  /** Stroke thickness of the arc (default 12). */
  thickness?: number
  /** Scale down to fit narrow containers (capped at `size`, stays circular). */
  fluid?: boolean
  /** Accessible name (default: `label` when it's a string, else "Gauge"). */
  ariaLabel?: string
}

// 270° dial with a 90° gap at the bottom.
const SWEEP = 0.75

const Gauge = forwardRef<HTMLDivElement, GaugeProps>(
  (
    {
      className,
      value,
      min = 0,
      max = 100,
      label,
      formatValue,
      tone = 'default',
      size = 160,
      thickness = 12,
      fluid = false,
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    const fmt = formatValue ?? ((v: number) => String(v))
    const fraction = max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)))

    const cx = size / 2
    const cy = size / 2
    const r = size / 2 - thickness / 2 - 4
    const c = 2 * Math.PI * r
    const track = `${SWEEP * c} ${c}`
    const valueArc = `${fraction * SWEEP * c} ${c}`
    // rotate(135°) puts the 90° gap centered at the bottom and fills clockwise
    // from the bottom-left up and over to the bottom-right.
    const rotation = `rotate(135 ${cx} ${cy})`
    const color = gaugeTones[tone]

    const accessibleName =
      ariaLabel ?? (typeof label === 'string' ? label : 'Gauge')

    return (
      <div
        ref={ref}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={accessibleName}
        className={cn('relative inline-flex items-center justify-center', fluid && 'w-full', className)}
        style={fluid ? { maxWidth: size } : { width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={cn('block', fluid && 'h-auto w-full')}
          role="img"
          aria-hidden="true"
        >
          <g transform={rotation}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="var(--muted)"
              strokeWidth={thickness}
              strokeDasharray={track}
              strokeLinecap="round"
            />
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={thickness}
              strokeDasharray={valueArc}
              strokeLinecap="round"
              className="transition-[stroke-dasharray] duration-500 ease-out motion-reduce:transition-none"
            />
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-2xl font-semibold tabular-nums text-tollerud-text-primary" style={{ color }}>
            {fmt(value)}
          </span>
          {label ? (
            <span className="text-[11px] uppercase tracking-wide text-tollerud-text-muted">{label}</span>
          ) : null}
        </div>
      </div>
    )
  },
)
Gauge.displayName = 'Gauge'

export { Gauge }
