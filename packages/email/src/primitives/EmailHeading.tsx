import * as React from 'react'
import { Heading } from '@react-email/components'
import { emailTheme as t } from '../theme'

export interface EmailHeadingProps {
  /** Heading level → default size. Defaults to 1. */
  as?: 'h1' | 'h2' | 'h3'
  /** Escape hatch: inline styles merged last, overriding the token defaults. */
  style?: React.CSSProperties
  children: React.ReactNode
}

const SIZES = {
  h1: t.size.h1,
  h2: t.size.h2,
  h3: t.size.lg,
} as const

/** Section heading in the display-adjacent, tight-tracking Tollerud style. */
export function EmailHeading({ as = 'h1', style, children }: EmailHeadingProps) {
  return (
    <Heading
      as={as}
      style={{
        margin: `0 0 ${t.space[4]}`,
        color: t.color.textPrimary,
        fontFamily: t.font.sans,
        fontSize: SIZES[as],
        fontWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        ...style,
      }}
    >
      {children}
    </Heading>
  )
}
