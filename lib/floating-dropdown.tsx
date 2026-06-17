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
import { useRegisterScrollLockPortalShard } from '@/lib/modal-scroll-lock'
import { cn } from '@/lib/utils'

export function useFloatingDropdownCoords(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  popoverRef: RefObject<HTMLElement | null>,
  options: DropdownPlacementOptions = {},
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

    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, anchorRef, popoverRef, offset, maxHeight])

  return open ? coords : null
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
  const coords = useFloatingDropdownCoords(open, anchorRef, popoverRef, placementOptions)

  useRegisterScrollLockPortalShard(popoverRef, open && coords !== null)

  if (!open || !coords || typeof document === 'undefined') return null

  const resolvedWidth = width === 'anchor' ? coords.width : width

  return createPortal(
    <div
      ref={popoverRef as RefObject<HTMLDivElement>}
      id={id}
      role={role}
      aria-label={ariaLabel}
      data-placement={coords.placement}
      className={cn('shadow-lg', className)}
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
