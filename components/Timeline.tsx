import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { Status } from './StatusDot'

export interface TimelineItemData {
  id: string
  /** Timestamp label */
  time: string
  /** Title/headline of the event */
  title: string
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
}

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, items, active, loading, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('tollerud-timeline', loading && 'animate-pulse', className)}
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
                        item.status === 'online' && 'bg-tollerud-success shadow-[0_0_6px_rgba(34,197,94,0.5)]',
                        item.status === 'offline' && 'bg-tollerud-error',
                        item.status === 'warning' && 'bg-tollerud-yellow shadow-[0_0_6px_rgba(232,213,0,0.5)]',
                        !item.status && 'bg-tollerud-noir-500'
                      )}
                    />
                  )}
                  {!isLast && <div className="tollerud-timeline__line" />}
                </div>
              </div>

              {/* Content */}
              <div className="tollerud-timeline__content">
                <div className="flex items-start justify-between gap-2">
                  <span className="tollerud-timeline__title">{item.title}</span>
                  <span className="tollerud-timeline__time">{item.time}</span>
                </div>
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