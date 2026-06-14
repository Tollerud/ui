import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type GridColumns = 1 | 2 | 3 | 4 | 'auto'
export type GridGap = 'sm' | 'md' | 'lg'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section'
  columns?: GridColumns
  gap?: GridGap
}

const columns: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  auto: 'grid-cols-[repeat(auto-fit,minmax(220px,1fr))]',
}

const gaps: Record<GridGap, string> = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ as: Tag = 'div', columns: columnCount = 'auto', gap = 'md', className, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn('grid w-full', columns[columnCount], gaps[gap], className)}
        {...props}
      />
    )
  }
)
Grid.displayName = 'Grid'

export { Grid }
