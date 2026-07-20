import { type HTMLAttributes, forwardRef } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current 1-indexed page */
  page: number
  /** Total number of pages */
  pageCount: number
  /** Called with the next page number when the user navigates */
  onChange: (page: number) => void
  /** Number of sibling pages to show on either side of the current page */
  siblingCount?: number
}

function getPageRange(page: number, pageCount: number, siblingCount: number): (number | 'ellipsis')[] {
  const totalVisible = siblingCount * 2 + 5
  if (pageCount <= totalVisible) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }

  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, pageCount)

  const range: (number | 'ellipsis')[] = [1]
  if (left > 2) range.push('ellipsis')
  for (let p = left === 1 ? 2 : left; p <= (right === pageCount ? pageCount - 1 : right); p++) {
    range.push(p)
  }
  if (right < pageCount - 1) range.push('ellipsis')
  if (pageCount > 1) range.push(pageCount)
  return range
}

const navButtonClasses =
  'inline-flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm transition-colors duration-fast disabled:opacity-40 disabled:pointer-events-none'

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ className, page, pageCount, onChange, siblingCount = 1, ...props }, ref) => {
    const range = getPageRange(page, pageCount, siblingCount)

    return (
      <nav ref={ref} aria-label="Pagination" className={cn('flex items-center gap-1', className)} {...props}>
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={cn(navButtonClasses, 'text-tollerud-text-secondary hover:bg-tollerud-surface-hover')}
        >
          <ChevronLeft size={16} />
        </button>

        {range.map((item, i) =>
          item === 'ellipsis' ? (
            <span key={`e-${i}`} className="inline-flex h-8 w-8 items-center justify-center text-tollerud-text-muted">
              <MoreHorizontal size={16} />
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onChange(item)}
              className={cn(
                navButtonClasses,
                item === page
                  ? 'bg-tollerud-yellow text-tollerud-noir-black font-medium'
                  : 'text-tollerud-text-secondary hover:bg-tollerud-surface-hover'
              )}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          className={cn(navButtonClasses, 'text-tollerud-text-secondary hover:bg-tollerud-surface-hover')}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    )
  }
)
Pagination.displayName = 'Pagination'

export { Pagination }
