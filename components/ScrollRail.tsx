'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Children,
  type HTMLAttributes,
  type KeyboardEvent,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export type ScrollRailPeek = false | 'sm' | 'md' | 'lg'
export type ScrollRailGap = 'xs' | 'sm' | 'md' | 'lg'
export type ScrollRailControls = boolean | 'auto'

const peekValues: Record<Exclude<ScrollRailPeek, false>, string> = {
  sm: '1rem',
  md: '1.5rem',
  lg: '2.5rem',
}

const gaps: Record<ScrollRailGap, string> = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

function normalizeItemWidth(itemWidth: number | string): string {
  return typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth
}

export interface ScrollRailProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section'
  /** How much of the next item to reveal at rest. `false` disables peek spacing. */
  peek?: ScrollRailPeek
  gap?: ScrollRailGap
  /** Show prev/next controls, or `'auto'` only when content overflows. */
  controls?: ScrollRailControls
  /** Edge fade masks at scroll boundaries. Default `true`. */
  fadeEdges?: boolean
  /** Accessible name for the scroll region. */
  ariaLabel?: string
  /** Uniform child width (e.g. `280` or `'280px'`). Omit for intrinsic child widths. */
  itemWidth?: number | string
  trackClassName?: string
}

const ScrollRail = forwardRef<HTMLDivElement, ScrollRailProps>(
  (
    {
      as: Tag = 'div',
      peek = 'md',
      gap = 'md',
      controls = false,
      fadeEdges = true,
      ariaLabel = 'Scrollable content',
      itemWidth,
      className,
      trackClassName,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const [overflows, setOverflows] = useState(false)

    const updateScrollState = useCallback(() => {
      const el = scrollRef.current
      if (!el) return
      const { scrollLeft, scrollWidth, clientWidth } = el
      const maxScroll = scrollWidth - clientWidth
      setOverflows(maxScroll > 1)
      setCanScrollLeft(scrollLeft > 1)
      setCanScrollRight(scrollLeft < maxScroll - 1)
    }, [])

    useEffect(() => {
      const el = scrollRef.current
      if (!el) return

      updateScrollState()
      const ro = new ResizeObserver(updateScrollState)
      ro.observe(el)
      if (el.firstElementChild) ro.observe(el.firstElementChild)

      return () => ro.disconnect()
    }, [updateScrollState, children])

    const showControls = controls === true || (controls === 'auto' && overflows)
    const peekValue = peek ? peekValues[peek] : undefined
    const itemBasis = itemWidth ? normalizeItemWidth(itemWidth) : undefined

    const scrollByPage = useCallback((direction: -1 | 1) => {
      const el = scrollRef.current
      if (!el) return
      const distance = Math.max(el.clientWidth * 0.8, 120)
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollBy({
        left: direction * distance,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    }, [])

    const onKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollByPage(-1)
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollByPage(1)
        }
      },
      [scrollByPage]
    )

    const wrappedChildren = Children.map(children, (child) => {
      if (!isValidElement(child)) return child
      if (itemBasis) {
        return (
          <div className="shrink-0" style={{ flexBasis: itemBasis, width: itemBasis }}>
            {child}
          </div>
        )
      }
      return <div className="shrink-0">{child}</div>
    })

    return (
      <Tag
        ref={ref}
        className={cn('relative min-w-0 w-full', className)}
        style={
          peekValue
            ? ({ ...style, '--scroll-rail-peek': peekValue } as React.CSSProperties)
            : style
        }
        {...props}
      >
        {fadeEdges && canScrollLeft ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-[var(--background,var(--tollerud-noir-950))] to-transparent"
          />
        ) : null}
        {fadeEdges && canScrollRight ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-[var(--background,var(--tollerud-noir-950))] to-transparent"
          />
        ) : null}

        {showControls ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Scroll left"
              disabled={!canScrollLeft}
              onClick={() => scrollByPage(-1)}
              className={cn(
                'absolute left-1 top-1/2 z-[2] -translate-y-1/2',
                'border border-tollerud-border/40 bg-tollerud-noir-950/90 shadow-sm backdrop-blur-sm',
                'disabled:pointer-events-none disabled:opacity-0'
              )}
            >
              <ChevronLeft size={16} aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Scroll right"
              disabled={!canScrollRight}
              onClick={() => scrollByPage(1)}
              className={cn(
                'absolute right-1 top-1/2 z-[2] -translate-y-1/2',
                'border border-tollerud-border/40 bg-tollerud-noir-950/90 shadow-sm backdrop-blur-sm',
                'disabled:pointer-events-none disabled:opacity-0'
              )}
            >
              <ChevronRight size={16} aria-hidden />
            </Button>
          </>
        ) : null}

        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- scroll region: onScroll updates fades/controls; onKeyDown for arrow scroll */}
        <div
          ref={scrollRef}
          role="region"
          aria-label={ariaLabel}
          tabIndex={showControls ? 0 : undefined} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex -- keyboard horizontal scroll
          onScroll={updateScrollState}
          onKeyDown={showControls ? onKeyDown : undefined}
          className="tollerud-scroll-rail min-w-0 w-full overflow-x-auto overscroll-x-contain"
        >
          <div
            className={cn(
              'flex w-max min-w-full',
              gaps[gap],
              peekValue && 'pe-[var(--scroll-rail-peek)]',
              trackClassName
            )}
          >
            {wrappedChildren}
          </div>
        </div>
      </Tag>
    )
  }
)
ScrollRail.displayName = 'ScrollRail'

export { ScrollRail }
