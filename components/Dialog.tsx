'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { Children, type HTMLAttributes, type ReactNode, isValidElement } from 'react'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const dialogSizes: Record<DialogSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[min(1100px,calc(100vw-2rem))]',
}

function partitionDialogChildren(children: ReactNode) {
  const header: ReactNode[] = []
  const footer: ReactNode[] = []
  const body: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) body.push(child)
      return
    }
    const name = (child.type as { displayName?: string }).displayName
    if (name === 'DialogHeader') header.push(child)
    else if (name === 'DialogFooter') footer.push(child)
    else body.push(child)
  })

  return { header, footer, body }
}

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/60 backdrop-blur-sm', className)}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: DialogSize
  showClose?: boolean
}

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size = 'md', showClose = true, ...props }, ref) => {
  const { header, footer, body } = partitionDialogChildren(children)
  const bodyUsesDialogBody = body.some(
    (child) => isValidElement(child) && (child.type as { displayName?: string }).displayName === 'DialogBody'
  )

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col',
          'max-h-[min(85dvh,900px)] overflow-hidden rounded-lg border border-tollerud-border/30',
          'bg-tollerud-noir-900 shadow-xl',
          'data-[state=open]:animate-none data-[state=closed]:animate-none',
          dialogSizes[size],
          className
        )}
        {...props}
      >
        {header}
        {body.length > 0 ? (
          bodyUsesDialogBody ? (
            body
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{body}</div>
          )
        ) : null}
        {footer}
        {showClose ? (
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm p-1 text-tollerud-text-muted transition-colors duration-fast hover:text-tollerud-foreground tollerud-focus-ring">
            <X className="h-4 w-4" aria-hidden />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'shrink-0 border-b border-tollerud-border/30 px-6 py-4 pr-12 text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogBody = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('min-h-0 flex-1 overflow-y-auto px-6 py-4', className)} {...props} />
)
DialogBody.displayName = 'DialogBody'

const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex shrink-0 flex-col-reverse gap-2 border-t border-tollerud-border/30 px-6 py-4 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-base font-semibold text-tollerud-foreground', className)}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-tollerud-text-secondary', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

export interface DialogPanelProps {
  open: boolean
  onClose?: () => void
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: DialogSize
  showClose?: boolean
}

/** Controlled dialog with title, body, and footer slots — same ergonomics as `Drawer`. */
function DialogPanel({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showClose = true,
}: DialogPanelProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent size={size} showClose={showClose}>
        {title || description ? (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        ) : null}
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  )
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPanel,
}
