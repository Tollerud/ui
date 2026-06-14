import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { PageHeader } from './PageHeader'
import { Split } from './Split'
import { Stack } from './Stack'

export interface SettingsNavItem {
  id: string
  label: ReactNode
  href?: string
  active?: boolean
}

export interface SettingsLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  navItems?: SettingsNavItem[]
  activeId?: string
}

const SettingsLayout = forwardRef<HTMLDivElement, SettingsLayoutProps>(
  ({ className, title, description, actions, navItems = [], activeId, children, ...props }, ref) => {
    return (
      <Stack ref={ref} gap="lg" className={cn('w-full', className)} {...props}>
        <PageHeader title={title} description={description} actions={actions} />
        <Split ratio="sidebar" gap="lg" align="start">
          <nav className="rounded-lg border border-tollerud-border bg-tollerud-surface-raised p-2">
            {navItems.map((item) => {
              const active = item.active ?? item.id === activeId
              const content = (
                <span
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm text-tollerud-text-secondary transition-colors',
                    active
                      ? 'bg-tollerud-yellow text-tollerud-noir-950'
                      : 'hover:bg-tollerud-surface-hover hover:text-tollerud-text-primary'
                  )}
                >
                  {item.label}
                </span>
              )
              return item.href ? (
                <a key={item.id} href={item.href} className="tollerud-focus-ring block rounded-md no-underline">
                  {content}
                </a>
              ) : (
                <div key={item.id}>{content}</div>
              )
            })}
          </nav>
          <div>{children}</div>
        </Split>
      </Stack>
    )
  }
)
SettingsLayout.displayName = 'SettingsLayout'

export { SettingsLayout }
