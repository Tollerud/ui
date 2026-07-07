'use client'

import { type HTMLAttributes, forwardRef, useMemo, useState } from 'react'
import { formatChartDateLong, parseChartDate } from '@/lib/chart-series'
import { ChartSrTable, ChartTooltip, ChartTooltipLayer } from '@/lib/chart-interaction'
import { cn } from '@/lib/utils'

export interface HeatmapDatum {
  date: Date | string | number
  value: number
}

export interface HeatmapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  data: HeatmapDatum[]
  /** Grid start (default: earliest date in `data`). */
  startDate?: Date | string | number
  /** Grid end (default: latest date in `data`). */
  endDate?: Date | string | number
  /** First column of each week: 0 = Sunday, 1 = Monday (default 1). */
  weekStartsOn?: 0 | 1
  /**
   * Five cell colors by intensity: index 0 = zero/no activity, 1–4 = light→
   * strong. Defaults to a yellow-on-noir scale.
   */
  colors?: [string, string, string, string, string]
  /** Formats the value in tooltips and the SR table (default: raw number). */
  formatValue?: (value: number) => string
  formatDate?: (date: Date) => string
  locale?: string
  /** Show the “Less → More” intensity legend (default on). */
  showLegend?: boolean
  cellSize?: number
  cellGap?: number
  ariaLabel?: string
  /** Visually-hidden data table of every day's value for screen readers (default on). */
  srTable?: boolean
}

const DEFAULT_COLORS: [string, string, string, string, string] = [
  'var(--tollerud-noir-800, #1a1a1a)',
  'color-mix(in srgb, var(--tollerud-yellow-warm, #E8D500) 30%, var(--tollerud-noir-800, #1a1a1a))',
  'color-mix(in srgb, var(--tollerud-yellow-warm, #E8D500) 55%, var(--tollerud-noir-800, #1a1a1a))',
  'color-mix(in srgb, var(--tollerud-yellow-warm, #E8D500) 78%, var(--tollerud-noir-800, #1a1a1a))',
  'var(--tollerud-yellow-warm, #E8D500)',
]

const MS_DAY = 24 * 60 * 60 * 1000
const WEEKDAY_LABELS_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WEEKDAY_LABELS_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

interface Cell {
  date: Date
  value: number | null
  level: number // -1 out of range, 0 zero, 1..4 intensity
}

