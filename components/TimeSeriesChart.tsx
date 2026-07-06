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
  CHART_SERIES_COLORS,
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

export interface TimeSeriesSeries {
  /** Series name — shown in the legend, tooltip rows, and SR table header. */
  label: string
  points: TimeSeriesPoint[]
  /** Line color; defaults to the `--chart-1…5` palette cycled by position. */
  color?: string
}

export interface TimeSeriesRange {
  value: string
  label: ReactNode
  /** Omit for "all time". Milliseconds back from the latest point. */
  durationMs?: number
  disabled?: boolean
}

export interface TimeSeriesChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Single series. Ignored when `series` is provided. */
  data?: TimeSeriesPoint[]
  /**
   * Multiple index-aligned series (same dates by position). Takes precedence
   * over `data`. Each series gets a line + crosshair dot; the tooltip and SR
   * table stack all series at the active point. Area fill and the latest-value
   * badge are single-series only.
   */
  series?: TimeSeriesSeries[]
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
  /** Pin the latest value on the Y axis (single series only). */
  showLatestValue?: boolean
  ranges?: TimeSeriesRange[]
  range?: string
  onRangeChange?: (value: string) => void
  toolbarLeft?: ReactNode
  /** Single-series only — for multi-series the stacked tooltip is used. */
  renderTooltip?: (point: TimeSeriesPoint, index: number, formattedValue: string) => ReactNode
  /** Show a swatch legend above the chart (multi-series; default on). */
  showLegend?: boolean
  emptyMessage?: string
  locale?: string
  ariaLabel?: string
  /** Visually-hidden data table exposing every point to screen readers (default on). Set `false` to opt out. */
  srTable?: boolean
}

interface NormalizedSeries {
  label: string
  color: string
  visiblePoints: TimeSeriesPoint[]
  values: number[]
}

const MS_DAY = 24 * 60 * 60 * 1000

export const TIME_SERIES_PRESETS: TimeSeriesRange[] = [
  { value: '3m', label: '3 mo', durationMs: 90 * MS_DAY },
  { value: '6m', label: '6 mo', durationMs: 180 * MS_DAY },
  { value: '1y', label: '1 yr', durationMs: 365 * MS_DAY },
  { value: '2y', label: '2 yr', durationMs: 730 * MS_DAY },
  { value: 'all', label: 'All' },
]

