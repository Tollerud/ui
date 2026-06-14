import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { PageShell, type PageShellBackground } from './PageShell'
import { Section } from './Section'
import { EmptyState, type EmptyStateIconName } from './EmptyState'

export interface EmptyPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: EmptyStateIconName | ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  secondaryAction?: ReactNode
  background?: PageShellBackground
  accent?: boolean
}

const EmptyPage = forwardRef<HTMLDivElement, EmptyPageProps>(
  (
    {
      className,
      icon = 'folder',
      title,
      description,
      action,
      secondaryAction,
      background = 'grid',
      accent = true,
      ...props
    },
    ref
  ) => {
    return (
      <PageShell as="div" background={background}>
        <Section size="hero" width="narrow">
          <div ref={ref} className={cn('rounded-xl border border-tollerud-border bg-tollerud-surface-raised/75 p-8', className)} {...props}>
            <EmptyState
              icon={icon}
              title={title}
              description={description}
              action={action}
              secondaryAction={secondaryAction}
              accent={accent}
            />
          </div>
        </Section>
      </PageShell>
    )
  }
)
EmptyPage.displayName = 'EmptyPage'

export { EmptyPage }
