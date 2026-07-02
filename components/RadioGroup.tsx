'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  type InputHTMLAttributes,
  type ReactElement,
  forwardRef,
  useId,
} from 'react'
import { cn } from '@/lib/utils'

export interface RadioGroupProps {
  /** Group label */
  label?: string
  /** Error message */
  error?: string
  /** Controlled selected value */
  value?: string
  /** Called with the selected option value */
  onChange?: (value: string) => void
  /** Shared name for native radio grouping (auto-generated if omitted) */
  name?: string
  children?: React.ReactNode
  className?: string
  required?: boolean
}

const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ label, error, value, onChange, name: nameProp, children, className, required }, ref) => {
    const autoName = useId()
    const autoErrorId = useId()
    const name = nameProp ?? autoName
    const errorId = error ? autoErrorId : undefined

    const wired = Children.map(children, (child) => {
      if (!isValidElement(child)) return child
      const radio = child as ReactElement<RadioProps>
      const optionValue = radio.props.value
      if (optionValue === undefined) return child

      const option = String(optionValue)
      const checked = value !== undefined ? value === option : radio.props.checked

      return cloneElement(radio, {
        name,
        ...(checked !== undefined ? { checked } : {}),
        onChange: (e) => {
          radio.props.onChange?.(e)
          if (e.target.checked) onChange?.(option)
        },
      })
    })

    return (
      <fieldset
        ref={ref}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn('flex flex-col gap-1', className)}
      >
        {label && (
          <legend className="text-xs font-medium text-tollerud-text-muted mb-1">
            {label}
            {required && <span aria-hidden="true" className="ml-0.5 text-tollerud-error">*</span>}
          </legend>
        )}
        <div className="flex flex-col gap-2">{wired}</div>
        {error && (
          <p id={errorId} className="text-xs text-tollerud-error mt-0.5">{error}</p>
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
  ({ className, label, id: idProp, checked, ...props }, ref) => {
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
            {...(checked !== undefined ? { checked } : {})}
            className="peer sr-only"
            {...props}
          />
          {/* Custom radio circle */}
          <span
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-[150ms]',
              'bg-tollerud-surface-raised border-tollerud-border',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-tollerud-yellow',
              'peer-checked:border-tollerud-yellow',
              'peer-checked:[&>span]:opacity-100',
              'group-hover:border-tollerud-text-secondary'
            )}
          >
            {/* Inner dot — visible when checked (via peer on sibling input) */}
            <span className="pointer-events-none h-2 w-2 rounded-full bg-tollerud-yellow opacity-0 transition-opacity duration-[150ms]" />
          </span>
        </span>
        {label && <span>{label}</span>}
      </label>
    )
  }
)
Radio.displayName = 'Radio'

export { RadioGroup, Radio }
