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
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FloatingDropdownPortal, isOutsideFloatingDropdown } from '@/lib/floating-dropdown'
import { motionDuration, motionEase } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'
import { DialogDescription, DialogTitle } from './Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { Monogram } from './Monogram'
import { Cluster } from './Cluster'

export interface TopNavItem {
  label: ReactNode
  /** Omit when `items` is set — a group trigger isn't itself a direct link. */
  href?: string
  /** Renders the row as a `<button>` instead of a link — e.g. sign out. Ignored if `href` is set. */
  onClick?: () => void
  active?: boolean
  external?: boolean
  /** Shown in flyout/dropdown and mobile rows. Not rendered in the top bar itself. */
  icon?: ReactNode
  /** Child links shown in a flyout (desktop) / accordion (mobile). One level of nesting. */
  items?: TopNavItem[]
}

/** A labeled group of rows appended to the mobile menu, below nav items/actions —
 *  e.g. "recent stores" or an account section. Renders with the same row styling
 *  as nav item dropdowns, so ad-hoc consumer markup doesn't drift from the system. */
export interface TopNavSection {
  label?: ReactNode
  items: TopNavItem[]
  /** Collapse behind the label as a tap-to-expand accordion, same as flyout groups — keeps a mobile
   *  sheet with several sections from turning into a wall of rows. Default `true`. Has no effect
   *  without `label` (there'd be nothing to tap). */
  collapsible?: boolean
  /** Start expanded when `collapsible`. Default `false` — collapsed, matching flyout groups. */
  defaultOpen?: boolean
}

/** A single account/user menu, rendered from one data structure on both surfaces:
 *  a `DropdownMenu` next to the desktop actions, and appended to the mobile sheet's
 *  sections (same row styling, right alongside any `mobileMenuSections`). Keeps a
 *  desktop dropdown and its mobile equivalent from drifting out of sync — the two
 *  were previously always hand-duplicated by consumers. */
export interface TopNavUserMenu {
  /** Desktop dropdown trigger content — e.g. an avatar + name. Wrapped in a focusable button. */
  trigger: ReactNode
  /** Accessible label for the trigger button. Defaults to `'User menu'`. */
  triggerLabel?: string
  /** Same shape as `mobileMenuSections` — rendered as `DropdownMenuLabel`/`DropdownMenuItem` groups on desktop. */
  sections: TopNavSection[]
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
  /** Labeled row groups appended below nav items/actions (e.g. recent items, account links) — styled consistently with the rest of the menu. Rendered before `userMenu`'s sections, then `mobileMenuExtra`. */
  mobileMenuSections?: TopNavSection[]
  /** Freeform slot rendered at the bottom of the mobile nav sheet, below nav items, actions, `mobileMenuSections`, and `userMenu`'s sections, separated by a divider. Consumer controls all markup. */
  mobileMenuExtra?: ReactNode
  /** A single account/user menu rendered from one data structure — a `DropdownMenu` next to the desktop actions, and appended to the mobile sheet's sections. See `TopNavUserMenu`. */
  userMenu?: TopNavUserMenu
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
  const handleClick = () => {
    item.onClick?.()
    onNavigate?.()
  }
  const rowClassName = cn(
    'tollerud-focus-ring rounded-sm text-sm text-tollerud-text-secondary no-underline transition-colors hover:text-tollerud-text-primary',
    item.active && 'text-tollerud-yellow',
    className
  )
  if (item.onClick && !item.href) {
    return (
      <button type="button" onClick={handleClick} className={cn(rowClassName, 'text-left')}>
        {item.label}
      </button>
    )
  }
  return (
    <a
      href={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
      aria-current={item.active ? 'page' : undefined}
      onClick={handleClick}
      className={rowClassName}
    >
      {item.label}
    </a>
  )
}

/** Button-styled row used everywhere a dropdown/list of items appears: desktop flyout
 *  panels, the mobile menu, and mobile accordion groups — one consistent row language
 *  (icon slot, full-width hover/active surface) instead of each surface inventing its own. */
function TopNavMenuRow({
  item,
  className,
  onNavigate,
}: {
  item: TopNavItem
  className?: string
  onNavigate?: () => void
}) {
  const handleClick = () => {
    item.onClick?.()
    onNavigate?.()
  }
  const rowClassName = cn(
    'tollerud-focus-ring flex min-h-[40px] w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13.5px] font-medium text-tollerud-text-secondary no-underline transition-colors duration-fast',
    'hover:bg-tollerud-surface-hover hover:text-tollerud-text-primary',
    item.active &&
      'bg-tollerud-yellow/10 text-tollerud-text-primary shadow-[inset_2px_0_0_0] shadow-tollerud-yellow',
    className
  )
  const content = (
    <>
      {item.icon && (
        <span
          className={cn(
            'flex h-[15px] w-[15px] shrink-0 items-center justify-center text-tollerud-text-muted',
            item.active && 'text-tollerud-yellow'
          )}
        >
          {item.icon}
        </span>
      )}
      <span className="truncate">{item.label}</span>
    </>
  )
  if (item.onClick && !item.href) {
    return (
      <button type="button" onClick={handleClick} className={rowClassName}>
        {content}
      </button>
    )
  }
  return (
    <a
      href={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
      aria-current={item.active ? 'page' : undefined}
      onClick={handleClick}
      className={rowClassName}
    >
      {content}
    </a>
  )
}

/** SidebarGroupLabel's exact styling — same "muted uppercase eyebrow" language for
 *  labeled row groups wherever they appear, so Sidebar and TopNav read as one system. */
function TopNavGroupLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-tollerud-text-muted">
      {children}
    </div>
  )
}

