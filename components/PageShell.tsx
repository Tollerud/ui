import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type PageShellBackground = 'plain' | 'grid' | 'glow'
export type PageShellDensity = 'comfortable' | 'compact'

export interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'main'
  background?: PageShellBackground
  density?: PageShellDensity
  contentClassName?: string
}

const backgroundClasses: Record<PageShellBackground, string> = {
  plain: 'bg-tollerud-noir-950',
  grid: 'bg-tollerud-noir-950',
  glow: 'tollerud-noir-glow-root bg-tollerud-noir-950',
}

const PageShell = forwardRef<HTMLDivElement, PageShellProps>(
  ({ as: Tag = 'main', background = 'plain', density, className, contentClassName, children, ...props }, ref) => {
    const hasGrid = background === 'grid'
    const hasGlow = background === 'glow'

    return (
      <Tag
        ref={ref}
        data-density={density ?? undefined}
        className={cn(
          // overflow-clip (not -hidden): hidden creates a scroll container, which
          // silently breaks position:sticky for every descendant — sticky elements
          // stick to their nearest scrolling ancestor, and the shell root never
          // scrolls. clip contains the decorative grid/glow layers the same way
          // without establishing a scroll container.
          'relative min-h-screen overflow-clip text-tollerud-text-primary',
          backgroundClasses[background],
          className
        )}
        {...props}
      >
        {hasGlow && (
          <>
            <div className="tollerud-noir-glow-bg" aria-hidden="true" />
            <div className="tollerud-noir-glow-vignette" aria-hidden="true" />
            <div className="tollerud-noir-noise" aria-hidden="true" />
          </>
        )}
        {hasGrid && <div className="tollerud-grid-bg absolute inset-0" aria-hidden="true" />}
        <div className={cn('relative z-10 flex flex-col flex-1', contentClassName)}>{children}</div>
      </Tag>
    )
  }
)
PageShell.displayName = 'PageShell'

export { PageShell }
