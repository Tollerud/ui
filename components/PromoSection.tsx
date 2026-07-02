import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type PromoSectionVisualPlacement = 'right' | 'left'
export type PromoSectionBackground = 'default' | 'raised'
export type PromoSectionTextWidth = 'narrow' | 'balanced' | 'wide'
export type PromoSectionContentWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface PromoSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  /**
   * When `title` is a string, wraps the first matching substring in `.tollerud-display-shimmer`.
   * e.g. title="Se hva dine favorittøl koster" shimmer="favorittøl"
   */
  shimmer?: string
  description?: ReactNode
  actions?: ReactNode
  visual?: ReactNode
  visualPlacement?: PromoSectionVisualPlacement
  background?: PromoSectionBackground
  textWidth?: PromoSectionTextWidth
  /** Max-width cap for the inner content. The outer wrapper can be full-bleed via className. */
  contentWidth?: PromoSectionContentWidth
}

const contentWidthClass: Record<PromoSectionContentWidth, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  full: 'max-w-none',
}

const textWidthClass: Record<PromoSectionTextWidth, string> = {
  narrow: 'sm:grid-cols-[1fr_1.4fr]',
  balanced: 'sm:grid-cols-[1fr_1fr]',
  wide: 'sm:grid-cols-[1.4fr_1fr]',
}

function renderTitle(title: ReactNode, shimmer: string | undefined): ReactNode {
  if (!shimmer || typeof title !== 'string') return title
  const index = title.indexOf(shimmer)
  if (index === -1) return title
  return (
    <>
      {title.slice(0, index)}
      <span className="tollerud-display-shimmer">{shimmer}</span>
      {title.slice(index + shimmer.length)}
    </>
  )
}

const PromoSection = forwardRef<HTMLDivElement, PromoSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      shimmer,
      description,
      actions,
      visual,
      visualPlacement = 'right',
      background = 'default',
      textWidth = 'wide',
      contentWidth = 'xl',
      ...props
    },
    ref
  ) => {
    const hasVisual = !!visual

    const textCol = (
      <div className="flex flex-col justify-center gap-4" style={{ order: 0 }}>
        {eyebrow && (
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-tollerud-yellow">
            {eyebrow}
          </div>
        )}
        <h2 className="tollerud-display text-3xl leading-tight text-tollerud-text-primary sm:text-[40px]">
          {renderTitle(title, shimmer)}
        </h2>
        {description && (
          <p className="text-[15px] leading-relaxed text-tollerud-text-primary/65">
            {description}
          </p>
        )}
        {actions && <div className="mt-2 flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    )

    // On mobile: visual always renders second (order: 1) regardless of visualPlacement
    const visualCol = hasVisual ? (
      <div className="flex items-center justify-center overflow-hidden" style={{ order: 1 }}>
        {visual}
      </div>
    ) : null

    return (
      <div
        ref={ref}
        className={cn(
          'w-full px-6 py-12 sm:px-12',
          background === 'raised'
            ? 'border-y border-tollerud-border bg-tollerud-noir-900'
            : 'bg-transparent',
          className
        )}
        {...props}
      >
        <div className={cn('mx-auto w-full', contentWidthClass[contentWidth])}>
          {hasVisual ? (
            <div
              className={cn(
                'grid grid-cols-1 items-center gap-10 sm:gap-14',
                textWidthClass[textWidth],
                visualPlacement === 'left' && 'sm:[&>*:first-child]:order-1 sm:[&>*:last-child]:order-none'
              )}
            >
              {textCol}
              {visualCol}
            </div>
          ) : (
            <div className="mx-auto max-w-[640px] text-center">{textCol}</div>
          )}
        </div>
      </div>
    )
  }
)
PromoSection.displayName = 'PromoSection'

export { PromoSection }
