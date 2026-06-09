'use client'

import { type HTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

const avatarSizes = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-11 w-11 text-sm',
} as const

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase()
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image source */
  src?: string
  /** Accessible name / used to derive initials fallback */
  name?: string
  /** Explicit fallback content (overrides derived initials) */
  fallback?: React.ReactNode
  size?: keyof typeof avatarSizes
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, name, fallback, size = 'md', ...props }, ref) => {
    const [errored, setErrored] = useState(false)
    const showImage = !!src && !errored

    return (
      <span
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none',
          'bg-tollerud-surface-raised text-tollerud-text-secondary font-medium',
          'ring-1 ring-tollerud-border',
          avatarSizes[size],
          className
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={name ?? ''}
            className="h-full w-full object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <span aria-hidden={!!name}>{fallback ?? (name ? initialsFrom(name) : null)}</span>
        )}
      </span>
    )
  }
)
Avatar.displayName = 'Avatar'

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars to render before collapsing into a "+N" overflow indicator */
  max?: number
  size?: keyof typeof avatarSizes
  children: React.ReactNode
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, size = 'md', children, ...props }, ref) => {
    const items = Array.isArray(children) ? children : [children]
    const visible = max ? items.slice(0, max) : items
    const overflow = max ? items.length - max : 0

    return (
      <div
        ref={ref}
        className={cn('flex items-center -space-x-2', className)}
        {...props}
      >
        {visible.map((child, i) => (
          <span key={i} className="ring-2 ring-tollerud-surface rounded-full">
            {child}
          </span>
        ))}
        {overflow > 0 && (
          <span
            className={cn(
              'relative inline-flex shrink-0 items-center justify-center rounded-full select-none',
              'bg-tollerud-surface-raised text-tollerud-text-muted font-medium',
              'ring-2 ring-tollerud-surface',
              avatarSizes[size]
            )}
          >
            +{overflow}
          </span>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarGroup }
