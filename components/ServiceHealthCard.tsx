import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { StatusDot, type Status } from './StatusDot'

export interface ServiceHealthCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Service name */
  service: string
  /** Health status */
  status?: Status
  /** Uptime string (e.g. '14d 3h') */
  uptime?: string
  /** Response time in ms */
  responseTime?: string
  /** Current version */
  version?: string
  /** Whether the card is in a loading state */
  loading?: boolean
}

const ServiceHealthCard = forwardRef<HTMLDivElement, ServiceHealthCardProps>(
  ({ className, service, status = 'online', uptime, responseTime, version, loading, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-tia-surface-raised p-4',
          'transition-[border-color] duration-[150ms]',
          status === 'offline' && 'border-tia-error/40',
          status === 'warning' && 'border-tia-yellow/30',
          status === 'online' && 'border-tia-border hover:border-tia-noir-500',
          status === 'idle' && 'border-tia-border opacity-60',
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-tia-foreground truncate">
            {service}
          </span>
          <StatusDot status={status} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-tia-text-muted">
          {uptime && <span>Uptime: <span className="text-tia-text-secondary">{uptime}</span></span>}
          {responseTime && <span>Response: <span className="text-tia-text-secondary">{responseTime}</span></span>}
          {version && <span>Version: <span className="text-tia-text-secondary">{version}</span></span>}
        </div>
      </div>
    )
  }
)
ServiceHealthCard.displayName = 'ServiceHealthCard'

export { ServiceHealthCard }
