import * as React from 'react'
import { Text } from '@react-email/components'
import { emailTheme as t, emailClass } from '../theme'

export interface EmailTextProps {
  /** `muted` uses secondary text color; `fine` is small print. */
  tone?: 'default' | 'muted' | 'fine'
  /** Escape hatch: inline styles merged last, overriding the token defaults. */
  style?: React.CSSProperties
  children: React.ReactNode
}

// Per-tone class / color / size, kept in sync with the dark-mode `<style>`
// block so every tone recolors. `fine` matches the footer's fine print
// (`t-fine` + muted color + xs size), not a shrunk `muted`.
const TONE = {
  default: { className: emailClass.text, color: t.color.textPrimary, size: t.size.base },
  muted: { className: emailClass.muted, color: t.color.textSecondary, size: t.size.base },
  fine: { className: emailClass.fine, color: t.color.textMuted, size: t.size.xs },
} as const

/** Body copy. Tone controls color + size for secondary and fine-print text. */
export function EmailText({ tone = 'default', style, children }: EmailTextProps) {
  const s = TONE[tone]
  return (
    <Text
      className={s.className}
      style={{
        margin: `0 0 ${t.space[4]}`,
        color: s.color,
        fontFamily: t.font.sans,
        fontSize: s.size,
        lineHeight: 1.6,
        ...style,
      }}
    >
      {children}
    </Text>
  )
}
