'use client'

import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  DEFAULT_CHART_PADDING,
  buildLinearAreaPath,
  buildLinearPath,
  buildStepAreaPath,
  buildStepPath,
  computeYDomain,
  filterPointsByDuration,
  formatChartDateLong,
  formatChartDateShort,
  formatChartNumber,
  niceTicks,
  parseChartDate,
  sortPointsByDate,
  xScaleIndex,
  yScale,
  type ChartPadding,
} from '@/lib/chart-series'
import {
  ChartLiveRegion,
  ChartSrTable,
  ChartTooltip,
  ChartTooltipLayer,
  clampTooltipX,
  useChartInteraction,
} from '@/lib/chart-interaction'
import { cn } from '@/lib/utils'
import { Segmented } from './Segmented'

export interface TimeSeriesPoint {
  date: Date | string | number
  value: number
  /** Tooltip title — store name, series label, etc. */
  label?: string
  /** Extra tooltip lines — product name, notes */
  meta?: string[]
}

export interface TimeSeriesRange {
  value: string
  label: ReactNode
  /** Omit for "all time". Milliseconds back from the latest point. */
  durationMs?: number
  disabled?: boolean
}

export interface TimeSeriesChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  data: TimeSeriesPoint[]
  height?: number
  curve?: 'linear' | 'step'
  yAxis?: 'left' | 'right' | 'none'
  padding?: Partial<ChartPadding>
  /** Formats Y-axis ticks, latest-value badge, and default tooltip values. Independent of `locale` date formatting. When set, `valuePrefix` / `valueSuffix` are ignored. */
  formatValue?: (value: number) => string
  /** Prepended to the locale-formatted number (tooltip, Y-axis, latest badge). Ignored when `formatValue` is set. */
  valuePrefix?: string
  /** Appended to the locale-formatted number (tooltip, Y-axis, latest badge). Ignored when `formatValue` is set. */
  valueSuffix?: string
  formatDate?: (date: Date) => string
  formatAxisDate?: (date: Date) => string
  /** Pin the latest value on the Y axis */
  showLatestValue?: boolean
  ranges?: TimeSeriesRange[]
  range?: string
  onRangeChange?: (value: string) => void
  toolbarLeft?: ReactNode
  renderTooltip?: (point: TimeSeriesPoint, index: number, formattedValue: string) => ReactNode
  emptyMessage?: string
  locale?: string
  ariaLabel?: string
  /** Visually-hidden data table exposing every point to screen readers (default on). Set `false` to opt out. */
  srTable?: boolean
}

const MS_DAY = 24 * 60 * 60 * 1000

export const TIME_SERIES_PRESETS: TimeSeriesRange[] = [
  { value: '3m', label: '3 mo', durationMs: 90 * MS_DAY },
  { value: '6m', label: '6 mo', durationMs: 180 * MS_DAY },
  { value: '1y', label: '1 yr', durationMs: 365 * MS_DAY },
  { value: '2y', label: '2 yr', durationMs: 730 * MS_DAY },
  { value: 'all', label: 'All' },
]

function defaultTooltip(
  point: TimeSeriesPoint,
  formatValue: (v: number) => string,
  formatDate: (d: Date) => string,
) {
  return (
    <ChartTooltip
      title={formatValue(point.value)}
      subtitle={formatDate(parseChartDate(point.date))}
      label={point.label}
      lines={point.meta}
    />
  )
}

