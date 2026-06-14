import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { PageShell } from './PageShell'
import { TopNav, type TopNavItem } from './TopNav'
import { MainContent, type MainContentDensity } from './MainContent'

export interface DashboardShellProps extends HTMLAttributes<HTMLDivElement> {
  projectName: ReactNode
  navItems?: TopNavItem[]
  topActions?: ReactNode
  sidebar?: ReactNode
  header?: ReactNode
  density?: MainContentDensity
  contentWidth?: 'default' | 'wide' | 'full'
}

const DashboardShell = forwardRef<HTMLDivElement, DashboardShellProps>(
  (
    {
      className,
      projectName,
      navItems,
      topActions,
      sidebar,
      header,
      density,
      contentWidth = 'wide',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <PageShell as="div" background="plain" density={density}>
        <TopNav projectName={projectName} navItems={navItems} actions={topActions} />
        <div
          ref={ref}
          className={cn('grid min-h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[260px_1fr]', !sidebar && 'lg:grid-cols-1', className)}
          {...props}
        >
          {sidebar && (
            <aside className="border-b border-tollerud-border bg-tollerud-surface-raised/60 p-4 lg:border-b-0 lg:border-r">
              {sidebar}
            </aside>
          )}
          <MainContent as="div" width={contentWidth} spacing="lg" density={density}>
            {header && <div className="mb-8">{header}</div>}
            {children}
          </MainContent>
        </div>
      </PageShell>
    )
  }
)
DashboardShell.displayName = 'DashboardShell'

export { DashboardShell }
