'use client'

import { type ChangeEvent, type InputHTMLAttributes, forwardRef, useCallback, useEffect, useId, useRef } from 'react'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  /**
   * Mixed state — e.g. a select-all checkbox with only some rows selected.
   * Announced as "mixed" by screen readers and shows a dash instead of a
   * checkmark. Visual precedence over `checked`; cleared automatically when
   * the user clicks the checkbox.
   */
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id: idProp, indeterminate, disabled, onChange, value, ...rest }, ref) => {
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

    // Base UI's Checkbox.Root drives the hidden native input's `onChange`
    // internally — listen on the real DOM node so consumers keep the
    // familiar `(e: ChangeEvent<HTMLInputElement>) => void` signature with a
    // real `e.target`.
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
        <BaseCheckbox.Root
          id={id}
          inputRef={setInputRef}
          disabled={disabled}
          indeterminate={indeterminate}
          value={value === undefined ? undefined : String(value)}
          {...(rest as Omit<typeof rest, keyof React.DOMAttributes<HTMLInputElement>>)}
          className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-fast bg-tollerud-surface-raised border-tollerud-border focus-visible:outline-2 focus-visible:outline-tollerud-yellow data-[checked]:bg-tollerud-yellow data-[checked]:border-tollerud-yellow data-[indeterminate]:bg-tollerud-yellow data-[indeterminate]:border-tollerud-yellow group-hover:border-tollerud-text-secondary"
        >
          <BaseCheckbox.Indicator className="pointer-events-none flex items-center justify-center text-tollerud-black data-[indeterminate]:hidden">
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 6l2.5 2.5 4.5-5"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </BaseCheckbox.Indicator>
          <BaseCheckbox.Indicator
            keepMounted
            className="pointer-events-none absolute inset-0 m-auto hidden items-center justify-center text-tollerud-black data-[indeterminate]:flex"
          >
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6h7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
        {label && <span>{label}</span>}
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
