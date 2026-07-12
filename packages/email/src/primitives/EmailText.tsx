import * as React from 'react'
import { Text } from '@react-email/components'
import { emailTheme as t } from '../theme'

export interface EmailTextProps {
  /** `muted` uses secondary text color; `fine` is small print. */
  tone?: 'default' | 'muted' | 'fine'
  children: React.ReactNode
}

/** Body copy. Tone controls color + size for secondary and fine-print text. */
export function EmailText({ tone = 'default', children }: EmailTextProps) {
  const isFine = tone === 'fine'
  return (
    <Text
      style={{
        margin: `0 0 ${t.space[4]}`,
        color: tone === 'default' ? t.color.textPrimary : t.color.textSecondary,
        fontFamily: t.font.sans,
        fontSize: isFine ? t.size.sm : t.size.base,
        lineHeight: 1.6,
      }}
    >
      {children}
    </Text>
  )
}
