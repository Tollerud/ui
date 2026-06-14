import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type ClusterGap = 'xs' | 'sm' | 'md' | 'lg'
export type ClusterAlign = 'start' | 'center' | 'end' | 'stretch'
export type ClusterJustify = 'start' | 'center' | 'end' | 'between'

export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'nav' | 'header' | 'footer'
  gap?: ClusterGap
  align?: ClusterAlign
  justify?: ClusterJustify
}

const gaps: Record<ClusterGap, string> = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

const alignments: Record<ClusterAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const justifications: Record<ClusterJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

const Cluster = forwardRef<HTMLDivElement, ClusterProps>(
  (
    { as: Tag = 'div', gap = 'md', align = 'center', justify = 'start', className, ...props },
    ref
  ) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          'flex flex-wrap',
          gaps[gap],
          alignments[align],
          justifications[justify],
          className
        )}
        {...props}
      />
    )
  }
)
Cluster.displayName = 'Cluster'

export { Cluster }
