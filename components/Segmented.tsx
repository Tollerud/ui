'use client'

import {
  type HTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { ChevronDown } from 'lucide-react'
import { dropdownPlacementClasses, useDropdownPlacement } from '@/lib/dropdown-placement'
import { useIsMobile } from '@/lib/use-mobile'
import { cn } from '@/lib/utils'

export interface SegmentedOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface SegmentedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedOption[]
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md'
  /** On viewports below `md`, show only the selected option until expanded as a dropdown. Desktop unchanged. */
  collapseMobile?: boolean
}

const shellClass =
  'inline-flex items-center gap-0.5 rounded-lg p-1 bg-tollerud-surface-raised border border-tollerud-border'

function segmentButtonClass(active: boolean, size: 'sm' | 'md', disabled?: boolean) {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium leading-none transition-colors duration-[150ms] tollerud-focus-ring',
    size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3.5 text-sm',
    active
      ? 'bg-tollerud-yellow text-tollerud-noir-black'
      : 'text-tollerud-text-secondary hover:text-tollerud-text-primary',
    disabled && 'opacity-40 pointer-events-none',
  )
}

const Segmented = forwardRef<HTMLDivElement, SegmentedProps>(
  (
    {
      className,
      options,
      value,
      onChange,
      size = 'md',
      collapseMobile = false,
      ...props
    },
    ref,
  ) => {
    const listId = useId()
    const isMobile = useIsMobile()
    const [expanded, setExpanded] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)
    const collapse = collapseMobile && isMobile
    const selected = options.find((opt) => opt.value === value)
    const placement = useDropdownPlacement(expanded, rootRef, popoverRef, { maxHeight: 240 })

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref],
    )

    useEffect(() => {
      if (!collapse) setExpanded(false)
    }, [collapse])

    useEffect(() => {
      if (!expanded) return
      function onPointerDown(event: MouseEvent) {
        if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
          setExpanded(false)
        }
      }
      document.addEventListener('mousedown', onPointerDown)
      return () => document.removeEventListener('mousedown', onPointerDown)
    }, [expanded])

    const handleSelect = (next: string) => {
      onChange(next)
      if (collapse) setExpanded(false)
    }

    if (collapse) {
      const selectedLabel =
        typeof selected?.label === 'string' || typeof selected?.label === 'number'
          ? String(selected?.label)
          : value

      return (
        <div ref={setRefs} className={cn('relative inline-flex', className)} {...props}>
          <div className={shellClass}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-haspopup="listbox"
              aria-controls={expanded ? listId : undefined}
              aria-label={`${selectedLabel}, show options`}
              onClick={() => setExpanded((open) => !open)}
              className={cn(segmentButtonClass(true, size), 'gap-1')}
            >
              {selected?.label ?? value}
              <ChevronDown
                size={size === 'sm' ? 14 : 16}
                aria-hidden
                className={cn('transition-transform duration-[150ms]', expanded && 'rotate-180')}
              />
            </button>
          </div>

          {expanded ? (
            <div
              ref={popoverRef}
              id={listId}
              role="listbox"
              className={cn(
                'absolute z-50 left-0 min-w-full overflow-hidden py-1',
                dropdownPlacementClasses(placement),
                'rounded-lg border border-tollerud-border bg-tollerud-surface-overlay',
                'shadow-[0_8px_24px_rgba(0,0,0,0.4)]',
              )}
            >
              {options.map((opt, index) => {
                const active = opt.value === value
                return (
                  <button
                    key={`${String(opt.value)}-${index}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    disabled={opt.disabled}
                    onClick={() => !opt.disabled && handleSelect(opt.value)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm transition-colors duration-75 cursor-pointer',
                      active ? 'text-tollerud-yellow' : 'text-tollerud-text-primary',
                      'hover:bg-tollerud-noir-700/60',
                      active && 'bg-tollerud-noir-700',
                      opt.disabled && 'opacity-40 pointer-events-none',
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      )
    }

    return (
      <div ref={setRefs} role="radiogroup" className={cn(shellClass, className)} {...props}>
        {options.map((opt, index) => {
          const active = opt.value === value
          return (
            <button
              key={`${String(opt.value)}-${index}`}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={opt.disabled}
              onClick={() => !opt.disabled && handleSelect(opt.value)}
              className={segmentButtonClass(active, size, opt.disabled)}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  },
)
Segmented.displayName = 'Segmented'

export { Segmented }
