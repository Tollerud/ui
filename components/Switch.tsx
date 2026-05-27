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
          'inline-flex items-center gap-2.5 cursor-pointer select-none group',
          'text-sm text-tollerud-text-primary',
          props.disabled && 'opacity-40 pointer-events-none cursor-not-allowed',
          className
        )}
      >
        {/* Track */}
        <span
          className={cn(
            'relative inline-flex items-center h-5 w-9 flex-shrink-0 rounded-full',
            'transition-colors duration-200 ease-out',
            checked ? 'bg-tollerud-yellow' : 'bg-tollerud-noir-600',
            'group-hover:bg-tollerud-noir-500',
            checked && 'group-hover:bg-tollerud-yellow-bright',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-tollerud-yellow peer-focus-visible:outline-offset-2'
          )}
        >
          {/* Hidden input (peer) */}
          <input
            ref={ref}
            id={id}
            type="checkbox"
            role="switch"
            checked={checked}
            className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            {...props}
          />
          {/* Thumb */}
          <span
            className={cn(
              'block h-3.5 w-3.5 rounded-full shadow-sm',
              'transition-all duration-200 ease-out',
              checked
                ? 'translate-x-[18px] bg-tollerud-black'
                : 'translate-x-[3px] bg-tollerud-white'
            )}
          />
        </span>
        {label && <span>{label}</span>}
      </label>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }