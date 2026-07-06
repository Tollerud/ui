'use client'

import { type HTMLAttributes, forwardRef, useRef, useState } from 'react'
import { CHART_SERIES_COLORS } from '@/lib/chart-series'
import { cn } from '@/lib/utils'

export interface DonutSegment {
  label: string
  value: number
  /** Optional since 4.8.44 — omitted colors cycle the `--chart-1…5` palette. */
  color?: string
}

export interface DonutProps extends HTMLAttributes<HTMLDivElement> {
  segments: DonutSegment[]
  size?: number
  /**
   * Focusable legend rows that highlight their arc: Tab reaches the legend,
   * ↑/↓ (or ←/→) move between rows, Home/End jump, Esc dismisses. Rows carry
   * aria-labels ("Diesel: 420, 38%") announced on focus; the active row shows
   * its value next to the percentage and dims the other arcs.
   */
  interactive?: boolean
  /** Accessible legend name when `interactive` (default "Chart legend"). */
  ariaLabel?: string
  /**
   * Scale the ring down to fit narrow containers instead of a fixed `size`
   * (capped at `size`, stays perfectly circular — a square viewBox scales
   * uniformly). The legend wraps below the ring when space is tight.
   */
  fluid?: boolean
}

const Donut = forwardRef<HTMLDivElement, DonutProps>(
  ({ className, segments, size = 160, interactive = false, ariaLabel, fluid = false, ...props }, ref) => {
    const total = segments.reduce((a, s) => a + s.value, 0) || 1
    const r = size / 2 - 14
    const c = 2 * Math.PI * r
    let offset = 0

    const colorAt = (index: number) =>
      segments[index]!.color ?? CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]!
    const pctAt = (index: number) => Math.round((segments[index]!.value / total) * 100)

    const rowRefs = useRef<(HTMLLIElement | null)[]>([])
    const [rovingIndex, setRovingIndex] = useState(0)
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const activeIndex = interactive ? (hoverIndex ?? focusedIndex) : null

    const moveFocus = (next: number) => {
      const clamped = Math.max(0, Math.min(segments.length - 1, next))
      setRovingIndex(clamped)
      rowRefs.current[clamped]?.focus()
    }

    const onRowKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, index: number) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        moveFocus(index - 1)
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
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

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-6', fluid && 'flex-wrap', className)}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={cn('-rotate-90', fluid && 'h-auto w-full')}
          style={fluid ? { maxWidth: size } : undefined}
          role="img"
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="14"
          />
          {segments.map((s, i) => {
            const len = (s.value / total) * c
            const gap = len > 10 ? 4 : 0
            const el = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={colorAt(i)}
                strokeWidth="14"
                strokeOpacity={activeIndex != null && activeIndex !== i ? 0.35 : 1}
                strokeDasharray={`${Math.max(0.1, len - gap)} ${c - (len - gap)}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            )
            offset += len
            return el
          })}
        </svg>
        <ul
          className="m-0 flex list-none flex-col gap-2 p-0"
          aria-label={interactive ? ariaLabel ?? 'Chart legend' : undefined}
        >
          {segments.map((s, i) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- focusable info target (roving tabindex), not an actionable control: focus/hover highlights the arc and the aria-label is announced natively; there is nothing to activate
            <li
              key={i}
              ref={(node) => {
                rowRefs.current[i] = node
              }}
              className={cn(
                'flex items-center gap-2 rounded text-[13px]',
                interactive && 'tollerud-focus-ring',
                interactive && activeIndex != null && activeIndex !== i && 'opacity-50',
              )}
              aria-label={interactive ? `${s.label}: ${s.value}, ${pctAt(i)}%` : undefined}
              tabIndex={interactive ? (i === rovingIndex ? 0 : -1) : undefined}
              onFocus={interactive ? () => setFocusedIndex(i) : undefined}
              onBlur={interactive ? () => setFocusedIndex(null) : undefined}
              onMouseEnter={interactive ? () => setHoverIndex(i) : undefined}
              onMouseLeave={interactive ? () => setHoverIndex(null) : undefined}
              onKeyDown={interactive ? (e) => onRowKeyDown(e, i) : undefined}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                style={{ background: colorAt(i) }}
              />
              <span className="min-w-[70px] text-tollerud-text-primary">{s.label}</span>
              <span className="font-mono text-tollerud-text-muted">
                {activeIndex === i ? `${s.value} · ${pctAt(i)}%` : `${pctAt(i)}%`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
)
Donut.displayName = 'Donut'

export { Donut }
