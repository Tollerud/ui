import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = {
  default: 'bg-tia-noir-700 text-tia-text-secondary',
  accent: 'bg-tia-yellow/15 text-tia-yellow',
  success: 'bg-tia-success/15 text-tia-success',
  error: 'bg-tia-error/15 text-tia-error',
  info: 'bg-tia-info/15 text-tia-info',
  warning: 'bg-tia-yellow/15 text-tia-warning',
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
