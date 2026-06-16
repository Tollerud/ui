'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { type ComponentPropsWithoutRef, type ReactNode, Children, forwardRef, isValidElement } from 'react'
import { cn } from '@/lib/utils'

/* ──────────────────── Sheet (slide-in panel) ──────────────────── */

export type SheetSide = 'left' | 'right'

export interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    {children}
  </DialogPrimitive.Root>
)

const SheetTrigger = DialogPrimitive.Trigger

const SheetClose = DialogPrimitive.Close

interface SheetContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: SheetSide
  /** Screen reader label when children omit `SheetTitle`. Default: `Panel`. */
  title?: string
}

function treeContainsDisplayName(node: ReactNode, displayName: string): boolean {
  let found = false
  Children.forEach(node, (child) => {
    if (found || !isValidElement(child)) return
    if ((child.type as { displayName?: string }).displayName === displayName) {
      found = true
      return
    }
    const props = child.props as { children?: ReactNode }
    if (props.children && treeContainsDisplayName(props.children, displayName)) {
      found = true
    }
  })
  return found
}

const SheetOverlay = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('tollerud-sheet-overlay', className)}
    {...props}
  />
))
SheetOverlay.displayName = 'SheetOverlay'

const SheetContent = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ className, children, side = 'right', title = 'Panel', ...props }, ref) => (
  <SheetOverlay>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'tollerud-sheet-panel fixed z-50 gap-4 bg-tollerud-noir-900 border-tollerud-border/30 p-6 shadow-xl',
        side === 'right' && [
          'tollerud-sheet-panel--right inset-y-0 right-0 h-full w-full max-w-md border-l',
        ],
        side === 'left' && [
          'tollerud-sheet-panel--left inset-y-0 left-0 h-full w-full max-w-md border-r',
        ],
        className
      )}
      {...props}
    >
      {!treeContainsDisplayName(children, 'SheetTitle') && (
        <DialogPrimitive.Title className="tollerud-sr-only">{title}</DialogPrimitive.Title>
      )}
      {children}
      <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity text-tollerud-text-muted hover:text-tollerud-text-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
        <span className="sr-only">Close</span>
      </SheetClose>
    </DialogPrimitive.Content>
  </SheetOverlay>
))
SheetContent.displayName = 'SheetContent'

const SheetHeader = ({ className, ...props }: { className?: string; children?: ReactNode }) => (
  <div className={cn('flex flex-col space-y-1.5 text-left', className)} {...props} />
)

const SheetTitle = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-base font-semibold text-tollerud-text-primary', className)}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-tollerud-text-secondary', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}