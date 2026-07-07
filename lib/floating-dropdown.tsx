'use client'

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import {
  getFloatingDropdownCoords,
  type DropdownPlacement,
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
  // Last placement, so update() can keep the same side while it fits (hysteresis).
  const placementRef = useRef<DropdownPlacement | undefined>(undefined)

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setCoords(null)
      placementRef.current = undefined
      return
    }

    const update = () => {
      if (!anchorRef.current) return
      const next = getFloatingDropdownCoords(
        anchorRef.current,
        popoverRef.current,
        { offset, maxHeight },
        placementRef.current,
      )
      placementRef.current = next.placement
      setCoords(next)
    }

    update()

    // The ResizeObserver keeps placement correct after the popover mounts and
    // when its content resizes (e.g. filtering a Combobox). It fires on size
    // changes only — never on scroll — so it does not chase the viewport. This
    // runs on every device.
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(update)
        : null
    if (popoverRef.current) observer?.observe(popoverRef.current)
    if (anchorRef.current) observer?.observe(anchorRef.current)

    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

    if (isTouchDevice) {
      // Mobile has two kinds of scroll and they need opposite responses:
      //
      //  • A programmatic "settle" scroll — iOS scrolling the page to lift the
      //    focused search input above the keyboard, the address bar collapsing,
      //    a focus/zoom nudge on open. The anchor moves, so we must reposition
      //    to stay glued to it. These carry no finger drag.
      //  • A user fling and its momentum tail. The user is scrolling the content
      //    behind the panel, so we dismiss (repositioning would just chase the
      //    fling and float around, which is why we don't reposition here).
      //
      // `touchScrolled` distinguishes them: it is armed on touchmove and stays
      // armed through the inertial tail (reset only on the next touchstart), so a
      // fling and its momentum both dismiss, while a plain tap-to-open leaves it
      // false and the settle scroll repositions. Repositions are coalesced to one
      // per frame so an animating address bar cannot cause visible float.
      let touchScrolled = false
      let rafId = 0
      const scheduleUpdate = () => {
        if (rafId) return
        rafId = requestAnimationFrame(() => { rafId = 0; update() })
      }
      const onTouchStart = () => { touchScrolled = false }
      const onTouchMove = () => { touchScrolled = true }
      const onScroll = (e: Event) => {
        // Scrolling inside the popover (e.g. the options list) is never outside.
        if (popoverRef.current?.contains(e.target as Node)) return
        if (touchScrolled) {
          onOutsideScroll?.()
        } else {
          scheduleUpdate()
        }
      }
      // visualViewport resize fires for the keyboard, zoom, and address bar —
      // none of which fire a window `scroll` — so reposition on those too.
      const vv = typeof window !== 'undefined' ? window.visualViewport : null
      window.addEventListener('scroll', onScroll, true)
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: true })
      vv?.addEventListener('resize', scheduleUpdate)
      return () => {
        observer?.disconnect()
        if (rafId) cancelAnimationFrame(rafId)
        window.removeEventListener('scroll', onScroll, true)
        window.removeEventListener('touchstart', onTouchStart)
        window.removeEventListener('touchmove', onTouchMove)
        vv?.removeEventListener('resize', scheduleUpdate)
      }
    }

    // Desktop: reposition on scroll/resize so the panel tracks the anchor.
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
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
