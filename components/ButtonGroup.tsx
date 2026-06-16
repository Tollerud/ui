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
          'tollerud-button-group inline-flex overflow-hidden rounded-lg border border-tollerud-border',
          isHorizontal ? 'flex-row items-stretch' : 'tollerud-button-group--vertical flex-col items-stretch',
          className
        )}
        {...props}
      >
        {items.map((child) => {
          if (!isButtonChild(child)) return child

          return cloneElement(child, {
            size: child.props.size ?? size,
            className: cn(
              child.props.className,
              'tollerud-btn--grouped relative focus-visible:z-10'
            ),
          })
        })}
      </div>
    )
  }
)
ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }
