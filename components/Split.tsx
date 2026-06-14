import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type SplitRatio = 'equal' | 'content' | 'sidebar'
export type SplitGap = 'md' | 'lg' | 'xl'
export type SplitAlign = 'start' | 'center' | 'stretch'

export interface SplitProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section'
  ratio?: SplitRatio
  gap?: SplitGap
  align?: SplitAlign
  reverse?: boolean
}

const ratios: Record<SplitRatio, string> = {
  equal: 'lg:grid-cols-2',
  content: 'lg:grid-cols-[1.35fr_0.65fr]',
  sidebar: 'lg:grid-cols-[0.72fr_1.28fr]',
}

const gaps: Record<SplitGap, string> = {
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

const alignments: Record<SplitAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  stretch: 'items-stretch',
}

const Split = forwardRef<HTMLDivElement, SplitProps>(
  (
    {
      as: Tag = 'div',
      ratio = 'equal',
      gap = 'lg',
      align = 'stretch',
      reverse = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          'grid grid-cols-1',
          ratios[ratio],
          gaps[gap],
          alignments[align],
          reverse && 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1',
          className
        )}
        {...props}
      />
    )
  }
)
Split.displayName = 'Split'

export { Split }
