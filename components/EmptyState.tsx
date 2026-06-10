'use client'

import {
  AlertTriangle,
  Bell,
  CircleCheck,
  Folder,
  Rocket,
  Search,
  Server,
  type LucideIcon,
} from 'lucide-react'
import { type HTMLAttributes, type ReactNode, forwardRef, isValidElement } from 'react'
import { cn } from '@/lib/utils'

const emptyStateIcons = {
  folder: Folder,
  server: Server,
  search: Search,
  alert: AlertTriangle,
  bell: Bell,
  checkCircle: CircleCheck,
  rocket: Rocket,
} as const satisfies Record<string, LucideIcon>

export type EmptyStateIconName = keyof typeof emptyStateIcons

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Built-in icon name or a custom icon element */
  icon?: EmptyStateIconName | ReactNode
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  secondaryAction?: ReactNode
  compact?: boolean
  accent?: boolean
}

function resolveIcon(icon: EmptyStateProps['icon'], compact?: boolean) {
  if (!icon) {
    const Fallback = emptyStateIcons.folder
    return <Fallback size={compact ? 20 : 24} aria-hidden />
  }
  if (isValidElement(icon)) return icon
  if (typeof icon === 'string') {
    const Icon = emptyStateIcons[icon as EmptyStateIconName] ?? emptyStateIcons.folder
    return <Icon size={compact ? 20 : 24} aria-hidden />
  }
  return icon
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon = 'folder',
      title,
      description,
      action,
      secondaryAction,
      compact,
      accent,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn('tollerud-empty', className)}
      data-compact={compact ? 'true' : undefined}
      data-accent={accent ? 'true' : undefined}
      {...props}
    >
      <div className="tollerud-empty__icon">{resolveIcon(icon, compact)}</div>
      {title ? <div className="tollerud-empty__title">{title}</div> : null}
      {description ? <p className="tollerud-empty__desc">{description}</p> : null}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3.5">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  )
)
EmptyState.displayName = 'EmptyState'

export { EmptyState }
