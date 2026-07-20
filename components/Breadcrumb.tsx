import { type HTMLAttributes, Fragment, forwardRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: React.ReactNode
  href?: string
  onClick?: () => void
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: BreadcrumbItem[]
  /** Custom separator (defaults to a chevron) */
  separator?: React.ReactNode
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn('text-sm', className)} {...props}>
        <ol className="flex items-center gap-1.5 flex-wrap">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            const content =
              !isLast && (item.href || item.onClick) ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className="text-tollerud-text-secondary hover:text-tollerud-text-primary transition-colors duration-fast"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'text-tollerud-text-primary font-medium' : 'text-tollerud-text-secondary'}
                >
                  {item.label}
                </span>
              )

            return (
              <Fragment key={i}>
                <li className="flex items-center gap-1.5">{content}</li>
                {!isLast && (
                  <li aria-hidden="true" className="flex items-center text-tollerud-text-muted">
                    {separator ?? <ChevronRight size={14} />}
                  </li>
                )}
              </Fragment>
            )
          })}
        </ol>
      </nav>
    )
  }
)
Breadcrumb.displayName = 'Breadcrumb'

export { Breadcrumb }
