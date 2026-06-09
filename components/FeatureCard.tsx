import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Card } from './Card'

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
}

const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, icon, title, description, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn('p-5', className)} {...props}>
        {icon && (
          <span className="mb-3.5 inline-flex h-[38px] w-[38px] items-center justify-center rounded-[9px] bg-tollerud-yellow/12 text-tollerud-yellow">
            {icon}
          </span>
        )}
        <div className="mb-1.5 text-base font-semibold text-tollerud-text-primary">{title}</div>
        <p className="m-0 text-[13.5px] leading-snug text-tollerud-text-secondary">
          {description}
        </p>
      </Card>
    )
  }
)
FeatureCard.displayName = 'FeatureCard'

export { FeatureCard }
