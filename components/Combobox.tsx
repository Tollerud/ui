'use client'

import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FloatingDropdownPortal } from '@/lib/floating-dropdown'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxGroup {
  /** Section title shown above options in the dropdown */
  label: string
  options: ComboboxOption[]
}

export interface ComboboxProps {
  /** Flat option list — use when sections are not needed */
  options?: ComboboxOption[]
  /** Grouped options with section titles — takes precedence over `options` when provided */
  groups?: ComboboxGroup[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  /** Filter predicate, defaults to a case-insensitive substring match on the label */
  filter?: (option: ComboboxOption, query: string) => boolean
  /**
   * Where the search input lives.
   * - `'trigger'` (default) — the trigger input doubles as the search field, matching the original behaviour.
   * - `'dropdown'` — the trigger is a button showing the selected value; the search input appears at the top of the dropdown panel.
   */
  searchPlacement?: 'trigger' | 'dropdown'
  className?: string
  disabled?: boolean
  required?: boolean
}

const defaultFilter = (option: ComboboxOption, query: string) =>
  option.label.toLowerCase().includes(query.toLowerCase())

function flattenOptions(options: ComboboxOption[], groups?: ComboboxGroup[]) {
  if (groups && groups.length > 0) {
    return groups.flatMap((group) => group.options)
  }
  return options
}

function filterGroups(
  groups: ComboboxGroup[],
  query: string,
  filter: (option: ComboboxOption, query: string) => boolean
): ComboboxGroup[] {
  if (!query) return groups
  return groups
    .map((group) => ({
      ...group,
      options: group.options.filter((option) => filter(option, query)),
    }))
    .filter((group) => group.options.length > 0)
}

const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(function Combobox(
  {
    options = [],
    groups,
    value: valueProp,
    defaultValue,
    onChange,
    placeholder = 'Search…',
    label,
    error,
    filter = defaultFilter,
    searchPlacement = 'trigger',
    className,
    disabled,
    required,
  },
  ref
) {
  const id = useId()
  const autoErrorId = useId()
  const errorId = error ? autoErrorId : undefined
  const internalRootRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = isControlled ? valueProp : internalValue

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const isGrouped = Boolean(groups && groups.length > 0)
  const allOptions = useMemo(() => flattenOptions(options, groups), [options, groups])

  const filteredGroups = useMemo(() => {
    if (!isGrouped || !groups) return []
    return filterGroups(groups, query, filter)
  }, [groups, isGrouped, query, filter])

  const filtered = useMemo(() => {
    if (isGrouped) return filteredGroups.flatMap((group) => group.options)
    if (!query) return options
    return options.filter((option) => filter(option, query))
  }, [filteredGroups, filter, isGrouped, options, query])

  const highlightedIndex =
    filtered.length === 0 ? 0 : Math.min(activeIndex, filtered.length - 1)
  const activeOptionId =
    open && filtered.length > 0 ? `${id}-option-${highlightedIndex}` : undefined

  const selected = allOptions.find((option) => option.value === value)

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      internalRootRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (internalRootRef.current?.contains(target)) return
      if (listRef.current?.contains(target)) return
      setOpen(false)
      setQuery('')
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [open])

  // Keep the highlighted option visible while arrowing through a list taller
  // than the dropdown. The options live in a portal, so resolve them by id.
  useEffect(() => {
    if (!activeOptionId) return
    document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' })
  }, [activeOptionId])

  // Focus the search input as soon as it mounts (the portal renders null until
  // coords are computed, so a dep-effect on `open` always fires one render too
  // early). queueMicrotask defers until after React's layout effects, ensuring
  // FloatingDropdownPortal's useDialogEscapeHatch (useLayoutEffect) has already
  // attached its focusin stopPropagation before the focus event fires.
  const dropdownSearchCallbackRef = useCallback((node: HTMLInputElement | null) => {
    if (node && searchPlacement === 'dropdown') {
      queueMicrotask(() => node.focus())
    }
  }, [searchPlacement])

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
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const option = filtered[highlightedIndex]
      if (option) commit(option)
    } else if (e.key === 'Escape') {
      // Close only the innermost layer: consume the event while the dropdown
      // is open so a surrounding Dialog stays open; let it through otherwise.
      if (open) {
        e.preventDefault()
        e.stopPropagation()
        setOpen(false)
        setQuery('')
      }
    }
  }

  let flatIndex = 0

  const optionList = (
    <ul className="m-0 list-none p-0">
      {filtered.length === 0 && (
        <li className="px-3 py-2 text-sm text-tollerud-text-muted">No results</li>
      )}

      {isGrouped
        ? filteredGroups.map((group) => (
            <li key={group.label} role="presentation">
              <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-tollerud-text-muted">
                {group.label}
              </div>
              <ul role="group" aria-label={group.label}>
                {group.options.map((option) => {
                  const index = flatIndex++
                  const isSelected = option.value === value
                  return (
                    <li
                      key={option.value}
                      id={`${id}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        commit(option)
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer',
                        index === highlightedIndex
                          ? 'bg-tollerud-surface-hover text-tollerud-text-primary'
                          : 'text-tollerud-text-secondary',
                        option.disabled && 'opacity-40 pointer-events-none'
                      )}
                    >
                      {option.label}
                      {isSelected && <Check size={14} className="text-tollerud-yellow" />}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))
        : filtered.map((option, index) => {
            const isSelected = option.value === value
            return (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault()
                  commit(option)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer',
                  index === highlightedIndex
                    ? 'bg-tollerud-surface-hover text-tollerud-text-primary'
                    : 'text-tollerud-text-secondary',
                  option.disabled && 'opacity-40 pointer-events-none'
                )}
              >
                {option.label}
                {isSelected && <Check size={14} className="text-tollerud-yellow" />}
              </li>
            )
          })}
    </ul>
  )

  return (
    <div ref={setRootRef} className={cn('relative flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-tollerud-text-muted">
          {label}
          {required && <span aria-hidden="true" className="ml-0.5 text-tollerud-error">*</span>}
        </label>
      )}
      <div ref={anchorRef} className="relative">
        {searchPlacement === 'dropdown' ? (
          <button
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-listbox`}
            aria-haspopup="listbox"
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            disabled={disabled}
            onClick={() => {
              if (open) {
                setOpen(false)
                setQuery('')
              } else {
                setOpen(true)
                setActiveIndex(0)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setOpen(true)
                setActiveIndex(0)
              } else if (e.key === 'Escape') {
                if (open) {
                  e.preventDefault()
                  e.stopPropagation()
                  setOpen(false)
                  setQuery('')
                }
              }
            }}
            className={cn(
              'w-full font-sans text-base px-3 py-2.5 rounded text-left flex items-center justify-between gap-2',
              'bg-tollerud-surface-raised border',
              'transition-[border-color] duration-[150ms]',
              'focus:outline-none focus:border-tollerud-yellow focus:shadow-[0_0_0_1px_var(--tollerud-yellow-warm,#E8D500)]',
              error ? 'border-tollerud-error' : 'border-tollerud-border',
              disabled && 'opacity-50 pointer-events-none'
            )}
          >
            <span className={selected ? 'text-tollerud-text-primary' : 'text-tollerud-text-muted'}>
              {selected?.label ?? placeholder}
            </span>
            <ChevronDown
              size={15}
              className={cn(
                'shrink-0 text-tollerud-text-muted transition-transform duration-[150ms]',
                open && 'rotate-180'
              )}
            />
          </button>
        ) : (
          <>
            <input
              id={id}
              role="combobox"
              aria-expanded={open}
              aria-autocomplete="list"
              aria-controls={`${id}-listbox`}
              aria-activedescendant={activeOptionId}
              aria-required={required || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={errorId}
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
                'w-full font-sans text-base px-3 py-2.5 pr-9 rounded',
                'bg-tollerud-surface-raised border',
                'text-tollerud-text-primary placeholder:text-tollerud-text-muted',
                'transition-[border-color] duration-[150ms]',
                'focus:outline-none focus:border-tollerud-yellow focus:shadow-[0_0_0_1px_var(--tollerud-yellow-warm,#E8D500)]',
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
          </>
        )}
      </div>

      <FloatingDropdownPortal
        open={open}
        anchorRef={anchorRef}
        popoverRef={listRef}
        id={`${id}-listbox`}
        role="listbox"
        placementOptions={{ maxHeight: 320 }}
        onOutsideScroll={() => { setOpen(false); setQuery('') }}
        className={cn(
          'rounded-lg border border-tollerud-border bg-tollerud-surface-overlay',
          searchPlacement === 'dropdown' ? 'overflow-hidden' : 'overflow-auto py-1'
        )}
      >
        {searchPlacement === 'dropdown' ? (
          <>
            <div className="flex items-center gap-2 border-b border-tollerud-border px-3 py-2">
              <Search size={13} className="shrink-0 text-tollerud-text-muted" />
              <input
                ref={dropdownSearchCallbackRef}
                type="text"
                role="combobox"
                aria-expanded={true}
                aria-autocomplete="list"
                aria-controls={`${id}-listbox`}
                aria-activedescendant={activeOptionId}
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent text-sm text-tollerud-text-primary placeholder:text-tollerud-text-muted focus:outline-none"
              />
            </div>
            <div className="overflow-auto py-1" style={{ maxHeight: 256 }}>
              {optionList}
            </div>
          </>
        ) : (
          optionList
        )}
      </FloatingDropdownPortal>

      {error && <p id={errorId} className="text-xs text-tollerud-error mt-0.5">{error}</p>}
    </div>
  )
})
Combobox.displayName = 'Combobox'

export { Combobox }
