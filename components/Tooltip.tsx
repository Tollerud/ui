'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

const TooltipProvider = TooltipPrimitive.Provider

/* ── Mobile-friendly Tooltip ──
   Opens on hover (desktop) AND on click/tap (mobile).
   Uses React context so the Trigger can toggle Root's open state.
   Closes on second click/tap or click outside. */

type TooltipContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

function Tooltip({
  children,
  defaultOpen,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? (controlledOnOpenChange ?? setInternalOpen) : setInternalOpen

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <TooltipPrimitive.Root open={open} onOpenChange={(v: boolean) => setOpen(v)} {...props}>
        {children}
      </TooltipPrimitive.Root>
    </TooltipContext.Provider>
  )
}
Tooltip.displayName = 'Tooltip'

const TooltipTrigger = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ onClick, onTouchStart, children, ...props }, ref) => {
  const ctx = React.useContext(TooltipContext)
  const touchFired = React.useRef(false)

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      onClick={(e) => {
        // Skip click if this was triggered by a touch (already handled)
        if (touchFired.current) {
          touchFired.current = false
          return
        }
        // Toggle tooltip on click — covers mobile where hover doesn't fire
        if (ctx) {
          ctx.setOpen(!ctx.open)
        }
        onClick?.(e)
      }}
      onTouchStart={(e) => {
        touchFired.current = true
        // Open on touch for mobile
        if (ctx && !ctx.open) {
          ctx.setOpen(true)
        }
        onTouchStart?.(e)
      }}
      {...props}
    >
      {children}
    </TooltipPrimitive.Trigger>
  )
})
TooltipTrigger.displayName = 'TooltipTrigger'

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border border-tia-border/30',
      'bg-tia-noir-800 px-3 py-1.5 text-xs text-tia-foreground',
      'shadow-md',
      'animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-1',
      'data-[side=left]:slide-in-from-right-1',
      'data-[side=right]:slide-in-from-left-1',
      'data-[side=top]:slide-in-from-bottom-1',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = 'TooltipContent'

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }