import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// ── Empty ──

export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {}

const Empty = forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full flex-1 flex-col items-center justify-center text-center py-12',
          className
        )}
        {...props}
      />
    )
  }
)
Empty.displayName = 'Empty'

// ── EmptyHeader ──

const EmptyHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex max-w-sm flex-col items-center gap-2',
          className
        )}
        {...props}
      />
    )
  }
)
EmptyHeader.displayName = 'EmptyHeader'

// ── EmptyIcon ──

const EmptyIcon = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-full bg-tia-noir-800 text-tia-text-muted mb-2',
          className
        )}
        {...props}
      />
    )
  }
)
EmptyIcon.displayName = 'EmptyIcon'

// ── EmptyTitle ──

const EmptyTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-base font-semibold text-tia-foreground',
          className
        )}
        {...props}
      />
    )
  }
)
EmptyTitle.displayName = 'EmptyTitle'

// ── EmptyDescription ──

const EmptyDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm text-tia-text-secondary max-w-sm',
          className
        )}
        {...props}
      />
    )
  }
)
EmptyDescription.displayName = 'EmptyDescription'

// ── EmptyContent ──

const EmptyContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full max-w-sm flex-col items-center gap-4 mt-4',
          className
        )}
        {...props}
      />
    )
  }
)
EmptyContent.displayName = 'EmptyContent'

export {
  Empty,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
}
export type { }