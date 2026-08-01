'use client'

import { useCallback, useRef, type RefCallback } from 'react'

/**
 * Radix Dialog/Sheet uses react-remove-scroll on document. Portalled dropdowns sit
 * outside dialog content shards, so wheel/touch hit preventDefault on document.
 *
 * Native listeners on the portal element stop propagation before document handlers run.
 * Pair with `pointer-events-auto` on the same node when body is scroll-locked/inert.
 *
 * Implemented as a ref callback (not a `useLayoutEffect` keyed off a ref object) because
 * the target element (e.g. Radix DropdownMenuContent) unmounts/remounts on every
 * open/close — a `useRef` + effect with a stable dependency array only gets one shot at
 * attaching, at the wrapper component's initial mount, which is almost always *before*
 * the dropdown's first open. A callback ref instead fires exactly when the real node
 * mounts and unmounts, every time, so it reattaches on every open.
 */
export function useBypassModalScrollLock(enabled: boolean): RefCallback<HTMLElement> {
  const cleanupRef = useRef<(() => void) | null>(null)

  return useCallback(
    (element: HTMLElement | null) => {
      cleanupRef.current?.()
      cleanupRef.current = null

      if (!enabled || !element) return

      const stopCapture = (event: Event) => {
        event.stopImmediatePropagation()
      }
      const stopBubble = (event: Event) => {
        event.stopPropagation()
      }

      element.addEventListener('wheel', stopCapture, { capture: true, passive: false })
      element.addEventListener('touchmove', stopCapture, { capture: true, passive: false })
      element.addEventListener('wheel', stopBubble, { passive: false })
      element.addEventListener('touchmove', stopBubble, { passive: false })

      cleanupRef.current = () => {
        element.removeEventListener('wheel', stopCapture, { capture: true })
        element.removeEventListener('touchmove', stopCapture, { capture: true })
        element.removeEventListener('wheel', stopBubble)
        element.removeEventListener('touchmove', stopBubble)
      }
    },
    [enabled]
  )
}
