import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'header' | 'footer'
  gap?: StackGap
  align?: StackAlign
}

const gaps: Record<StackGap, string> = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

const alignments: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ as: Tag = 'div', gap = 'md', align = 'stretch', className, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn('flex flex-col', gaps[gap], alignments[align], className)}
        {...props}
      />
    )
  }
)
Stack.displayName = 'Stack'

export { Stack }
