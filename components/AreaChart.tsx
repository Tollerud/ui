'use client'

import { type HTMLAttributes, type ReactNode, forwardRef, useId, useRef } from 'react'
import { formatChartNumber } from '@/lib/chart-series'
import {
  ChartLiveRegion,
  ChartSrTable,
  ChartTooltip,
  ChartTooltipLayer,
  useChartInteraction,
} from '@/lib/chart-interaction'
import { cn } from '@/lib/utils'

export interface AreaChartPoint {
  value: number
  /** Tooltip title and screen-reader name for the point (e.g. a month). */
  label?: string
}

export interface AreaChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Plain numbers (original API) or labeled points for interactive tooltips. */
  data: number[] | AreaChartPoint[]
  height?: number
  /**
   * Hover/keyboard interactivity: crosshair, tooltip, arrow-key navigation,
   * and screen-reader announcements. Off by default — the static chart stays
   * a decorative `aria-hidden` graphic exactly as before 4.8.43.
   */
  interactive?: boolean
  /** Formats tooltip values and announcements. Defaults to en-US number formatting. */
  formatValue?: (value: number) => string
  renderTooltip?: (point: AreaChartPoint, index: number, formattedValue: string) => ReactNode
  /** Accessible name when `interactive` (default "Area chart"). */
  ariaLabel?: string
  /** Visually-hidden data table for screen readers. Defaults to `interactive` (the SVG is `aria-hidden` when static). */
  srTable?: boolean
}

const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      className,
      data,
      height = 180,
      interactive = false,
      formatValue,
      renderTooltip,
      ariaLabel,
      srTable,
      ...props
    },
    ref,
  ) => {
    const gradientId = useId().replace(/:/g, '')
    const svgRef = useRef<SVGSVGElement>(null)
    const points: AreaChartPoint[] = data.map((d) =>
      typeof d === 'number' ? { value: d } : d,
    )
    const values = points.map((p) => p.value)
    const w = 520
    const h = height
    const pad = 8
    const max = Math.max(...values) * 1.1
    const min = Math.min(...values, 0)
    const span = Math.max(values.length - 1, 1)
    const x = (i: number) => pad + (i / span) * (w - pad * 2)
    const y = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
    const line = values.map((v, i) => `${x(i)},${y(v)}`).join(' ')
    const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`

    const { activeIndex, isKeyboard, svgProps } = useChartInteraction({
      svgRef,
      count: values.length,
      paddingLeft: pad,
      paddingRight: pad,
      viewBoxWidth: w,
    })

    const fmt = formatValue ?? ((v: number) => formatChartNumber(v))
    const pointIndex = interactive ? activeIndex : null
    const activePoint = pointIndex != null ? points[pointIndex] : null
    // The 520-unit viewBox stretches to the container, so overlays anchored in
    // HTML must use percentages, not viewBox pixels.
    const tooltipLeftPct =
      pointIndex != null ? Math.min(Math.max((x(pointIndex) / w) * 100, 16), 84) : 0
    const tooltipTopPct = activePoint ? (y(activePoint.value) / h) * 100 : 0
    const announcement =
      interactive && isKeyboard && activePoint && pointIndex != null
        ? `${activePoint.label ?? `Point ${pointIndex + 1} of ${points.length}`}: ${fmt(activePoint.value)}`
        : null
    const showSrTable = srTable ?? interactive

    return (
      <div ref={ref} className={cn('relative w-full', className)} {...props}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${w} ${h}`}
          className={cn('w-full', interactive && 'tollerud-focus-ring touch-none select-none')}
          style={{ height }}
          preserveAspectRatio="none"
          role="img"
          aria-hidden={interactive ? undefined : 'true'}
          aria-label={interactive ? ariaLabel ?? 'Area chart' : undefined}
          {...(interactive ? svgProps : null)}
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
          {values.map((v, i) => (
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

          {pointIndex != null ? (
            <line
              x1={x(pointIndex)}
              x2={x(pointIndex)}
              y1={pad}
              y2={h - pad}
              stroke="var(--chart-axis)"
              strokeWidth="1"
            />
          ) : null}
          {activePoint && pointIndex != null ? (
            <circle
              cx={x(pointIndex)}
              cy={y(activePoint.value)}
              r="4"
              fill="var(--card, #111111)"
              stroke="var(--tollerud-yellow-warm, #E8D500)"
              strokeWidth="2"
            />
          ) : null}
        </svg>

        {activePoint && pointIndex != null ? (
          <ChartTooltipLayer
            left={`${tooltipLeftPct}%`}
            top={`calc(${tooltipTopPct}% - 12px)`}
          >
            {renderTooltip ? (
              renderTooltip(activePoint, pointIndex, fmt(activePoint.value))
            ) : (
              <ChartTooltip title={fmt(activePoint.value)} label={activePoint.label} />
            )}
          </ChartTooltipLayer>
        ) : null}

        {interactive ? <ChartLiveRegion message={announcement} /> : null}
        {showSrTable ? (
          <ChartSrTable
            caption={ariaLabel ?? 'Area chart'}
            rows={points.map((point, index) => ({
              label: point.label ?? `Point ${index + 1}`,
              value: fmt(point.value),
            }))}
          />
        ) : null}
      </div>
    )
  },
)
AreaChart.displayName = 'AreaChart'

export { AreaChart }
