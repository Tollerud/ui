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

    // On touch devices, close the dropdown when the user scrolls the page behind
    // it rather than chasing the scroll with async React state updates (which lag).
    // On desktop, reposition normally.
    //
    // BUT only dismiss on a *genuine* touch drag. iOS Safari fires `scroll` for
    // programmatic reasons too — auto-zooming a focused <16px input, or scrolling
    // a focused field above the on-screen keyboard. Those must reposition, not
    // close, otherwise a dropdown with an auto-focused search field closes the
    // instant it opens. We track whether a real finger drag is in progress and
    // only dismiss then; all other scrolls fall through to update().
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    let touchDragging = false
    const onTouchStart = () => { touchDragging = false }
    const onTouchMove = () => { touchDragging = true }
    const onTouchEnd = () => { touchDragging = false }
    const onScroll = (e: Event) => {
      if (isTouchDevice && onOutsideScroll) {
        const target = e.target as Node
        // Scroll inside the popover (e.g. the options list) never dismisses.
        if (popoverRef.current?.contains(target)) return
        // Ignore focus/zoom-induced scrolls; only a user drag closes the panel.
        if (touchDragging) {
          onOutsideScroll()
        } else {
          update()
        }
      } else {
        update()
      }
    }

    window.addEventListener('resize', update)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [open, anchorRef, popoverRef, offset, maxHeight, onOutsideScroll])

  return open ? coords : null
}

/**
 * Attach native event listeners that prevent Radix Dialog's FocusScope and
 * DismissableLayer from interfering with portalled interactive content.
 *
 * Three problems arise when a portal (e.g. Combobox dropdown) is inside a Radix Dialog:
 *  1. Radix DismissableLayer sees `pointerdown` outside DialogContent → closes dialog.
 *  2. Radix FocusScope `focusin` handler (bubble, document) sees focus outside
 *     DialogContent → calls focus(lastFocusedElement), stealing focus back.
 *  3. Radix FocusScope `focusout` handler (bubble, document) fires when focus leaves
 *     DialogContent toward the portal. relatedTarget = portal element, which is outside
 *     the container, so Radix calls focus(lastFocusedElement) — before focusin ever fires,
 *     making the focusin escape useless.
 *
 * Fix for 1+2: bubble-phase listeners on the portal element stop pointerdown/focusin
 * before they reach the document-level Radix handlers.
 * Fix for 3: capture-phase focusout listener on document fires before Radix's bubble-phase
 * handler; suppressed only when relatedTarget (the destination) is inside the portal.
 */
function useDialogEscapeHatch(
  elementRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  // useLayoutEffect so listeners are attached synchronously during React's commit phase,
  // before the queueMicrotask-deferred .focus() call in the Combobox callback ref fires.
  useLayoutEffect(() => {
    if (!enabled) return
    const el = elementRef.current
    if (!el) return

    const stop = (e: Event) => e.stopPropagation()

    // Stop pointerdown + focusin from reaching document-level Radix handlers (bubble phase).
    el.addEventListener('pointerdown', stop)
    el.addEventListener('focusin', stop)

    // Stop focusout from reaching Radix's document-level bubble handler when focus is
    // moving INTO the portal. Must be capture phase to fire before Radix's bubble handler.
    const stopFocusOut = (e: FocusEvent) => {
      if (e.relatedTarget instanceof Node && el.contains(e.relatedTarget)) {
        e.stopPropagation()
      }
    }
    document.addEventListener('focusout', stopFocusOut, { capture: true })

    return () => {
      el.removeEventListener('pointerdown', stop)
      el.removeEventListener('focusin', stop)
      document.removeEventListener('focusout', stopFocusOut, { capture: true })
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
