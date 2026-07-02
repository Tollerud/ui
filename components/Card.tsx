import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `true` — yellow border tint (`border-tollerud-yellow/25`), no fill.
   * `"filled"` — yellow border + subtle yellow background fill (`bg-tollerud-yellow/5`). Use for callout boxes, cheapest-item highlights, and CTAs.
   */
  accent?: boolean | 'filled'
  density?: 'comfortable' | 'compact'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent, density, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-density={density ?? undefined}
        className={cn(
          'rounded-lg border bg-tollerud-surface-raised p-6 transition-[border-color,padding] duration-[150ms]',
          '[[data-density=compact]_&]:p-3',
          density === 'compact' && 'p-3',
          accent ? 'border-tollerud-yellow/25' : 'border-tollerud-border',
          accent === 'filled' && 'bg-tollerud-yellow/5',
          'hover:border-tollerud-noir-500',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export { Card }
