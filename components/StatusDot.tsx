import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Status = 'online' | 'offline' | 'warning' | 'idle'

const statusStyles: Record<Status, string> = {
  online:  'bg-tia-success shadow-[0_0_6px_rgba(34,197,94,0.5)]',
  offline: 'bg-tia-error',
  warning: 'bg-tia-yellow shadow-[0_0_6px_rgba(232,213,0,0.5)]',
  idle:    'bg-tia-noir-400',
}

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  status?: Status
  label?: string
}

const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, status = 'idle', label, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}
        {...props}
      >
        <span
          className={cn(
            'inline-block w-2 h-2 rounded-full',
            statusStyles[status]
          )}
        />
        {label && <span>{label}</span>}
      </span>
    )
  }
)
StatusDot.displayName = 'StatusDot'

export { StatusDot }
export type { Status }
