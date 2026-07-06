'use client'

import { type HTMLAttributes, forwardRef, useId, useRef } from 'react'
import {
  buildLinearAreaPath,
  buildLinearPath,
  buildStepAreaPath,
  buildStepPath,
  computeYDomain,
  formatChartNumber,
  yScale,
} from '@/lib/chart-series'
import {
  ChartLiveRegion,
  ChartTooltip,
  ChartTooltipLayer,
  useChartInteraction,
} from '@/lib/chart-interaction'
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
  /** Hover + keyboard interactivity: point dot, tooltip, arrow navigation, announcements. */
  interactive?: boolean
  /** Formats tooltip values and announcements. Defaults to en-US number formatting. */
  formatValue?: (value: number) => string
  /** Accessible name when `interactive` (default "Sparkline"). */
  ariaLabel?: string
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
      formatValue,
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    const gradientId = useId().replace(/:/g, '')
    const svgRef = useRef<SVGSVGElement>(null)

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

    const { activeIndex, isKeyboard, svgProps } = useChartInteraction({
      svgRef,
      count: data.length,
      paddingLeft: padX,
      paddingRight: padX,
    })

    const fmt = formatValue ?? ((v: number) => formatChartNumber(v))
    const pointIndex = interactive ? activeIndex : null
    // Idle interactive sparklines keep marking the latest value with a dot.
    const dotIndex = pointIndex ?? (interactive && data.length ? data.length - 1 : null)
    // The tooltip bubble is wider than most sparklines — pin it as close to the
    // point as the chart width allows.
    const tooltipMargin = Math.min(88, resolvedWidth / 2)
    const tooltipLeft =
      pointIndex != null
        ? Math.min(Math.max(xAt(pointIndex), tooltipMargin), resolvedWidth - tooltipMargin)
        : 0
    const announcement =
      interactive && isKeyboard && pointIndex != null
        ? `Point ${pointIndex + 1} of ${data.length}: ${fmt(data[pointIndex]!)}`
        : null

    return (
      <div ref={ref} className={cn('relative inline-block', className)} {...props}>
        <svg
          ref={svgRef}
          width={resolvedWidth}
          height={resolvedHeight}
          viewBox={`0 0 ${resolvedWidth} ${resolvedHeight}`}
          overflow="hidden"
          className={cn('block', interactive && 'tollerud-focus-ring touch-none')}
          role="img"
          aria-hidden={!interactive}
          aria-label={interactive ? ariaLabel ?? 'Sparkline' : undefined}
          {...(interactive ? svgProps : null)}
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
          {dotIndex != null ? (
            <circle
              cx={xAt(dotIndex)}
              cy={yAt(data[dotIndex]!)}
              r="3"
              fill="var(--card, #111111)"
              stroke={color}
              strokeWidth="1.5"
            />
          ) : null}
        </svg>

        {pointIndex != null ? (
          <ChartTooltipLayer left={tooltipLeft} top={yAt(data[pointIndex]!) - 6}>
            <ChartTooltip title={fmt(data[pointIndex]!)} />
          </ChartTooltipLayer>
        ) : null}

        {interactive ? <ChartLiveRegion message={announcement} /> : null}
      </div>
    )
  },
)
Sparkline.displayName = 'Sparkline'

export { Sparkline }
