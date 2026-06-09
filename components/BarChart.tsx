import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BarChartDatum {
  label: string
  value: number
  accent?: boolean
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  data: BarChartDatum[]
  height?: number
}

const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  ({ className, data, height = 180, ...props }, ref) => {
    const max = Math.max(...data.map((d) => d.value), 1)

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          className="flex items-end gap-2.5 px-1"
          style={{ height, borderBottom: '1px solid var(--chart-grid)' }}
        >
          {data.map((d, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-center justify-end h-full"
            >
              <span className="mb-1.5 font-mono text-[11px] text-tollerud-text-secondary">
                {d.value}
              </span>
              <div
                className={cn(
                  'w-full max-w-[38px] rounded-t-[3px] transition-[height] duration-500 ease-out',
                  d.accent ? 'bg-tollerud-yellow' : 'bg-tollerud-noir-600'
                )}
                style={{ height: `${(d.value / max) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 px-1 pt-2">
          {data.map((d, i) => (
            <div
              key={i}
              className="flex-1 text-center text-[11px] text-tollerud-text-muted"
            >
              {d.label}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
BarChart.displayName = 'BarChart'

export { BarChart }
