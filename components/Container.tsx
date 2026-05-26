import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer'
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, as: Tag = 'div', ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn('mx-auto w-full max-w-[1100px] px-6', className)}
        {...props}
      />
    )
  }
)
Container.displayName = 'Container'

export { Container }
