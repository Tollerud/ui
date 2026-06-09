import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface DonutSegment {
  label: string
  value: number
  color: string
}

export interface DonutProps extends HTMLAttributes<HTMLDivElement> {
  segments: DonutSegment[]
  size?: number
}

const Donut = forwardRef<HTMLDivElement, DonutProps>(
  ({ className, segments, size = 160, ...props }, ref) => {
    const total = segments.reduce((a, s) => a + s.value, 0) || 1
    const r = size / 2 - 14
    const c = 2 * Math.PI * r
    let offset = 0

    return (
      <div ref={ref} className={cn('flex items-center gap-6', className)} {...props}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="14"
          />
          {segments.map((s, i) => {
            const len = (s.value / total) * c
            const gap = len > 10 ? 4 : 0
            const el = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="14"
                strokeDasharray={`${Math.max(0.1, len - gap)} ${c - (len - gap)}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            )
            offset += len
            return el
          })}
        </svg>
        <div className="flex flex-col gap-2">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px]">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                style={{ background: s.color }}
              />
              <span className="min-w-[70px] text-tollerud-text-primary">{s.label}</span>
              <span className="font-mono text-tollerud-text-muted">
                {Math.round((s.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
Donut.displayName = 'Donut'

export { Donut }
