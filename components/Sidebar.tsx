'use client'

import { Slot, Slottable } from '@radix-ui/react-slot'
import { PanelLeft } from 'lucide-react'
import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  forwardRef,
  useContext,
  useEffect,
} from 'react'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { useIsMobile } from '@/lib/use-mobile'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent } from './Sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

/* ──────────────────── Sidebar primitive family ──────────────────── */

export type SidebarSide = 'left' | 'right'
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none'

interface SidebarContextValue {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  isMobile: boolean
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within a <SidebarProvider>')
  return ctx
}

interface SidebarConfigValue {
  side: SidebarSide
  collapsible: SidebarCollapsible
}

const SidebarConfigContext = createContext<SidebarConfigValue>({
  side: 'left',
  collapsible: 'offcanvas',
})

export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
  /** Default expanded state (desktop). Default `true`. */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Cmd/Ctrl+B toggles the sidebar. Default `true`. */
  keyboardShortcut?: boolean
}

const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(
  ({ open, defaultOpen = true, onOpenChange, keyboardShortcut = true, style, className, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = useControllableState({
      defaultProp: false,
    })

    const toggleSidebar = () => {
      if (isMobile) setOpenMobile((prev) => !prev)
      else setIsOpen((prev) => !prev)
    }

    useEffect(() => {
      if (!keyboardShortcut) return
      function handleKeyDown(event: KeyboardEvent) {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
          event.preventDefault()
          toggleSidebar()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
      // eslint-disable-next-line react-hooks/exhaustive-deps -- toggleSidebar closes over isMobile/setters, re-subscribing each render is unnecessary churn; behavior is correct since the handler reads current isMobile via closure recreation on every render pass anyway.
    }, [keyboardShortcut, isMobile])

    const contextValue: SidebarContextValue = {
      state: isOpen ? 'expanded' : 'collapsed',
      open: isOpen ?? true,
      setOpen: setIsOpen,
      isMobile,
      openMobile: openMobile ?? false,
      setOpenMobile,
      toggleSidebar,
    }

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            ref={ref}
            style={
              {
                '--sidebar-width': '264px',
                '--sidebar-width-icon': '3.5rem',
                '--sidebar-width-mobile': '288px',
                ...style,
              } as CSSProperties
            }
            className={cn('flex min-h-screen w-full', className)}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = 'SidebarProvider'

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  side?: SidebarSide
  /** Default `offcanvas`. */
  collapsible?: SidebarCollapsible
  /** Screen reader title for the mobile sheet. */
  mobileTitle?: string
}

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ side = 'left', collapsible = 'offcanvas', mobileTitle = 'Navigation menu', className, children, ...props }, ref) => {
    const { isMobile, open, openMobile, setOpenMobile } = useSidebar()

    if (isMobile) {
      return (
        <SidebarConfigContext.Provider value={{ side, collapsible }}>
          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetContent
              side={side}
              title={mobileTitle}
              style={{ '--sidebar-width-mobile': '288px' } as CSSProperties}
              className={cn(
                'flex w-[var(--sidebar-width-mobile)] max-w-[var(--sidebar-width-mobile)] flex-col gap-0 border-0 p-0',
                side === 'left' ? 'border-r' : 'border-l',
                className
              )}
            >
              {children}
            </SheetContent>
          </Sheet>
        </SidebarConfigContext.Provider>
      )
    }

    const collapsedIcon = collapsible === 'icon' && !open
    const width =
      collapsible === 'none' || open
        ? 'var(--sidebar-width)'
        : collapsible === 'icon'
          ? 'var(--sidebar-width-icon)'
          : '0px'

    return (
      <SidebarConfigContext.Provider value={{ side, collapsible }}>
        <aside
          ref={ref}
          data-state={open ? 'expanded' : 'collapsed'}
          data-collapsible={collapsible}
          style={{ width }}
          className={cn(
            // Absolute (viewport-relative) height, not h-full — a flex row's
            // default align-items:stretch would otherwise stretch this to
            // match SidebarInset's content height, defeating `sticky` (see
            // PageShell.test.tsx). --sidebar-height lets an embedding context
            // (e.g. a bounded docs demo box) override it without needing a
            // new prop — CSS custom properties inherit through any ancestor.
            'sticky top-0 flex h-[var(--sidebar-height,100vh)] shrink-0 flex-col overflow-hidden border-tollerud-border bg-tollerud-noir-900 transition-[width] duration-normal ease-out',
            side === 'left' ? 'border-r' : 'border-l',
            collapsedIcon && 'items-center',
            className
          )}
          {...props}
        >
          {children}
        </aside>
      </SidebarConfigContext.Provider>
    )
  }
)
Sidebar.displayName = 'Sidebar'

const SidebarTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar, isMobile, open, openMobile } = useSidebar()
    const expanded = isMobile ? openMobile : open

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Toggle sidebar"
        aria-expanded={expanded}
        className={cn(
          'tollerud-focus-ring inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md border border-tollerud-border bg-tollerud-noir-900 text-tollerud-text-secondary transition-colors hover:border-tollerud-noir-500 hover:text-tollerud-text-primary',
          className
        )}
        onClick={(event) => {
          onClick?.(event)
          toggleSidebar()
        }}
        {...props}
      >
        <PanelLeft className="h-4 w-4" />
      </button>
    )
  }
)
SidebarTrigger.displayName = 'SidebarTrigger'

