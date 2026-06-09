'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  /** Filter predicate, defaults to a case-insensitive substring match on the label */
  filter?: (option: ComboboxOption, query: string) => boolean
  className?: string
  disabled?: boolean
}

const defaultFilter = (option: ComboboxOption, query: string) =>
  option.label.toLowerCase().includes(query.toLowerCase())

function Combobox({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = 'Search…',
  label,
  error,
  filter = defaultFilter,
  className,
  disabled,
}: ComboboxProps) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = isControlled ? valueProp : internalValue

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(() => {
    if (!query) return options
    return options.filter((o) => filter(o, query))
  }, [options, query, filter])

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    function onResize() {
      setOpen(false)
      setQuery('')
    }
    document.addEventListener('mousedown', onClickOutside)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const commit = (option: ComboboxOption) => {
    if (option.disabled) return
    if (!isControlled) setInternalValue(option.value)
    onChange?.(option.value)
    setOpen(false)
    setQuery('')
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const opt = filtered[activeIndex]
      if (opt) commit(opt)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div ref={rootRef} className={cn('relative flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-tollerud-text-muted">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          disabled={disabled}
          value={open ? query : selected?.label ?? ''}
          placeholder={selected ? selected.label : placeholder}
          onFocus={() => {
            setOpen(true)
            setActiveIndex(0)
          }}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(0)
            if (!open) setOpen(true)
          }}
          onKeyDown={onKeyDown}
          className={cn(
            'w-full font-sans text-base px-3 py-2 pr-9 rounded',
            'bg-tollerud-surface-raised border',
            'text-tollerud-text-primary placeholder:text-tollerud-text-muted',
            'transition-[border-color] duration-[150ms]',
            'focus:outline-none focus:border-tollerud-yellow focus:shadow-[0_0_0_1px_#E8D500]',
            error ? 'border-tollerud-error' : 'border-tollerud-border',
            disabled && 'opacity-50 pointer-events-none'
          )}
        />
        <ChevronDown
          size={15}
          className={cn(
            'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-tollerud-text-muted transition-transform duration-[150ms]',
            open && 'rotate-180'
          )}
        />
      </div>

      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute top-full z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-tollerud-border bg-tollerud-surface-overlay py-1 shadow-lg"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-tollerud-text-muted">No results</li>
          )}
          {filtered.map((option, i) => {
            const isSelected = option.value === value
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault()
                  commit(option)
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  'flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer',
                  i === activeIndex ? 'bg-tollerud-surface-hover text-tollerud-text-primary' : 'text-tollerud-text-secondary',
                  option.disabled && 'opacity-40 pointer-events-none'
                )}
              >
                {option.label}
                {isSelected && <Check size={14} className="text-tollerud-yellow" />}
              </li>
            )
          })}
        </ul>
      )}

      {error && <p className="text-xs text-tollerud-error mt-0.5">{error}</p>}
    </div>
  )
}
Combobox.displayName = 'Combobox'

export { Combobox }
