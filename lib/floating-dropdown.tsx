'use client'

import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import {
  getFloatingDropdownCoords,
  type DropdownPlacementOptions,
  type FloatingDropdownCoords,
} from '@/lib/dropdown-placement'
import { useBypassModalScrollLock } from '@/lib/bypass-modal-scroll-lock'
import { cn } from '@/lib/utils'

export function useFloatingDropdownCoords(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  popoverRef: RefObject<HTMLElement | null>,
  options: DropdownPlacementOptions = {},
  onOutsideScroll?: () => void,
): FloatingDropdownCoords | null {
  const offset = options.offset ?? 4
  const maxHeight = options.maxHeight ?? 240
  const [coords, setCoords] = useState<FloatingDropdownCoords | null>(null)

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setCoords(null)
      return
    }

    const update = () => {
      if (!anchorRef.current) return
      setCoords(getFloatingDropdownCoords(anchorRef.current, popoverRef.current, { offset, maxHeight }))
    }

    update()

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(update)
        : null
    if (popoverRef.current) observer?.observe(popoverRef.current)
    if (anchorRef.current) observer?.observe(anchorRef.current)

    // On touch devices, close the dropdown when the page scrolls behind it
    // rather than chasing the scroll with async React state updates (which lag).
    // On desktop, reposition normally.
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    const onScroll = (e: Event) => {
      if (isTouchDevice && onOutsideScroll) {
        const target = e.target as Node
        if (!popoverRef.current?.contains(target)) {
          onOutsideScroll()
        }
      } else {
        update()
      }
    }

    window.addEventListener('resize', update)
    window.addEventListener('scroll', onScroll, true)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open, anchorRef, popoverRef, offset, maxHeight, onOutsideScroll])

  return open ? coords : null
}

/**
 * Attach native event listeners to the portalled element that stop
 * `pointerdown` and `focusin` from bubbling to `document`.
 *
 * Without this, two problems arise when the portal is inside a Radix Dialog:
 *  1. Radix DismissableLayer sees `pointerdown` outside DialogContent → closes dialog.
 *  2. Radix FocusScope (trapped=true) sees `focusin` outside DialogContent → redirects
 *     focus back, making portalled inputs (e.g. the Combobox search field) unreachable.
 *
 * Both listeners use the bubble phase so they fire before the document-level handlers
 * Radix registers, and `stopPropagation()` prevents those handlers from executing.
 */
function useDialogEscapeHatch(
  elementRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  // useLayoutEffect (not useEffect) so listeners are attached synchronously
  // during React's commit phase — before any queued microtask can call .focus()
  // on a portalled input. This guarantees stopPropagation is in place before
  // Radix Dialog's document-level focusin handler can redirect focus.
  useLayoutEffect(() => {
    if (!enabled) return
    const el = elementRef.current
    if (!el) return
    const stop = (e: Event) => e.stopPropagation()
    el.addEventListener('pointerdown', stop)
    el.addEventListener('focusin', stop)
    return () => {
      el.removeEventListener('pointerdown', stop)
      el.removeEventListener('focusin', stop)
    }
  }, [enabled, elementRef])
}

export interface FloatingDropdownPortalProps {
  open: boolean
  anchorRef: RefObject<HTMLElement | null>
  popoverRef: RefObject<HTMLElement | null>
  children: ReactNode
  className?: string
  style?: CSSProperties
  placementOptions?: DropdownPlacementOptions
  /** Match trigger width (default) or a fixed px width. */
  width?: number | 'anchor'
  id?: string
  role?: string
  'aria-label'?: string
  /** Called when the page scrolls on a touch device behind the open dropdown. Use to close the dropdown instead of repositioning (prevents visible scroll lag on mobile). */
  onOutsideScroll?: () => void
}

export function FloatingDropdownPortal({
  open,
  anchorRef,
  popoverRef,
  children,
  className,
  style,
  placementOptions,
  width = 'anchor',
  id,
  role,
  'aria-label': ariaLabel,
  onOutsideScroll,
}: FloatingDropdownPortalProps) {
  const coords = useFloatingDropdownCoords(open, anchorRef, popoverRef, placementOptions, onOutsideScroll)
  const isOpen = open && coords !== null

  useBypassModalScrollLock(popoverRef, isOpen)
  useDialogEscapeHatch(popoverRef, isOpen)

  if (!open || !coords || typeof document === 'undefined') return null

  const resolvedWidth = width === 'anchor' ? coords.width : width

  return createPortal(
    <div
      ref={popoverRef as RefObject<HTMLDivElement>}
      id={id}
      role={role}
      aria-label={ariaLabel}
      data-placement={coords.placement}
      className={cn('pointer-events-auto shadow-lg', className)}
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        width: resolvedWidth,
        maxHeight: coords.maxHeight,
        zIndex: 50,
        ...style,
      }}
    >
      {children}
    </div>,
    document.body,
  )
}

/** Close when clicking outside both the anchor and portalled popover. */
export function isOutsideFloatingDropdown(
  target: Node,
  anchorRef: RefObject<HTMLElement | null>,
  popoverRef: RefObject<HTMLElement | null>,
): boolean {
  if (anchorRef.current?.contains(target)) return false
  if (popoverRef.current?.contains(target)) return false
  return true
}
