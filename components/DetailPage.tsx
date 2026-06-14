import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { PageHeader } from './PageHeader'
import { Split } from './Split'
import { Stack } from './Stack'

export interface DetailPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  meta?: ReactNode
  aside?: ReactNode
}

const DetailPage = forwardRef<HTMLDivElement, DetailPageProps>(
  (
    { className, eyebrow, title, description, actions, meta, aside, children, ...props },
    ref
  ) => {
    return (
      <Stack ref={ref} gap="lg" className={cn('w-full', className)} {...props}>
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          actions={actions}
          meta={meta}
        />
        {aside ? (
          <Split ratio="content" gap="lg" align="start">
            <div>{children}</div>
            <aside>{aside}</aside>
          </Split>
        ) : (
          <div>{children}</div>
        )}
      </Stack>
    )
  }
)
DetailPage.displayName = 'DetailPage'

export { DetailPage }
