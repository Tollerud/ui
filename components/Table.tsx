import {
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  forwardRef,
} from 'react'
import { cn } from '@/lib/utils'

/**
 * Static table primitives — plain rows/columns with no built-in sorting, filtering,
 * search, or pagination. Use `DataTable` when you need that interactivity; use
 * `Table` for a fixed comparison table, a summary grid, or any small dataset that
 * doesn't need a toolbar.
 */

export type TableProps = HTMLAttributes<HTMLTableElement>

const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
))
Table.displayName = 'Table'

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('[&_tr]:border-b [&_tr]:border-tollerud-border/30', className)}
      {...props}
    />
  )
)
TableHeader.displayName = 'TableHeader'

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
)
TableBody.displayName = 'TableBody'

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        'border-t border-tollerud-border/30 bg-tollerud-noir-900 font-medium text-tollerud-text-primary',
        className
      )}
      {...props}
    />
  )
)
TableFooter.displayName = 'TableFooter'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Tints the row to draw attention — e.g. the item that triggered a custom override. */
  highlight?: boolean
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, highlight, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-tollerud-border/20 transition-colors',
        highlight && 'bg-tollerud-yellow/[0.03]',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right'
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, align, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-tollerud-text-muted whitespace-nowrap',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

export type TableCellTone = 'success' | 'error' | 'warning' | 'info' | 'accent'

const cellTone: Record<TableCellTone, string> = {
  success: 'text-tollerud-success',
  error: 'text-tollerud-error',
  warning: 'text-tollerud-warning',
  info: 'text-tollerud-info',
  accent: 'text-tollerud-yellow',
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right'
  /** Colors the value to call out a computed or changed figure — e.g. a scaled quantity. */
  tone?: TableCellTone
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align, tone, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'px-3 py-2.5 text-tollerud-text-secondary whitespace-nowrap',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        tone && cn('font-semibold', cellTone[tone]),
        className
      )}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>

const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-3 text-xs text-tollerud-text-muted', className)} {...props} />
  )
)
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
