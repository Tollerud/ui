'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dropdownPlacementClasses, useDropdownPlacement } from '@/lib/dropdown-placement'

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
}

const defaultFormat = (date: Date) =>
  date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
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
}: DatePickerProps) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue)
  const value = isControlled ? valueProp ?? null : internalValue

  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value ?? new Date()))
  const placement = useDropdownPlacement(open, rootRef, panelRef, { maxHeight: 320 })

  const cells = useMemo(() => buildCalendarGrid(viewMonth), [viewMonth])

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [open])

  const select = (date: Date) => {
    if (!isControlled) setInternalValue(date)
    onChange?.(date)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('relative flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-tollerud-text-muted">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          setViewMonth(startOfMonth(value ?? new Date()))
          setOpen((o) => !o)
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded px-3 py-2 text-left text-base',
          'bg-tollerud-surface-raised border',
          'transition-[border-color] duration-[150ms]',
          'focus:outline-none focus:border-tollerud-yellow focus:shadow-[0_0_0_1px_#E8D500]',
          error ? 'border-tollerud-error' : 'border-tollerud-border',
          value ? 'text-tollerud-text-primary' : 'text-tollerud-text-muted',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        <span>{value ? formatDate(value) : placeholder}</span>
        <CalendarIcon size={15} className="text-tollerud-text-muted" />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Choose date"
          className={cn(
            'absolute z-50 w-72 rounded-lg border border-tollerud-border bg-tollerud-surface-overlay p-3 shadow-lg',
            dropdownPlacementClasses(placement),
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
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
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="rounded p-1 text-tollerud-text-secondary hover:bg-tollerud-surface-hover"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-[11px] font-medium text-tollerud-text-muted py-1">
                {d}
              </span>
            ))}
            {cells.map((date, i) => {
              if (!date) return <span key={i} />
              const selected = value ? isSameDay(date, value) : false
              const today = isSameDay(date, new Date())
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(date)}
                  className={cn(
                    'h-8 w-8 rounded-full text-sm transition-colors duration-[150ms]',
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
        </div>
      )}

      {error && <p className="text-xs text-tollerud-error mt-0.5">{error}</p>}
    </div>
  )
}
DatePicker.displayName = 'DatePicker'

export { DatePicker }
