import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { Status } from './StatusDot'

export interface TimelineItemData {
  id: string
  /** Timestamp label */
  time: string
  /** Title/headline of the event. Accepts a string or rich content (e.g. a bolded actor name inline with plain text). */
  title: ReactNode
  /** Description */
  description?: string
  /** Status indicator dot */
  status?: Status
  /** Optional icon to replace dot */
  icon?: ReactNode
  /** Optional metadata badges */
  meta?: string[]
}

export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Timeline events */
  items: TimelineItemData[]
  /** Whether items are active (show animated dot pulse) */
  active?: boolean
  /** Whether the timeline is loading */
  loading?: boolean
  /**
   * `'connected'` (default) draws a vertical line between dots and shows the timestamp
   * beside the title — a chronological trail. `'flat'` drops the connector, divides rows
   * with a hairline border, and puts the timestamp on its own line below the title —
   * suited to activity/audit logs.
   */
  variant?: 'connected' | 'flat'
}

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, items, active, loading, variant = 'connected', ...props }, ref) => {
    const flat = variant === 'flat'

    return (
      <div
        ref={ref}
        className={cn('tollerud-timeline', flat && 'tollerud-timeline--flat', loading && 'animate-pulse', className)}
        role="list"
        aria-label="Activity timeline"
        {...props}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1

          return (
            <div key={item.id} className="tollerud-timeline__item" role="listitem">
              {/* Dot column */}
              <div className="tollerud-timeline__marker">
                <div className="tollerud-timeline__dot-group">
                  {item.icon ? (
                    <span className="tollerud-timeline__icon">{item.icon}</span>
                  ) : (
                    <span
                      className={cn(
                        'tollerud-timeline__dot',
                        active && 'tollerud-timeline__dot--active',
                        item.status === 'online' && 'tollerud-timeline__dot--online',
                        item.status === 'offline' && 'tollerud-timeline__dot--offline',
                        item.status === 'warning' && 'tollerud-timeline__dot--warning',
                        item.status === 'idle' && 'tollerud-timeline__dot--idle',
                        item.status === 'info' && 'tollerud-timeline__dot--info'
                      )}
                    />
                  )}
                  {!flat && !isLast && <div className="tollerud-timeline__line" />}
                </div>
              </div>

              {/* Content */}
              <div className="tollerud-timeline__content">
                {flat ? (
                  <>
                    <span className="tollerud-timeline__title">{item.title}</span>
                    <div className="tollerud-timeline__time tollerud-timeline__time--below">{item.time}</div>
                  </>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <span className="tollerud-timeline__title">{item.title}</span>
                    <span className="tollerud-timeline__time">{item.time}</span>
                  </div>
                )}
                {item.description && (
                  <p className="tollerud-timeline__description">{item.description}</p>
                )}
                {item.meta && item.meta.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.meta.map((m) => (
                      <span key={m} className="tollerud-timeline__meta">{m}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)
Timeline.displayName = 'Timeline'

export { Timeline }