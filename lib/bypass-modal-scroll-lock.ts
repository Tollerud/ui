'use client'

import { useLayoutEffect, type RefObject } from 'react'

/**
 * Radix Dialog/Sheet uses react-remove-scroll on document. Portalled dropdowns sit
 * outside dialog content shards, so wheel/touch hit preventDefault on document.
 *
 * Native listeners on the portal element stop propagation before document handlers run.
 * Pair with `pointer-events-auto` on the same node when body is scroll-locked/inert.
 */
export function useBypassModalScrollLock(
  elementRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    if (!enabled) return

    let element: HTMLElement | null = null
    let frame = 0

    const stopCapture = (event: Event) => {
      event.stopImmediatePropagation()
    }

    const stopBubble = (event: Event) => {
      event.stopPropagation()
    }

    const attach = () => {
      element = elementRef.current
      if (!element) return false

      element.addEventListener('wheel', stopCapture, { capture: true, passive: false })
      element.addEventListener('touchmove', stopCapture, { capture: true, passive: false })
      element.addEventListener('wheel', stopBubble, { passive: false })
      element.addEventListener('touchmove', stopBubble, { passive: false })
      return true
    }

    if (!attach()) {
      frame = requestAnimationFrame(() => {
        attach()
      })
    }

    return () => {
      if (frame) cancelAnimationFrame(frame)
      if (!element) return
      element.removeEventListener('wheel', stopCapture, { capture: true })
      element.removeEventListener('touchmove', stopCapture, { capture: true })
      element.removeEventListener('wheel', stopBubble)
      element.removeEventListener('touchmove', stopBubble)
    }
  }, [enabled, elementRef])
}
