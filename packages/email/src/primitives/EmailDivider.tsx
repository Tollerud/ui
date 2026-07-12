import * as React from 'react'
import { Hr } from '@react-email/components'
import { emailTheme as t } from '../theme'

export interface EmailDividerProps {
  /** `accent` renders a short yellow rule; default is a full-width hairline. */
  variant?: 'default' | 'accent'
  /** Escape hatch: inline styles merged last, overriding the token defaults. */
  style?: React.CSSProperties
}

/** Horizontal rule. The accent variant mirrors the web `.tollerud-divider--accent`. */
export function EmailDivider({ variant = 'default', style }: EmailDividerProps) {
  const isAccent = variant === 'accent'
  return (
    <Hr
      style={{
        border: 'none',
        borderTop: `1px solid ${isAccent ? t.color.accent : t.color.border}`,
        width: isAccent ? '48px' : '100%',
        margin: `${t.space[6]} 0`,
        ...style,
      }}
    />
  )
}
