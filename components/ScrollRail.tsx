'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
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

/** Rem values aligned with Tailwind gap utilities — exposed as `--scroll-rail-gap`. */
export const scrollRailGapValues: Record<ScrollRailGap, string> = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
}

const VISIBLE_COUNT_ITEM_WIDTH =
  'calc((100cqw - (var(--scroll-rail-columns) - 1) * var(--scroll-rail-gap) - var(--scroll-rail-peek-inset)) / var(--scroll-rail-columns))'

/** Item shell — stretch slot height so `h-full` on children works without consumer boilerplate. */
const ITEM_SHELL = 'flex h-full shrink-0 flex-col'

function normalizeItemWidth(itemWidth: number | string): string {
  return typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth
}

function countScrollRailChildren(children: ReactNode): number {
  let count = 0
  Children.forEach(children, (child) => {
    if (child != null && child !== false) count += 1
  })
  return count
}

export interface ScrollRailProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section'
  /** How much of the next item to reveal when overflowing. `false` disables peek; peek applies only when the row scrolls. */
  peek?: ScrollRailPeek
  gap?: ScrollRailGap
  /** Show prev/next controls, or `'auto'` only when content overflows. */
  controls?: ScrollRailControls
  /** Edge fade masks at scroll boundaries. Default `true`. */
  fadeEdges?: boolean
  /** Accessible name for the scroll region. */
  ariaLabel?: string
  /** Fixed uniform child width (e.g. `280` or `'280px'`). Percentages are track-relative — prefer `visibleCount` for column layouts. */
  itemWidth?: number | string
  /** Items visible at once; fills row when count ≤ this, scrolls when above (viewport-relative sizing). */
  visibleCount?: number
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
      visibleCount,
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

    const childCount = useMemo(() => countScrollRailChildren(children), [children])
    const gapValue = scrollRailGapValues[gap]
    const peekValue = peek ? peekValues[peek] : undefined

    const usesVisibleCount = visibleCount != null && visibleCount > 0
    const overflowsByCount = usesVisibleCount && childCount > visibleCount
    const layoutColumns = usesVisibleCount
      ? overflowsByCount
        ? visibleCount
        : Math.max(childCount, 1)
      : undefined
    const effectivePeekInset = overflowsByCount && peekValue ? peekValue : '0px'

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
    }, [updateScrollState, children, layoutColumns, effectivePeekInset])

    const showControls = controls === true || (controls === 'auto' && overflows)
    const itemBasis = !usesVisibleCount && itemWidth ? normalizeItemWidth(itemWidth) : undefined

    const scrollportStyle = {
      '--scroll-rail-gap': gapValue,
      '--scroll-rail-peek': peekValue ?? '0px',
      '--scroll-rail-peek-inset': effectivePeekInset,
      ...(layoutColumns != null ? { '--scroll-rail-columns': layoutColumns } : {}),
    } as CSSProperties

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
      if (usesVisibleCount) {
        return (
          <div
            className={cn(ITEM_SHELL, 'min-w-0')}
            style={{ flexBasis: VISIBLE_COUNT_ITEM_WIDTH, width: VISIBLE_COUNT_ITEM_WIDTH }}
          >
            {child}
          </div>
        )
      }
      if (itemBasis) {
        return (
          <div className={ITEM_SHELL} style={{ flexBasis: itemBasis, width: itemBasis }}>
            {child}
          </div>
        )
      }
      return <div className={ITEM_SHELL}>{child}</div>
    })

    return (
      <Tag ref={ref} className={cn('relative min-w-0 w-full', className)} style={style} {...props}>
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
          className="tollerud-scroll-rail @container min-w-0 w-full overflow-x-auto overscroll-x-contain"
          style={scrollportStyle}
        >
          <div
            className={cn(
              'tollerud-scroll-rail-track flex',
              usesVisibleCount && !overflowsByCount ? 'w-full' : 'w-max min-w-full',
              overflowsByCount && peekValue && 'pe-[var(--scroll-rail-peek-inset)]',
              trackClassName
            )}
            style={{ gap: 'var(--scroll-rail-gap)' }}
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
