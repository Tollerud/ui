import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CTABandProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  accentBar?: boolean
}

const CTABand = forwardRef<HTMLDivElement, CTABandProps>(
  ({ className, title, description, actions, accentBar = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-tollerud-border bg-tollerud-surface px-8 py-11 text-center',
          className
        )}
        {...props}
      >
        <h2 className="tollerud-display text-[30px] text-tollerud-text-primary">{title}</h2>
        {description && (
          <p className="mx-auto mt-3 max-w-[440px] text-[15px] text-tollerud-text-secondary">
            {description}
          </p>
        )}
        {actions && (
          <div className="mt-[22px] flex flex-wrap items-center justify-center gap-3">{actions}</div>
        )}
        {accentBar && (
          <hr className="tollerud-accent-bar mx-auto mt-8 max-w-[320px] border-0" />
        )}
      </div>
    )
  }
)
CTABand.displayName = 'CTABand'

export { CTABand }
