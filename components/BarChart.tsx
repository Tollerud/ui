'use client'

import { type HTMLAttributes, forwardRef, useRef, useState } from 'react'
import { CHART_SERIES_COLORS } from '@/lib/chart-series'
import { ChartTooltip, ChartTooltipLayer } from '@/lib/chart-interaction'
import { cn } from '@/lib/utils'

export interface BarChartDatum {
  label: string
  value: number
  accent?: boolean
}

export interface BarChartSeries {
  label: string
  /** One value per category, index-aligned with `categories`. */
  values: number[]
  /** Bar color; defaults to the `--chart-1…5` palette cycled by position. */
  color?: string
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Single series. Ignored when `series` is provided. */
  data?: BarChartDatum[]
  /** Multiple series — grouped bars by default, or stacked with `stacked`. Pair with `categories`. */
  series?: BarChartSeries[]
  /** Category (x-axis) labels for multi-series charts. */
  categories?: string[]
  /** Stack series into one bar per category instead of grouping side by side. */
  stacked?: boolean
  height?: number
  /**
   * Focusable bars/columns with tooltips: Tab reaches the chart, ←/→ move
   * between targets (roving tabindex), Home/End jump, Esc dismisses. Each
   * carries an aria-label announced on focus.
   */
  interactive?: boolean
  /** Formats the visible value labels, tooltips, and aria-labels. */
  formatValue?: (value: number) => string
  /** Show a swatch legend above the chart (multi-series; default on). */
  showLegend?: boolean
  /** Accessible group name when `interactive` (default "Bar chart"). */
  ariaLabel?: string
}

