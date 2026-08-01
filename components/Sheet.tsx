'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
} from 'react'
import { motionDuration, motionEase } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ──────────────────── Sheet (slide-in panel) ──────────────────── */

export type SheetSide = 'left' | 'right'

export interface SheetProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

const SheetOpenContext = createContext(false)

const Sheet = ({ open, defaultOpen = false, onOpenChange, children }: SheetProps) => {
  const [isOpen, setIsOpen] = useControllableState({
    prop: open,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <SheetOpenContext.Provider value={isOpen ?? false}>{children}</SheetOpenContext.Provider>
    </DialogPrimitive.Root>
  )
}

const SheetTrigger = DialogPrimitive.Trigger

const SheetClose = DialogPrimitive.Close

// framer-motion's `motion.div` redefines several native DOM event handler
// signatures (onDrag/onAnimation*) for its own gesture/animation system —
// omit them so the underlying `ComponentPropsWithoutRef` DOM types don't
// conflict when spread onto `motion.div` below.
type ConflictingMotionHandlers =
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'

interface SheetContentProps
  extends Omit<ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, ConflictingMotionHandlers> {
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

const sideOffset: Record<SheetSide, string> = {
  right: '100%',
  left: '-100%',
}

const SheetContent = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      className,
      children,
      side = 'right',
      title = 'Panel',
      onOpenAutoFocus,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onInteractOutside,
      style,
      ...props
    },
    ref
  ) => {
    const isOpen = useContext(SheetOpenContext)
    const prefersReducedMotion = useReducedMotion()
    const enterTransition = prefersReducedMotion
      ? { duration: 0 }
      : { duration: motionDuration.normal, ease: motionEase.out }
    const exitTransition = prefersReducedMotion
      ? { duration: 0 }
      : { duration: motionDuration.normal, ease: motionEase.in }
    const offset = sideOffset[side]

    return (
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="tollerud-sheet-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: enterTransition }}
                exit={{ opacity: 0, transition: exitTransition }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              onOpenAutoFocus={onOpenAutoFocus}
              onCloseAutoFocus={onCloseAutoFocus}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              onInteractOutside={onInteractOutside}
            >
              <motion.div
                ref={ref}
                style={style}
                className={cn(
                  'tollerud-sheet-panel fixed z-50 flex gap-4 bg-tollerud-noir-900 border-tollerud-border/30 p-6 shadow-xl',
                  side === 'right' && ['inset-y-0 right-0 h-full w-full max-w-md border-l'],
                  side === 'left' && ['inset-y-0 left-0 h-full w-full max-w-md border-r'],
                  className
                )}
                initial={{ x: offset }}
                animate={{ x: 0, transition: enterTransition }}
                exit={{ x: offset, transition: exitTransition }}
                {...props}
              >
                {!treeContainsDisplayName(children, 'SheetTitle') && (
                  <DialogPrimitive.Title className="tollerud-sr-only">{title}</DialogPrimitive.Title>
                )}
                {children}
                <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity duration-fast text-tollerud-text-muted hover:text-tollerud-text-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                  <span className="sr-only">Close</span>
                </SheetClose>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    )
  }
)
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
