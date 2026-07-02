import { type TextareaHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, required, ...props }, ref) => {
    const autoErrorId = useId()
    const errorId = error ? autoErrorId : undefined
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-tollerud-text-muted">
            {label}
            {required && <span aria-hidden="true" className="ml-0.5 text-tollerud-error">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'font-sans text-base px-3 py-2.5 rounded min-h-[80px] resize-y',
            'bg-tollerud-surface-raised border',
            'text-tollerud-text-primary',
            'placeholder:text-tollerud-text-muted',
            'transition-[border-color] duration-[150ms]',
            'focus:outline-none focus:border-tollerud-yellow focus:shadow-[0_0_0_1px_#E8D500]',
            error ? 'border-tollerud-error' : 'border-tollerud-border',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-tollerud-error mt-0.5">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
