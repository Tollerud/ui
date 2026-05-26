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
          'rounded-lg border bg-tia-surface-raised p-6 transition-[border-color] duration-[150ms]',
          accent ? 'border-tia-yellow/25' : 'border-tia-border',
          'hover:border-tia-noir-500',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export { Card }