/** A `mobileMenuSections`/`userMenu` section in the mobile sheet. Collapses behind its label as a
 *  tap-to-expand accordion by default — the same treatment flyout groups already get — so a sheet
 *  with several sections doesn't turn into one long wall of rows. Falls back to always-expanded
 *  when there's no label to tap, or when a section opts out via `collapsible: false`. */
function TopNavMobileSection({
  section,
  sectionKey,
  itemKeyPrefix,
  onNavigate,
}: {
  section: TopNavSection
  sectionKey: string
  itemKeyPrefix: string
  onNavigate: () => void
}) {
  const rows = section.items.map((item) => (
    <TopNavMenuRow key={topNavItemKey(item, itemKeyPrefix)} item={item} onNavigate={onNavigate} />
  ))

  if (!section.label || section.collapsible === false) {
    return (
      <div className="flex flex-col gap-0.5">
        {section.label && <TopNavGroupLabel>{section.label}</TopNavGroupLabel>}
        {rows}
      </div>
    )
  }

  return (
    <Accordion
      defaultOpen={section.defaultOpen ? sectionKey : undefined}
      className="rounded-none border-0 divide-y-0"
    >
      <AccordionItem value={sectionKey}>
        <AccordionTrigger className="rounded-sm px-2.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-tollerud-text-muted hover:bg-transparent hover:text-tollerud-text-secondary [&_svg]:h-3 [&_svg]:w-3">
          {section.label}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-0.5 px-0 pb-1 pt-0.5">{rows}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function TopNavUserMenuItem({ item }: { item: TopNavItem }) {
  const content = (
    <>
      {item.icon && (
        <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center text-tollerud-text-muted">
          {item.icon}
        </span>
      )}
      <span className="truncate">{item.label}</span>
    </>
  )
  if (item.onClick && !item.href) {
    return (
      <DropdownMenuItem onSelect={item.onClick} className="gap-2">
        {content}
      </DropdownMenuItem>
    )
  }
  return (
    <DropdownMenuItem asChild className="gap-2">
      <a
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noreferrer' : undefined}
      >
        {content}
      </a>
    </DropdownMenuItem>
  )
}

/** Desktop half of `userMenu` — a `DropdownMenu` built from the same `TopNavSection[]`
 *  shape the mobile sheet renders, so the two surfaces can't drift out of sync. */
function TopNavUserMenuDropdown({ userMenu }: { userMenu: TopNavUserMenu }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="tollerud-focus-ring inline-flex cursor-pointer items-center gap-2 rounded-full"
          aria-label={userMenu.triggerLabel ?? 'User menu'}
        >
          {userMenu.trigger}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {userMenu.sections.map((section, i) => (
          <Fragment key={section.label ? String(section.label) : `user-menu-section-${i}`}>
            {i > 0 && <DropdownMenuSeparator />}
            {section.label && <DropdownMenuLabel>{section.label}</DropdownMenuLabel>}
            {section.items.map((item) => (
              <TopNavUserMenuItem key={topNavItemKey(item, `user-menu-${i}-`)} item={item} />
            ))}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Desktop flyout group. `NavigationMenuPrimitive.Trigger` owns hover/click/keyboard open
 *  state entirely on its own (confirmed — it doesn't need a matching `Content`/`Viewport`
 *  to function); the panel itself is positioned with the same Floating UI engine behind
 *  Combobox/Select, anchored to this trigger specifically. Radix's own Viewport centers
 *  content under the *whole* nav bar rather than the trigger that opened it — for a trigger
 *  that isn't near the bar's center, the panel renders far from the cursor, which both looks
 *  disconnected and makes the hover area impossible to bridge (the pointer leaves the trigger
 *  before reaching the panel, so it closes mid-open — the "shrinks to a line" glitch). */
function TopNavFlyoutGroup({
  item,
  value,
  isOpen,
  onClose,
}: {
  item: TopNavItem & { items: TopNavItem[] }
  value: string
  isOpen: boolean
  onClose: () => void
}) {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const popoverId = useId()

  // Radix's Trigger owns hover/click/keyboard *opening*, but closing on Escape or an
  // outside click was previously Content's job (via its own DismissableLayer) — now that
  // the panel is a Floating UI portal instead, both need reimplementing here directly.
  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (e: PointerEvent) => {
      if (isOutsideFloatingDropdown(e.target as Node, anchorRef, popoverRef)) onClose()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen, onClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Escape') return
    e.preventDefault()
    e.stopPropagation()
    onClose()
    anchorRef.current?.focus()
  }

  return (
    <NavigationMenuPrimitive.Item value={value} onKeyDown={handleKeyDown}>
      <NavigationMenuPrimitive.Trigger
        ref={anchorRef}
        aria-controls={isOpen ? popoverId : undefined}
        className={cn(
          'tollerud-focus-ring group flex cursor-pointer items-center gap-1 rounded-sm text-sm text-tollerud-text-secondary transition-colors hover:text-tollerud-text-primary',
          item.active && 'text-tollerud-yellow'
        )}
      >
        {item.label}
        <ChevronDown
          className="h-3 w-3 shrink-0 transition-transform duration-fast group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </NavigationMenuPrimitive.Trigger>
      <FloatingDropdownPortal
        open={isOpen}
        anchorRef={anchorRef}
        popoverRef={popoverRef}
        id={popoverId}
        width="auto"
        role="menu"
        aria-label={typeof item.label === 'string' ? item.label : undefined}
        className="rounded-lg border border-tollerud-border/30 bg-tollerud-noir-850"
      >
        <ul className="flex min-w-[12rem] flex-col gap-0.5 p-2">
          {item.items.map((child) => (
            <li key={topNavItemKey(child)}>
              <TopNavMenuRow item={child} />
            </li>
          ))}
        </ul>
      </FloatingDropdownPortal>
    </NavigationMenuPrimitive.Item>
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
      mobileMenuSections,
      mobileMenuExtra,
      userMenu,
      ...props
    },
    ref
  ) => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [openGroup, setOpenGroup] = useState('')
    const hasNavItems = navItems.length > 0
    const { inline: mobileInlineActions, menu: mobileMenuActions, desktop: desktopActions } =
      useMemo(() => partitionActions(actions), [actions])
    const hasDesktopActions = desktopActions.length > 0
    const allMobileSections = useMemo(
      () => [...(mobileMenuSections ?? []), ...(userMenu?.sections ?? [])],
      [mobileMenuSections, userMenu]
    )
    const hasMobileSections = allMobileSections.length > 0
    const hasMobileMenuContent =
      hasNavItems || mobileMenuActions.length > 0 || hasMobileSections || !!mobileMenuExtra
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
                <TopNavFlyoutGroup
                  key={topNavItemKey(item)}
                  item={item}
                  value={topNavItemKey(item)}
                  isOpen={openGroup === topNavItemKey(item)}
                  onClose={() => setOpenGroup('')}
                />
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

        {(hasDesktopActions || userMenu) && (
          <Cluster as="div" gap="sm" justify="end" className="ml-auto hidden shrink-0 lg:flex">
            {desktopActions}
            {userMenu && <TopNavUserMenuDropdown userMenu={userMenu} />}
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
                  className="tollerud-focus-ring inline-flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center rounded-md border border-tollerud-border bg-tollerud-noir-900 text-tollerud-text-secondary transition-colors hover:border-tollerud-noir-500 hover:text-tollerud-text-primary"
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
                  'tollerud-topnav-menu-panel fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-tollerud-border bg-tollerud-noir-950 px-6 py-4 shadow-xl outline-none lg:hidden',
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
                    <div className="flex flex-col gap-0.5">
                      {navItems.map((item) =>
                        isTopNavGroup(item) ? (
                          <Accordion
                            key={topNavItemKey(item, 'mobile-group-')}
                            className="rounded-none border-0 divide-y-0"
                          >
                            <AccordionItem value={topNavItemKey(item, 'mobile-group-')}>
                              <AccordionTrigger
                                className={cn(
                                  'min-h-[40px] gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium text-tollerud-text-secondary transition-colors duration-fast hover:bg-tollerud-surface-hover hover:text-tollerud-text-primary',
                                  item.active && 'text-tollerud-yellow'
                                )}
                              >
                                <span className="flex min-w-0 flex-1 items-center gap-2.5">
                                  {item.icon && (
                                    <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center text-tollerud-text-muted">
                                      {item.icon}
                                    </span>
                                  )}
                                  <span className="truncate">{item.label}</span>
                                </span>
                              </AccordionTrigger>
                              <AccordionContent className="px-0 pb-1 pt-0.5">
                                <div className="ml-[19px] flex flex-col gap-0.5 border-l border-tollerud-border py-0.5 pl-3">
                                  {item.items.map((child) => (
                                    <TopNavMenuRow
                                      key={topNavItemKey(child, 'mobile-')}
                                      item={child}
                                      onNavigate={closeMobileMenu}
                                    />
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ) : (
                          <TopNavMenuRow
                            key={topNavItemKey(item, 'mobile-')}
                            item={item}
                            onNavigate={closeMobileMenu}
                          />
                        )
                      )}
                    </div>
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
                  {hasMobileSections && (
                    <div
                      className={cn(
                        'flex flex-col gap-[18px]',
                        (hasNavItems || mobileMenuActions.length > 0) &&
                          'border-t border-tollerud-border pt-4'
                      )}
                    >
                      {allMobileSections.map((section, i) => {
                        const sectionKey = section.label ? String(section.label) : `mobile-section-${i}`
                        return (
                          <TopNavMobileSection
                            key={sectionKey}
                            section={section}
                            sectionKey={sectionKey}
                            itemKeyPrefix={`mobile-section-${i}-`}
                            onNavigate={closeMobileMenu}
                          />
                        )
                      })}
                    </div>
                  )}
                  {mobileMenuExtra && (
                    <div
                      className={cn(
                        (hasNavItems || mobileMenuActions.length > 0 || hasMobileSections) &&
                          'border-t border-tollerud-border pt-4'
                      )}
                    >
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
          <NavigationMenuPrimitive.Root
            ref={ref}
            className={navClassName}
            value={openGroup}
            onValueChange={setOpenGroup}
            {...props}
          >
            {headerBar}
            {mobileMenu}
          </NavigationMenuPrimitive.Root>
        </DialogPrimitive.Root>
      )
    }

    return (
      <NavigationMenuPrimitive.Root
        ref={ref}
        className={navClassName}
        value={openGroup}
        onValueChange={setOpenGroup}
        {...props}
      >
        {headerBar}
      </NavigationMenuPrimitive.Root>
    )
  }
)
TopNav.displayName = 'TopNav'

export { TopNav, TopNavAction }
