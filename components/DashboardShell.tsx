'use client'

import { type HTMLAttributes, type ReactNode, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { PageShell } from './PageShell'
import { TopNav, type TopNavItem } from './TopNav'
import { SidebarNav, type SidebarNavGroup, type SidebarNavItem } from './SidebarNav'
import { DashboardTopBar } from './DashboardTopBar'
import { MainContent, type MainContentDensity } from './MainContent'

export type DashboardShellVariant = 'sidebar' | 'topnav'

export interface DashboardShellProps extends HTMLAttributes<HTMLDivElement> {
  projectName: ReactNode
  projectSubtitle?: ReactNode
  homeHref?: string
  variant?: DashboardShellVariant
  /** Sidebar variant — grouped navigation links rendered in the left rail. */
  sidebarGroups?: SidebarNavGroup[]
  /** Sidebar variant — flat navigation links when groups are not needed. */
  sidebarItems?: SidebarNavItem[]
  /** Context prefix shown in the top bar (e.g. project or section name). */
  breadcrumb?: ReactNode
  /** Current page label shown in the top bar. */
  pageTitle?: ReactNode
  /** Topnav variant — horizontal links in TopNav. Also used as sidebar fallback when no sidebarGroups/sidebarItems. */
  navItems?: TopNavItem[]
  topActions?: ReactNode
  /** Optional custom sidebar content below structured nav in the left rail. */
  sidebar?: ReactNode
  header?: ReactNode
  density?: MainContentDensity
  contentWidth?: 'default' | 'wide' | 'full'
}

function mapTopNavItems(items: TopNavItem[]): SidebarNavItem[] {
  return items.map((item, index) => ({
    id: `${item.href}-${index}`,
    label: item.label,
    href: item.href,
    active: item.active,
  }))
}

function resolveSidebarGroups(
  sidebarGroups?: SidebarNavGroup[],
  sidebarItems?: SidebarNavItem[],
  navItems?: TopNavItem[]
): SidebarNavGroup[] | undefined {
  if (sidebarGroups?.length) return sidebarGroups
  if (sidebarItems?.length) return [{ items: sidebarItems }]
  if (navItems?.length) return [{ items: mapTopNavItems(navItems) }]
  return undefined
}

const DashboardShell = forwardRef<HTMLDivElement, DashboardShellProps>(
  (
    {
      className,
      projectName,
      projectSubtitle,
      homeHref = '/',
      variant = 'sidebar',
      sidebarGroups,
      sidebarItems,
      breadcrumb,
      pageTitle,
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
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const resolvedGroups = resolveSidebarGroups(sidebarGroups, sidebarItems, navItems)
    const closeMobileNav = () => setMobileNavOpen(false)

    if (variant === 'topnav') {
      return (
        <PageShell as="div" background="plain" density={density}>
          <TopNav
            projectName={projectName}
            homeHref={homeHref}
            navItems={navItems}
            actions={topActions}
          />
          <div
            ref={ref}
            className={cn(
              'grid min-h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[260px_1fr]',
              !sidebar && 'lg:grid-cols-1',
              className
            )}
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

    return (
      <PageShell as="div" background="plain" density={density}>
        <div ref={ref} className={cn('flex min-h-screen', className)} {...props}>
          <button
            type="button"
            aria-label="Close navigation"
            className={cn(
              'fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity lg:hidden',
              mobileNavOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            )}
            onClick={closeMobileNav}
          />
          <div
            className={cn(
              'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-30 lg:translate-x-0',
              mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <SidebarNav
              projectName={projectName}
              projectSubtitle={projectSubtitle}
              homeHref={homeHref}
              groups={resolvedGroups}
              onItemSelect={closeMobileNav}
              className="h-screen shadow-[0_0_40px_rgba(0,0,0,0.5)] lg:shadow-none"
            >
              {sidebar}
            </SidebarNav>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <DashboardTopBar
              projectName={projectName}
              homeHref={homeHref}
              breadcrumb={breadcrumb ?? projectName}
              pageTitle={pageTitle}
              actions={topActions}
              menuOpen={mobileNavOpen}
              onMenuToggle={() => setMobileNavOpen((open) => !open)}
            />
            <MainContent as="div" width={contentWidth} spacing="lg" density={density}>
              {header && <div className="mb-8">{header}</div>}
              {children}
            </MainContent>
          </div>
        </div>
      </PageShell>
    )
  }
)
DashboardShell.displayName = 'DashboardShell'

export { DashboardShell }
