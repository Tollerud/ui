import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type MainContentWidth = 'narrow' | 'default' | 'wide' | 'full'
export type MainContentSpacing = 'none' | 'sm' | 'md' | 'lg'
export type MainContentDensity = 'comfortable' | 'compact'

export interface MainContentProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'main' | 'div'
  width?: MainContentWidth
  spacing?: MainContentSpacing
  density?: MainContentDensity
}

const widths: Record<MainContentWidth, string> = {
  narrow: 'max-w-[760px]',
  default: 'max-w-[1100px]',
  wide: 'max-w-[1400px]',
  full: 'max-w-none',
}

const spacings: Record<MainContentSpacing, string> = {
  none: 'py-0',
  sm: 'py-6',
  md: 'py-8',
  lg: 'py-12',
}

const MainContent = forwardRef<HTMLDivElement, MainContentProps>(
  (
    {
      as: Tag = 'main',
      width = 'default',
      spacing = 'md',
      density,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Tag
        ref={ref}
        data-density={density ?? undefined}
        className={cn('mx-auto w-full px-6', widths[width], spacings[spacing], className)}
        {...props}
      />
    )
  }
)
MainContent.displayName = 'MainContent'

export { MainContent }
