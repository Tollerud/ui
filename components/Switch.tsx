'use client'

import { type ChangeEvent, type InputHTMLAttributes, forwardRef, useCallback, useEffect, useId, useRef } from 'react'
import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
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
          'inline-flex items-center gap-2.5 cursor-pointer select-none group',
          'text-sm text-tollerud-text-primary',
          disabled && 'opacity-40 pointer-events-none cursor-not-allowed',
          className
        )}
      >
        <BaseSwitch.Root
          id={id}
          inputRef={setInputRef}
          disabled={disabled}
          value={value === undefined ? undefined : String(value)}
          {...(rest as Omit<typeof rest, keyof React.DOMAttributes<HTMLInputElement>>)}
          className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-fast ease-out bg-tollerud-noir-600 group-hover:bg-tollerud-noir-500 data-[checked]:bg-tollerud-yellow data-[checked]:group-hover:bg-tollerud-yellow-warm"
        >
          <BaseSwitch.Thumb className="block h-3.5 w-3.5 translate-x-[3px] rounded-full bg-tollerud-white shadow-sm transition-all duration-fast ease-out data-[checked]:translate-x-[18px] data-[checked]:bg-tollerud-black" />
        </BaseSwitch.Root>
        {label && <span>{label}</span>}
      </label>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
