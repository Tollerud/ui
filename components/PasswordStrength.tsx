'use client'

import { useMemo } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PasswordRule {
  label: string
  test: (value: string) => boolean
}

export interface PasswordStrengthProps {
  value: string
  rules?: PasswordRule[]
  className?: string
}

const DEFAULT_RULES: PasswordRule[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'Uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'Lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'Number', test: (v) => /[0-9]/.test(v) },
  { label: 'Special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
]

type StrengthLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong'

function getStrength(passed: number, total: number): StrengthLevel {
  if (passed === 0) return 'empty'
  const ratio = passed / total
  if (ratio <= 0.2) return 'weak'
  if (ratio <= 0.6) return 'fair'
  if (ratio < 1) return 'good'
  return 'strong'
}

const STRENGTH_LABELS: Record<StrengthLevel, string> = {
  empty: '',
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
}

const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  empty: 'bg-tollerud-border',
  weak: 'bg-tollerud-error',
  fair: 'bg-tollerud-warning',
  good: 'bg-tollerud-info',
  strong: 'bg-tollerud-success',
}

const STRENGTH_TEXT: Record<StrengthLevel, string> = {
  empty: 'text-tollerud-text-muted',
  weak: 'text-tollerud-error',
  fair: 'text-tollerud-warning',
  good: 'text-tollerud-info',
  strong: 'text-tollerud-success',
}

function PasswordStrength({ value, rules = DEFAULT_RULES, className }: PasswordStrengthProps) {
  const results = useMemo(() => rules.map((rule) => rule.test(value)), [value, rules])
  const passed = results.filter(Boolean).length
  const strength = getStrength(passed, rules.length)
  const segments = rules.length

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-300',
                i < passed ? STRENGTH_COLORS[strength] : 'bg-tollerud-border'
              )}
            />
          ))}
        </div>
        {value.length > 0 && (
          <span className={cn('text-[11px] font-semibold w-10 text-right transition-colors duration-300', STRENGTH_TEXT[strength])}>
            {STRENGTH_LABELS[strength]}
          </span>
        )}
      </div>

      {/* Rule checklist */}
      <ul className="flex flex-col gap-1 list-none m-0 p-0">
        {rules.map((rule, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {results[i] ? (
              <Check size={12} className="text-tollerud-success shrink-0" strokeWidth={2.5} />
            ) : (
              <X size={12} className="text-tollerud-text-muted shrink-0" strokeWidth={2.5} />
            )}
            <span className={cn(
              'text-xs transition-colors duration-150',
              results[i] ? 'text-tollerud-text-secondary' : 'text-tollerud-text-muted'
            )}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { PasswordStrength, DEFAULT_RULES as passwordRules }
