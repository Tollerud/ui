'use client'

import { useLayoutEffect, useState, type RefObject } from 'react'

export type DropdownPlacement = 'bottom' | 'top'

export interface DropdownPlacementOptions {
  /** Gap between anchor and menu in px. Matches Tailwind `mt-1` / `mb-1` (4px). */
  offset?: number
  /** Estimated menu height when measuring before layout or when content is shorter than max. */
  maxHeight?: number
}

const DEFAULT_OFFSET = 4

export function getDropdownPlacement(
  anchor: HTMLElement,
  popover: HTMLElement | null | undefined,
  options: DropdownPlacementOptions = {},
  /**
   * The placement currently in use, if the dropdown is already open. When the
   * current side still has room, it is kept (hysteresis) so that shrinking the
   * content — e.g. filtering a Combobox down to one result — does not flip the
   * panel from top to bottom (or vice-versa) mid-interaction.
   */
  current?: DropdownPlacement,
): DropdownPlacement {
  const offset = options.offset ?? DEFAULT_OFFSET
  const maxHeight = options.maxHeight ?? 240
  const rect = anchor.getBoundingClientRect()

  const measuredHeight = popover
    ? Math.min(popover.getBoundingClientRect().height || maxHeight, maxHeight)
    : maxHeight

  const spaceBelow = window.innerHeight - rect.bottom - offset
  const spaceAbove = rect.top - offset

  // Prefer keeping the side we already committed to while it still fits.
  if (current === 'bottom' && spaceBelow >= measuredHeight) return 'bottom'
  if (current === 'top' && spaceAbove >= measuredHeight) return 'top'

  if (spaceBelow >= measuredHeight) return 'bottom'
  if (spaceAbove >= measuredHeight) return 'top'
  return spaceBelow >= spaceAbove ? 'bottom' : 'top'
}

export function dropdownPlacementClasses(placement: DropdownPlacement): string {
  return placement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
}

export interface FloatingDropdownCoords {
  placement: DropdownPlacement
  top: number
  left: number
  width: number
  maxHeight: number
}

/** Fixed viewport coordinates for a portalled dropdown anchored to a trigger. */
export function getFloatingDropdownCoords(
  anchor: HTMLElement,
  popover: HTMLElement | null | undefined,
  options: DropdownPlacementOptions = {},
  /** Current placement, for hysteresis — see {@link getDropdownPlacement}. */
  current?: DropdownPlacement,
): FloatingDropdownCoords {
  const offset = options.offset ?? DEFAULT_OFFSET
  const maxHeight = options.maxHeight ?? 240
  const rect = anchor.getBoundingClientRect()
  const placement = getDropdownPlacement(anchor, popover, options, current)
  const measuredHeight = popover
    ? Math.min(popover.getBoundingClientRect().height || maxHeight, maxHeight)
    : maxHeight

  const top =
    placement === 'bottom'
      ? rect.bottom + offset
      : Math.max(offset, rect.top - offset - measuredHeight)

  return {
    placement,
    top,
    left: rect.left,
    width: rect.width,
    maxHeight,
  }
}

export function useDropdownPlacement(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  popoverRef: RefObject<HTMLElement | null>,
  options: DropdownPlacementOptions = {},
): DropdownPlacement {
  const [placement, setPlacement] = useState<DropdownPlacement>('bottom')
  const offset = options.offset ?? DEFAULT_OFFSET
  const maxHeight = options.maxHeight ?? 240

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setPlacement('bottom')
      return
    }

    const placementOptions = { offset, maxHeight }

    const update = () => {
      if (!anchorRef.current) return
      setPlacement(getDropdownPlacement(anchorRef.current, popoverRef.current, placementOptions))
    }

    update()

    const observer =
      typeof ResizeObserver !== 'undefined' && popoverRef.current
        ? new ResizeObserver(update)
        : null
    if (popoverRef.current) observer?.observe(popoverRef.current)

    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, anchorRef, popoverRef, offset, maxHeight])

  return placement
}
