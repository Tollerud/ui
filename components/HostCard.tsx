import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { StatusDot, type Status } from './StatusDot'

export interface HostCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Hostname */
  hostname: string
  /** IP address */
  ip?: string
  /** Status */
  status?: Status
  /** CPU load (e.g. '23%') */
  cpu?: string
  /** Memory usage (e.g. '6.2/16 GB') */
  memory?: string
  /** Disk usage (e.g. '45%') */
  disk?: string
  /** Uptime */
  uptime?: string
  /** Number of containers running */
  containers?: number
  /** Whether the card is loading */
  loading?: boolean
}

const HostCard = forwardRef<HTMLDivElement, HostCardProps>(
  ({ className, hostname, ip, status = 'online', cpu, memory, disk, uptime, containers, loading, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-tollerud-surface-raised p-4',
          'transition-[border-color] duration-fast',
          status === 'offline' && 'border-tollerud-error/40',
          status === 'warning' && 'border-tollerud-yellow/30',
          status === 'online' && 'border-tollerud-border hover:border-tollerud-noir-500',
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <StatusDot status={status} />
            <span className="font-semibold text-sm text-tollerud-foreground truncate">
              {hostname}
            </span>
          </div>
          {containers !== undefined && (
            <span className="text-[11px] text-tollerud-text-muted whitespace-nowrap ml-2">
              {containers} container{containers !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {ip && (
          <div className="text-xs text-tollerud-text-muted mb-2 font-mono">{ip}</div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-tollerud-text-muted">
          {cpu && <span>CPU: <span className="text-tollerud-text-secondary">{cpu}</span></span>}
          {memory && <span>RAM: <span className="text-tollerud-text-secondary">{memory}</span></span>}
          {disk && <span>Disk: <span className="text-tollerud-text-secondary">{disk}</span></span>}
          {uptime && <span>Up: <span className="text-tollerud-text-secondary">{uptime}</span></span>}
        </div>
      </div>
    )
  }
)
HostCard.displayName = 'HostCard'

export { HostCard }
