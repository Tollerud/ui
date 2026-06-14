import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { PageHeader } from './PageHeader'
import { Grid, type GridColumns } from './Grid'
import { StatCard, type StatCardProps } from './StatCard'
import { Stack } from './Stack'

export interface StatsSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: ReactNode
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  stats: StatCardProps[]
  columns?: GridColumns
}

const StatsSection = forwardRef<HTMLDivElement, StatsSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      actions,
      stats,
      columns = 'auto',
      ...props
    },
    ref
  ) => {
    const hasHeader = title || description || eyebrow || actions

    return (
      <Stack ref={ref} gap="lg" className={cn('w-full', className)} {...props}>
        {hasHeader && (
          <PageHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            actions={actions}
            size="md"
          />
        )}
        <Grid columns={columns} gap="md">
          {stats.map((stat, index) => (
            <StatCard key={`${stat.label}-${index}`} {...stat} />
          ))}
        </Grid>
      </Stack>
    )
  }
)
StatsSection.displayName = 'StatsSection'

export { StatsSection }
