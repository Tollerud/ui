'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
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
import { motionDuration, motionEase } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'
import { DialogDescription, DialogTitle } from './Dialog'
import { Monogram } from './Monogram'
import { Cluster } from './Cluster'

export interface TopNavItem {
  label: ReactNode
  /** Omit when `items` is set — a group trigger isn't itself a direct link. */
  href?: string
  active?: boolean
  external?: boolean
  /** Child links shown in a flyout (desktop) / accordion (mobile). One level of nesting. */
  items?: TopNavItem[]
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

function isTopNavGroup(item: TopNavItem): item is TopNavItem & { items: TopNavItem[] } {
  return !!item.items && item.items.length > 0
}

function topNavItemKey(item: TopNavItem, prefix = '') {
  return `${prefix}${item.href ?? ''}-${String(item.label)}`
}

// `defaultValue`/`dir` are generic HTMLAttributes but collide in meaning with
// NavigationMenuPrimitive.Root's own semantic props of the same name (which
// item is initially active / reading direction) — omit so `{...props}` below
// stays assignable to NavigationMenuPrimitive.Root.
export interface TopNavProps extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir'> {
  projectName: ReactNode
  homeHref?: string
  navItems?: TopNavItem[]
  actions?: ReactNode
  sticky?: boolean
  /** Constrain inner content width; `false` keeps full-bleed (default). */
  maxWidth?: TopNavMaxWidth
  /** Screen reader title for the mobile menu dialog. */
  mobileMenuTitle?: string
  /** Slot rendered at the bottom of the mobile nav sheet, below nav items and actions, separated by a divider. Consumer controls all markup. */
  mobileMenuExtra?: ReactNode
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
      mobileMenuExtra,
      ...props
    },
    ref
  ) => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const hasNavItems = navItems.length > 0
    const { inline: mobileInlineActions, menu: mobileMenuActions, desktop: desktopActions } =
      useMemo(() => partitionActions(actions), [actions])
    const hasDesktopActions = desktopActions.length > 0
    const hasMobileMenuContent = hasNavItems || mobileMenuActions.length > 0 || !!mobileMenuExtra
    const closeMobileMenu = () => setMobileOpen(false)

    const prefersReducedMotion = useReducedMotion()
    const enterTransition = prefersReducedMotion
      ? { duration: 0 }
      : { duration: motionDuration.normal, ease: motionEase.out }
    const exitTransition = prefersReducedMotion
      ? { duration: 0 }
      : { duration: motionDuration.normal, ease: motionEase.in }

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
          <span className="text-base font-semibold leading-tight">{projectName}</span>
        </a>

        {hasNavItems && (
          <NavigationMenuPrimitive.List className="ml-2 hidden min-w-0 flex-wrap items-center gap-4 lg:flex">
            {navItems.map((item) =>
              isTopNavGroup(item) ? (
                <NavigationMenuPrimitive.Item key={topNavItemKey(item)}>
                  <NavigationMenuPrimitive.Trigger
                    className={cn(
                      'tollerud-focus-ring group flex items-center gap-1 rounded-sm text-sm text-tollerud-text-secondary transition-colors hover:text-tollerud-text-primary',
                      item.active && 'text-tollerud-yellow'
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className="h-3 w-3 shrink-0 transition-transform duration-fast group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </NavigationMenuPrimitive.Trigger>
                  <NavigationMenuPrimitive.Content className="tollerud-topnav-flyout-content">
                    <ul className="flex min-w-[12rem] flex-col gap-1 p-2">
                      {item.items.map((child) => (
                        <li key={topNavItemKey(child)}>
                          <NavigationMenuPrimitive.Link asChild active={child.active}>
                            <TopNavLink
                              item={child}
                              className="block rounded-md px-2 py-1.5 hover:bg-tollerud-surface-hover hover:text-tollerud-text-primary"
                            />
                          </NavigationMenuPrimitive.Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuPrimitive.Content>
                </NavigationMenuPrimitive.Item>
              ) : (
                <NavigationMenuPrimitive.Item key={topNavItemKey(item)}>
                  <NavigationMenuPrimitive.Link asChild active={item.active}>
                    <TopNavLink item={item} />
                  </NavigationMenuPrimitive.Link>
                </NavigationMenuPrimitive.Item>
              )
            )}
          </NavigationMenuPrimitive.List>
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

    const viewport = hasNavItems ? (
      <div className="tollerud-topnav-viewport-wrapper absolute inset-x-0 top-full hidden justify-center lg:flex">
        <NavigationMenuPrimitive.Viewport className="tollerud-topnav-viewport border border-tollerud-border/30 bg-tollerud-noir-850 shadow-lg" />
      </div>
    ) : null

    const mobileMenu = hasMobileMenuContent ? (
      <AnimatePresence>
        {mobileOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="tollerud-topnav-menu-overlay lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: enterTransition }}
                exit={{ opacity: 0, transition: exitTransition }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              onOpenAutoFocus={(event) => event.preventDefault()}
            >
              <motion.div
                className={cn(
                  'tollerud-topnav-menu-panel fixed inset-x-0 top-14 z-50 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b border-tollerud-border bg-tollerud-noir-950 px-6 py-4 shadow-xl outline-none lg:hidden',
                  maxWidth && 'mx-auto w-full',
                  maxWidth && maxWidthClasses[maxWidth]
                )}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0, transition: enterTransition }}
                exit={{ opacity: 0, y: -8, transition: exitTransition }}
              >
                <DialogTitle className="tollerud-sr-only">{mobileMenuTitle}</DialogTitle>
                <DialogDescription className="tollerud-sr-only">
                  Site navigation links and actions
                </DialogDescription>
                <div className="flex flex-col gap-4">
                  {hasNavItems && (
                    <Cluster as="div" gap="sm" className="flex-col items-stretch">
                      {navItems.map((item) =>
                        isTopNavGroup(item) ? (
                          <Accordion
                            key={topNavItemKey(item, 'mobile-group-')}
                            className="rounded-none border-0 divide-y-0"
                          >
                            <AccordionItem value={topNavItemKey(item, 'mobile-group-')}>
                              <AccordionTrigger className="rounded-sm px-1 py-2 text-sm font-normal text-tollerud-text-secondary hover:bg-transparent hover:text-tollerud-text-primary">
                                {item.label}
                              </AccordionTrigger>
                              <AccordionContent className="flex flex-col gap-1 px-0 pb-1 pt-0">
                                {item.items.map((child) => (
                                  <TopNavLink
                                    key={topNavItemKey(child, 'mobile-')}
                                    item={child}
                                    className="px-3 py-2 text-tollerud-text-secondary"
                                    onNavigate={closeMobileMenu}
                                  />
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ) : (
                          <TopNavLink
                            key={topNavItemKey(item, 'mobile-')}
                            item={item}
                            className="px-1 py-2"
                            onNavigate={closeMobileMenu}
                          />
                        )
                      )}
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
                  {mobileMenuExtra && (
                    <div className="border-t border-tollerud-border pt-4">
                      {mobileMenuExtra}
                    </div>
                  )}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    ) : null

    const navClassName = cn(
      'relative z-30 border-b border-tollerud-border bg-tollerud-noir-950/85 backdrop-blur-[20px]',
      sticky && 'sticky top-0',
      className
    )

    if (hasMobileMenuContent) {
      return (
        <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <NavigationMenuPrimitive.Root ref={ref} className={navClassName} {...props}>
            {headerBar}
            {viewport}
            {mobileMenu}
          </NavigationMenuPrimitive.Root>
        </DialogPrimitive.Root>
      )
    }

    return (
      <NavigationMenuPrimitive.Root ref={ref} className={navClassName} {...props}>
        {headerBar}
        {viewport}
      </NavigationMenuPrimitive.Root>
    )
  }
)
TopNav.displayName = 'TopNav'

export { TopNav, TopNavAction }
