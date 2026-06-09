'use client'

import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          {/* Custom box */}
          <span
            className={cn(
              'h-4 w-4 rounded border transition-all duration-[150ms]',
              'flex items-center justify-center',
              'bg-tollerud-surface-raised border-tollerud-border',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-tollerud-yellow',
              'peer-checked:bg-tollerud-yellow peer-checked:border-tollerud-yellow',
              'peer-checked:[&_svg]:opacity-100',
              'group-hover:border-tollerud-text-secondary'
            )}
          >
            {/* Checkmark SVG — visible when checked (via peer on sibling input) */}
            <svg
              className="pointer-events-none h-3 w-3 text-tollerud-black opacity-0 transition-opacity duration-[150ms]"
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
          </span>
        </span>
        {label && <span>{label}</span>}
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }