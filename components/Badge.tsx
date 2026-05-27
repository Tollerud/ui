import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = {
  default: 'bg-tollerud-noir-700 text-tollerud-text-secondary',
  accent: 'bg-tollerud-yellow/15 text-tollerud-yellow',
  success: 'bg-tollerud-success/15 text-tollerud-success',
  error: 'bg-tollerud-error/15 text-tollerud-error',
  info: 'bg-tollerud-info/15 text-tollerud-info',
  warning: 'bg-tollerud-yellow/15 text-tollerud-warning',
} as const

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded',
          'tracking-wide',
          badgeVariants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }
