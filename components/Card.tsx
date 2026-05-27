import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-tollerud-surface-raised p-6 transition-[border-color] duration-[150ms]',
          accent ? 'border-tollerud-yellow/25' : 'border-tollerud-border',
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
