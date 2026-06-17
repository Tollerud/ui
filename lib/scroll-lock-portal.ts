import type { UIEvent } from 'react'

/**
 * Radix Dialog/Sheet uses react-remove-scroll on the document, which blocks wheel
 * and touch scroll on portalled nodes outside Dialog.Content (Select, Combobox, etc.).
 * Stopping propagation keeps background scroll locked while list panels scroll.
 */
export function allowScrollInsideScrollLock(event: UIEvent) {
  event.stopPropagation()
}
