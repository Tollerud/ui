import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
} from 'react'
import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from './Button'

export type ButtonGroupSize = 'sm' | 'md' | 'lg'
export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Default size applied to child buttons that omit `size` */
  size?: ButtonGroupSize
  /** Layout direction — horizontal fuses left-to-right, vertical stacks top-to-bottom */
  orientation?: ButtonGroupOrientation
}

function isButtonChild(child: React.ReactElement): child is ReactElement<ButtonProps> {
  return child.type === Button
}

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, size = 'md', orientation = 'horizontal', children, ...props }, ref) => {
    const items = Children.toArray(children).filter(isValidElement)
    const isHorizontal = orientation === 'horizontal'

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'inline-flex overflow-hidden rounded-lg border border-tollerud-border',
          isHorizontal ? 'flex-row items-stretch' : 'flex-col items-stretch',
          className
        )}
        {...props}
      >
        {items.map((child, index) => {
          if (!isButtonChild(child)) return child

          const isFirst = index === 0
          const isLast = index === items.length - 1

          return cloneElement(child, {
            size: child.props.size ?? size,
            className: cn(
              child.props.className,
              'rounded-none border-0 shadow-none',
              !isFirst && (isHorizontal ? 'border-l border-tollerud-border' : 'border-t border-tollerud-border'),
              'relative focus-visible:z-10',
              isFirst && isHorizontal && 'rounded-l-lg',
              isLast && isHorizontal && 'rounded-r-lg',
              isFirst && !isHorizontal && 'rounded-t-lg',
              isLast && !isHorizontal && 'rounded-b-lg'
            ),
          })
        })}
      </div>
    )
  }
)
ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }
