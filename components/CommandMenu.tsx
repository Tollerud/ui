"use client"

import {
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'
import { type ActionItem, ActionRow } from './ActionRow'

export interface CommandGroup {
  /** Group label (e.g. "Servers", "Actions") */
  label: string
  /** Items in this group */
  items: ActionItem[]
}

export interface CommandMenuProps {
  /** Whether the menu is open */
  open: boolean
  /** Called when menu should close */
  onOpenChange: (open: boolean) => void
  /** Command groups to display */
  groups: CommandGroup[]
  /** Placeholder text for the search input */
  placeholder?: string
  /** Empty state message when no results */
  emptyMessage?: string
  /** Custom class for the overlay */
  className?: string
  /** Keyboard shortcut to toggle (default: "⌘K") */
  toggleShortcut?: string
  /** Custom search filter override. Return filtered groups. */
  filter?: (query: string, groups: CommandGroup[]) => CommandGroup[]
  /** Callback when an action runs */
  onAction?: (action: ActionItem) => void
}

/**
 * Command palette — a Raycast-inspired global command menu.
 *
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <CommandMenu
 *   open={open}
 *   onOpenChange={setOpen}
 *   groups={[
 *     {
 *       label: 'Servers',
 *       items: [
 *         { id: 'emma', label: 'Emma', icon: <Server />, onSelect: () => {} },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */
const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>(
  ({
  open,
  onOpenChange,
  groups,
  placeholder = 'Type a command…',
  emptyMessage = 'No matching commands',
  className,
  filter: customFilter,
  onAction,
}: CommandMenuProps, ref) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Flatten items with their group indices for keyboard navigation
  const flatItems = groups.flatMap((g) => g.items)
  // Auto-close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onOpenChange(false)
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < flatItems.length - 1 ? prev + 1 : 0
        )
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : flatItems.length - 1
        )
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        const item = flatItems[selectedIndex]
        if (item && !item.disabled) {
          item.onSelect?.()
          onAction?.(item)
          onOpenChange(false)
        }
        return
      }
    },
    [flatItems, selectedIndex, onOpenChange, onAction]
  )

  // Open toggle via ⌘K / Ctrl+K
  useEffect(() => {
    function handleGlobalKey(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', handleGlobalKey)
    return () => document.removeEventListener('keydown', handleGlobalKey)
  }, [open, onOpenChange])

  // Focus input and reset state when opening
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      // Small delay to let the animation start before focusing
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Filter groups based on query
  const filteredGroups = customFilter
    ? customFilter(query, groups)
    : query.trim()
      ? groups
          .map((g) => ({
            ...g,
            items: g.items.filter(
              (item) =>
                item.label.toLowerCase().includes(query.toLowerCase()) ||
                item.description
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
                item.group?.toLowerCase().includes(query.toLowerCase())
            ),
          }))
          .filter((g) => g.items.length > 0)
      : groups

  // Re-index selection when results change
  const currentFlat = filteredGroups.flatMap((g) => g.items)
  useEffect(() => {
    if (selectedIndex >= currentFlat.length) {
      setSelectedIndex(0)
    }
  }, [currentFlat.length, selectedIndex])

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="tia-cmd-overlay"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Command Menu */}
      <div
        className={cn('tia-cmd', className)}
        role="listbox"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="tia-cmd__header">
          <span className="tia-cmd__search-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            className="tia-cmd__input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* Results */}
        <div ref={listRef} className="tia-cmd__list">
          {filteredGroups.length === 0 && (
            <div className="tia-cmd__empty">{emptyMessage}</div>
          )}

          {filteredGroups.map((group, gi) => {
            // Calculate flat offset for this group
            const flatOffset = filteredGroups
              .slice(0, gi)
              .reduce((acc, g) => acc + g.items.length, 0)

            return (
              <div key={group.label} className="tia-cmd__group">
                <div className="tia-cmd__group-label">{group.label}</div>
                {group.items.map((item, ii) => {
                  const flatIndex = flatOffset + ii
                  return (
                    <ActionRow
                      key={item.id}
                      action={item}
                      highlighted={selectedIndex === flatIndex}
                      onClick={() => {
                        item.onSelect?.()
                        onAction?.(item)
                        onOpenChange(false)
                      }}
                      onMouseEnter={() => setSelectedIndex(flatIndex)}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Footer hints */}
        <div className="tia-cmd__footer">
          <span className="tia-cmd__hint">
            <span className="tia-kbd tia-kbd--sm">
              <span className="tia-kbd__key">↑</span>
            </span>
            <span className="tia-kbd tia-kbd--sm">
              <span className="tia-kbd__key">↓</span>
            </span>
            <span className="tia-cmd__hint-text">navigate</span>
          </span>
          <span className="tia-cmd__hint">
            <span className="tia-kbd tia-kbd--sm">
              <span className="tia-kbd__key">↵</span>
            </span>
            <span className="tia-cmd__hint-text">select</span>
          </span>
          <span className="tia-cmd__hint">
            <span className="tia-kbd tia-kbd--sm">
              <span className="tia-kbd__key">Esc</span>
            </span>
            <span className="tia-cmd__hint-text">close</span>
          </span>
        </div>
      </div>
    </>
  )
}
)
CommandMenu.displayName = 'CommandMenu'

export { CommandMenu }