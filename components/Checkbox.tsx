'use client'

import { type InputHTMLAttributes, forwardRef, useCallback, useEffect, useId, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  /**
   * Mixed state — e.g. a select-all checkbox with only some rows selected.
   * Sets the native `indeterminate` property (announced as "mixed" by screen
   * readers) and shows a dash instead of a checkmark. Visual precedence over
   * `checked`; cleared automatically when the user clicks the checkbox.
   */
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id: idProp, indeterminate, ...props }, ref) => {
    const autoId = useId()
    const id = idProp ?? autoId
    const internalRef = useRef<HTMLInputElement>(null)

    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    // `indeterminate` is a property, not an attribute — it must be set on the DOM node.
    useEffect(() => {
      if (internalRef.current) internalRef.current.indeterminate = Boolean(indeterminate)
    }, [indeterminate])

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
            ref={setRef}
            id={id}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          {/* Custom box */}
          <span
            className={cn(
              'relative h-4 w-4 rounded border transition-all duration-fast',
              'flex items-center justify-center',
              'bg-tollerud-surface-raised border-tollerud-border',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-tollerud-yellow',
              'peer-checked:bg-tollerud-yellow peer-checked:border-tollerud-yellow',
              'peer-checked:[&_.tollerud-checkbox-check]:opacity-100',
              'peer-indeterminate:bg-tollerud-yellow peer-indeterminate:border-tollerud-yellow',
              'peer-indeterminate:[&_.tollerud-checkbox-check]:opacity-0',
              'peer-indeterminate:[&_.tollerud-checkbox-dash]:opacity-100',
              'group-hover:border-tollerud-text-secondary'
            )}
          >
            {/* Checkmark SVG — visible when checked (via peer on sibling input) */}
            <svg
              className="tollerud-checkbox-check pointer-events-none h-3 w-3 text-tollerud-black opacity-0 transition-opacity duration-fast"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.5 6l2.5 2.5 4.5-5"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Dash SVG — visible when indeterminate */}
            <svg
              className="tollerud-checkbox-dash pointer-events-none absolute inset-0 m-auto h-3 w-3 text-tollerud-black opacity-0 transition-opacity duration-fast"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.5 6h7"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </span>
        </span>
        {label && <span>{label}</span>}
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
