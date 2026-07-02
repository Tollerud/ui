import { type HTMLAttributes, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `true` — yellow border tint (`border-tollerud-yellow/25`), no fill.
   * `"filled"` — yellow border + subtle yellow background fill (`bg-tollerud-yellow/5`). Use for callout boxes, cheapest-item highlights, and CTAs.
   */
  accent?: boolean | 'filled'
  density?: 'comfortable' | 'compact'
  /** Render as the single child element instead of a `<div>`, merging props and styles onto it. */
  asChild?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent, density, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'
    return (
      <Comp
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