const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      className,
      data,
      series,
      categories: categoriesProp,
      stacked = false,
      height = 180,
      interactive = false,
      formatValue,
      showLegend = true,
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    const fmt = formatValue ?? ((v: number) => String(v))
    const isMulti = Boolean(series && series.length > 0)

    const categories = isMulti
      ? categoriesProp ?? (series![0]?.values.map((_, i) => `#${i + 1}`) ?? [])
      : (data ?? []).map((d) => d.label)
    const seriesCount = isMulti ? series!.length : 1
    const colorAt = (si: number) =>
      series?.[si]?.color ?? CHART_SERIES_COLORS[si % CHART_SERIES_COLORS.length]!

    // Y scale: grouped/single use the largest single value; stacked uses the
    // largest per-category sum.
    const max = isMulti
      ? stacked
        ? Math.max(
            ...categories.map((_, ci) => series!.reduce((sum, s) => sum + (s.values[ci] ?? 0), 0)),
            1,
          )
        : Math.max(...series!.flatMap((s) => s.values), 1)
      : Math.max(...(data ?? []).map((d) => d.value), 1)

    // Flat focus-target count for the roving tabindex: single = one per bar;
    // grouped = one per (category, series); stacked = one per category column.
    const focusCount = isMulti ? (stacked ? categories.length : categories.length * seriesCount) : (data ?? []).length

    const barRefs = useRef<(HTMLDivElement | null)[]>([])
    const [rovingIndex, setRovingIndex] = useState(0)
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const activeIndex = interactive ? (hoverIndex ?? focusedIndex) : null

    const moveFocus = (next: number) => {
      const clamped = Math.max(0, Math.min(focusCount - 1, next))
      setRovingIndex(clamped)
      barRefs.current[clamped]?.focus()
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        moveFocus(index - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        moveFocus(index + 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        moveFocus(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        moveFocus(focusCount - 1)
      } else if (e.key === 'Escape') {
        if (focusedIndex != null) {
          e.preventDefault()
          e.stopPropagation()
          e.currentTarget.blur()
        }
      }
    }

    // Shared focusable-target props for a given flat index.
    const targetProps = (flatIndex: number, label: string) =>
      interactive
        ? {
            ref: (node: HTMLDivElement | null) => {
              barRefs.current[flatIndex] = node
            },
            role: 'img' as const,
            'aria-label': label,
            tabIndex: flatIndex === rovingIndex ? 0 : -1,
            onFocus: () => setFocusedIndex(flatIndex),
            onBlur: () => setFocusedIndex(null),
            onMouseEnter: () => setHoverIndex(flatIndex),
            onMouseLeave: () => setHoverIndex(null),
            onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => onKeyDown(e, flatIndex),
          }
        : {}

    const legend =
      isMulti && showLegend ? (
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {series!.map((s, si) => (
            <span key={s.label} className="inline-flex items-center gap-1.5 text-xs text-tollerud-text-secondary">
              <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: colorAt(si) }} aria-hidden="true" />
              {s.label}
            </span>
          ))}
        </div>
      ) : null

    const categoryLabels = (
      <div className="flex gap-2.5 px-1 pt-2">
        {categories.map((label, i) => (
          <div key={i} className="flex-1 text-center text-[11px] text-tollerud-text-muted">
            {label}
          </div>
        ))}
      </div>
    )

    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        role={interactive ? 'group' : undefined}
        aria-label={interactive ? ariaLabel ?? 'Bar chart' : undefined}
        {...props}
      >
        {legend}

        {!isMulti ? (
          // ── Single series (unchanged) ──
          <div
            className="flex items-end gap-2.5 px-1"
            style={{ height, borderBottom: '1px solid var(--chart-grid)' }}
          >
            {(data ?? []).map((d, i) => (
              <div
                key={i}
                {...targetProps(i, `${d.label}: ${fmt(d.value)}`)}
                className={cn(
                  'relative flex flex-1 flex-col items-center justify-end h-full',
                  interactive && 'tollerud-focus-ring rounded-t-[3px]',
                )}
              >
                <span className="mb-1.5 font-mono text-[11px] text-tollerud-text-secondary">{fmt(d.value)}</span>
                <div
                  className={cn(
                    'w-full max-w-[38px] rounded-t-[3px] transition-[height] duration-500 ease-out motion-reduce:transition-none',
                    d.accent ? 'bg-tollerud-yellow' : 'bg-tollerud-noir-600',
                  )}
                  style={{ height: `${(d.value / max) * 100}%` }}
                />
                {activeIndex === i ? (
                  <ChartTooltipLayer left="50%" top={-6}>
                    <ChartTooltip title={fmt(d.value)} label={d.label} />
                  </ChartTooltipLayer>
                ) : null}
              </div>
            ))}
          </div>
        ) : stacked ? (
          // ── Stacked: one bar per category, one focusable column each ──
          <div
            className="flex items-end gap-2.5 px-1"
            style={{ height, borderBottom: '1px solid var(--chart-grid)' }}
          >
            {categories.map((cat, ci) => {
              const label = `${cat}: ${series!.map((s) => `${s.label} ${fmt(s.values[ci] ?? 0)}`).join(', ')}`
              return (
                <div
                  key={ci}
                  {...targetProps(ci, label)}
                  className={cn(
                    'relative flex flex-1 flex-col items-center justify-end h-full',
                    interactive && 'tollerud-focus-ring rounded-t-[3px]',
                  )}
                >
                  <div className="flex w-full max-w-[38px] flex-col-reverse overflow-hidden rounded-t-[3px]">
                    {series!.map((s, si) => (
                      <div
                        key={si}
                        className="w-full transition-[height] duration-500 ease-out motion-reduce:transition-none"
                        style={{ height: `${((s.values[ci] ?? 0) / max) * height}px`, background: colorAt(si) }}
                      />
                    ))}
                  </div>
                  {activeIndex === ci ? (
                    <ChartTooltipLayer left="50%" top={-6}>
                      <ChartTooltip
                        title={cat}
                        rows={series!.map((s, si) => ({
                          label: s.label,
                          value: fmt(s.values[ci] ?? 0),
                          color: colorAt(si),
                        }))}
                      />
                    </ChartTooltipLayer>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : (
          // ── Grouped: side-by-side bars per category, each bar focusable ──
          <div
            className="flex items-end gap-2.5 px-1"
            style={{ height, borderBottom: '1px solid var(--chart-grid)' }}
          >
            {categories.map((cat, ci) => (
              <div key={ci} className="flex h-full flex-1 items-end justify-center gap-1">
                {series!.map((s, si) => {
                  const flatIndex = ci * seriesCount + si
                  const v = s.values[ci] ?? 0
                  return (
                    <div
                      key={si}
                      {...targetProps(flatIndex, `${cat} · ${s.label}: ${fmt(v)}`)}
                      className={cn(
                        'relative flex h-full flex-1 flex-col items-center justify-end',
                        interactive && 'tollerud-focus-ring rounded-t-[3px]',
                      )}
                    >
                      <div
                        className="w-full max-w-[22px] rounded-t-[3px] transition-[height] duration-500 ease-out motion-reduce:transition-none"
                        style={{ height: `${(v / max) * 100}%`, background: colorAt(si) }}
                      />
                      {activeIndex === flatIndex ? (
                        <ChartTooltipLayer left="50%" top={-6}>
                          <ChartTooltip
                            title={cat}
                            rows={[{ label: s.label, value: fmt(v), color: colorAt(si) }]}
                          />
                        </ChartTooltipLayer>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        {categoryLabels}
      </div>
    )
  },
)
BarChart.displayName = 'BarChart'

export { BarChart }
