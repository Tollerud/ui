import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Stack } from './Stack'
import { Cluster } from './Cluster'

export type PageHeaderAlign = 'start' | 'center'
export type PageHeaderSize = 'md' | 'lg'

export interface PageHeaderShimmerProps {
  children: ReactNode
  className?: string
}

/** Inline shimmer accent for use inside `PageHeader` `title` or elsewhere. */
function PageHeaderShimmer({ children, className }: PageHeaderShimmerProps) {
  return <span className={cn('tollerud-display-shimmer', className)}>{children}</span>
}
PageHeaderShimmer.displayName = 'PageHeaderShimmer'

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  /**
   * When `title` is a string, wraps the first matching substring in `.tollerud-display-shimmer`.
   * Use for a single word mid-sentence, e.g. title="Keep beer prices honest." shimmer="honest".
   */
  titleAccent?: string
  /** Alias for `titleAccent` — the word (or phrase) in `title` to render with shimmer. */
  shimmer?: string
  /** Optional second title line rendered with display secondary + shimmer styles. */
  titleShimmer?: ReactNode
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

const titleShimmerSizes: Record<PageHeaderSize, string> = {
  md: 'text-[32px] leading-tight',
  lg: 'text-[40px] leading-[1]',
}

function renderAccentInTitle(text: string, accent: string): ReactNode {
  if (!accent) return text
  const index = text.indexOf(accent)
  if (index === -1) return text
  return (
    <>
      {text.slice(0, index)}
      <PageHeaderShimmer>{accent}</PageHeaderShimmer>
      {text.slice(index + accent.length)}
    </>
  )
}

function renderPageHeaderTitle(
  title: ReactNode,
  titleAccent: string | undefined,
  titleShimmer: ReactNode | undefined,
  size: PageHeaderSize,
) {
  const baseTitle =
    typeof title === 'string' && titleAccent ? renderAccentInTitle(title, titleAccent) : title

  if (!titleShimmer) return baseTitle

  return (
    <>
      {baseTitle}
      <span
        className={cn(
          'tollerud-display--secondary tollerud-display-shimmer mt-1 block',
          titleShimmerSizes[size],
        )}
      >
        {titleShimmer}
      </span>
    </>
  )
}

const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      className,
      eyebrow,
      title,
      titleAccent,
      shimmer,
      titleShimmer,
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

    const accent = shimmer ?? titleAccent

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
            {renderPageHeaderTitle(title, accent, titleShimmer, size)}
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

export { PageHeader, PageHeaderShimmer }
