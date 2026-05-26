import { type HTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { IncidentCard, type IncidentSeverity } from './IncidentCard'

export interface AlertItem {
  id: string
  title: string
  severity: IncidentSeverity
  timestamp: string
  description?: string
  service?: string
  acknowledged?: boolean
}

export interface AlertInboxProps extends HTMLAttributes<HTMLDivElement> {
  /** List of alerts */
  alerts: AlertItem[]
  /** Filter by severity (empty = show all) */
  filterSeverity?: IncidentSeverity | ''
  /** Called when acknowledge is requested */
  onAcknowledge?: (id: string) => void
  /** Whether the inbox is loading */
  loading?: boolean
  /** Empty state message */
  emptyMessage?: string
}

const AlertInbox = forwardRef<HTMLDivElement, AlertInboxProps>(
  ({ className, alerts, filterSeverity = '', onAcknowledge, loading, emptyMessage = 'All clear — no incidents', ...props }, ref) => {
    const filtered = filterSeverity
      ? alerts.filter((a) => a.severity === filterSeverity)
      : alerts

    const counts = {
      total: alerts.length,
      unacknowledged: alerts.filter((a) => !a.acknowledged).length,
      critical: alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length,
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-tia-border bg-tia-surface-raised overflow-hidden',
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-tia-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-tia-foreground">Alerts</span>
            {counts.unacknowledged > 0 && (
              <span className="text-[11px] text-tia-error font-medium">{counts.unacknowledged} unread</span>
            )}
            {counts.critical > 0 && (
              <span className="text-[11px] text-tia-error font-bold">{counts.critical} critical</span>
            )}
          </div>
          <span className="text-xs text-tia-text-muted">{filtered.length} of {alerts.length}</span>
        </div>

        {/* Alert list */}
        <div className="divide-y divide-tia-border/50 max-h-[480px] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-xs text-center text-tia-text-muted">{emptyMessage}</div>
          )}
          {filtered.map((alert) => (
            <div key={alert.id} className="relative group">
              <IncidentCard
                title={alert.title}
                severity={alert.severity}
                timestamp={alert.timestamp}
                description={alert.description}
                service={alert.service}
                acknowledged={alert.acknowledged}
                className="border-0 rounded-none bg-transparent hover:bg-tia-noir-800/30"
              />
              {!alert.acknowledged && onAcknowledge && (
                <button
                  type="button"
                  onClick={() => onAcknowledge(alert.id)}
                  className={cn(
                    'absolute top-3 right-3 text-[11px] font-medium px-2 py-0.5 rounded',
                    'text-tia-text-muted hover:text-tia-foreground hover:bg-tia-noir-700',
                    'opacity-0 group-hover:opacity-100 transition-opacity'
                  )}
                >
                  Acknowledge
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
AlertInbox.displayName = 'AlertInbox'

export { AlertInbox }