import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const toneStyles = {
  default: { wrapper: 'border-tollerud-border bg-tollerud-surface-raised', icon: 'text-tollerud-text-muted' },
  accent:  { wrapper: 'border-tollerud-yellow/30 bg-tollerud-yellow/5',    icon: 'text-tollerud-yellow' },
  info:    { wrapper: 'border-blue-500/30 bg-blue-500/5',                  icon: 'text-blue-400' },
  success: { wrapper: 'border-green-500/30 bg-green-500/5',                icon: 'text-green-400' },
  error:   { wrapper: 'border-red-500/30 bg-red-500/5',                    icon: 'text-red-400' },
} as const

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: keyof typeof toneStyles
  title?: string
  icon?: React.ReactNode
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone = 'default', title, icon, children, ...props }, ref) => {
    const styles = toneStyles[tone]
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex gap-3 rounded-md border p-4',
          styles.wrapper,
          className
        )}
        {...props}
      >
        {icon && (
          <span className={cn('mt-0.5 flex-shrink-0 w-[18px] h-[18px]', styles.icon)}>
            {icon}
          </span>
        )}
        <div className="min-w-0">
          {title && (
            <p className="text-sm font-semibold text-tollerud-text-primary leading-snug">
              {title}
            </p>
          )}
          {children && (
            <p className={cn('text-sm text-tollerud-text-secondary leading-relaxed', title && 'mt-1')}>
              {children}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Alert.displayName = 'Alert'

export { Alert }
