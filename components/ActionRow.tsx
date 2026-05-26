"use client"

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Kbd } from './Kbd'

export interface ActionItem {
  /** Unique ID */
  id: string
  /** Label text */
  label: string
  /** Subtitle / description */
  description?: string
  /** Optional icon element */
  icon?: React.ReactNode
  /** Keyboard shortcut */
  shortcut?: string | string[]
  /** Group this item belongs to */
  group?: string
  /** When true, item is disabled */
  disabled?: boolean
  /** Selection callback */
  onSelect?: () => void
}

export interface ActionRowProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  /** Action data */
  action: ActionItem
  /** Whether this row is currently highlighted (keyboard navigation) */
  highlighted?: boolean
  /** Whether to show the shortcut */
  showShortcut?: boolean
}

/**
 * Action row — a single command/action item in a list or command menu.
 * Inspired by Raycast's compact action layout.
 */
const ActionRow = forwardRef<HTMLButtonElement, ActionRowProps>(
  (
    {
      action,
      highlighted = false,
      showShortcut = true,
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled ?? action.disabled}
        onClick={(e) => {
          onClick?.(e)
          action.onSelect?.()
        }}
        className={cn(
          'tia-action-row',
          highlighted && 'tia-action-row--highlighted',
          (disabled ?? action.disabled) && 'tia-action-row--disabled',
          className
        )}
        role="option"
        aria-selected={highlighted}
        aria-disabled={disabled ?? action.disabled}
        {...props}
      >
        {action.icon && (
          <span className="tia-action-row__icon">{action.icon}</span>
        )}

        <span className="tia-action-row__content">
          <span className="tia-action-row__label">{action.label}</span>
          {action.description && (
            <span className="tia-action-row__description">
              {action.description}
            </span>
          )}
        </span>

        {showShortcut && action.shortcut && (
          <span className="tia-action-row__shortcut">
            <Kbd keys={action.shortcut} size="sm" />
          </span>
        )}
      </button>
    )
  }
)
ActionRow.displayName = 'ActionRow'

export { ActionRow }