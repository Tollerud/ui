import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { StatusDot, type Status } from './StatusDot'

export interface StackService {
  name: string
  status: Status
}

export interface DockerStackCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Stack name */
  name: string
  /** Services in the stack */
  services: StackService[]
  /** Path to compose file */
  composePath?: string
  /** Whether the card is loading */
  loading?: boolean
}

const DockerStackCard = forwardRef<HTMLDivElement, DockerStackCardProps>(
  ({ className, name, services, composePath, loading, ...props }, ref) => {
    const onlineCount = services.filter((s) => s.status === 'online').length
    const degraded = services.some((s) => s.status === 'offline' || s.status === 'warning')
    const status: Status = services.every((s) => s.status === 'online') ? 'online' : degraded ? 'warning' : 'offline'

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-tollerud-surface-raised p-4',
          'transition-[border-color] duration-[150ms]',
          status === 'offline' && 'border-tollerud-error/40',
          status === 'warning' && 'border-tollerud-yellow/30',
          status === 'online' && 'border-tollerud-border hover:border-tollerud-noir-500',
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <StatusDot status={status} />
            <span className="font-semibold text-sm text-tollerud-foreground truncate">
              {name}
            </span>
          </div>
          <span className="text-xs text-tollerud-text-muted whitespace-nowrap ml-2">
            {onlineCount}/{services.length} healthy
          </span>
        </div>
        {composePath && (
          <div className="text-[11px] text-tollerud-text-muted font-mono mb-2 truncate">
            {composePath}
          </div>
        )}
        <div className="flex flex-col gap-1">
          {services.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between text-xs">
              <span className="text-tollerud-text-secondary truncate">{svc.name}</span>
              <StatusDot status={svc.status} />
            </div>
          ))}
        </div>
      </div>
    )
  }
)
DockerStackCard.displayName = 'DockerStackCard'

export { DockerStackCard }
