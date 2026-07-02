'use client'

import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from './Badge'

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
}

const PriceDisplay = forwardRef<HTMLDivElement, PriceDisplayProps>(
  ({ className, primary, secondary, highlight = false, align = 'right', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-1',
          align === 'right' ? 'items-end' : 'items-start',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'text-base font-semibold tabular-nums leading-none',
            highlight === 'cheapest' ? 'text-tollerud-success' : 'text-tollerud-text-primary',
          )}
        >
          {primary}
        </span>
        {secondary && (
          <Badge variant={highlight === 'cheapest' ? 'success' : 'default'}>
            {secondary}
          </Badge>
        )}
      </div>
    )
  },
)
PriceDisplay.displayName = 'PriceDisplay'

export { PriceDisplay }
