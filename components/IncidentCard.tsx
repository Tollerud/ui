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
  critical: { border: 'border-tia-error/50', dot: 'bg-tia-error shadow-[0_0_8px_rgba(239,68,68,0.6)]', label: 'text-tia-error' },
  high:     { border: 'border-tia-yellow/50', dot: 'bg-tia-yellow shadow-[0_0_8px_rgba(232,213,0,0.5)]', label: 'text-tia-yellow' },
  medium:   { border: 'border-tia-amber/40', dot: 'bg-tia-amber', label: 'text-tia-amber' },
  low:      { border: 'border-tia-noir-500', dot: 'bg-tia-noir-400', label: 'text-tia-text-muted' },
  info:     { border: 'border-tia-info/30', dot: 'bg-tia-info', label: 'text-tia-info' },
}

const IncidentCard = forwardRef<HTMLDivElement, IncidentCardProps>(
  ({ className, title, severity, timestamp, description, service, acknowledged, loading, ...props }, ref) => {
    const style = severityStyles[severity]

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-tia-surface-raised p-4',
          'transition-[border-color] duration-[150ms]',
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
              <span className="text-sm font-semibold text-tia-foreground truncate">{title}</span>
              <span className={cn('text-[11px] font-medium uppercase whitespace-nowrap', style.label)}>
                {severity}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-tia-text-muted">
              <span>{timestamp}</span>
              {service && <><span className="text-tia-noir-500">·</span><span>{service}</span></>}
            </div>
            {description && (
              <p className="mt-1.5 text-xs text-tia-text-secondary leading-relaxed">{description}</p>
            )}
          </div>
        </div>
      </div>
    )
  }
)
IncidentCard.displayName = 'IncidentCard'

export { IncidentCard }
