'use client'

import { type AnchorHTMLAttributes, type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ListCardProps extends HTMLAttributes<HTMLElement> {
  /** When provided, the card renders as an `<a>` with this href. */
  href?: string
  /**
   * `"cheapest"` applies a yellow border tint to flag the best-value item.
   * `false` (default) uses the standard border.
   */
  highlight?: 'cheapest' | false
  /** Open link in a new tab. Only applies when `href` is set. */
  external?: boolean
}

const listCardBase =
  'group flex w-full items-center gap-3 rounded-lg border bg-tollerud-noir-900/40 px-4 py-3 transition-[border-color,background-color] duration-[150ms]'

const listCardBorder = (highlight: ListCardProps['highlight']) =>
  highlight === 'cheapest'
    ? 'border-tollerud-yellow/30 hover:border-tollerud-yellow/60'
    : 'border-tollerud-noir-800 hover:border-tollerud-noir-600'

const ListCard = forwardRef<HTMLElement, ListCardProps>(
  ({ className, href, highlight = false, external = false, children, ...props }, ref) => {
    const classes = cn(listCardBase, listCardBorder(highlight), className)

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className={cn(classes, 'no-underline')}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      )
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={classes}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    )
  },
)
ListCard.displayName = 'ListCard'

export { ListCard }
