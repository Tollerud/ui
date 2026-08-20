'use client'

import { forwardRef, useCallback, useId, useMemo, useState } from 'react'
import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { Check, ChevronDown, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formFieldTriggerVariants } from '@/lib/form-field-variants'

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
  /**
   * Enables "create a new option" — when set, a `Create "<query>"` row appears at the
   * end of the list whenever the search text has no exact (case-insensitive) label match,
   * so users can add an option that doesn't exist yet without leaving the field. Called
   * with the trimmed query when that row is chosen; return a string to use as the new
   * option's value (e.g. a generated id), or return nothing to use the typed text as both
   * label and value.
   */
  onCreateOption?: (label: string) => string | void
  /** Customizes the create row's label. Defaults to `Create "<query>"`. */
  createOptionLabel?: (query: string) => string
  className?: string
  disabled?: boolean
  required?: boolean
}

const CREATE_VALUE = '__tollerud_combobox_create__'

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
    onCreateOption,
    createOptionLabel = (query) => `Create "${query}"`,
    className,
    disabled,
    required,
  },
  ref
) {
  const id = useId()
  const autoErrorId = useId()
  const errorId = error ? autoErrorId : undefined
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = isControlled ? valueProp : internalValue

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [createdOptions, setCreatedOptions] = useState<ComboboxOption[]>([])

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

  const lookupOptions = useMemo(() => {
    if (createdOptions.length === 0) return allOptions
    return [...allOptions, ...createdOptions.filter((c) => !allOptions.some((o) => o.value === c.value))]
  }, [allOptions, createdOptions])

  const trimmedQuery = query.trim()
  const showCreateOption =
    Boolean(onCreateOption) &&
    trimmedQuery !== '' &&
    !lookupOptions.some((option) => option.label.toLowerCase() === trimmedQuery.toLowerCase())

  const selected = lookupOptions.find((option) => option.value === value)

  const commit = useCallback(
    (optionValue: string) => {
      const option = lookupOptions.find((o) => o.value === optionValue)
      if (!option || option.disabled) return
      if (!isControlled) setInternalValue(option.value)
      onChange?.(option.value)
      setOpen(false)
      setQuery('')
    },
    [isControlled, lookupOptions, onChange]
  )

  const commitCreate = useCallback(() => {
    const newLabel = trimmedQuery
    if (!newLabel) return
    const returned = onCreateOption?.(newLabel)
    const newValue = typeof returned === 'string' && returned ? returned : newLabel
    setCreatedOptions((prev) => (prev.some((o) => o.value === newValue) ? prev : [...prev, { value: newValue, label: newLabel }]))
    if (!isControlled) setInternalValue(newValue)
    onChange?.(newValue)
    setOpen(false)
    setQuery('')
  }, [isControlled, onChange, trimmedQuery, onCreateOption])

  // Root needs the create-row's sentinel value in its own item accounting for
  // keyboard navigation/selection to reach it — grouped mode omits it since
  // Root's `items` can't mix flat and grouped shapes; the create row still
  // renders, just outside Root's filtered-item count in that combination.
  const itemsForRoot = isGrouped
    ? filteredGroups.map((g) => ({ label: g.label, items: g.options }))
    : showCreateOption
      ? [...filtered, { value: CREATE_VALUE, label: createOptionLabel(trimmedQuery) }]
      : filtered

  const triggerClassName = cn(
    formFieldTriggerVariants({ error: Boolean(error) }),
    'pr-9',
    disabled && 'opacity-50 pointer-events-none',
    className
  )

  const renderItem = (option: ComboboxOption) => (
    <BaseCombobox.Item
      key={option.value}
      value={option.value}
      disabled={option.disabled}
      className={cn(
        'flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer text-tollerud-text-secondary',
        'data-[highlighted]:bg-tollerud-surface-hover data-[highlighted]:text-tollerud-text-primary',
        option.disabled && 'opacity-40 pointer-events-none'
      )}
    >
      {option.label}
      {option.value === value && <Check size={14} className="text-tollerud-yellow" />}
    </BaseCombobox.Item>
  )

  const optionList = (
    <>
      {filtered.length === 0 && !showCreateOption && (
        <div className="px-3 py-2 text-sm text-tollerud-text-muted">No results</div>
      )}

      {isGrouped
        ? filteredGroups.map((group) => (
            <BaseCombobox.Group key={group.label} items={group.options} className="pb-1">
              <BaseCombobox.GroupLabel className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-tollerud-text-muted">
                {group.label}
              </BaseCombobox.GroupLabel>
              {group.options.map(renderItem)}
            </BaseCombobox.Group>
          ))
        : filtered.map(renderItem)}

      {showCreateOption && (
        <BaseCombobox.Item
          value={CREATE_VALUE}
          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-tollerud-text-secondary data-[highlighted]:bg-tollerud-surface-hover data-[highlighted]:text-tollerud-text-primary"
        >
          <Plus size={14} className="shrink-0 text-tollerud-yellow" />
          {createOptionLabel(trimmedQuery)}
        </BaseCombobox.Item>
      )}
    </>
  )

  return (
    <div ref={ref} className={cn('relative flex flex-col gap-1')}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-tollerud-text-muted">
          {label}
          {required && <span aria-hidden="true" className="ml-0.5 text-tollerud-error">*</span>}
        </label>
      )}

      <BaseCombobox.Root
        items={isGrouped ? groups?.map((g) => ({ label: g.label, items: g.options })) : allOptions}
        filteredItems={itemsForRoot}
        value={value ? value : null}
        inputValue={query}
        onInputValueChange={(next) => setQuery(next)}
        open={open}
        onOpenChange={setOpen}
        disabled={disabled}
        required={required}
        // 'always' (highlight the first item as soon as the list opens, matching
        // this component's pre-migration behavior) is supported at runtime but
        // narrowed out of Combobox.Root's public prop type, which only exposes
        // boolean — cast around that gap rather than losing the behavior.
        autoHighlight={'always' as unknown as true}
        onValueChange={(next) => {
          if (next === CREATE_VALUE) {
            commitCreate()
          } else if (typeof next === 'string') {
            commit(next)
          } else if (next === null) {
            // Escape-while-closed clears the current selection.
            if (!isControlled) setInternalValue(undefined)
            onChange?.('')
          }
        }}
      >
        <div className="relative">
          {searchPlacement === 'dropdown' ? (
            <BaseCombobox.Trigger
              id={id}
              aria-required={required || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={errorId}
              // The search Input lives inside the popup in this mode, so it
              // doesn't exist yet for Trigger's default focus-to-open behavior
              // to reach — open explicitly instead.
              onClick={() => setOpen((prev) => !prev)}
              className={cn(triggerClassName, 'pr-3')}
            >
              <span className={selected ? 'text-tollerud-text-primary' : 'text-tollerud-text-muted'}>
                {selected?.label ?? placeholder}
              </span>
              <ChevronDown
                size={15}
                className="shrink-0 text-tollerud-text-muted transition-transform duration-fast data-[popup-open]:rotate-180"
              />
            </BaseCombobox.Trigger>
          ) : (
            <>
              <BaseCombobox.Input
                id={id}
                aria-required={required || undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={errorId}
                placeholder={selected ? selected.label : placeholder}
                className={triggerClassName}
              />
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-tollerud-text-muted transition-transform duration-fast"
              />
            </>
          )}
        </div>

        <BaseCombobox.Portal>
          <BaseCombobox.Positioner
            sideOffset={4}
            className="pointer-events-auto z-50 outline-none"
            style={{ pointerEvents: 'auto' }}
          >
            <BaseCombobox.Popup
              // Base UI gives the popup `role="dialog"` when it contains its
              // own search input (searchPlacement="dropdown") since that
              // input isn't the combobox's own anchor — needs its own name.
              aria-label={searchPlacement === 'dropdown' ? label || placeholder : undefined}
              className={cn(
                'rounded-lg border border-tollerud-border bg-tollerud-surface-overlay',
                searchPlacement === 'dropdown' && 'overflow-hidden'
              )}
            >
              {searchPlacement === 'dropdown' && (
                <div className="flex items-center gap-2 border-b border-tollerud-border px-3 py-2">
                  <Search size={13} className="shrink-0 text-tollerud-text-muted" />
                  <BaseCombobox.Input
                    placeholder={placeholder}
                    // pointer-coarse:text-base forces ≥16px on touch devices so iOS
                    // Safari does not auto-zoom (and trigger a scroll) when the field
                    // is focused on open. Desktop keeps the 14px (text-sm) sizing.
                    className="w-full bg-transparent text-sm pointer-coarse:text-base text-tollerud-text-primary placeholder:text-tollerud-text-muted focus:outline-none"
                  />
                </div>
              )}
              <BaseCombobox.List
                className={cn('overflow-auto py-1', searchPlacement === 'dropdown' ? 'max-h-[256px]' : 'max-h-[320px]')}
              >
                {optionList}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>

      {error && <p id={errorId} className="text-xs text-tollerud-error mt-0.5">{error}</p>}
    </div>
  )
})
Combobox.displayName = 'Combobox'

export { Combobox }
