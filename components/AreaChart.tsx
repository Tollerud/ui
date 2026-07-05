import { type HTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface AreaChartProps extends HTMLAttributes<HTMLDivElement> {
  data: number[]
  height?: number
}

const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(
  ({ className, data, height = 180, ...props }, ref) => {
    const gradientId = useId().replace(/:/g, '')
    const w = 520
    const h = height
    const pad = 8
    const max = Math.max(...data) * 1.1
    const min = Math.min(...data, 0)
    const span = Math.max(data.length - 1, 1)
    const x = (i: number) => pad + (i / span) * (w - pad * 2)
    const y = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
    const line = data.map((v, i) => `${x(i)},${y(v)}`).join(' ')
    const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          style={{ height }}
          preserveAspectRatio="none"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--tollerud-yellow-warm, #E8D500)" stopOpacity="0.30" />
              <stop offset="100%" stopColor="var(--tollerud-yellow-warm, #E8D500)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g, i) => (
            <line
              key={i}
              x1={pad}
              x2={w - pad}
              y1={h * g}
              y2={h * g}
              stroke="var(--chart-grid)"
              strokeWidth="1"
            />
          ))}
          <polygon points={area} fill={`url(#${gradientId})`} />
          <polyline
            points={line}
            fill="none"
            stroke="var(--tollerud-yellow-warm, #E8D500)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((v, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r="2.5"
              fill="var(--card)"
              stroke="var(--tollerud-yellow-warm, #E8D500)"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
    )
  }
)
AreaChart.displayName = 'AreaChart'

export { AreaChart }
