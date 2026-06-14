import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Monogram } from './Monogram'
import { Cluster } from './Cluster'

export interface TopNavItem {
  label: ReactNode
  href: string
  active?: boolean
  external?: boolean
}

export interface TopNavProps extends HTMLAttributes<HTMLElement> {
  projectName: ReactNode
  homeHref?: string
  navItems?: TopNavItem[]
  actions?: ReactNode
  sticky?: boolean
}

const TopNav = forwardRef<HTMLElement, TopNavProps>(
  ({ className, projectName, homeHref = '/', navItems = [], actions, sticky = true, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'z-30 flex min-h-14 items-center gap-6 border-b border-tollerud-border bg-tollerud-noir-950/85 px-6 backdrop-blur-[20px]',
          sticky && 'sticky top-0',
          className
        )}
        {...props}
      >
        <a
          href={homeHref}
          className="tollerud-focus-ring flex shrink-0 items-center gap-2 rounded-sm text-tollerud-text-primary no-underline"
        >
          <Monogram color="yellow" className="h-5 w-auto" />
          <span className="text-sm font-semibold">{projectName}</span>
        </a>
        {navItems.length > 0 && (
          <Cluster as="div" gap="md" className="min-w-0">
            {navItems.map((item) => (
              <a
                key={`${item.href}-${String(item.label)}`}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                aria-current={item.active ? 'page' : undefined}
                className={cn(
                  'tollerud-focus-ring rounded-sm text-sm text-tollerud-text-secondary no-underline transition-colors hover:text-tollerud-text-primary',
                  item.active && 'text-tollerud-yellow'
                )}
              >
                {item.label}
              </a>
            ))}
          </Cluster>
        )}
        {actions && (
          <Cluster as="div" gap="sm" justify="end" className="ml-auto">
            {actions}
          </Cluster>
        )}
      </nav>
    )
  }
)
TopNav.displayName = 'TopNav'

export { TopNav }
