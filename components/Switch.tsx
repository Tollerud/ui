'use client'

import { type InputHTMLAttributes, forwardRef, useId, useState } from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id: idProp, checked, defaultChecked, onChange, ...props }, ref) => {
    const autoId = useId()
    const id = idProp ?? autoId
    const isControlled = checked !== undefined
    const [internalChecked, setInternalChecked] = useState(!!defaultChecked)
    const isOn = isControlled ? checked : internalChecked

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
        <span
          className={cn(
            'relative inline-flex items-center h-5 w-9 flex-shrink-0 rounded-full',
            'transition-colors duration-fast ease-out',
            isOn ? 'bg-tollerud-yellow group-hover:bg-tollerud-yellow-warm' : 'bg-tollerud-noir-600 group-hover:bg-tollerud-noir-500'
          )}
        >
          <input
            ref={ref}
            id={id}
            type="checkbox"
            role="switch"
            checked={isOn}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            onChange={(e) => {
              if (!isControlled) setInternalChecked(e.target.checked)
              onChange?.(e)
            }}
            {...props}
          />
          <span
            className={cn(
              'block h-3.5 w-3.5 rounded-full shadow-sm pointer-events-none',
              'transition-all duration-fast ease-out',
              isOn ? 'translate-x-[18px] bg-tollerud-black' : 'translate-x-[3px] bg-tollerud-white'
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
