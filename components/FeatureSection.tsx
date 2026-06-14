import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { PageHeader } from './PageHeader'
import { CardGrid, type CardGridColumns } from './CardGrid'
import { FeatureCard } from './FeatureCard'
import { Stack } from './Stack'

export interface FeatureSectionItem {
  icon?: ReactNode
  title: ReactNode
  description: ReactNode
}

export interface FeatureSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  features: FeatureSectionItem[]
  columns?: CardGridColumns
}

const FeatureSection = forwardRef<HTMLDivElement, FeatureSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      actions,
      features,
      columns = 3,
      ...props
    },
    ref
  ) => {
    return (
      <Stack ref={ref} gap="lg" className={cn('w-full', className)} {...props}>
        <PageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
        <CardGrid columns={columns}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </CardGrid>
      </Stack>
    )
  }
)
FeatureSection.displayName = 'FeatureSection'

export { FeatureSection }
