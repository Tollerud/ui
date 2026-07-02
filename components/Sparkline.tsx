'use client'

import { type HTMLAttributes, forwardRef, useId, useRef, useState } from 'react'
import {
  buildLinearAreaPath,
  buildLinearPath,
  buildStepAreaPath,
  buildStepPath,
  computeYDomain,
  indexFromPointer,
  yScale,
} from '@/lib/chart-series'
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
  curve?: 'linear' | 'step'
  fill?: boolean
  interactive?: boolean
}

const Sparkline = forwardRef<HTMLDivElement, SparklineProps>(
  (
    {
      className,
      data,
      width,
      height,
      w,
      h,
      color = 'var(--tollerud-yellow-warm, #E8D500)',
      curve = 'linear',
      fill = false,
      interactive = false,
      ...props
    },
    ref,
  ) => {
    const gradientId = useId().replace(/:/g, '')
    const svgRef = useRef<SVGSVGElement>(null)
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)

    const resolvedWidth = width ?? w ?? 120
    const resolvedHeight = height ?? h ?? 34
    const padX = 1
    const padY = 2
    const plotWidth = resolvedWidth - padX * 2
    const plotHeight = resolvedHeight - padY * 2
    const baselineY = resolvedHeight - padY
    const domain = computeYDomain(data, 0.04)

    const xAt = (index: number) =>
      padX + (data.length <= 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth)
    const yAt = (value: number) => yScale(value, domain, padY, plotHeight)

    const linePath =
      curve === 'step' ? buildStepPath(data, xAt, yAt) : buildLinearPath(data, xAt, yAt)

    const areaPath = !fill
      ? ''
      : curve === 'step'
        ? buildStepAreaPath(data, xAt, yAt, baselineY)
        : buildLinearAreaPath(data, xAt, yAt, baselineY)

    const activeIndex = hoverIndex ?? (interactive && data.length ? data.length - 1 : null)

    const handlePointer = (clientX: number) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect || !interactive || data.length === 0) return
      setHoverIndex(indexFromPointer(clientX, rect, data.length, padX, padX))
    }

    return (
      <div ref={ref} className={cn('inline-block', className)} {...props}>
        <svg
          ref={svgRef}
          width={resolvedWidth}
          height={resolvedHeight}
          viewBox={`0 0 ${resolvedWidth} ${resolvedHeight}`}
          overflow="hidden"
          className={cn('block', interactive && 'touch-none')}
          role="img"
          aria-hidden={!interactive}
          onMouseMove={interactive ? (e) => handlePointer(e.clientX) : undefined}
          onMouseLeave={interactive ? () => setHoverIndex(null) : undefined}
        >
          {fill ? (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
          ) : null}
          {fill ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {interactive && activeIndex != null ? (
            <circle
              cx={xAt(activeIndex)}
              cy={yAt(data[activeIndex]!)}
              r="3"
              fill="var(--card, #111111)"
              stroke={color}
              strokeWidth="1.5"
            />
          ) : null}
        </svg>
      </div>
    )
  },
)
Sparkline.displayName = 'Sparkline'

export { Sparkline }
