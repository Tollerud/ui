import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id: idProp, checked, ...props }, ref) => {
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
        <span className="relative inline-flex items-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            role="switch"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          {/* Track */}
          <span
            className={cn(
              'h-5 w-9 rounded-full border transition-colors duration-[200ms]',
              'bg-tia-surface-raised border-tia-border',
              'peer-checked:bg-tia-yellow peer-checked:border-tia-yellow',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-tia-yellow peer-focus-visible:outline-offset-1',
              'group-hover:border-tia-text-secondary'
            )}
          >
            {/* Thumb */}
            <span
              className={cn(
                'block h-4 w-4 rounded-full bg-tia-text-secondary transition-all duration-[200ms]',
                'mt-[1px] ml-[1px]',
                checked && 'translate-x-4 bg-tia-noir-black'
              )}
            />
          </span>
        </span>
        {label && <span>{label}</span>}
      </label>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }