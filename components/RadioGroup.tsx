'use client'

import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { Radio as BaseRadio } from '@base-ui/react/radio'
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
  children?: ReactNode
  className?: string
  required?: boolean
}

const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ label, error, value, onChange, name, children, className, required }, ref) => {
    const autoErrorId = useId()
    const errorId = error ? autoErrorId : undefined

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
            {required && (
              <span aria-hidden="true" className="ml-0.5 text-tollerud-error">
                *
              </span>
            )}
          </legend>
        )}
        <BaseRadioGroup
          value={value}
          onValueChange={(next) => onChange?.(String(next))}
          name={name}
          required={required}
          className="flex flex-col gap-2"
        >
          {children}
        </BaseRadioGroup>
        {error && (
          <p id={errorId} className="text-xs text-tollerud-error mt-0.5">
            {error}
          </p>
        )}
      </fieldset>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked'> {
  label?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id: idProp, disabled, onChange, value, ...rest }, ref) => {
    const autoId = useId()
    const id = idProp ?? autoId
    const inputRef = useRef<HTMLInputElement | null>(null)

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = node
      },
      [ref]
    )

    useEffect(() => {
      const node = inputRef.current
      if (!node || !onChange) return
      const handleChange = (event: Event) => onChange(event as unknown as ChangeEvent<HTMLInputElement>)
      node.addEventListener('change', handleChange)
      return () => node.removeEventListener('change', handleChange)
    }, [onChange])

    return (
      <label
        htmlFor={id}
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer select-none group',
          'text-sm text-tollerud-text-primary',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
      >
        <BaseRadio.Root
          id={id}
          inputRef={setInputRef}
          disabled={disabled}
          value={value === undefined ? '' : String(value)}
          {...(rest as Omit<typeof rest, keyof React.DOMAttributes<HTMLInputElement>>)}
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-fast bg-tollerud-surface-raised border-tollerud-border focus-visible:outline-2 focus-visible:outline-tollerud-yellow data-[checked]:border-tollerud-yellow group-hover:border-tollerud-text-secondary"
        >
          <BaseRadio.Indicator className="h-2 w-2 rounded-full bg-tollerud-yellow" />
        </BaseRadio.Root>
        {label && <span>{label}</span>}
      </label>
    )
  }
)
Radio.displayName = 'Radio'

export { RadioGroup, Radio }
