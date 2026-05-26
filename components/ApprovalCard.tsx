import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type ApprovalState = 'pending' | 'approved' | 'rejected'

export interface ApprovalCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Action being approved */
  action: string
  /** Description of what will happen */
  description?: string
  /** Source (e.g. 'Emma → backup.sh') */
  source?: string
  /** Current approval state */
  state?: ApprovalState
  /** Timestamp of the request */
  timestamp?: string
  /** Called when user approves */
  onApprove?: () => void
  /** Called when user rejects */
  onReject?: () => void
  /** Whether actions are disabled */
  disabled?: boolean
  /** Whether the card is loading */
  loading?: boolean
}

const stateStyles: Record<ApprovalState, string> = {
  pending:  'border-tia-yellow/30 hover:border-tia-yellow/50',
  approved: 'border-tia-success/40 opacity-70',
  rejected: 'border-tia-error/40 opacity-70',
}

const stateLabels: Record<ApprovalState, { text: string; cls: string }> = {
  pending:  { text: 'Awaiting approval', cls: 'text-tia-yellow' },
  approved: { text: 'Approved', cls: 'text-tia-success' },
  rejected: { text: 'Rejected', cls: 'text-tia-error' },
}

const ApprovalCard = forwardRef<HTMLDivElement, ApprovalCardProps>(
  ({ className, action, description, source, state = 'pending', timestamp, onApprove, onReject, disabled, loading, ...props }, ref) => {
    const label = stateLabels[state]

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-tia-surface-raised p-4',
          'transition-all duration-[150ms]',
          stateStyles[state],
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-tia-foreground truncate">{action}</span>
          <span className={cn('text-[11px] font-medium whitespace-nowrap ml-2', label.cls)}>{label.text}</span>
        </div>
        {description && (
          <p className="text-xs text-tia-text-secondary mb-1.5 leading-relaxed">{description}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-tia-text-muted mb-3">
          {source && <span className="font-mono">{source}</span>}
          {timestamp && <span>{timestamp}</span>}
        </div>
        {state === 'pending' && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={onApprove}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all',
                'bg-tia-success text-tia-text-inverse',
                'hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              Approve
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={onReject}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all',
                'bg-tia-error text-white',
                'hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    )
  }
)
ApprovalCard.displayName = 'ApprovalCard'

export { ApprovalCard }
