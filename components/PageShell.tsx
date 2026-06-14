import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type PageShellBackground = 'plain' | 'grid' | 'glow'
export type PageShellDensity = 'comfortable' | 'compact'

export interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'main'
  background?: PageShellBackground
  density?: PageShellDensity
}

const backgroundClasses: Record<PageShellBackground, string> = {
  plain: 'bg-tollerud-noir-950',
  grid: 'bg-tollerud-noir-950',
  glow: 'tollerud-noir-glow-root bg-tollerud-noir-950',
}

const PageShell = forwardRef<HTMLDivElement, PageShellProps>(
  ({ as: Tag = 'main', background = 'plain', density, className, children, ...props }, ref) => {
    const hasGrid = background === 'grid'
    const hasGlow = background === 'glow'

    return (
      <Tag
        ref={ref}
        data-density={density ?? undefined}
        className={cn(
          'relative min-h-screen overflow-hidden text-tollerud-text-primary',
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
        <div className="relative z-10">{children}</div>
      </Tag>
    )
  }
)
PageShell.displayName = 'PageShell'

export { PageShell }