const SidebarInset = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex min-w-0 flex-1 flex-col', className)} {...props} />
  )
)
SidebarInset.displayName = 'SidebarInset'

const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex h-14 shrink-0 items-center gap-[11px] border-b border-tollerud-border px-[22px]', className)}
      {...props}
    />
  )
)
SidebarHeader.displayName = 'SidebarHeader'

const SidebarContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4', className)} {...props} />
  )
)
SidebarContent.displayName = 'SidebarContent'

const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('border-t border-tollerud-border px-3 py-4', className)} {...props} />
  )
)
SidebarFooter.displayName = 'SidebarFooter'

const SidebarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-[18px] last:mb-0', className)} {...props} />
  )
)
SidebarGroup.displayName = 'SidebarGroup'

const SidebarGroupLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { open } = useSidebar()
    const { collapsible } = useContext(SidebarConfigContext)
    if (collapsible === 'icon' && !open) return null
    return (
      <div
        ref={ref}
        className={cn(
          'px-2.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-tollerud-text-muted',
          className
        )}
        {...props}
      />
    )
  }
)
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

const SidebarGroupContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex flex-col', className)} {...props} />
)
SidebarGroupContent.displayName = 'SidebarGroupContent'

const SidebarMenu = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-col gap-0.5', className)} {...props} />
  )
)
SidebarMenu.displayName = 'SidebarMenu'

const SidebarMenuItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('relative', className)} {...props} />
)
SidebarMenuItem.displayName = 'SidebarMenuItem'

export interface SidebarMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as the single child element (e.g. `next/link`) instead of a `<button>`. */
  asChild?: boolean
  isActive?: boolean
  icon?: ReactNode
  /** Shown as a tooltip when the sidebar is collapsed to icon-only. */
  tooltip?: ReactNode
}

const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ asChild, isActive, icon, tooltip, className, children, ...props }, ref) => {
    const { state, isMobile } = useSidebar()
    const { collapsible } = useContext(SidebarConfigContext)
    const collapsedIcon = !isMobile && collapsible === 'icon' && state === 'collapsed'
    const Comp = asChild ? Slot : 'button'

    const button = (
      <Comp
        ref={ref}
        type={asChild ? undefined : 'button'}
        data-active={isActive || undefined}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'tollerud-focus-ring flex w-full items-center gap-2.5 rounded-md border-0 bg-transparent px-2.5 py-1.5 text-left text-[13.5px] font-medium text-tollerud-text-secondary no-underline transition-colors duration-fast',
          'hover:bg-tollerud-noir-800 hover:text-tollerud-text-primary',
          isActive && 'bg-tollerud-yellow/10 text-tollerud-text-primary shadow-[inset_2px_0_0_0] shadow-tollerud-yellow',
          collapsedIcon && 'w-9 justify-center px-0',
          className
        )}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              'flex h-[15px] w-[15px] shrink-0 items-center justify-center text-tollerud-text-muted',
              isActive && 'text-tollerud-yellow'
            )}
          >
            {icon}
          </span>
        )}
        <Slottable>
          {asChild ? children : <span className={cn('truncate', collapsedIcon && 'sr-only')}>{children}</span>}
        </Slottable>
      </Comp>
    )

    if (collapsedIcon && tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">{tooltip}</TooltipContent>
        </Tooltip>
      )
    }

    return button
  }
)
SidebarMenuButton.displayName = 'SidebarMenuButton'

const SidebarMenuAction = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : 'button'}
      className={cn(
        'tollerud-focus-ring absolute right-1.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded text-tollerud-text-muted transition-colors hover:bg-tollerud-noir-800 hover:text-tollerud-text-primary',
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = 'SidebarMenuAction'

const SidebarMenuBadge = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 min-w-[18px] rounded-full px-1.5 text-center font-mono text-[10px] text-tollerud-text-muted',
        className
      )}
      {...props}
    />
  )
)
SidebarMenuBadge.displayName = 'SidebarMenuBadge'

const SidebarMenuSub = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('ml-[19px] flex flex-col gap-0.5 border-l border-tollerud-border py-0.5 pl-3', className)}
      {...props}
    />
  )
)
SidebarMenuSub.displayName = 'SidebarMenuSub'

const SidebarMenuSubItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('relative', className)} {...props} />
)
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

export interface SidebarMenuSubButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isActive?: boolean
}

const SidebarMenuSubButton = forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
  ({ asChild, isActive, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : 'button'}
        data-active={isActive || undefined}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'tollerud-focus-ring flex w-full items-center rounded-md border-0 bg-transparent px-2.5 py-1.5 text-left text-[13px] text-tollerud-text-secondary no-underline transition-colors duration-fast',
          'hover:bg-tollerud-noir-800 hover:text-tollerud-text-primary',
          isActive && 'text-tollerud-yellow',
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

/* ──────────────────── Data-driven convenience types ────────────────────
   Kept for source compatibility with the removed SidebarNav's data props
   (DashboardShellProps.sidebarGroups / sidebarItems). */

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

export {
  useSidebar,
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
}
