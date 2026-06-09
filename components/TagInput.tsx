'use client'

import { type KeyboardEvent, useId, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TagInputProps {
  value?: string[]
  defaultValue?: string[]
  onChange?: (tags: string[]) => void
  label?: string
  error?: string
  placeholder?: string
  /** Maximum number of tags allowed */
  max?: number
  className?: string
  disabled?: boolean
}

function TagInput({
  value: valueProp,
  defaultValue = [],
  onChange,
  label,
  error,
  placeholder = 'Add a tag…',
  max,
  className,
  disabled,
}: TagInputProps) {
  const id = useId()
  const isControlled = valueProp !== undefined
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue)
  const tags = isControlled ? valueProp : internalTags
  const [draft, setDraft] = useState('')

  const setAndNotify = (next: string[]) => {
    if (!isControlled) setInternalTags(next)
    onChange?.(next)
  }

  const addTag = (raw: string) => {
    const tag = raw.trim()
    if (!tag || tags.includes(tag)) return
    if (max && tags.length >= max) return
    setAndNotify([...tags, tag])
    setDraft('')
  }

  const removeTag = (index: number) => {
    setAndNotify(tags.filter((_, i) => i !== index))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(draft)
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const atMax = max ? tags.length >= max : false

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-tollerud-text-muted">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex flex-wrap items-center gap-1.5 rounded px-2.5 py-1.5',
          'bg-tollerud-surface-raised border',
          'transition-[border-color] duration-[150ms]',
          'focus-within:border-tollerud-yellow focus-within:shadow-[0_0_0_1px_#E8D500]',
          error ? 'border-tollerud-error' : 'border-tollerud-border',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 rounded-full bg-tollerud-surface-hover px-2.5 py-0.5 text-xs font-medium text-tollerud-text-primary"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => removeTag(i)}
              className="text-tollerud-text-muted hover:text-tollerud-text-primary transition-colors duration-[150ms]"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          disabled={disabled || atMax}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={atMax ? '' : placeholder}
          className={cn(
            'min-w-[6rem] flex-1 bg-transparent py-0.5 text-sm text-tollerud-text-primary',
            'placeholder:text-tollerud-text-muted focus:outline-none'
          )}
        />
      </div>
      {error && <p className="text-xs text-tollerud-error mt-0.5">{error}</p>}
    </div>
  )
}
TagInput.displayName = 'TagInput'

export { TagInput }
