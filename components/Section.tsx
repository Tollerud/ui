import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type SectionSize = 'sm' | 'md' | 'lg' | 'hero'
export type SectionWidth = 'narrow' | 'default' | 'wide' | 'full'

export interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'section' | 'div' | 'article' | 'header' | 'footer'
  size?: SectionSize
  width?: SectionWidth
}

const sizes: Record<SectionSize, string> = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  hero: 'py-20 md:py-28',
}

const widths: Record<SectionWidth, string> = {
  narrow: 'max-w-[760px]',
  default: 'max-w-[1100px]',
  wide: 'max-w-[1400px]',
  full: 'max-w-none',
}

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ as: Tag = 'section', size = 'md', width = 'default', className, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn('mx-auto w-full px-6', sizes[size], widths[width], className)}
        {...props}
      />
    )
  }
)
Section.displayName = 'Section'

export { Section }
