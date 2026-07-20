import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type RollbackStepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped'

export interface RollbackStep {
  id: string
  label: string
  description?: string
  status: RollbackStepStatus
}

export interface RollbackPlanProps extends HTMLAttributes<HTMLDivElement> {
  /** Name/identifier for the plan */
  name: string
  /** Rollback steps */
  steps: RollbackStep[]
  /** Whether the plan is executing */
  executing?: boolean
  /** Whether the plan is loading */
  loading?: boolean
}

const stepIcon: Record<RollbackStepStatus, string> = {
  pending: '○',
  running: '◉',
  success: '●',
  failed:  '✕',
  skipped: '—',
}

const stepStyles: Record<RollbackStepStatus, string> = {
  pending:  'text-tollerud-noir-400',
  running:  'text-tollerud-yellow animate-pulse',
  success:  'text-tollerud-success',
  failed:   'text-tollerud-error',
  skipped:  'text-tollerud-noir-500',
}

const RollbackPlan = forwardRef<HTMLDivElement, RollbackPlanProps>(
  ({ className, name, steps, executing, loading, ...props }, ref) => {
    const statusSummary: Record<RollbackStepStatus, number> = {
      pending: steps.filter((s) => s.status === 'pending').length,
      running: steps.filter((s) => s.status === 'running').length,
      success: steps.filter((s) => s.status === 'success').length,
      failed:  steps.filter((s) => s.status === 'failed').length,
      skipped: steps.filter((s) => s.status === 'skipped').length,
    }

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
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-tollerud-foreground">{name}</span>
            {executing && (
              <span className="text-[11px] text-tollerud-yellow font-medium animate-pulse">Executing…</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-tollerud-text-muted">
            {statusSummary.success > 0 && <span className="text-tollerud-success">{statusSummary.success} done</span>}
            {statusSummary.failed > 0 && <span className="text-tollerud-error">{statusSummary.failed} failed</span>}
            {statusSummary.running > 0 && <span className="text-tollerud-yellow">{statusSummary.running} running</span>}
          </div>
        </div>

        {/* Steps */}
        <div className="p-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                'flex items-start gap-3 px-3 py-2 rounded-md',
                'transition-colors duration-fast',
                step.status === 'failed' && 'bg-tollerud-error/5',
                step.status === 'running' && 'bg-tollerud-yellow/5'
              )}
            >
              <span className={cn('font-mono text-sm mt-0.5 flex-shrink-0', stepStyles[step.status])}>
                {stepIcon[step.status]}
              </span>
              <div className="flex-1 min-w-0">
                <span className={cn(
                  'text-xs font-medium',
                  step.status === 'success' ? 'text-tollerud-success' :
                  step.status === 'failed' ? 'text-tollerud-error' :
                  step.status === 'skipped' ? 'text-tollerud-noir-500' :
                  'text-tollerud-foreground'
                )}>
                  {step.label}
                </span>
                {step.description && (
                  <p className="text-[11px] text-tollerud-text-muted mt-0.5">{step.description}</p>
                )}
              </div>
              <span className={cn(
                'text-[10px] uppercase font-semibold flex-shrink-0',
                stepStyles[step.status]
              )}>
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
RollbackPlan.displayName = 'RollbackPlan'

export { RollbackPlan }