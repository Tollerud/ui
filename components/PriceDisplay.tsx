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

const PriceDisplay = forwardRef<HTMLDivElement, PriceDisplayProps>(
  (
    { className, primary, secondary, highlight = false, align = 'right', size = 'md', ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col',
          size === 'sm' && 'gap-0.5',
          size === 'md' && 'gap-1',
          size === 'lg' && 'gap-1.5',
          align === 'right' ? 'items-end' : 'items-start',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'font-semibold tabular-nums leading-none',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg',
            highlight === 'cheapest' ? 'text-tollerud-success' : 'text-tollerud-text-primary',
          )}
        >
          {primary}
        </span>
        {secondary && (
          <Badge
            variant={highlight === 'cheapest' ? 'success' : 'default'}
            className={cn(
              size === 'sm' && 'px-1.5 py-px text-[10px]',
              size === 'lg' && 'px-2.5 py-0.5 text-sm',
            )}
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