const SINGLE_SERIES_COLOR = 'var(--tollerud-yellow-warm, #E8D500)'

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
      series,
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
      showLegend = true,
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

    const isMulti = Boolean(series && series.length > 0)
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

    const seriesList = useMemo<NormalizedSeries[]>(() => {
      const raw =
        isMulti && series
          ? series.map((s, index) => ({
              label: s.label,
              color: s.color ?? CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]!,
              points: s.points,
            }))
          : [{ label: '', color: SINGLE_SERIES_COLOR, points: data ?? [] }]
      return raw.map((s) => {
        const visiblePoints = filterPointsByDuration(
          sortPointsByDate(s.points),
          activeRangeDef?.durationMs,
        )
        return {
          label: s.label,
          color: s.color,
          visiblePoints,
          values: visiblePoints.map((p) => p.value),
        }
      })
    }, [isMulti, series, data, activeRangeDef?.durationMs])

    const primaryPoints = seriesList[0]?.visiblePoints ?? []
    const xCount = primaryPoints.length
    const allValues = useMemo(() => seriesList.flatMap((s) => s.values), [seriesList])
    const domain = useMemo(() => computeYDomain(allValues), [allValues])

    const padding = useMemo<ChartPadding>(() => {
      const base = { ...DEFAULT_CHART_PADDING, ...paddingOverride }
      if (yAxis === 'left') return { ...base, left: 52, right: 12 }
      if (yAxis === 'none') return { ...base, left: 12, right: 12 }
      return base
    }, [paddingOverride, yAxis])

    const { activeIndex: pointIndex, isKeyboard, svgProps } = useChartInteraction({
      svgRef,
      count: xCount,
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
      (index: number) => xScaleIndex(index, xCount, plotLeft, plotWidth),
      [plotLeft, plotWidth, xCount],
    )
    const yAt = useCallback(
      (value: number) => yScale(value, domain, plotTop, plotHeight),
      [domain, plotHeight, plotTop],
    )

    const buildLine = useCallback(
      (values: number[]) =>
        curve === 'step' ? buildStepPath(values, xAt, yAt) : buildLinearPath(values, xAt, yAt),
      [curve, xAt, yAt],
    )

    const areaPath = useMemo(() => {
      if (isMulti) return ''
      const values = seriesList[0]?.values ?? []
      if (curve === 'step') return buildStepAreaPath(values, xAt, yAt, baselineY)
      return buildLinearAreaPath(values, xAt, yAt, baselineY)
    }, [isMulti, seriesList, baselineY, curve, xAt, yAt])

    const yTicks = useMemo(() => niceTicks(domain.min, domain.max, 4), [domain])
    const xLabelIndexes = useMemo(() => {
      if (xCount <= 1) return [0]
      const maxLabels = 7
      const step = Math.max(1, Math.floor((xCount - 1) / (maxLabels - 1)))
      const indexes: number[] = []
      for (let i = 0; i < xCount; i += step) indexes.push(i)
      if (indexes[indexes.length - 1] !== xCount - 1) indexes.push(xCount - 1)
      return indexes
    }, [xCount])

    const activeIndex = pointIndex ?? (xCount > 0 ? xCount - 1 : null)
    // Single-series active point (drives area-mode tooltip + latest badge).
    const activePoint = !isMulti && activeIndex != null ? primaryPoints[activeIndex] : null

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

    if (xCount === 0) {
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
    // Value at the active index for a given series, or null when it has no point there.
    const valueAt = (s: NormalizedSeries) =>
      activeIndex != null ? s.visiblePoints[activeIndex]?.value ?? null : null
    // Tooltip anchors above the topmost active point across series.
    const anchorY =
      activeIndex != null
        ? Math.min(
            ...seriesList.map((s) => {
              const v = valueAt(s)
              return v != null ? yAt(v) : Number.POSITIVE_INFINITY
            }),
          )
        : Number.POSITIVE_INFINITY
    const crosshairY =
      !isMulti && activePoint ? yAt(activePoint.value) : Number.isFinite(anchorY) ? anchorY : plotTop
    const tooltipLeft = crosshairX != null ? clampTooltipX(crosshairX, width) : width / 2
    const activeDate =
      activeIndex != null && primaryPoints[activeIndex]
        ? dateFormatter(parseChartDate(primaryPoints[activeIndex]!.date))
        : ''

    const announcement =
      isKeyboard && pointIndex != null
        ? isMulti
          ? `${activeDate}: ${seriesList
              .map((s) => {
                const v = valueAt(s)
                return `${s.label} ${v != null ? valueFormatter(v) : '—'}`
              })
              .join(', ')}`
          : activePoint
            ? `${activeDate}: ${valueFormatter(activePoint.value)}`
            : null
        : null

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(ranges?.length || toolbarLeft || (isMulti && showLegend)) && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1.5">
              {toolbarLeft}
              {isMulti && showLegend
                ? seriesList.map((s) => (
                    <span key={s.label} className="inline-flex items-center gap-1.5 text-xs text-tollerud-text-secondary">
                      <span
                        className="h-2 w-2 shrink-0 rounded-[2px]"
                        style={{ background: s.color }}
                        aria-hidden="true"
                      />
                      {s.label}
                    </span>
                  ))
                : null}
            </div>
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

            {!isMulti ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}
            {seriesList.map((s) => (
              <path
                key={s.label || 'series'}
                d={buildLine(s.values)}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {xLabelIndexes.map((index) => (
              <text
                key={index}
                x={xAt(index)}
                y={height - 10}
                textAnchor="middle"
                className="fill-[var(--chart-axis)] text-[11px]"
              >
                {axisDateFormatter(parseChartDate(primaryPoints[index]!.date))}
              </text>
            ))}

            {!isMulti && showLatestValue && activePoint && pointIndex === null && yAxis === 'right' ? (
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

            {crosshairX != null && pointIndex !== null
              ? seriesList.map((s) => {
                  const v = valueAt(s)
                  if (v == null) return null
                  return (
                    <circle
                      key={s.label || 'series'}
                      cx={crosshairX}
                      cy={yAt(v)}
                      r="5"
                      fill="var(--card, #111111)"
                      stroke={s.color}
                      strokeWidth="2"
                    />
                  )
                })
              : null}
          </svg>

          {pointIndex !== null && (isMulti || activePoint) ? (
            <ChartTooltipLayer left={tooltipLeft} top={crosshairY - 12}>
              {isMulti ? (
                <ChartTooltip
                  title={activeDate}
                  rows={seriesList.map((s) => {
                    const v = valueAt(s)
                    return {
                      label: s.label,
                      value: v != null ? valueFormatter(v) : '—',
                      color: s.color,
                    }
                  })}
                />
              ) : renderTooltip ? (
                renderTooltip(activePoint!, activeIndex!, valueFormatter(activePoint!.value))
              ) : (
                defaultTooltip(activePoint!, valueFormatter, dateFormatter)
              )}
            </ChartTooltipLayer>
          ) : null}

          {!isMulti && showLatestValue && activePoint && pointIndex === null && yAxis === 'right' ? (
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
            columns={['Date', ...(isMulti ? seriesList.map((s) => s.label) : ['Value'])]}
            rows={primaryPoints.map((point, index) => ({
              header: dateFormatter(parseChartDate(point.date)),
              cells: isMulti
                ? seriesList.map((s) => {
                    const v = s.visiblePoints[index]?.value
                    return v != null ? valueFormatter(v) : ''
                  })
                : [valueFormatter(point.value)],
            }))}
          />
        ) : null}
      </div>
    )
  },
)
TimeSeriesChart.displayName = 'TimeSeriesChart'

export { TimeSeriesChart }
