import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export interface IncidentCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Incident title */
  title: string
  /** Severity level */
  severity: IncidentSeverity
  /** Timestamp string */
  timestamp: string
  /** Description / detail */
  description?: string
  /** Service name affected */
  service?: string
  /** Whether acknowledged */
  acknowledged?: boolean
  /** Whether the card is loading */
  loading?: boolean
}

const severityStyles: Record<IncidentSeverity, { border: string; dot: string; label: string }> = {
  critical: { border: 'border-tollerud-error/50', dot: 'bg-tollerud-error shadow-[0_0_8px_rgba(239,68,68,0.6)]', label: 'text-tollerud-error' },
  high:     { border: 'border-tollerud-yellow/50', dot: 'bg-tollerud-yellow shadow-[0_0_8px_rgba(232,213,0,0.5)]', label: 'text-tollerud-yellow' },
  medium:   { border: 'border-tollerud-amber/40', dot: 'bg-tollerud-amber', label: 'text-tollerud-amber' },
  low:      { border: 'border-tollerud-noir-500', dot: 'bg-tollerud-noir-400', label: 'text-tollerud-text-muted' },
  info:     { border: 'border-tollerud-info/30', dot: 'bg-tollerud-info', label: 'text-tollerud-info' },
}

const IncidentCard = forwardRef<HTMLDivElement, IncidentCardProps>(
  ({ className, title, severity, timestamp, description, service, acknowledged, loading, ...props }, ref) => {
    const style = severityStyles[severity]

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-tollerud-surface-raised p-4',
          'transition-[border-color] duration-fast',
          style.border,
          acknowledged && 'opacity-50',
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <span className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', style.dot)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-tollerud-foreground truncate">{title}</span>
              <span className={cn('text-[11px] font-medium uppercase whitespace-nowrap', style.label)}>
                {severity}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-tollerud-text-muted">
              <span>{timestamp}</span>
              {service && <><span className="text-tollerud-noir-500">·</span><span>{service}</span></>}
            </div>
            {description && (
              <p className="mt-1.5 text-xs text-tollerud-text-secondary leading-relaxed">{description}</p>
            )}
          </div>
        </div>
      </div>
    )
  }
)
IncidentCard.displayName = 'IncidentCard'

export { IncidentCard }
