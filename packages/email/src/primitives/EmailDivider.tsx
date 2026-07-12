import * as React from 'react'
import { Hr } from '@react-email/components'
import { emailTheme as t } from '../theme'

export interface EmailDividerProps {
  /** `accent` renders a short yellow rule; default is a full-width hairline. */
  variant?: 'default' | 'accent'
}

/** Horizontal rule. The accent variant mirrors the web `.tollerud-divider--accent`. */
export function EmailDivider({ variant = 'default' }: EmailDividerProps) {
  const isAccent = variant === 'accent'
  return (
    <Hr
      style={{
        border: 'none',
        borderTop: `1px solid ${isAccent ? t.color.accent : t.color.border}`,
        width: isAccent ? '48px' : '100%',
        margin: `${t.space[6]} 0`,
      }}
    />
  )
}
