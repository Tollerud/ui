'use client'

import { type ReactNode } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './Sheet'

export type DrawerSide = 'left' | 'right'

export interface DrawerProps {
  open: boolean
  onClose?: () => void
  side?: DrawerSide
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  /** Panel width in pixels (maps to max-width on SheetContent) */
  width?: number
}

function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  description,
  children,
  footer,
  width = 380,
}: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose?.()}>
      <SheetContent side={side} style={{ maxWidth: width }} className="flex flex-col">
        {(title || description) && (
          <SheetHeader>
            {title ? <SheetTitle>{title}</SheetTitle> : null}
            {description ? <SheetDescription>{description}</SheetDescription> : null}
          </SheetHeader>
        )}
        <div className="flex-1 overflow-y-auto py-4">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-tollerud-border pt-4">
            {footer}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export { Drawer }
