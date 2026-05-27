"use client"

import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface KbdProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * The keys to display. Separate by + for chords.
   * @example "⌘K", "⌘⇧S", "⌘K", "Esc"
   */
  keys: string | string[]
  /** Small variant for inline use */
  size?: 'sm' | 'md'
}

/**
 * Keyboard shortcut chip — inspired by Raycast shortcut badges.
 *
 * ```tsx
 * <Kbd keys="⌘K" />
 * <Kbd keys={["⌘", "⇧", "S"]} />
 * <Kbd keys="Esc" size="sm" />
 * ```
 */
const Kbd = forwardRef<HTMLSpanElement, KbdProps>(
  ({ className, keys, size = 'md', ...props }, ref) => {
    const keyArray = typeof keys === 'string' ? [keys] : keys

    return (
      <span
        ref={ref}
        className={cn(
          'tollerud-kbd',
          size === 'sm' && 'tollerud-kbd--sm',
          className
        )}
        {...props}
      >
        {keyArray.map((key, i) => (
          <span key={i} className="tollerud-kbd__key">
            {key}
          </span>
        ))}
      </span>
    )
  }
)
Kbd.displayName = 'Kbd'

export { Kbd }