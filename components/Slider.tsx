'use client'

import { type InputHTMLAttributes, forwardRef, useCallback, useId, useRef } from 'react'
import { Slider as BaseSlider } from '@base-ui/react/slider'
import { cn } from '@/lib/utils'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  /** Show the current numeric value next to the label */
  showValue?: boolean
  onChange?: (value: number) => void
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    { className, label, showValue, id: idProp, value, defaultValue, min = 0, max = 100, step, disabled, onChange, name, ...rest },
    ref
  ) => {
    const autoId = useId()
    const id = idProp ?? autoId
    const numericMin = Number(min)
    const numericMax = Number(max)
    const numericValue = value !== undefined ? Number(value) : undefined
    const numericDefault = defaultValue !== undefined ? Number(defaultValue) : undefined
    const current = numericValue ?? numericDefault ?? numericMin
    const inputRef = useRef<HTMLInputElement | null>(null)

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = node
      },
      [ref]
    )

    return (
      <label className="flex flex-col gap-1.5">
        {(label || showValue) && (
          <div className="flex items-center justify-between text-xs">
            {label && <span className="font-medium text-tollerud-text-muted">{label}</span>}
            {showValue && <span className="text-tollerud-text-secondary tabular-nums">{current}</span>}
          </div>
        )}
        <BaseSlider.Root
          id={id}
          value={numericValue}
          defaultValue={numericDefault}
          min={numericMin}
          max={numericMax}
          step={step === undefined ? undefined : Number(step)}
          disabled={disabled}
          name={name}
          onValueChange={(next) => onChange?.(next)}
          className={cn('relative', className)}
        >
          <BaseSlider.Control
            className={cn(
              'flex w-full cursor-pointer items-center py-2',
              disabled && 'opacity-40 pointer-events-none'
            )}
          >
            <BaseSlider.Track className="relative h-1.5 w-full rounded-full bg-[var(--muted)]">
              <BaseSlider.Indicator className="absolute h-full rounded-full bg-tollerud-yellow" />
              <BaseSlider.Thumb
                inputRef={setInputRef}
                {...(rest as Omit<typeof rest, keyof React.DOMAttributes<HTMLInputElement>>)}
                className="h-4 w-4 rounded-full border-2 border-[var(--card)] bg-tollerud-yellow shadow-[0_0_0_1px_var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tollerud-yellow/50"
              />
            </BaseSlider.Track>
          </BaseSlider.Control>
        </BaseSlider.Root>
      </label>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }
