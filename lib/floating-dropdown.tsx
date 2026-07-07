'use client'

import {
  useLayoutEffect,
  useMemo,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import {
  useFloating,
  autoUpdate,
  offset as offsetMiddleware,
  flip,
  shift,
  size,
} from '@floating-ui/react-dom'
import { useBypassModalScrollLock } from '@/lib/bypass-modal-scroll-lock'
import { cn, mergeRefs } from '@/lib/utils'

/** Positioning options for {@link FloatingDropdownPortal}. */
export interface DropdownPlacementOptions {
  /** Gap between the anchor and the panel in px. Default 4 (Tailwind `mt-1`). */
  offset?: number
  /** Upper bound on the panel height in px; the panel also never exceeds the
   *  space Floating UI has available, so it shrinks to fit small viewports. */
  maxHeight?: number
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
}: FloatingDropdownPortalProps) {
  const gap = placementOptions?.offset ?? 4
  const maxHeight = placementOptions?.maxHeight ?? 240

  // Floating UI is the same positioning engine Radix Popover / shadcn use.
  // `autoUpdate` keeps the panel glued to the trigger across scroll, resize,
  // layout shifts, and mobile viewport changes (iOS keyboard/zoom/address bar),
  // so we no longer hand-roll scroll/touch listeners. `flip` swaps top/bottom
  // when space runs out, `shift` nudges it back into view, and `size` caps the
  // height to the smaller of `maxHeight` and the room actually available.
  const { refs, floatingStyles, placement, isPositioned } = useFloating({
    open,
    strategy: 'fixed',
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offsetMiddleware(gap),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, availableHeight, elements }) {
          elements.floating.style.width =
            width === 'anchor' ? `${rects.reference.width}px` : `${width}px`
          elements.floating.style.maxHeight = `${Math.min(maxHeight, availableHeight)}px`
        },
      }),
    ],
  })

  // The caller owns `anchorRef`; feed its current node to Floating UI's reference.
  useLayoutEffect(() => {
    refs.setReference(anchorRef.current)
  }, [refs, anchorRef, open])

  // One ref on the portal element must feed both the caller's popoverRef (used
  // by the outside-click / Dialog-escape helpers) and Floating UI's floating slot.
  const setFloatingRef = useMemo(
    () => mergeRefs<HTMLElement>(popoverRef, refs.setFloating),
    [popoverRef, refs],
  )

  const isOpen = open && isPositioned
  useBypassModalScrollLock(popoverRef, isOpen)
  useDialogEscapeHatch(popoverRef, isOpen)

  if (!open || typeof document === 'undefined') return null

  const side = placement.split('-')[0] === 'top' ? 'top' : 'bottom'

  return createPortal(
    <div
      ref={setFloatingRef}
      id={id}
      role={role}
      aria-label={ariaLabel}
      data-placement={side}
      className={cn('pointer-events-auto shadow-lg', className)}
      style={{
        ...floatingStyles,
        zIndex: 50,
        // Avoid a flash at (0,0) before the first measurement resolves.
        visibility: isPositioned ? 'visible' : 'hidden',
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
