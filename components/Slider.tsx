'use client'

import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  /** Show the current numeric value next to the label */
  showValue?: boolean
  onChange?: (value: number) => void
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, showValue, id: idProp, value, defaultValue, min = 0, max = 100, onChange, ...props }, ref) => {
    const autoId = useId()
    const id = idProp ?? autoId
    const current = value ?? defaultValue ?? min

    return (
      <div className="flex flex-col gap-1.5">
        {(label || showValue) && (
          <div className="flex items-center justify-between text-xs">
            {label && (
              <label htmlFor={id} className="font-medium text-tollerud-text-muted">
                {label}
              </label>
            )}
            {showValue && <span className="text-tollerud-text-secondary tabular-nums">{current}</span>}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className={cn(
            'h-1.5 w-full cursor-pointer appearance-none rounded-full bg-tollerud-surface-raised accent-tollerud-yellow',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-tollerud-yellow [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-tollerud-noir-black',
            '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-tollerud-yellow [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-tollerud-noir-black [&::-moz-range-thumb]:cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tollerud-yellow/50',
            'disabled:opacity-40 disabled:pointer-events-none',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }
