import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Pill } from './Pill'

export type PromoSectionVisualPlacement = 'right' | 'left'
export type PromoSectionBackground = 'default' | 'raised'
export type PromoSectionTextWidth = 'narrow' | 'balanced' | 'wide'

export interface PromoSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  visual?: ReactNode
  visualPlacement?: PromoSectionVisualPlacement
  background?: PromoSectionBackground
  textWidth?: PromoSectionTextWidth
}

const textWidthClass: Record<PromoSectionTextWidth, string> = {
  narrow: 'grid-cols-[1fr_1.4fr]',
  balanced: 'grid-cols-[1fr_1fr]',
  wide: 'grid-cols-[1.4fr_1fr]',
}

const PromoSection = forwardRef<HTMLDivElement, PromoSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      actions,
      visual,
      visualPlacement = 'right',
      background = 'default',
      textWidth = 'wide',
      ...props
    },
    ref
  ) => {
    const hasVisual = !!visual

    const textCol = (
      <div className="flex flex-col justify-center gap-4">
        {eyebrow && (
          <Pill variant="outline" className="self-start">
            {eyebrow}
          </Pill>
        )}
        <h2 className="tollerud-display text-[32px] leading-tight text-tollerud-text-primary sm:text-[40px]">
          {title}
        </h2>
        {description && (
          <p className="text-[15px] leading-relaxed text-tollerud-text-primary/65">
            {description}
          </p>
        )}
        {actions && <div className="mt-2 flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    )

    const visualCol = hasVisual ? (
      <div className="flex items-center justify-center">{visual}</div>
    ) : null

    return (
      <div
        ref={ref}
        className={cn(
          'w-full rounded-xl px-8 py-12 sm:px-12',
          background === 'raised'
            ? 'border border-tollerud-border bg-tollerud-noir-900'
            : 'bg-transparent',
          className
        )}
        {...props}
      >
        {hasVisual ? (
          <div
            className={cn(
              'grid items-center gap-10 sm:gap-14',
              textWidthClass[textWidth]
            )}
          >
            {visualPlacement === 'right' ? (
              <>
                {textCol}
                {visualCol}
              </>
            ) : (
              <>
                {visualCol}
                {textCol}
              </>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-[640px] text-center">{textCol}</div>
        )}
      </div>
    )
  }
)
PromoSection.displayName = 'PromoSection'

export { PromoSection }
