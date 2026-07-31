'use client'

import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { PageShell } from './PageShell'
import { TopNav, type TopNavItem } from './TopNav'
import { DashboardTopBar } from './DashboardTopBar'
import { MainContent, type MainContentDensity } from './MainContent'
import { Monogram } from './Monogram'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  type SidebarNavGroup,
  type SidebarNavItem,
  useSidebar,
} from './Sidebar'

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
  showMobileLogo?: boolean
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

/** Renders the structured nav groups; lives inside SidebarProvider so it can
 *  close the mobile sheet on item select via useSidebar(). */
function DashboardSidebarNav({ groups }: { groups: SidebarNavGroup[] }) {
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarContent>
      {groups.map((group, groupIndex) => (
        <SidebarGroup key={group.label ? String(group.label) : groupIndex}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild={!!item.href}
                    isActive={item.active}
                    icon={item.icon}
                    onClick={() => {
                      item.onSelect?.()
                      setOpenMobile(false)
                    }}
                  >
                    {item.href ? <a href={item.href}>{item.label}</a> : item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  )
}

function DashboardMobileTrigger() {
  return <SidebarTrigger className="lg:hidden" />
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
      showMobileLogo,
      sidebar,
      header,
      density,
      contentWidth = 'wide',
      children,
      ...props
    },
    ref
  ) => {
    const resolvedGroups = resolveSidebarGroups(sidebarGroups, sidebarItems, navItems)

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
        <SidebarProvider>
          <div ref={ref} className={cn('flex min-h-screen w-full', className)} {...props}>
            <Sidebar collapsible="offcanvas" mobileTitle="Navigation menu">
              <SidebarHeader>
                <a
                  href={homeHref}
                  className="tollerud-focus-ring flex min-w-0 items-center gap-[11px] no-underline"
                >
                  <Monogram color="yellow" className="h-[26px] w-auto" />
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-bold leading-tight tracking-[-0.01em] text-tollerud-text-primary">
                      {projectName}
                    </div>
                    {projectSubtitle && (
                      <div className="truncate font-mono text-[10px] text-tollerud-text-muted">
                        {projectSubtitle}
                      </div>
                    )}
                  </div>
                </a>
              </SidebarHeader>
              {resolvedGroups && resolvedGroups.length > 0 && (
                <DashboardSidebarNav groups={resolvedGroups} />
              )}
              {sidebar && <SidebarFooter>{sidebar}</SidebarFooter>}
            </Sidebar>
            <SidebarInset>
              <DashboardTopBar
                projectName={projectName}
                homeHref={homeHref}
                breadcrumb={breadcrumb ?? projectName}
                pageTitle={pageTitle}
                actions={topActions}
                menuTrigger={<DashboardMobileTrigger />}
                showMobileLogo={showMobileLogo}
              />
              <MainContent as="div" width={contentWidth} spacing="lg" density={density}>
                {header && <div className="mb-8">{header}</div>}
                {children}
              </MainContent>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </PageShell>
    )
  }
)
DashboardShell.displayName = 'DashboardShell'

export { DashboardShell }
