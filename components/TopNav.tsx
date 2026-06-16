'use client'

import { type HTMLAttributes, type ReactNode, forwardRef, useId, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Monogram } from './Monogram'
import { Cluster } from './Cluster'

export interface TopNavItem {
  label: ReactNode
  href: string
  active?: boolean
  external?: boolean
}

export type TopNavMaxWidth = 'default' | 'wide' | 'full' | false

const maxWidthClasses: Record<Exclude<TopNavMaxWidth, false>, string> = {
  default: 'max-w-[1100px]',
  wide: 'max-w-[1400px]',
  full: 'max-w-none',
}

export interface TopNavProps extends HTMLAttributes<HTMLElement> {
  projectName: ReactNode
  homeHref?: string
  navItems?: TopNavItem[]
  actions?: ReactNode
  sticky?: boolean
  /** Constrain inner content width; `false` keeps full-bleed (default). */
  maxWidth?: TopNavMaxWidth
}

function TopNavLink({
  item,
  className,
  onNavigate,
}: {
  item: TopNavItem
  className?: string
  onNavigate?: () => void
}) {
  return (
    <a
      href={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
      aria-current={item.active ? 'page' : undefined}
      onClick={onNavigate}
      className={cn(
        'tollerud-focus-ring rounded-sm text-sm text-tollerud-text-secondary no-underline transition-colors hover:text-tollerud-text-primary',
        item.active && 'text-tollerud-yellow',
        className
      )}
    >
      {item.label}
    </a>
  )
}

const TopNav = forwardRef<HTMLElement, TopNavProps>(
  (
    {
      className,
      projectName,
      homeHref = '/',
      navItems = [],
      actions,
      sticky = true,
      maxWidth = false,
      ...props
    },
    ref
  ) => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const mobileMenuId = useId()
    const hasNavItems = navItems.length > 0
    const closeMobileMenu = () => setMobileOpen(false)

    return (
      <nav
        ref={ref}
        className={cn(
          'z-30 border-b border-tollerud-border bg-tollerud-noir-950/85 backdrop-blur-[20px]',
          sticky && 'sticky top-0',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'mx-auto flex min-h-14 w-full items-center gap-4 px-6 max-lg:gap-2',
            maxWidth && maxWidthClasses[maxWidth]
          )}
        >
          <a
            href={homeHref}
            className="tollerud-focus-ring flex shrink-0 items-center gap-2 rounded-sm text-tollerud-text-primary no-underline"
          >
            <Monogram color="yellow" className="h-5 w-auto" />
            <span className="text-sm font-semibold">{projectName}</span>
          </a>

          {hasNavItems && (
            <Cluster as="div" gap="md" className="hidden min-w-0 lg:flex">
              {navItems.map((item) => (
                <TopNavLink key={`${item.href}-${String(item.label)}`} item={item} />
              ))}
            </Cluster>
          )}

          {actions && (
            <Cluster as="div" gap="sm" justify="end" className="ml-auto hidden shrink-0 lg:flex">
              {actions}
            </Cluster>
          )}

          {(hasNavItems || actions) && (
            <div className="ml-auto flex items-center gap-2 lg:hidden">
              {actions && <Cluster as="div" gap="sm" justify="end">{actions}</Cluster>}
              {hasNavItems && (
                <button
                  type="button"
                  className="tollerud-focus-ring inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md border border-tollerud-border bg-tollerud-noir-900 text-tollerud-text-secondary transition-colors hover:border-tollerud-noir-500 hover:text-tollerud-text-primary"
                  onClick={() => setMobileOpen((open) => !open)}
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileOpen}
                  aria-controls={mobileMenuId}
                >
                  {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              )}
            </div>
          )}
        </div>

        {hasNavItems && mobileOpen && (
          <div
            id={mobileMenuId}
            className={cn(
              'border-t border-tollerud-border bg-tollerud-noir-950 px-6 py-3 lg:hidden',
              maxWidth && 'mx-auto w-full',
              maxWidth && maxWidthClasses[maxWidth]
            )}
          >
            <Cluster as="div" gap="sm" className="flex-col items-stretch">
              {navItems.map((item) => (
                <TopNavLink
                  key={`mobile-${item.href}-${String(item.label)}`}
                  item={item}
                  className="px-1 py-2"
                  onNavigate={closeMobileMenu}
                />
              ))}
            </Cluster>
          </div>
        )}
      </nav>
    )
  }
)
TopNav.displayName = 'TopNav'

export { TopNav }
