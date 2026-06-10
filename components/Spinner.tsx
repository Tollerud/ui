import { type CSSProperties, type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Diameter in pixels */
  size?: number
  style?: CSSProperties
}

const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = 16, style, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cn('tollerud-spinner inline-block shrink-0', className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  )
)
Spinner.displayName = 'Spinner'

export { Spinner }
