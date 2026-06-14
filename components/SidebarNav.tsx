'use client'

import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Monogram } from './Monogram'

export interface SidebarNavItem {
  id: string
  label: ReactNode
  href?: string
  active?: boolean
  icon?: ReactNode
  onSelect?: () => void
}

export interface SidebarNavGroup {
  label?: ReactNode
  items: SidebarNavItem[]
}

export interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  projectName: ReactNode
  projectSubtitle?: ReactNode
  homeHref?: string
  groups?: SidebarNavGroup[]
  items?: SidebarNavItem[]
  onItemSelect?: (item: SidebarNavItem) => void
  children?: ReactNode
}

function SidebarNavLink({
  item,
  onItemSelect,
}: {
  item: SidebarNavItem
  onItemSelect?: (item: SidebarNavItem) => void
}) {
  const className = cn(
    'tollerud-focus-ring flex w-full items-center gap-2.5 rounded-md border-0 bg-transparent px-2.5 py-1.5 text-left text-[13.5px] font-medium text-tollerud-text-secondary transition-colors',
    'hover:bg-tollerud-noir-800 hover:text-tollerud-text-primary',
    item.active &&
      'bg-tollerud-yellow/10 text-tollerud-text-primary shadow-[inset_2px_0_0_0] shadow-tollerud-yellow'
  )

  const icon = item.icon ? (
    <span
      className={cn(
        'flex h-[15px] w-[15px] shrink-0 items-center justify-center text-tollerud-text-muted',
        item.active && 'text-tollerud-yellow'
      )}
    >
      {item.icon}
    </span>
  ) : null

  const content = (
    <>
      {icon}
      {item.label}
    </>
  )

  const handleSelect = () => {
    item.onSelect?.()
    onItemSelect?.(item)
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        aria-current={item.active ? 'page' : undefined}
        className={cn(className, 'no-underline')}
        onClick={handleSelect}
      >
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={className} onClick={handleSelect}>
      {content}
    </button>
  )
}

const SidebarNav = forwardRef<HTMLElement, SidebarNavProps>(
  (
    {
      className,
      projectName,
      projectSubtitle,
      homeHref = '/',
      groups,
      items,
      onItemSelect,
      children,
      ...props
    },
    ref
  ) => {
    const navGroups: SidebarNavGroup[] =
      groups ?? (items?.length ? [{ items }] : [])

    return (
      <aside
        ref={ref}
        className={cn(
          'flex h-full w-[264px] shrink-0 flex-col border-r border-tollerud-border bg-tollerud-noir-900',
          className
        )}
        {...props}
      >
        <a
          href={homeHref}
          className="tollerud-focus-ring flex h-14 shrink-0 items-center gap-[11px] border-b border-tollerud-border px-[22px] no-underline"
        >
          <Monogram color="yellow" className="h-[26px] w-auto" />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold leading-tight tracking-[-0.01em] text-tollerud-text-primary">
              {projectName}
            </div>
            {projectSubtitle && (
              <div className="truncate font-mono text-[10px] text-tollerud-text-muted">{projectSubtitle}</div>
            )}
          </div>
        </a>
        {navGroups.length > 0 && (
          <nav className="flex-1 overflow-y-auto px-3 py-4 pb-6">
            {navGroups.map((group, groupIndex) => (
              <div className={cn('mb-[18px] last:mb-0')} key={group.label ? String(group.label) : groupIndex}>
                {group.label && (
                  <div className="px-2.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-tollerud-text-muted">
                    {group.label}
                  </div>
                )}
                <div className="flex flex-col">
                  {group.items.map((item) => (
                    <SidebarNavLink key={item.id} item={item} onItemSelect={onItemSelect} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        )}
        {children && <div className="border-t border-tollerud-border px-3 py-4">{children}</div>}
      </aside>
    )
  }
)
SidebarNav.displayName = 'SidebarNav'

export { SidebarNav }
