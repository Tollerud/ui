import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { StatusDot, type Status } from './StatusDot'

export interface BackupJob {
  name: string
  status: Status
  lastRun?: string
  nextRun?: string
  size?: string
  target?: string
}

export interface BackupStatusPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** List of backup jobs */
  jobs: BackupJob[]
  /** Total size of all backups */
  totalSize?: string
  /** Last full backup timestamp */
  lastFullBackup?: string
  /** Whether the panel is loading */
  loading?: boolean
}

const BackupStatusPanel = forwardRef<HTMLDivElement, BackupStatusPanelProps>(
  ({ className, jobs, totalSize, lastFullBackup, loading, ...props }, ref) => {
    const failed = jobs.filter((j) => j.status === 'offline').length

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-tollerud-border bg-tollerud-surface-raised',
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-tollerud-border">
          <span className="text-sm font-semibold text-tollerud-foreground">Backups</span>
          <div className="flex items-center gap-3 text-[11px] text-tollerud-text-muted">
            {totalSize && <span>{totalSize}</span>}
            {lastFullBackup && <span>Last full: {lastFullBackup}</span>}
          </div>
        </div>

        {/* Job list */}
        <div className="p-1">
          {jobs.length === 0 && (
            <div className="px-3 py-6 text-xs text-center text-tollerud-text-muted">No backup jobs configured</div>
          )}
          {jobs.map((job) => (
            <div
              key={job.name}
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-tollerud-noir-800/50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <StatusDot status={job.status} />
                <span className="text-xs font-medium text-tollerud-foreground truncate">{job.name}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-tollerud-text-muted flex-shrink-0 ml-2">
                {job.size && <span>{job.size}</span>}
                {job.target && <span className="hidden sm:inline font-mono">{job.target}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Footer — schedule summary */}
        {(failed > 0) && (
          <div className="px-4 py-2 border-t border-tollerud-border">
            <span className="text-[11px] text-tollerud-error">
              {failed} job{failed !== 1 ? 's' : ''} failed — check logs
            </span>
          </div>
        )}
      </div>
    )
  }
)
BackupStatusPanel.displayName = 'BackupStatusPanel'

export { BackupStatusPanel }
