import * as React from 'react'
import { Button } from '@react-email/components'
import { emailTheme as t, emailClass } from '../theme'

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
 * Tollerud yellow with black text in both light and dark mode — a deliberately
 * high-contrast pairing that reads on either background. The secondary variant
 * follows the card surface, so it flips with the dark-mode <style> overrides.
 */
export function EmailButton({ href, variant = 'primary', style, children }: EmailButtonProps) {
  const isPrimary = variant === 'primary'
  return (
    <Button
      href={href}
      className={isPrimary ? undefined : `${emailClass.card} ${emailClass.text} ${emailClass.border}`}
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
