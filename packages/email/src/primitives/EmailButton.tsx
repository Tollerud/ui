import * as React from 'react'
import { Button } from '@react-email/components'
import { emailTheme as t } from '../theme'

export interface EmailButtonProps {
  href: string
  /** Visual weight. `primary` is the yellow accent; `secondary` is outlined. */
  variant?: 'primary' | 'secondary'
  /** Escape hatch: inline styles merged last, overriding the token defaults. */
  style?: React.CSSProperties
  children: React.ReactNode
}

/**
 * Call-to-action button. Wraps React Email's <Button>, which emits the MSO
 * padding hack so Outlook renders the padding correctly. The primary variant is
 * Tollerud yellow with black text — a deliberately high-contrast pairing that
 * reads correctly even in clients that force dark-mode inversion.
 */
export function EmailButton({ href, variant = 'primary', style, children }: EmailButtonProps) {
  const isPrimary = variant === 'primary'
  return (
    <Button
      href={href}
      style={{
        display: 'inline-block',
        boxSizing: 'border-box',
        backgroundColor: isPrimary ? t.color.accent : t.color.surfaceOverlay,
        color: isPrimary ? t.color.accentText : t.color.textPrimary,
        border: `1px solid ${isPrimary ? t.color.accent : t.color.border}`,
        borderRadius: t.radius.base,
        fontFamily: t.font.sans,
        fontSize: t.size.base,
        fontWeight: 600,
        lineHeight: 1,
        padding: `${t.space[3]} ${t.space[6]}`,
        textDecoration: 'none',
        textAlign: 'center',
        ...style,
      }}
    >
      {children}
    </Button>
  )
}
