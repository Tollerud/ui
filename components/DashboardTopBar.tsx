'use client'

import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Monogram } from './Monogram'
import { Cluster } from './Cluster'

export interface DashboardTopBarProps extends HTMLAttributes<HTMLElement> {
  projectName: ReactNode
  homeHref?: string
  breadcrumb?: ReactNode
  pageTitle?: ReactNode
  actions?: ReactNode
  /** Mobile menu trigger slot, e.g. `<SidebarTrigger className="lg:hidden" />`. */
  menuTrigger?: ReactNode
  sticky?: boolean
  showMobileLogo?: boolean
}

const DashboardTopBar = forwardRef<HTMLElement, DashboardTopBarProps>(
  (
    {
      className,
      projectName,
      homeHref = '/',
      breadcrumb,
      pageTitle,
      actions,
      menuTrigger,
      sticky = true,
      showMobileLogo = true,
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        className={cn(
          'z-30 flex h-14 items-center gap-3.5 border-b border-tollerud-border bg-tollerud-noir-950/85 px-7 backdrop-blur-[20px] max-lg:px-3.5 max-lg:gap-2',
          sticky && 'sticky top-0',
          className
        )}
        {...props}
      >
        {menuTrigger}
        {showMobileLogo && (
          <a
            href={homeHref}
            className="tollerud-focus-ring shrink-0 rounded-sm lg:hidden"
            aria-label={typeof projectName === 'string' ? projectName : 'Home'}
          >
            <Monogram color="yellow" className="h-[22px] w-auto" />
          </a>
        )}
        {(breadcrumb || pageTitle) && (
          <p className="min-w-0 truncate text-[13px] text-tollerud-text-muted">
            {breadcrumb && <span className="max-sm:hidden">{breadcrumb}</span>}
            {breadcrumb && pageTitle && (
              <span className="mx-1.5 opacity-40 max-sm:hidden">/</span>
            )}
            {pageTitle && <b className="font-semibold text-tollerud-text-primary">{pageTitle}</b>}
          </p>
        )}
        <span className="flex-1" aria-hidden="true" />
        {actions && (
          <Cluster as="div" gap="sm" justify="end" className="shrink-0">
            {actions}
          </Cluster>
        )}
      </header>
    )
  }
)
DashboardTopBar.displayName = 'DashboardTopBar'

export { DashboardTopBar }
