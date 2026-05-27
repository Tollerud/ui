import { type HTMLAttributes, forwardRef, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

export interface DiffLine {
  /** Diff content */
  text: string
  /** Change type */
  type: 'add' | 'remove' | 'context'
  /** Line number in original */
  oldLine?: number
  /** Line number in new */
  newLine?: number
}

export interface ActionDiffProps extends HTMLAttributes<HTMLDivElement> {
  /** Diff lines */
  lines: DiffLine[]
  /** File/label name */
  label?: string
  /** View mode */
  view?: 'unified' | 'side-by-side'
  /** Whether the diff is loading */
  loading?: boolean
}

const diffStyles = {
  add:     'bg-tia-success/[0.06] text-tia-success hover:bg-tia-success/[0.10]',
  remove:  'bg-tia-error/[0.06] text-tia-error hover:bg-tia-error/[0.10]',
  context: 'text-tia-noir-300',
}

const diffPrefix = {
  add:    '+',
  remove: '-',
  context: ' ',
}

const ActionDiff = forwardRef<HTMLDivElement, ActionDiffProps>(
  ({ className, lines, label, view = 'unified', loading, ...props }, ref) => {
    const [showContext, setShowContext] = useState(true)

    const stats = useMemo(() => {
      const adds = lines.filter((l) => l.type === 'add').length
      const rems = lines.filter((l) => l.type === 'remove').length
      return { adds, rems }
    }, [lines])

    // Filter context lines if collapsed
    const displayLines = showContext ? lines : lines.filter((l) => l.type !== 'context')
    const hasContext = lines.some((l) => l.type === 'context')

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-tia-border bg-[var(--color-tia-surface-raised)] overflow-hidden',
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-tia-border bg-tia-noir-900">
          <div className="flex items-center gap-2 min-w-0">
            {label && (
              <span className="text-xs font-medium text-tia-foreground font-mono truncate">{label}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-tia-success">+{stats.adds}</span>
            <span className="text-tia-error">-{stats.rems}</span>
            {hasContext && (
              <button
                type="button"
                onClick={() => setShowContext(!showContext)}
                className="text-tia-text-muted hover:text-tia-foreground transition-colors"
              >
                {showContext ? 'Hide context' : 'Show context'}
              </button>
            )}
          </div>
        </div>

        {/* Diff content */}
        <div className="overflow-x-auto font-mono text-xs leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {displayLines.map((line, i) => (
                <tr
                  key={i}
                  className={cn(
                    'transition-colors duration-[100ms]',
                    diffStyles[line.type]
                  )}
                >
                  {/* Old line number */}
                  <td className={cn(
                    'w-10 text-right px-2 py-px select-none',
                    'text-tia-noir-500 border-r border-tia-border/30',
                    'text-[10px] align-top'
                  )}>
                    {line.oldLine ?? ''}
                  </td>
                  {/* New line number */}
                  <td className={cn(
                    'w-10 text-right px-2 py-px select-none',
                    'text-tia-noir-500 border-r border-tia-border/30',
                    'text-[10px] align-top'
                  )}>
                    {line.newLine ?? ''}
                  </td>
                  {/* Prefix + content */}
                  <td className="px-2 py-px whitespace-pre-wrap">
                    <span className="select-none opacity-50 mr-2">{diffPrefix[line.type]}</span>
                    {line.text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
)
ActionDiff.displayName = 'ActionDiff'

export { ActionDiff }