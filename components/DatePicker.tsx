'use client'

import { type KeyboardEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Popover as BasePopover } from '@base-ui/react/popover'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formFieldTriggerVariants } from '@/lib/form-field-variants'

export interface DatePickerProps {
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date | null) => void
  label?: string
  error?: string
  placeholder?: string
  /** Format a date for display in the input (defaults to locale short date) */
  formatDate?: (date: Date) => string
  className?: string
  disabled?: boolean
  required?: boolean
}

const defaultFormat = (date: Date) =>
  date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function clampToMonth(date: Date, monthDate: Date) {
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
  return new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.min(date.getDate(), daysInMonth))
}

function buildCalendarGrid(monthDate: Date): (Date | null)[] {
  const first = startOfMonth(monthDate)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), d))
  return cells
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function DatePicker({
  value: valueProp,
  defaultValue = null,
  onChange,
  label,
  error,
  placeholder = 'Select a date',
  formatDate = defaultFormat,
  className,
  disabled,
  required,
}: DatePickerProps) {
  const id = useId()
  const autoErrorId = useId()
  const errorId = error ? autoErrorId : undefined
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue)
  const value = isControlled ? valueProp ?? null : internalValue

  const [open, setOpen] = useState(false)
  const [focusedDate, setFocusedDate] = useState(() => value ?? new Date())
  const viewMonth = useMemo(() => startOfMonth(focusedDate), [focusedDate])
  const dayRefs = useRef(new Map<string, HTMLButtonElement>())

  const cells = useMemo(() => buildCalendarGrid(viewMonth), [viewMonth])

  useEffect(() => {
    dayRefs.current.get(dateKey(focusedDate))?.focus()
  }, [focusedDate])

  const select = (date: Date) => {
    if (!isControlled) setInternalValue(date)
    onChange?.(date)
    setOpen(false)
  }

  const moveFocus = useCallback((next: Date) => {
    setFocusedDate(next)
  }, [])

  const onGridKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const base = focusedDate
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        moveFocus(new Date(base.getFullYear(), base.getMonth(), base.getDate() + 1))
        break
      case 'ArrowLeft':
        e.preventDefault()
        moveFocus(new Date(base.getFullYear(), base.getMonth(), base.getDate() - 1))
        break
      case 'ArrowDown':
        e.preventDefault()
        moveFocus(new Date(base.getFullYear(), base.getMonth(), base.getDate() + 7))
        break
      case 'ArrowUp':
        e.preventDefault()
        moveFocus(new Date(base.getFullYear(), base.getMonth(), base.getDate() - 7))
        break
      case 'Home':
        e.preventDefault()
        moveFocus(new Date(base.getFullYear(), base.getMonth(), base.getDate() - base.getDay()))
        break
      case 'End':
        e.preventDefault()
        moveFocus(new Date(base.getFullYear(), base.getMonth(), base.getDate() + (6 - base.getDay())))
        break
      case 'PageUp': {
        e.preventDefault()
        const prevMonth = new Date(base.getFullYear(), base.getMonth() - 1, 1)
        moveFocus(clampToMonth(base, prevMonth))
        break
      }
      case 'PageDown': {
        e.preventDefault()
        const nextMonth = new Date(base.getFullYear(), base.getMonth() + 1, 1)
        moveFocus(clampToMonth(base, nextMonth))
        break
      }
    }
  }

  return (
    <div className={cn('relative flex flex-col gap-1')}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-tollerud-text-muted">
          {label}
          {required && <span aria-hidden="true" className="ml-0.5 text-tollerud-error">*</span>}
        </label>
      )}

      <BasePopover.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (next) setFocusedDate(value ?? new Date())
        }}
      >
        <BasePopover.Trigger
          id={id}
          disabled={disabled}
          aria-describedby={errorId}
          className={cn(
            formFieldTriggerVariants({ error: Boolean(error) }),
            !value && 'text-tollerud-text-muted',
            className
          )}
        >
          <span>{value ? formatDate(value) : placeholder}</span>
          <CalendarIcon size={15} className="text-tollerud-text-muted" />
        </BasePopover.Trigger>

        <BasePopover.Portal>
          <BasePopover.Positioner
            sideOffset={4}
            className="pointer-events-auto z-50 outline-none"
            style={{ pointerEvents: 'auto' }}
          >
            <BasePopover.Popup
              aria-label="Choose date"
              initialFocus={() => dayRefs.current.get(dateKey(focusedDate)) ?? true}
              className="w-[288px] rounded-lg border border-tollerud-border bg-tollerud-surface-overlay p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => moveFocus(clampToMonth(focusedDate, new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)))}
                  className="rounded p-1 text-tollerud-text-secondary hover:bg-tollerud-surface-hover"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-tollerud-text-primary">
                  {viewMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => moveFocus(clampToMonth(focusedDate, new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)))}
                  className="rounded p-1 text-tollerud-text-secondary hover:bg-tollerud-surface-hover"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div
                role="group"
                aria-label={viewMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                className="grid grid-cols-7 gap-1 text-center"
              >
                {WEEKDAYS.map((d) => (
                  <span key={d} className="text-[11px] font-medium text-tollerud-text-muted py-1" aria-hidden="true">
                    {d}
                  </span>
                ))}
                {cells.map((date, i) => {
                  if (!date) return <span key={i} />
                  const selected = value ? isSameDay(date, value) : false
                  const today = isSameDay(date, new Date())
                  const isFocusable = isSameDay(date, focusedDate)
                  return (
                    <button
                      key={i}
                      ref={(node) => {
                        const key = dateKey(date)
                        if (node) dayRefs.current.set(key, node)
                        else dayRefs.current.delete(key)
                      }}
                      type="button"
                      tabIndex={isFocusable ? 0 : -1}
                      aria-pressed={selected}
                      aria-current={today ? 'date' : undefined}
                      onClick={() => select(date)}
                      onFocus={() => setFocusedDate(date)}
                      onKeyDown={onGridKeyDown}
                      className={cn(
                        'h-8 w-8 rounded-full text-sm transition-colors duration-fast',
                        selected
                          ? 'bg-tollerud-yellow text-tollerud-noir-black font-medium'
                          : 'text-tollerud-text-secondary hover:bg-tollerud-surface-hover',
                        !selected && today && 'ring-1 ring-tollerud-yellow/40'
                      )}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </BasePopover.Popup>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>

      {error && <p id={errorId} className="text-xs text-tollerud-error mt-0.5">{error}</p>}
    </div>
  )
}
DatePicker.displayName = 'DatePicker'

export { DatePicker }
