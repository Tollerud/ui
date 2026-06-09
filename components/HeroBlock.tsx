import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Pill } from './Pill'
import { NoirGlowBackground } from './NoirGlowBackground'

export interface HeroBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  media?: React.ReactNode
  minHeight?: number
  /** When true, renders the live shader background via NoirGlowBackground. */
  intense?: boolean
}

const HeroBlock = forwardRef<HTMLDivElement, HeroBlockProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      actions,
      media,
      minHeight = 280,
      intense = false,
      ...props
    },
    ref
  ) => {
    const hasMedia = !!media

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-xl border border-tollerud-border bg-black',
          className
        )}
        style={{ minHeight }}
        {...props}
      >
        {intense ? (
          <NoirGlowBackground intensity="loud" speed="medium" />
        ) : (
          <div className="tollerud-noir-glow-bg absolute inset-0 opacity-50" aria-hidden="true" />
        )}
        <div
          className={cn(
            'tollerud-grid-bg absolute inset-0',
            intense ? 'opacity-25' : 'opacity-50'
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            'relative flex items-center gap-6 px-11 py-12',
            hasMedia ? 'grid grid-cols-[1.4fr_1fr]' : 'block'
          )}
        >
          <div className={cn(!hasMedia && 'max-w-[560px]')}>
            {eyebrow && (
              <Pill variant="outline" className="mb-0">
                {eyebrow}
              </Pill>
            )}
            <h2
              className={cn(
                'tollerud-display text-[40px] text-tollerud-text-primary',
                eyebrow && 'mt-[18px]'
              )}
            >
              {title}
            </h2>
            {description && (
              <p className="mt-3.5 text-[15.5px] leading-relaxed text-tollerud-text-primary/70">
                {description}
              </p>
            )}
            {actions && <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>}
          </div>
          {hasMedia && (
            <div className="flex items-center justify-center">{media}</div>
          )}
        </div>
      </div>
    )
  }
)
HeroBlock.displayName = 'HeroBlock'

export { HeroBlock }
