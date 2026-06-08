'use client'

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
  add:     'bg-tollerud-success/[0.06] text-tollerud-success hover:bg-tollerud-success/[0.10]',
  remove:  'bg-tollerud-error/[0.06] text-tollerud-error hover:bg-tollerud-error/[0.10]',
  context: 'text-tollerud-noir-300',
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
          'rounded-lg border border-tollerud-border bg-[var(--color-tollerud-surface-raised)] overflow-hidden',
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-tollerud-border bg-tollerud-noir-900">
          <div className="flex items-center gap-2 min-w-0">
            {label && (
              <span className="text-xs font-medium text-tollerud-foreground font-mono truncate">{label}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-tollerud-success">+{stats.adds}</span>
            <span className="text-tollerud-error">-{stats.rems}</span>
            {hasContext && (
              <button
                type="button"
                onClick={() => setShowContext(!showContext)}
                className="text-tollerud-text-muted hover:text-tollerud-foreground transition-colors"
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
                    'text-tollerud-noir-500 border-r border-tollerud-border/30',
                    'text-[10px] align-top'
                  )}>
                    {line.oldLine ?? ''}
                  </td>
                  {/* New line number */}
                  <td className={cn(
                    'w-10 text-right px-2 py-px select-none',
                    'text-tollerud-noir-500 border-r border-tollerud-border/30',
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