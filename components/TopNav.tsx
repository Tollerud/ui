'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import {
  Children,
  Fragment,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  forwardRef,
  isValidElement,
  useMemo,
  useState,
} from 'react'
import { cn } from '@/lib/utils'
import { DialogDescription, DialogTitle } from './Dialog'
import { Monogram } from './Monogram'
import { Cluster } from './Cluster'

export interface TopNavItem {
  label: ReactNode
  href: string
  active?: boolean
  external?: boolean
}

export type TopNavMaxWidth = 'default' | 'wide' | 'full' | false

export type TopNavActionMobile = 'inline' | 'menu' | 'hidden'

export interface TopNavActionProps {
  children: ReactNode
  /** Mobile placement; desktop always shows in the actions cluster. Default `menu`. */
  mobile?: TopNavActionMobile
}

const maxWidthClasses: Record<Exclude<TopNavMaxWidth, false>, string> = {
  default: 'max-w-[1100px]',
  wide: 'max-w-[1400px]',
  full: 'max-w-none',
}

function TopNavAction({ children }: TopNavActionProps) {
  return <>{children}</>
}
TopNavAction.displayName = 'TopNavAction'

function isTopNavAction(element: unknown): element is ReactElement<TopNavActionProps> {
  return (
    isValidElement(element) &&
    (element.type as { displayName?: string }).displayName === 'TopNavAction'
  )
}

function flattenActionChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (isValidElement(child) && child.type === Fragment) {
      return flattenActionChildren((child.props as { children?: ReactNode }).children)
    }
    return [child]
  })
}

function partitionActions(actions: ReactNode | undefined) {
  const inline: ReactNode[] = []
  const menu: ReactNode[] = []
  const desktop: ReactNode[] = []

  for (const child of flattenActionChildren(actions)) {
    if (isTopNavAction(child)) {
      const mobile = child.props.mobile ?? 'menu'
      const content = child.props.children
      desktop.push(content)
      if (mobile === 'inline') inline.push(content)
      else if (mobile === 'menu') menu.push(content)
    } else if (child != null && child !== false) {
      desktop.push(child)
      menu.push(child)
    }
  }

  return { inline, menu, desktop }
}

export interface TopNavProps extends HTMLAttributes<HTMLElement> {
  projectName: ReactNode
  homeHref?: string
  navItems?: TopNavItem[]
  actions?: ReactNode
  sticky?: boolean
  /** Constrain inner content width; `false` keeps full-bleed (default). */
  maxWidth?: TopNavMaxWidth
  /** Screen reader title for the mobile menu dialog. */
  mobileMenuTitle?: string
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
      mobileMenuTitle = 'Navigation menu',
      ...props
    },
    ref
  ) => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const hasNavItems = navItems.length > 0
    const { inline: mobileInlineActions, menu: mobileMenuActions, desktop: desktopActions } =
      useMemo(() => partitionActions(actions), [actions])
    const hasDesktopActions = desktopActions.length > 0
    const hasMobileMenuContent = hasNavItems || mobileMenuActions.length > 0
    const closeMobileMenu = () => setMobileOpen(false)

    const headerBar = (
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

        {hasDesktopActions && (
          <Cluster as="div" gap="sm" justify="end" className="ml-auto hidden shrink-0 lg:flex">
            {desktopActions}
          </Cluster>
        )}

        {(hasMobileMenuContent || mobileInlineActions.length > 0) && (
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            {mobileInlineActions.length > 0 && (
              <Cluster as="div" gap="sm" justify="end" className="shrink-0">
                {mobileInlineActions}
              </Cluster>
            )}
            {hasMobileMenuContent && (
              <DialogPrimitive.Trigger asChild>
                <button
                  type="button"
                  className="tollerud-focus-ring inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md border border-tollerud-border bg-tollerud-noir-900 text-tollerud-text-secondary transition-colors hover:border-tollerud-noir-500 hover:text-tollerud-text-primary"
                  aria-label="Toggle navigation menu"
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              </DialogPrimitive.Trigger>
            )}
          </div>
        )}
      </div>
    )

    const mobileMenu = hasMobileMenuContent ? (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="tollerud-topnav-menu-overlay lg:hidden" />
        <DialogPrimitive.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className={cn(
            'tollerud-topnav-menu-panel fixed inset-x-0 top-14 z-50 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b border-tollerud-border bg-tollerud-noir-950 px-6 py-4 shadow-xl outline-none lg:hidden',
            maxWidth && 'mx-auto w-full',
            maxWidth && maxWidthClasses[maxWidth]
          )}
        >
          <DialogTitle className="tollerud-sr-only">{mobileMenuTitle}</DialogTitle>
          <DialogDescription className="tollerud-sr-only">
            Site navigation links and actions
          </DialogDescription>
          <div className="flex flex-col gap-4">
            {hasNavItems && (
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
            )}
            {mobileMenuActions.length > 0 && (
              <Cluster
                as="div"
                gap="sm"
                className={cn(
                  'flex-col items-stretch',
                  hasNavItems && 'border-t border-tollerud-border pt-4'
                )}
                onClick={closeMobileMenu}
              >
                {mobileMenuActions}
              </Cluster>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    ) : null

    if (hasMobileMenuContent) {
      return (
        <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <nav
            ref={ref}
            className={cn(
              'z-30 border-b border-tollerud-border bg-tollerud-noir-950/85 backdrop-blur-[20px]',
              sticky && 'sticky top-0',
              className
            )}
            {...props}
          >
            {headerBar}
            {mobileMenu}
          </nav>
        </DialogPrimitive.Root>
      )
    }

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
        {headerBar}
      </nav>
    )
  }
)
TopNav.displayName = 'TopNav'

export { TopNav, TopNavAction }
