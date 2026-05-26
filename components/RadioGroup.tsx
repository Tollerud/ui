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
          <legend className="text-xs font-medium text-tia-text-muted mb-1">
            {label}
          </legend>
        )}
        <div className="flex flex-col gap-2">{children}</div>
        {error && (
          <p className="text-xs text-tia-error mt-0.5">{error}</p>
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
          'text-sm text-tia-text-primary',
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
              'bg-tia-surface-raised border-tia-border',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-tia-yellow',
              'peer-checked:border-tia-yellow',
              'group-hover:border-tia-text-secondary',
              'flex items-center justify-center'
            )}
          >
            {/* Inner dot */}
            <span
              className={cn(
                'h-2 w-2 rounded-full bg-tia-yellow transition-opacity duration-[150ms]',
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