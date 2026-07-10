import {
  Children,
  type HTMLAttributes,
  forwardRef,
  isValidElement,
  type ReactNode,
} from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `true` — yellow border tint (`border-tollerud-yellow/25`), no fill.
   * `"filled"` — yellow border + subtle yellow background fill (`bg-tollerud-yellow/5`). Use for callout boxes, cheapest-item highlights, and CTAs.
   */
  accent?: boolean | 'filled'
  density?: 'comfortable' | 'compact'
  /** Render as the single child element instead of a `<div>`, merging props and styles onto it. */
  asChild?: boolean
}

export type CardChangeDirection = 'up' | 'down' | 'flat'

export interface CardChangeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Change label — defaults to `—` when `direction` is `flat`. */
  value?: string
  direction: CardChangeDirection
  /** Override the color. Omit to use the default (up=success, down=error, flat=info). */
  tone?: 'success' | 'error' | 'warning' | 'info' | 'accent'
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Trailing header content — change chip, buttons, badge, etc. */
  actions?: ReactNode
}

const STRUCTURED_CARD_PARTS = new Set([
  'CardHeader',
  'CardTitle',
  'CardDescription',
  'CardContent',
  'CardFooter',
])

function usesStructuredLayout(children: ReactNode) {
  let structured = false
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    const name = (child.type as { displayName?: string }).displayName
    if (name && STRUCTURED_CARD_PARTS.has(name)) structured = true
  })
  return structured
}

const cardRegionPadding =
  'px-6 py-4 group-data-[density=compact]/card:px-3 group-data-[density=compact]/card:py-3'

const cardBodyBg =
  'bg-tollerud-surface-raised group-data-[accent=filled]/card:bg-tollerud-yellow/5'

/** Neutral band by default; subtle yellow tint when `accent`, stronger when `accent="filled"`. */
const cardBandBg =
  'bg-[color-mix(in_srgb,var(--tollerud-black)_6%,var(--tollerud-surface-raised))] group-data-[accent=accent]/card:bg-[color-mix(in_srgb,var(--tollerud-yellow)_4%,var(--tollerud-surface-raised))] group-data-[accent=filled]/card:bg-[color-mix(in_srgb,var(--tollerud-black)_5%,var(--tollerud-yellow)_5%)]'

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent, density, asChild = false, children, ...props }, ref) => {
    const structured = usesStructuredLayout(children)
    const Comp = asChild ? Slot : 'div'
    return (
      <Comp
        ref={ref}
        data-density={density ?? undefined}
        data-accent={accent === 'filled' ? 'filled' : accent ? 'accent' : undefined}
        className={cn(
          'group/card rounded-lg border bg-tollerud-surface-raised transition-[border-color,padding] duration-[150ms]',
          structured ? 'flex flex-col overflow-hidden p-0' : 'p-6',
          !structured && '[[data-density=compact]_&]:p-3',
          !structured && density === 'compact' && 'p-3',
          accent ? 'border-tollerud-yellow/25' : 'border-tollerud-border',
          accent === 'filled' && 'bg-tollerud-yellow/5',
          'hover:border-tollerud-noir-500',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Card.displayName = 'Card'

const CardChange = forwardRef<HTMLSpanElement, CardChangeProps>(
  ({ className, value, direction, tone, ...props }, ref) => {
    const label = value ?? (direction === 'flat' ? '—' : undefined)

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-0.5 text-[11px] font-semibold whitespace-nowrap',
          tone === 'success'
            ? 'text-tollerud-success'
            : tone === 'error'
              ? 'text-tollerud-error'
              : tone === 'warning'
                ? 'text-tollerud-warning'
                : tone === 'info'
                  ? 'text-tollerud-info'
                  : tone === 'accent'
                    ? 'text-tollerud-yellow'
                    : direction === 'up'
                      ? 'text-tollerud-success'
                      : direction === 'down'
                        ? 'text-tollerud-error'
                        : 'text-tollerud-info',
          className
        )}
        {...props}
      >
        {direction === 'flat' ? (
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M5 12h14" />
          </svg>
        ) : (
          <svg
            className={cn('h-3 w-3', direction === 'up' && 'rotate-180')}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        )}
        {label}
      </span>
    )
  }
)
CardChange.displayName = 'CardChange'

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, actions, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'shrink-0 border-b border-tollerud-border/20',
        cardBandBg,
        cardRegionPadding,
        className
      )}
      {...props}
    >
      {actions ? (
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">{children}</div>
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </div>
      ) : (
        children
      )}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-sm font-semibold leading-none text-tollerud-text-primary', className)}
      {...props}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-tollerud-text-secondary', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex-1', cardBodyBg, cardRegionPadding, className)}
      {...props}
    />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex shrink-0 flex-wrap items-center gap-2 border-t border-tollerud-border/20',
        cardBandBg,
        cardRegionPadding,
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardChange,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}
