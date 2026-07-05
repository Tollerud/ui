'use client'

import { type ReactNode, type RefObject, useCallback, useMemo, useRef, useState } from 'react'
import { indexFromPointer } from '@/lib/chart-series'

/**
 * Shared interaction layer for the SVG charts (TimeSeriesChart, AreaChart,
 * Sparkline, …). One active-index state serves both pointer and keyboard so
 * the crosshair, tooltip, and live-region announcements always agree.
 *
 * Keyboard contract (documented in KEYBOARD.md → Charts):
 * - Tab focuses the chart; the latest point becomes active
 * - ArrowLeft / ArrowRight step through points, Home / End jump
 * - Escape clears the active point (consumed only while a point is active,
 *   so a surrounding Dialog stays open — same rule as Combobox/Select)
 */

export interface ChartInteractionOptions {
  /** The interactive SVG element — used to translate pointer X to an index. */
  svgRef: RefObject<SVGSVGElement | null>
  /** Number of data points currently rendered. */
  count: number
  paddingLeft: number
  paddingRight: number
  /** Called when Escape clears an active point. */
  onEscape?: () => void
}

export interface ChartInteraction {
  /** Active point index — from hover, touch, or keyboard; null when idle. */
  activeIndex: number | null
  setActiveIndex: (index: number | null) => void
  /** True while the active point was set via keyboard (drives announcements). */
  isKeyboard: boolean
  /** Spread onto the SVG: pointer + keyboard handlers, tabIndex. */
  svgProps: {
    tabIndex: number
    onPointerDown: () => void
    onMouseMove: (e: React.MouseEvent) => void
    onMouseLeave: () => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: () => void
    onKeyDown: (e: React.KeyboardEvent) => void
    onFocus: () => void
    onBlur: () => void
  }
}

export function useChartInteraction({
  svgRef,
  count,
  paddingLeft,
  paddingRight,
  onEscape,
}: ChartInteractionOptions): ChartInteraction {
  const [rawIndex, setRawIndex] = useState<number | null>(null)
  const [isKeyboard, setIsKeyboard] = useState(false)
  // Focus fires after pointerdown when clicking the SVG; skip the focus-selects
  // -latest behavior in that case so a click doesn't jump the crosshair.
  const pointerDownRef = useRef(false)

  // Clamp instead of resetting when the point count shrinks (range switch).
  const activeIndex =
    rawIndex == null || count === 0 ? null : Math.min(rawIndex, count - 1)

  const setActiveIndex = useCallback((index: number | null) => {
    setRawIndex(index)
    if (index === null) setIsKeyboard(false)
  }, [])

  const handlePointer = useCallback(
    (clientX: number) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect || count === 0) return
      setIsKeyboard(false)
      setRawIndex(indexFromPointer(clientX, rect, count, paddingLeft, paddingRight))
    },
    [count, paddingLeft, paddingRight, svgRef],
  )

  const svgProps = useMemo<ChartInteraction['svgProps']>(
    () => ({
      tabIndex: 0,
      onPointerDown: () => {
        pointerDownRef.current = true
      },
      onMouseMove: (e: React.MouseEvent) => {
        handlePointer(e.clientX)
      },
      onMouseLeave: () => {
        setRawIndex(null)
        setIsKeyboard(false)
      },
      onTouchMove: (e: React.TouchEvent) => {
        const touch = e.touches[0]
        if (touch) handlePointer(touch.clientX)
      },
      onTouchEnd: () => {
        setRawIndex(null)
        setIsKeyboard(false)
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (count === 0) return
        const current = rawIndex == null ? count - 1 : Math.min(rawIndex, count - 1)
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          setIsKeyboard(true)
          setRawIndex(Math.max(0, current - 1))
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          setIsKeyboard(true)
          setRawIndex(Math.min(count - 1, current + 1))
        } else if (e.key === 'Home') {
          e.preventDefault()
          setIsKeyboard(true)
          setRawIndex(0)
        } else if (e.key === 'End') {
          e.preventDefault()
          setIsKeyboard(true)
          setRawIndex(count - 1)
        } else if (e.key === 'Escape') {
          // Consume only while a point is active — innermost layer wins.
          if (rawIndex != null) {
            e.preventDefault()
            e.stopPropagation()
            setRawIndex(null)
            setIsKeyboard(false)
            onEscape?.()
          }
        }
      },
      onFocus: () => {
        if (pointerDownRef.current) {
          pointerDownRef.current = false
          return
        }
        if (count > 0 && rawIndex == null) {
          setIsKeyboard(true)
          setRawIndex(count - 1)
        }
      },
      onBlur: () => {
        pointerDownRef.current = false
        setRawIndex(null)
        setIsKeyboard(false)
      },
    }),
    [count, handlePointer, onEscape, rawIndex],
  )

  return { activeIndex, setActiveIndex, isKeyboard, svgProps }
}

/** Clamp a tooltip anchor so the bubble stays inside the chart width. */
export function clampTooltipX(x: number, width: number, margin = 88): number {
  return Math.min(Math.max(x, margin), width - margin)
}

export interface ChartTooltipProps {
  /** Main value line, large. */
  title: ReactNode
  /** Secondary line under the value — usually the formatted date/label. */
  subtitle?: ReactNode
  /** Emphasized label line (e.g. series or store name). */
  label?: ReactNode
  /** Extra muted lines. */
  lines?: string[]
}

/** Default tooltip bubble — shared visual for every chart. */
export function ChartTooltip({ title, subtitle, label, lines }: ChartTooltipProps) {
  return (
    <div className="min-w-[168px] rounded-lg border border-tollerud-noir-600 bg-tollerud-noir-800 px-3 py-2.5 shadow-lg">
      <div className="text-lg font-semibold leading-tight text-tollerud-text-primary">{title}</div>
      {subtitle != null ? (
        <div className="mt-0.5 text-xs text-tollerud-text-secondary">{subtitle}</div>
      ) : null}
      {label != null ? (
        <div className="mt-2 text-sm font-medium text-tollerud-text-primary">{label}</div>
      ) : null}
      {lines?.map((line, index) => (
        <div key={`${index}-${line}`} className="mt-0.5 text-xs leading-snug text-tollerud-text-muted">
          {line}
        </div>
      ))}
    </div>
  )
}

export interface ChartTooltipLayerProps {
  left: number
  top: number
  children: ReactNode
}

/** Absolute, non-interactive layer that anchors a tooltip above a point. */
export function ChartTooltipLayer({ left, top, children }: ChartTooltipLayerProps) {
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
      style={{ left, top }}
    >
      {children}
    </div>
  )
}

export interface ChartLiveRegionProps {
  /**
   * Announcement for the active point — set only for keyboard-driven changes
   * (hover announcements are noise). The region stays mounted so assistive
   * technology keeps observing it.
   */
  message: string | null
}

/** Visually-hidden polite live region announcing keyboard-selected points. */
export function ChartLiveRegion({ message }: ChartLiveRegionProps) {
  return (
    <div aria-live="polite" className="sr-only">
      {message}
    </div>
  )
}
