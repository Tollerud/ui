'use client'

import { type HTMLAttributes, forwardRef, useId } from 'react'
import { Select as BaseSelect } from '@base-ui/react/select'
import { cn } from '@/lib/utils'
import { formFieldTriggerVariants } from '@/lib/form-field-variants'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string
  error?: string
  placeholder?: string
  options?: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  /** `inline` keeps the label on one row with the trigger — for dense toolbars and table footers. */
  layout?: 'stacked' | 'inline'
  size?: 'md' | 'sm'
  required?: boolean
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ className, label, error, placeholder, options = [], value, onChange, layout = 'stacked', size = 'md', required, ...props }, ref) => {
    const triggerId = useId()
    const autoErrorId = useId()
    const errorId = error ? autoErrorId : undefined
    const selectedOption = options.find((o) => o.value === value)

    return (
      <div
        ref={ref}
        className={cn(layout === 'inline' ? 'flex items-center gap-2' : 'flex flex-col gap-1.5')}
        {...props}
      >
        {label && (
          <label
            htmlFor={triggerId}
            className={cn(
              'shrink-0 font-medium text-tollerud-text-muted text-xs',
              layout === 'inline' && 'mb-0',
            )}
          >
            {label}
            {required && <span aria-hidden="true" className="ml-0.5 text-tollerud-error">*</span>}
          </label>
        )}
        <div className={cn('relative', layout === 'inline' && 'min-w-0')}>
          <BaseSelect.Root items={options} value={value ?? null} onValueChange={(next) => onChange?.(next ?? '')} required={required}>
            <BaseSelect.Trigger
              id={triggerId}
              aria-describedby={errorId}
              aria-label={layout === 'inline' && label ? `${label}: ${selectedOption?.label ?? placeholder ?? 'Select'}` : undefined}
              className={cn(formFieldTriggerVariants({ size, error: Boolean(error) }), className)}
            >
              <BaseSelect.Value placeholder={placeholder || 'Select…'} />
              <BaseSelect.Icon className="h-4 w-4 text-tollerud-text-muted transition-transform duration-fast flex-shrink-0 data-[popup-open]:rotate-180">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </BaseSelect.Icon>
            </BaseSelect.Trigger>
            <BaseSelect.Portal>
              <BaseSelect.Positioner
                sideOffset={4}
                className="pointer-events-auto z-50 outline-none"
                style={{ pointerEvents: 'auto' }}
              >
                <BaseSelect.Popup className="max-h-[240px] overflow-y-auto py-1 rounded-lg border border-tollerud-border bg-tollerud-surface-overlay">
                  {options.length === 0 && (
                    <div className="px-3 py-2 text-xs text-tollerud-text-muted text-center">
                      No options
                    </div>
                  )}
                  {options.map((opt) => (
                    <BaseSelect.Item
                      key={opt.value}
                      value={opt.value}
                      className={cn(
                        'w-full text-sm text-left px-3 py-2 transition-colors duration-fast cursor-pointer',
                        'text-tollerud-text-primary data-[selected]:text-tollerud-yellow data-[highlighted]:bg-tollerud-noir-700'
                      )}
                    >
                      <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                    </BaseSelect.Item>
                  ))}
                </BaseSelect.Popup>
              </BaseSelect.Positioner>
            </BaseSelect.Portal>
          </BaseSelect.Root>
        </div>
        {error && (
          <p id={errorId} className="text-xs text-tollerud-error mt-0.5">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
