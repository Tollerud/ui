'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { HostCard, type HostCardProps } from './HostCard'
import { StatCard, type StatCardProps } from './StatCard'
import { ServiceHealthCard, type ServiceHealthCardProps } from './ServiceHealthCard'
import { IncidentCard } from './IncidentCard'
import type { IncidentSeverity } from './IncidentCard'
import type { BackupJob } from './BackupStatusPanel'

/* ──────────────────── Bento Grid Dashboard Template ──────────────────── */

export interface BentoDashboardProps {
  title: string
  hosts?: HostCardProps[]
  metrics?: StatCardProps[]
  services?: ServiceHealthCardProps[]
  incidents?: { title: string; severity: IncidentSeverity; timestamp: string; service: string; description?: string; acknowledged?: boolean }[]
  backupJobs?: BackupJob[]
  className?: string
  /** Render the incident list footer */
  renderIncidentFooter?: () => ReactNode
}

export function BentoDashboard({
  title,
  hosts = [],
  metrics = [],
  services = [],
  incidents = [],
  className,
}: BentoDashboardProps) {
  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-tollerud-text-primary">{title}</h2>
          <p className="text-xs text-tollerud-text-muted">
            {hosts.length} hosts · {services.length} services
            {incidents.length > 0 && ` · ${incidents.length} active incident${incidents.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Row 1: Host cards — bento asymmetric */}
      {hosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2 lg:col-span-1">
            <HostCard {...hosts[0]} />
          </div>
          <div className="grid grid-cols-1 gap-3 md:col-span-2 lg:col-span-1">
            {hosts.slice(1).map((h, i) => (
              <HostCard key={h.hostname ?? i} {...h} />
            ))}
          </div>
        </div>
      )}

      {/* Row 2: Metrics + Services — side by side */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-3">
        {metrics.length > 0 && (
          <div className="min-w-0 lg:col-span-2">
            <SectionLabel>Metrics</SectionLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {metrics.map((m, i) => (
                <StatCard key={m.label ?? i} {...m} />
              ))}
            </div>
          </div>
        )}

        {services.length > 0 && (
          <div className="min-w-0">
            <SectionLabel>Services</SectionLabel>
            <div className="space-y-2">
              {services.slice(0, 4).map((s, i) => (
                <ServiceHealthCard key={s.service ?? i} {...s} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Incidents — full width */}
      {incidents.length > 0 && (
        <div className="min-w-0 pt-1">
          <SectionLabel>Recent Incidents</SectionLabel>
          <div className="space-y-2">
            {incidents.slice(0, 4).map((inc, i) => (
              <IncidentCard key={inc.title + i} {...inc} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-tollerud-text-muted">{children}</p>
  )
}

export default BentoDashboard