const TimeSeriesChart = forwardRef<HTMLDivElement, TimeSeriesChartProps>(
  (
    {
      className,
      data,
      height = 280,
      curve = 'step',
      yAxis = 'right',
      padding: paddingOverride,
      formatValue,
      valuePrefix,
      valueSuffix,
      formatDate,
      formatAxisDate,
      showLatestValue = true,
      ranges,
      range,
      onRangeChange,
      toolbarLeft,
      renderTooltip,
      emptyMessage = 'No data',
      locale = 'en-US',
      ariaLabel,
      srTable = true,
      ...props
    },
    ref,
  ) => {
    const gradientId = useId().replace(/:/g, '')
    const svgRef = useRef<SVGSVGElement>(null)
    const [width, setWidth] = useState(640)
    const [internalRange, setInternalRange] = useState(ranges?.[0]?.value ?? 'all')

    const activeRange = range ?? internalRange
    const activeRangeDef = ranges?.find((r) => r.value === activeRange)

    const valueFormatter = useCallback(
      (v: number) => {
        if (formatValue) return formatValue(v)
        const base = formatChartNumber(v, locale)
        if (!valuePrefix && !valueSuffix) return base
        return `${valuePrefix ?? ''}${base}${valueSuffix ?? ''}`
      },
      [formatValue, locale, valuePrefix, valueSuffix],
    )
    const dateFormatter = useCallback(
      (d: Date) => formatDate?.(d) ?? formatChartDateLong(d, locale),
      [formatDate, locale],
    )
    const axisDateFormatter = useCallback(
      (d: Date) => formatAxisDate?.(d) ?? formatChartDateShort(d, locale),
      [formatAxisDate, locale],
    )

    const visiblePoints = useMemo(() => {
      const sorted = sortPointsByDate(data)
      return filterPointsByDuration(sorted, activeRangeDef?.durationMs)
    }, [data, activeRangeDef?.durationMs])

    const values = useMemo(() => visiblePoints.map((p) => p.value), [visiblePoints])
    const domain = useMemo(() => computeYDomain(values), [values])

    const padding = useMemo<ChartPadding>(() => {
      const base = { ...DEFAULT_CHART_PADDING, ...paddingOverride }
      if (yAxis === 'left') return { ...base, left: 52, right: 12 }
      if (yAxis === 'none') return { ...base, left: 12, right: 12 }
      return base
    }, [paddingOverride, yAxis])

    const {
      activeIndex: pointIndex,
      isKeyboard,
      svgProps,
    } = useChartInteraction({
      svgRef,
      count: values.length,
      paddingLeft: padding.left,
      paddingRight: padding.right,
    })

    const plotLeft = padding.left
    const plotRight = width - padding.right
    const plotTop = padding.top
    const plotBottom = height - padding.bottom
    const plotWidth = plotRight - plotLeft
    const plotHeight = plotBottom - plotTop
    const baselineY = plotBottom

    const xAt = useCallback(
      (index: number) => xScaleIndex(index, values.length, plotLeft, plotWidth),
      [plotLeft, plotWidth, values.length],
    )
    const yAt = useCallback(
      (value: number) => yScale(value, domain, plotTop, plotHeight),
      [domain, plotHeight, plotTop],
    )

    const linePath = useMemo(() => {
      if (curve === 'step') return buildStepPath(values, xAt, yAt)
      return buildLinearPath(values, xAt, yAt)
    }, [curve, values, xAt, yAt])

    const areaPath = useMemo(() => {
      if (curve === 'step') return buildStepAreaPath(values, xAt, yAt, baselineY)
      return buildLinearAreaPath(values, xAt, yAt, baselineY)
    }, [baselineY, curve, values, xAt, yAt])

    const yTicks = useMemo(() => niceTicks(domain.min, domain.max, 4), [domain])
    const xLabelIndexes = useMemo(() => {
      if (visiblePoints.length <= 1) return [0]
      const maxLabels = 7
      const step = Math.max(1, Math.floor((visiblePoints.length - 1) / (maxLabels - 1)))
      const indexes: number[] = []
      for (let i = 0; i < visiblePoints.length; i += step) indexes.push(i)
      if (indexes[indexes.length - 1] !== visiblePoints.length - 1) {
        indexes.push(visiblePoints.length - 1)
      }
      return indexes
    }, [visiblePoints.length])

    const activeIndex = pointIndex ?? (values.length > 0 ? values.length - 1 : null)
    const activePoint = activeIndex != null ? visiblePoints[activeIndex] : null

    useEffect(() => {
      const el = svgRef.current?.parentElement
      if (!el) return
      const ro = new ResizeObserver(([entry]) => {
        if (entry) setWidth(entry.contentRect.width)
      })
      ro.observe(el)
      setWidth(el.getBoundingClientRect().width || 640)
      return () => ro.disconnect()
    }, [])

    const handleRangeChange = (next: string) => {
      if (range === undefined) setInternalRange(next)
      onRangeChange?.(next)
    }

    if (visiblePoints.length === 0) {
      return (
        <div
          ref={ref}
          className={cn('w-full rounded-lg border border-tollerud-noir-700 bg-tollerud-noir-900 px-4 py-8 text-center text-sm text-tollerud-text-muted', className)}
          {...props}
        >
          {emptyMessage}
        </div>
      )
    }

    const crosshairX = activeIndex != null ? xAt(activeIndex) : null
    const crosshairY = activePoint ? yAt(activePoint.value) : null
    const tooltipLeft = crosshairX != null ? clampTooltipX(crosshairX, width) : width / 2
    const announcement =
      isKeyboard && activePoint && pointIndex != null
        ? `${dateFormatter(parseChartDate(activePoint.date))}: ${valueFormatter(activePoint.value)}`
        : null

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(ranges?.length || toolbarLeft) && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">{toolbarLeft}</div>
            {ranges?.length ? (
              <Segmented
                size="sm"
                options={ranges.map(({ value, label, disabled }) => ({ value, label, disabled }))}
                value={activeRange}
                onChange={handleRangeChange}
              />
            ) : null}
          </div>
        )}

        <div className="relative w-full">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="tollerud-focus-ring block w-full touch-none select-none"
            role="img"
            aria-label={ariaLabel ?? 'Time series chart'}
            {...svgProps}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--tollerud-yellow-warm, #E8D500)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--tollerud-yellow-warm, #E8D500)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {yTicks.map((tick) => {
              const y = yAt(tick)
              return (
                <g key={tick}>
                  <line
                    x1={plotLeft}
                    x2={plotRight}
                    y1={y}
                    y2={y}
                    stroke="var(--chart-grid)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  {yAxis === 'left' ? (
                    <text
                      x={plotLeft - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-[var(--chart-axis)] text-[11px]"
                    >
                      {valueFormatter(tick)}
                    </text>
                  ) : null}
                  {yAxis === 'right' ? (
                    <text
                      x={plotRight + 8}
                      y={y + 4}
                      textAnchor="start"
                      className="fill-[var(--chart-axis)] text-[11px]"
                    >
                      {valueFormatter(tick)}
                    </text>
                  ) : null}
                </g>
              )
            })}

            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
              d={linePath}
              fill="none"
              stroke="var(--tollerud-yellow-warm, #E8D500)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {xLabelIndexes.map((index) => (
              <text
                key={index}
                x={xAt(index)}
                y={height - 10}
                textAnchor="middle"
                className="fill-[var(--chart-axis)] text-[11px]"
              >
                {axisDateFormatter(parseChartDate(visiblePoints[index]!.date))}
              </text>
            ))}

            {showLatestValue && activePoint && pointIndex === null && yAxis === 'right' ? (
              <line
                x1={plotLeft}
                x2={plotRight}
                y1={yAt(activePoint.value)}
                y2={yAt(activePoint.value)}
                stroke="var(--tollerud-yellow-warm, #E8D500)"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
            ) : null}

            {crosshairX != null && pointIndex !== null ? (
              <line
                x1={crosshairX}
                x2={crosshairX}
                y1={plotTop}
                y2={plotBottom}
                stroke="var(--chart-axis)"
                strokeWidth="1"
              />
            ) : null}

            {crosshairX != null && crosshairY != null && pointIndex !== null ? (
              <circle
                cx={crosshairX}
                cy={crosshairY}
                r="5"
                fill="var(--card, #111111)"
                stroke="var(--tollerud-yellow-warm, #E8D500)"
                strokeWidth="2"
              />
            ) : null}
          </svg>

          {activePoint && pointIndex !== null ? (
            <ChartTooltipLayer
              left={tooltipLeft}
              top={crosshairY != null ? crosshairY - 12 : plotTop}
            >
              {renderTooltip
                ? renderTooltip(activePoint, activeIndex!, valueFormatter(activePoint.value))
                : defaultTooltip(activePoint, valueFormatter, dateFormatter)}
            </ChartTooltipLayer>
          ) : null}

          {showLatestValue && activePoint && pointIndex === null && yAxis === 'right' ? (
            <div
              className="pointer-events-none absolute -translate-y-1/2 whitespace-nowrap rounded-md bg-tollerud-yellow px-2 py-0.5 text-[10px] font-semibold text-tollerud-noir-950"
              style={{ top: yAt(activePoint.value), right: 0 }}
            >
              {valueFormatter(activePoint.value)}
            </div>
          ) : null}
        </div>

        <ChartLiveRegion message={announcement} />
        {srTable ? (
          <ChartSrTable
            caption={ariaLabel ?? 'Time series chart'}
            labelHeader="Date"
            valueHeader="Value"
            rows={visiblePoints.map((point) => ({
              label: dateFormatter(parseChartDate(point.date)),
              value: valueFormatter(point.value),
            }))}
          />
        ) : null}
      </div>
    )
  },
)
TimeSeriesChart.displayName = 'TimeSeriesChart'

export { TimeSeriesChart }
