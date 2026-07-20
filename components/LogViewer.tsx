'use client'

import {
  type HTMLAttributes,
  type UIEvent,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'trace'

export interface LogLine {
  /** Line content */
  text: string
  /** Log level for color coding */
  level?: LogLevel
  /** Timestamp string (optional) */
  timestamp?: string
  /** Source/logger name */
  source?: string
}

export interface LogViewerProps extends HTMLAttributes<HTMLDivElement> {
  /** Log lines to display */
  lines: LogLine[]
  /** Maximum visible lines (for performance) */
  maxLines?: number
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Show timestamps */
  showTimestamps?: boolean
  /** Whether to auto-scroll (follow new content) */
  follow?: boolean
  /** Enable search */
  searchable?: boolean
  /** Height of the viewer */
  height?: string
  /** Whether the viewer is loading */
  loading?: boolean
}

const levelStyles: Record<LogLevel, string> = {
  debug: 'text-tollerud-noir-400',
  trace: 'text-tollerud-noir-300',
  info:  'text-tollerud-foreground',
  warn:  'text-tollerud-amber',
  error: 'text-tollerud-error',
}

const levelLabels: Record<LogLevel, string> = {
  debug: 'DBG',
  trace: 'TRC',
  info:  'INF',
  warn:  'WRN',
  error: 'ERR',
}

const LogViewer = forwardRef<HTMLDivElement, LogViewerProps>(
  ({ className, lines, maxLines = 5000, showLineNumbers = true, showTimestamps = true, follow = true, searchable, height = '400px', loading, ...props }, ref) => {
    const [search, setSearch] = useState('')
    const [isFollowing, setIsFollowing] = useState(follow)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Truncate for performance
    const displayedLines = useMemo(() => {
      return lines.length > maxLines ? lines.slice(-maxLines) : lines
    }, [lines, maxLines])

    // Filter by search
    const filteredLines = useMemo(() => {
      if (!search.trim()) return displayedLines
      return displayedLines.filter((l) =>
        l.text.toLowerCase().includes(search.toLowerCase()) ||
        l.source?.toLowerCase().includes(search.toLowerCase())
      )
    }, [displayedLines, search])

    // Auto-scroll
    useEffect(() => {
      if (isFollowing && scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, [filteredLines.length, isFollowing])

    // Detect manual scroll to disable follow
    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
      setIsFollowing(atBottom)
    }

    const filteredFrom = displayedLines.indexOf(filteredLines[0])

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-tollerud-border bg-[var(--color-tollerud-surface-raised)] overflow-hidden tollerud-log-viewer',
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-tollerud-border bg-tollerud-noir-900">
          <div className="flex items-center gap-2 text-xs text-tollerud-text-muted">
            {isFollowing
              ? <span className="text-tollerud-yellow font-medium">● Live</span>
              : <span className="text-tollerud-noir-400">● Paused</span>}
            <span>{filteredLines.length} lines</span>
            {lines.length > maxLines && (
              <span className="text-tollerud-amber">(showing last {maxLines})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {searchable && (
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search logs…"
                className={cn(
                  'w-40 text-[11px] px-2 py-1 rounded bg-tollerud-noir-800',
                  'border border-tollerud-noir-600 text-tollerud-foreground',
                  'placeholder:text-tollerud-noir-400 outline-none',
                  'focus:border-tollerud-yellow/50 transition-colors duration-fast'
                )}
              />
            )}
          </div>
        </div>

        {/* Log content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto font-mono text-xs leading-relaxed p-3"
          style={{ height }}
        >
          {filteredLines.length === 0 && (
            <div className="flex items-center justify-center h-full text-tollerud-noir-400 text-xs">
              {search ? 'No matching log lines' : 'No log output'}
            </div>
          )}
          {filteredLines.map((line, i) => {
            const absLineNum = filteredFrom >= 0 ? filteredFrom + i + 1 : i + 1
            const level = line.level ?? 'info'
            return (
              <div
                key={`${absLineNum}-${i}`}
                className={cn(
                  'flex gap-3 hover:bg-[var(--color-tollerud-surface-hover)] px-1 py-px rounded-sm',
                  levelStyles[level]
                )}
              >
                {showLineNumbers && (
                  <span className="text-tollerud-noir-500 text-right select-none w-8 flex-shrink-0">
                    {absLineNum}
                  </span>
                )}
                {showTimestamps && line.timestamp && (
                  <span className="text-tollerud-noir-400 flex-shrink-0 select-none">
                    {line.timestamp}
                  </span>
                )}
                <span className="flex-shrink-0 w-7 text-center font-bold text-[10px] uppercase opacity-60">
                  {levelLabels[level]}
                </span>
                <span className="whitespace-pre-wrap break-all">{line.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
LogViewer.displayName = 'LogViewer'

export { LogViewer }