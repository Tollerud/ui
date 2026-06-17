'use client'

import { RemoveScroll } from 'react-remove-scroll'
import { useRef, type HTMLAttributes, type RefObject } from 'react'
import { cn } from '@/lib/utils'
import { useMirrorDataState, useScrollLockPortalShardRefs } from '@/lib/scroll-lock-portal'

export interface ModalScrollLockOverlayProps extends HTMLAttributes<HTMLDivElement> {
  contentRef: RefObject<HTMLElement | null>
}

/**
 * Replaces Radix Dialog.Overlay for modal scroll-lock: same scrim, but shards include
 * portalled Select/Combobox/DropdownMenu panels registered via scroll-lock-portal.
 */
export function ModalScrollLockOverlay({
  contentRef,
  className,
  ...props
}: ModalScrollLockOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const portalShards = useScrollLockPortalShardRefs()

  useMirrorDataState(contentRef, overlayRef)

  return (
    <RemoveScroll shards={[contentRef, ...portalShards]} allowPinchZoom>
      <div
        ref={overlayRef}
        aria-hidden
        className={cn(className)}
        {...props}
      />
    </RemoveScroll>
  )
}
