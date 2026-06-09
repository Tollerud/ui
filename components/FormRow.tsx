'use client'

import { type HTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode
  /** Hint text rendered below the label */
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  /** Forwarded to the label's `htmlFor` — should match the control's `id` */
  htmlFor?: string
}

const FormRow = forwardRef<HTMLDivElement, FormRowProps>(
  ({ className, label, description, error, required, htmlFor, children, ...props }, ref) => {
    const autoId = useId()
    const descriptionId = description ? `${autoId}-description` : undefined
    const errorId = error ? `${autoId}-error` : undefined

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
        {label && (
          <label htmlFor={htmlFor} className="text-sm font-medium text-tollerud-text-primary">
            {label}
            {required && <span className="ml-0.5 text-tollerud-error">*</span>}
          </label>
        )}
        {description && (
          <p id={descriptionId} className="text-xs text-tollerud-text-muted">
            {description}
          </p>
        )}
        <div aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}>{children}</div>
        {error && (
          <p id={errorId} className="text-xs text-tollerud-error">
            {error}
          </p>
        )}
      </div>
    )
  }
)
FormRow.displayName = 'FormRow'

export { FormRow }
