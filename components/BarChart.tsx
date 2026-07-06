'use client'

import { type HTMLAttributes, forwardRef, useRef, useState } from 'react'
import { ChartTooltip, ChartTooltipLayer } from '@/lib/chart-interaction'
import { cn } from '@/lib/utils'

export interface BarChartDatum {
  label: string
  value: number
  accent?: boolean
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  data: BarChartDatum[]
  height?: number
  /**
   * Focusable bars with tooltips: Tab reaches the chart, ←/→ move between
   * bars (roving tabindex), Home/End jump, Esc dismisses. Each bar carries an
   * aria-label ("Oslo: 42") that screen readers announce on focus.
   */
  interactive?: boolean
  /** Formats the visible value labels, tooltips, and aria-labels. */
  formatValue?: (value: number) => string
  /** Accessible group name when `interactive` (default "Bar chart"). */
  ariaLabel?: string
}

const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    { className, data, height = 180, interactive = false, formatValue, ariaLabel, ...props },
    ref,
  ) => {
    const max = Math.max(...data.map((d) => d.value), 1)
    const fmt = formatValue ?? ((v: number) => String(v))

    const barRefs = useRef<(HTMLDivElement | null)[]>([])
    // Roving tabindex anchor — which bar is reachable via Tab.
    const [rovingIndex, setRovingIndex] = useState(0)
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const activeIndex = interactive ? (hoverIndex ?? focusedIndex) : null

    const moveFocus = (next: number) => {
      const clamped = Math.max(0, Math.min(data.length - 1, next))
      setRovingIndex(clamped)
      barRefs.current[clamped]?.focus()
    }

    const onBarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
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
        moveFocus(data.length - 1)
      } else if (e.key === 'Escape') {
        // Consume only while a bar is focused — innermost layer wins.
        if (focusedIndex != null) {
          e.preventDefault()
          e.stopPropagation()
          e.currentTarget.blur()
        }
      }
    }

    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        role={interactive ? 'group' : undefined}
        aria-label={interactive ? ariaLabel ?? 'Bar chart' : undefined}
        {...props}
      >
        <div
          className="flex items-end gap-2.5 px-1"
          style={{ height, borderBottom: '1px solid var(--chart-grid)' }}
        >
          {data.map((d, i) => (
            <div
              key={i}
              ref={(node) => {
                barRefs.current[i] = node
              }}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-end h-full',
                interactive && 'tollerud-focus-ring rounded-t-[3px]',
              )}
              role={interactive ? 'img' : undefined}
              aria-label={interactive ? `${d.label}: ${fmt(d.value)}` : undefined}
              tabIndex={interactive ? (i === rovingIndex ? 0 : -1) : undefined}
              onFocus={interactive ? () => setFocusedIndex(i) : undefined}
              onBlur={interactive ? () => setFocusedIndex(null) : undefined}
              onMouseEnter={interactive ? () => setHoverIndex(i) : undefined}
              onMouseLeave={interactive ? () => setHoverIndex(null) : undefined}
              onKeyDown={interactive ? (e) => onBarKeyDown(e, i) : undefined}
            >
              <span className="mb-1.5 font-mono text-[11px] text-tollerud-text-secondary">
                {fmt(d.value)}
              </span>
              <div
                className={cn(
                  'w-full max-w-[38px] rounded-t-[3px] transition-[height] duration-500 ease-out motion-reduce:transition-none',
                  d.accent ? 'bg-tollerud-yellow' : 'bg-tollerud-noir-600'
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