const Heatmap = forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      className,
      data,
      startDate,
      endDate,
      weekStartsOn = 1,
      colors = DEFAULT_COLORS,
      formatValue,
      formatDate,
      locale = 'en-US',
      showLegend = true,
      cellSize = 13,
      cellGap = 3,
      ariaLabel,
      srTable = true,
      ...props
    },
    ref,
  ) => {
    const fmt = formatValue ?? ((v: number) => String(v))
    const dateFmt = formatDate ?? ((d: Date) => formatChartDateLong(d, locale))

    const { weeks, valuedDays } = useMemo(() => {
      const map = new Map<string, number>()
      const parsed = data.map((d) => ({ date: parseChartDate(d.date), value: d.value }))
      for (const d of parsed) map.set(dayKey(d.date), (map.get(dayKey(d.date)) ?? 0) + d.value)
      const times = parsed.map((d) => d.date.getTime())
      const start = startDate != null ? parseChartDate(startDate) : new Date(Math.min(...times))
      const end = endDate != null ? parseChartDate(endDate) : new Date(Math.max(...times))
      const maxValue = Math.max(...parsed.map((d) => d.value), 1)

      // Align the start back to the first day of its week.
      const startOffset = (start.getDay() - weekStartsOn + 7) % 7
      const aligned = new Date(start.getTime() - startOffset * MS_DAY)

      // Day boundaries computed once (avoid mutating inside the loop).
      const startBoundary = new Date(start)
      startBoundary.setHours(0, 0, 0, 0)
      const startMs = startBoundary.getTime()
      const endMs = end.getTime()

      const weeks: Cell[][] = []
      let current: Cell[] = []
      const valuedDays: { date: Date; value: number }[] = []
      for (let t = aligned.getTime(); t <= endMs; t += MS_DAY) {
        const date = new Date(t)
        const inRange = t >= startMs && t <= endMs
        const raw = map.get(dayKey(date))
        const value = inRange ? raw ?? 0 : null
        const level =
          value == null ? -1 : value <= 0 ? 0 : Math.min(4, Math.ceil((value / maxValue) * 4))
        current.push({ date, value, level })
        if (value != null && raw != null && raw > 0) valuedDays.push({ date, value: raw })
        if (current.length === 7) {
          weeks.push(current)
          current = []
        }
      }
      if (current.length) {
        while (current.length < 7) current.push({ date: new Date(0), value: null, level: -1 })
        weeks.push(current)
      }
      return { weeks, valuedDays }
    }, [data, startDate, endDate, weekStartsOn])

    const [hover, setHover] = useState<{ x: number; y: number; cell: Cell } | null>(null)
    const weekdayLabels = weekStartsOn === 1 ? WEEKDAY_LABELS_MON : WEEKDAY_LABELS_SUN
    const name = ariaLabel ?? 'Activity heatmap'

    return (
      <div ref={ref} className={cn('inline-block', className)} {...props}>
        <div className="relative flex gap-1.5">
          {/* Weekday labels (show Mon/Wed/Fri to avoid clutter) */}
          <div
            className="flex flex-col text-[10px] text-tollerud-text-muted"
            style={{ gap: cellGap, paddingTop: 0 }}
            aria-hidden="true"
          >
            {weekdayLabels.map((label, i) => (
              <span key={label} style={{ height: cellSize, lineHeight: `${cellSize}px` }}>
                {i % 2 === 0 ? label : ''}
              </span>
            ))}
          </div>

          {/* Week columns */}
          <div className="flex" style={{ gap: cellGap }} role="img" aria-label={name}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: cellGap }}>
                {week.map((cell, di) => (
                  <div
                    key={di}
                    className="rounded-[2px]"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      background: cell.level < 0 ? 'transparent' : colors[cell.level],
                    }}
                    onMouseEnter={
                      cell.level >= 0 && cell.value != null
                        ? (e) => {
                            const host = e.currentTarget.closest('.relative') as HTMLElement
                            const hostRect = host.getBoundingClientRect()
                            const r = e.currentTarget.getBoundingClientRect()
                            setHover({
                              x: r.left - hostRect.left + cellSize / 2,
                              y: r.top - hostRect.top,
                              cell,
                            })
                          }
                        : undefined
                    }
                    onMouseLeave={cell.level >= 0 ? () => setHover(null) : undefined}
                  />
                ))}
              </div>
            ))}
          </div>

          {hover ? (
            <ChartTooltipLayer left={hover.x} top={hover.y - 6}>
              <ChartTooltip
                title={hover.cell.value != null ? fmt(hover.cell.value) : '—'}
                subtitle={dateFmt(hover.cell.date)}
              />
            </ChartTooltipLayer>
          ) : null}
        </div>

        {showLegend ? (
          <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-tollerud-text-muted">
            <span>Less</span>
            {colors.map((color, i) => (
              <span
                key={i}
                className="rounded-[2px]"
                style={{ width: cellSize, height: cellSize, background: color }}
                aria-hidden="true"
              />
            ))}
            <span>More</span>
          </div>
        ) : null}

        {srTable ? (
          <ChartSrTable
            caption={name}
            columns={['Date', 'Value']}
            rows={valuedDays.map((d) => ({ header: dateFmt(d.date), cells: [fmt(d.value)] }))}
          />
        ) : null}
      </div>
    )
  },
)
Heatmap.displayName = 'Heatmap'

export { Heatmap }
