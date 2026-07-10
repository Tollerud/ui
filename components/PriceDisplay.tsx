'use client'

import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from './Badge'

export type PriceDisplaySize = 'sm' | 'md' | 'lg'

export interface PriceDisplayProps extends HTMLAttributes<HTMLDivElement> {
  /** Primary price string, rendered large — e.g. `"58,0 kr/l"` */
  primary: string
  /** Secondary label rendered as a Badge below the primary value — e.g. `"29,00 kr"` */
  secondary?: string
  /**
   * `"cheapest"` switches the primary value to success color and the badge to `variant="success"`.
   * `false` (default) uses muted text for the primary and default badge styling.
   */
  highlight?: 'cheapest' | false
  /** Text alignment of the block. Default `"right"`. */
  align?: 'left' | 'right'
  /** Primary value scale. Default `"md"`. */
  size?: PriceDisplaySize
}

const sizeStyles: Record<
  PriceDisplaySize,
  { root: string; primary: string; badge: string }
> = {
  sm: {
    root: 'gap-0.5',
    primary: 'text-sm font-semibold',
    badge: 'px-1.5 py-px text-[10px]',
  },
  md: {
    root: 'gap-1',
    primary: 'text-base font-semibold',
    badge: '',
  },
  lg: {
    root: 'gap-1.5',
    primary: 'text-lg font-semibold',
    badge: 'px-2.5 py-0.5 text-sm',
  },
}

const PriceDisplay = forwardRef<HTMLDivElement, PriceDisplayProps>(
  (
    { className, primary, secondary, highlight = false, align = 'right', size = 'md', ...props },
    ref,
  ) => {
    const styles = sizeStyles[size]

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col',
          styles.root,
          align === 'right' ? 'items-end' : 'items-start',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            styles.primary,
            'tabular-nums leading-none',
            highlight === 'cheapest' ? 'text-tollerud-success' : 'text-tollerud-text-primary',
          )}
        >
          {primary}
        </span>
        {secondary && (
          <Badge
            variant={highlight === 'cheapest' ? 'success' : 'default'}
            className={styles.badge}
          >
            {secondary}
          </Badge>
        )}
      </div>
    )
  },
)
PriceDisplay.displayName = 'PriceDisplay'

export { PriceDisplay }
