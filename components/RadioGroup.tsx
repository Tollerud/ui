'use client'

import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface RadioGroupProps {
  /** Group label */
  label?: string
  /** Error message */
  error?: string
  children?: React.ReactNode
  className?: string
}

const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ label, error, children, className }, ref) => {
    const autoId = useId()
    return (
      <fieldset ref={ref} className={cn('flex flex-col gap-1', className)}>
        {label && (
          <legend className="text-xs font-medium text-tollerud-text-muted mb-1">
            {label}
          </legend>
        )}
        <div className="flex flex-col gap-2">{children}</div>
        {error && (
          <p className="text-xs text-tollerud-error mt-0.5">{error}</p>
        )}
      </fieldset>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id: idProp, ...props }, ref) => {
    const autoId = useId()
    const id = idProp ?? autoId

    return (
      <label
        htmlFor={id}
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer select-none group',
          'text-sm text-tollerud-text-primary',
          props.disabled && 'opacity-50 pointer-events-none',
          className
        )}
      >
        <span className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={id}
            type="radio"
            className="peer sr-only"
            {...props}
          />
          {/* Custom radio circle */}
          <span
            className={cn(
              'h-4 w-4 rounded-full border transition-all duration-[150ms]',
              'bg-tollerud-surface-raised border-tollerud-border',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-tollerud-yellow',
              'peer-checked:border-tollerud-yellow',
              'group-hover:border-tollerud-text-secondary',
              'flex items-center justify-center'
            )}
          >
            {/* Inner dot */}
            <span
              className={cn(
                'h-2 w-2 rounded-full bg-tollerud-yellow transition-opacity duration-[150ms]',
                props.checked ? 'opacity-100' : 'opacity-0'
              )}
            />
          </span>
        </span>
        {label && <span>{label}</span>}
      </label>
    )
  }
)
Radio.displayName = 'Radio'

export { RadioGroup, Radio }