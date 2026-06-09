import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SparklineProps extends HTMLAttributes<HTMLDivElement> {
  data: number[]
  width?: number
  height?: number
  /** @deprecated Use `width` */
  w?: number
  /** @deprecated Use `height` */
  h?: number
  color?: string
}

const Sparkline = forwardRef<HTMLDivElement, SparklineProps>(
  ({ className, data, width, height, w, h, color = '#E8D500', ...props }, ref) => {
    const resolvedWidth = width ?? w ?? 120
    const resolvedHeight = height ?? h ?? 34
    const max = Math.max(...data)
    const min = Math.min(...data)
    const span = Math.max(data.length - 1, 1)
    const pts = data
      .map(
        (v, i) =>
          `${(i / span) * resolvedWidth},${resolvedHeight - 2 - ((v - min) / (max - min || 1)) * (resolvedHeight - 4)}`
      )
      .join(' ')

    return (
      <div ref={ref} className={cn('inline-block', className)} {...props}>
        <svg width={resolvedWidth} height={resolvedHeight} className="block" role="img" aria-hidden="true">
          <polyline
            points={pts}
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }
)
Sparkline.displayName = 'Sparkline'

export { Sparkline }
