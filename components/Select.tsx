'use client'

import { type HTMLAttributes, forwardRef, useState, useRef, useEffect, useCallback, useId } from 'react'
import { cn } from '@/lib/utils'
import { FloatingDropdownPortal } from '@/lib/floating-dropdown'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string
  error?: string
  placeholder?: string
  options?: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  /** `inline` keeps the label on one row with the trigger — for dense toolbars and table footers. */
  layout?: 'stacked' | 'inline'
  size?: 'md' | 'sm'
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ className, label, error, placeholder, options = [], value, onChange, layout = 'stacked', size = 'md', ...props }, ref) => {
    const [open, setOpen] = useState(false)
    const [highlightedIdx, setHighlightedIdx] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const outerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find((o) => o.value === value)

    const setOuterRef = useCallback(
      (node: HTMLDivElement | null) => {
        outerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref],
    )

    // Close on click outside
    useEffect(() => {
      if (!open) return
      const handleClick = (e: MouseEvent) => {
        const target = e.target as Node
        if (outerRef.current?.contains(target)) return
        if (listRef.current?.contains(target)) return
        setOpen(false)
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    // Reset highlight when opening
    useEffect(() => {
      if (open) {
        const idx = value ? options.findIndex((o) => o.value === value) : -1
        setHighlightedIdx(idx >= 0 ? idx : 0)
      }
    }, [open, options, value])

    // Scroll highlighted option into view
    useEffect(() => {
      if (open && listRef.current) {
        const item = listRef.current.children[highlightedIdx] as HTMLElement | undefined
        item?.scrollIntoView({ block: 'nearest' })
      }
    }, [open, highlightedIdx])

    const selectOption = useCallback(
      (opt: SelectOption) => {
        onChange?.(opt.value)
        setOpen(false)
      },
      [onChange]
    )

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault()
          setOpen(true)
        }
        return
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          break
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIdx((prev) => Math.min(prev + 1, options.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIdx((prev) => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (options[highlightedIdx]) {
            selectOption(options[highlightedIdx])
          }
          break
      }
    }

    const triggerId = useId()

    return (
      <div
        className={cn(layout === 'inline' ? 'flex items-center gap-2' : 'flex flex-col gap-1.5')}
        ref={setOuterRef}
        {...props}
      >
        {label && (
          <label
            htmlFor={triggerId}
            className={cn(
              'shrink-0 font-medium text-tollerud-text-muted text-xs',
              layout === 'inline' && 'mb-0',
            )}
          >
            {label}
          </label>
        )}
        <div ref={containerRef} className={cn('relative', layout === 'inline' && 'min-w-0')}>
          {/* Trigger */}
          <button
            id={triggerId}
            type="button"
            onClick={() => setOpen(!open)}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={layout === 'inline' && label ? `${label}: ${selectedOption?.label ?? placeholder ?? 'Select'}` : undefined}
            className={cn(
              'font-sans w-full flex items-center justify-between rounded',
              size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2.5 text-sm',
              'bg-tollerud-surface-raised',
              'text-tollerud-text-primary text-left',
              'transition-all duration-150 ease-out cursor-pointer',
              error
                ? 'border-tollerud-error/70 focus:border-tollerud-error focus:shadow-[0_0_0_1px_#EF4444]'
                : 'border-tollerud-border focus:border-tollerud-yellow focus:shadow-[0_0_0_1px_#E8D500]',
              'border hover:border-tollerud-noir-400',
              'focus:outline-none',
              className
            )}
          >
            <span className={cn(!selectedOption && 'text-tollerud-text-muted')}>
              {selectedOption ? selectedOption.label : placeholder || 'Select…'}
            </span>
            <svg
              className={cn(
                'h-4 w-4 text-tollerud-text-muted transition-transform duration-150 flex-shrink-0',
                open && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown — portalled so scroll containers (e.g. DataTable) do not clip */}
          <FloatingDropdownPortal
            open={open}
            anchorRef={containerRef}
            popoverRef={listRef}
            role="listbox"
            placementOptions={{ maxHeight: 240 }}
            className={cn(
              'overflow-y-auto py-1',
              'rounded-lg border border-tollerud-border bg-tollerud-surface-overlay',
            )}
          >
            {options.length === 0 && (
              <div className="px-3 py-2 text-xs text-tollerud-text-muted text-center">
                No options
              </div>
            )}
            {options.map((opt, idx) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => selectOption(opt)}
                onMouseEnter={() => setHighlightedIdx(idx)}
                className={cn(
                  'w-full text-sm text-left px-3 py-2 transition-colors duration-75',
                  'cursor-pointer',
                  opt.value === value
                    ? 'text-tollerud-yellow'
                    : 'text-tollerud-text-primary',
                  idx === highlightedIdx && !(opt.value === value)
                    ? 'bg-tollerud-noir-700'
                    : 'hover:bg-tollerud-noir-700/60',
                  opt.value === value && highlightedIdx === idx && 'bg-tollerud-noir-700'
                )}
              >
                {opt.label}
              </button>
            ))}
          </FloatingDropdownPortal>
        </div>
        {error && (
          <p className="text-xs text-tollerud-error mt-0.5">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }