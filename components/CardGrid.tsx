import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type CardGridColumns = 2 | 3 | 4 | 'auto'
export type CardGridGap = 'md' | 'lg'

export interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section'
  columns?: CardGridColumns
  gap?: CardGridGap
}

const columns: Record<CardGridColumns, string> = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  auto: 'grid-cols-[repeat(auto-fit,minmax(240px,1fr))]',
}

const gaps: Record<CardGridGap, string> = {
  md: 'gap-4',
  lg: 'gap-6',
}

const CardGrid = forwardRef<HTMLDivElement, CardGridProps>(
  ({ as: Tag = 'div', columns: columnCount = 'auto', gap = 'lg', className, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn('grid w-full', columns[columnCount], gaps[gap], className)}
        {...props}
      />
    )
  }
)
CardGrid.displayName = 'CardGrid'

export { CardGrid }
