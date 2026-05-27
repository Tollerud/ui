import { type HTMLAttributes, forwardRef, useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

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
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ className, label, error, placeholder, options = [], value, onChange, ...props }, ref) => {
    const [open, setOpen] = useState(false)
    const [highlightedIdx, setHighlightedIdx] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find((o) => o.value === value)

    // Close on click outside
    useEffect(() => {
      if (!open) return
      const handleClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
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

    return (
      <div className="flex flex-col gap-1.5" ref={ref}>
        {label && (
          <label className="text-xs font-medium text-tollerud-text-muted">
            {label}
          </label>
        )}
        <div ref={containerRef} className="relative">
          {/* Trigger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={open}
            className={cn(
              'font-sans text-sm w-full flex items-center justify-between px-3 py-2.5 rounded-lg',
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

          {/* Dropdown */}
          {open && (
            <div
              ref={listRef}
              role="listbox"
              className={cn(
                'absolute z-10 left-0 right-0 mt-1 py-1',
                'rounded-lg border border-tollerud-border bg-tollerud-surface-overlay',
                'shadow-[0_8px_24px_rgba(0,0,0,0.4)]',
                'max-h-60 overflow-y-auto'
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
            </div>
          )}
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