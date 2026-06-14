import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Card } from './Card'
import { PageHeader } from './PageHeader'
import { Cluster } from './Cluster'
import { Stack } from './Stack'

export interface ResourceListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  filters?: ReactNode
  count?: ReactNode
  emptyState?: ReactNode
}

const ResourceList = forwardRef<HTMLDivElement, ResourceListProps>(
  (
    { className, title, description, actions, filters, count, emptyState, children, ...props },
    ref
  ) => {
    const hasContent = Boolean(children)

    return (
      <Stack ref={ref} gap="lg" className={cn('w-full', className)} {...props}>
        <PageHeader
          title={title}
          description={description}
          actions={actions}
          meta={count ? <span className="font-mono text-xs text-tollerud-text-muted">{count}</span> : undefined}
        />
        {(filters || count) && (
          <Cluster justify="between" gap="md">
            <div>{filters}</div>
            {count && <span className="font-mono text-xs text-tollerud-text-muted">{count}</span>}
          </Cluster>
        )}
        <Card className="p-0">
          {hasContent ? children : emptyState}
        </Card>
      </Stack>
    )
  }
)
ResourceList.displayName = 'ResourceList'

export { ResourceList }
