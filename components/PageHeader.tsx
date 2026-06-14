import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Stack } from './Stack'
import { Cluster } from './Cluster'

export type PageHeaderAlign = 'start' | 'center'
export type PageHeaderSize = 'md' | 'lg'

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  meta?: ReactNode
  align?: PageHeaderAlign
  size?: PageHeaderSize
}

const titleSizes: Record<PageHeaderSize, string> = {
  md: 'text-[32px] leading-tight',
  lg: 'text-[44px] leading-[0.98]',
}

const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      actions,
      meta,
      align = 'start',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const centered = align === 'center'

    return (
      <header
        ref={ref}
        className={cn(
          'flex flex-col gap-5',
          centered ? 'items-center text-center' : 'items-start',
          className
        )}
        {...props}
      >
        <Stack gap="sm" align={centered ? 'center' : 'start'} className="max-w-[760px]">
          {eyebrow && (
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-tollerud-yellow">
              {eyebrow}
            </div>
          )}
          <h1 className={cn('tollerud-display text-tollerud-text-primary', titleSizes[size])}>
            {title}
          </h1>
          {description && (
            <p className="max-w-[680px] text-[15.5px] leading-relaxed text-tollerud-text-secondary">
              {description}
            </p>
          )}
          {meta && (
            <div className="text-sm text-tollerud-text-muted">
              {meta}
            </div>
          )}
        </Stack>
        {actions && (
          <Cluster justify={centered ? 'center' : 'start'} gap="sm">
            {actions}
          </Cluster>
        )}
      </header>
    )
  }
)
PageHeader.displayName = 'PageHeader'

export { PageHeader }
