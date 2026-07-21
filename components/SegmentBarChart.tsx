'use client'

import { type HTMLAttributes, forwardRef, useRef, useState } from 'react'
import { SEGMENT_BAR_COLORS } from '@/lib/chart-series'
import { ChartTooltip, ChartTooltipLayer } from '@/lib/chart-interaction'
import { cn } from '@/lib/utils'

export interface SegmentBarChartSegment {
  label: string
  value: number
  /** Optional — omitted colors cycle `SEGMENT_BAR_COLORS`. */
  color?: string
}

export interface SegmentBarChartProps extends HTMLAttributes<HTMLDivElement> {
  segments: SegmentBarChartSegment[]
  /** Bar height in px (default 36). */
  height?: number
  /** Show percentage labels inside segments when wide enough (default on). */
  showPercentLabels?: boolean
  /** Hide in-bar % labels below this share (default 8). */
  minPercentLabel?: number
  /** Formats legend values, tooltips, and aria-labels. */
  formatValue?: (value: number) => string
  /**
   * Focusable segments with tooltips: Tab reaches the bar, ←/→ move between
   * segments (roving tabindex), Home/End jump, Esc dismisses.
   */
  interactive?: boolean
  /** Accessible chart name when `interactive` (default "Segment bar chart"). */
  ariaLabel?: string
}

const SegmentBarChart = forwardRef<HTMLDivElement, SegmentBarChartProps>(
  (
    {
      className,
      segments,
      height = 36,
      showPercentLabels = true,
      minPercentLabel = 8,
      formatValue,
      interactive = false,
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    const fmt = formatValue ?? ((v: number) => String(v))
    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1

    const colorAt = (index: number) =>
      segments[index]!.color ?? SEGMENT_BAR_COLORS[index % SEGMENT_BAR_COLORS.length]!
    const pctAt = (index: number) => Math.round((segments[index]!.value / total) * 100)
    const labelTone = (index: number) => (index < 2 ? 'text-tollerud-noir-950' : 'text-tollerud-text-primary')

    const segmentRefs = useRef<(HTMLDivElement | null)[]>([])
    const [rovingIndex, setRovingIndex] = useState(0)
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const activeIndex = interactive ? (hoverIndex ?? focusedIndex) : null

    const moveFocus = (next: number) => {
      const clamped = Math.max(0, Math.min(segments.length - 1, next))
      setRovingIndex(clamped)
      segmentRefs.current[clamped]?.focus()
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
        moveFocus(segments.length - 1)
      } else if (e.key === 'Escape') {
        if (focusedIndex != null) {
          e.preventDefault()
          e.stopPropagation()
          e.currentTarget.blur()
        }
      }
    }

    const targetProps = (index: number) => {
      const s = segments[index]!
      const pct = pctAt(index)
      const label = `${s.label}: ${fmt(s.value)} (${pct}%)`
      return interactive
        ? {
            ref: (node: HTMLDivElement | null) => {
              segmentRefs.current[index] = node
            },
            role: 'img' as const,
            'aria-label': label,
            tabIndex: index === rovingIndex ? 0 : -1,
            onFocus: () => setFocusedIndex(index),
            onBlur: () => setFocusedIndex(null),
            onMouseEnter: () => setHoverIndex(index),
            onMouseLeave: () => setHoverIndex(null),
            onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => onKeyDown(e, index),
          }
        : {}
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          className={cn(
            'flex w-full overflow-hidden rounded-full',
            interactive && 'tollerud-focus-ring rounded-full',
          )}
          style={{ height }}
          role={interactive ? 'group' : 'img'}
          aria-label={interactive ? ariaLabel ?? 'Segment bar chart' : undefined}
          aria-hidden={!interactive ? true : undefined}
        >
          {segments.map((s, i) => {
            const pct = pctAt(i)
            const widthPct = (s.value / total) * 100
            if (widthPct <= 0) return null
            return (
              <div
                key={i}
                {...targetProps(i)}
                className={cn(
                  'relative flex min-w-0 items-center justify-center transition-opacity duration-normal ease-out motion-reduce:transition-none',
                  interactive && activeIndex != null && activeIndex !== i && 'opacity-35',
                )}
                style={{ width: `${widthPct}%`, background: colorAt(i) }}
              >
                {showPercentLabels && pct >= minPercentLabel ? (
                  <span className={cn('pointer-events-none select-none text-xs font-medium tabular-nums', labelTone(i))}>
                    {pct}%
                  </span>
                ) : null}
                {interactive && activeIndex === i ? (
                  <ChartTooltipLayer left="50%" top="50%">
                    <ChartTooltip title={fmt(s.value)} label={`${s.label} · ${pct}%`} />
                  </ChartTooltipLayer>
                ) : null}
              </div>
            )
          })}
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2" aria-label="Chart legend">
          {segments.map((s, i) => (
            <li key={i} className="flex min-w-0 items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                style={{ background: colorAt(i) }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-sm text-tollerud-text-secondary">{s.label}</span>
              <span className="shrink-0 text-sm tabular-nums text-tollerud-text-primary">{fmt(s.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  },
)

SegmentBarChart.displayName = 'SegmentBarChart'

export { SegmentBarChart }
