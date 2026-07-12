import * as React from 'react'
import { Img } from '@react-email/components'
import { MONOGRAM_PATH, MONOGRAM_VIEW_BOX } from '../monogram-geometry'
import { emailTheme as t } from '../theme'

export type BrandMarkColor = 'yellow' | 'white' | 'black'

const MARK_COLORS: Record<BrandMarkColor, string> = {
  yellow: t.color.accent, // #FFFF00
  white: t.color.textPrimary, // #F5F5F5
  black: t.color.page, // #0A0A0A
}

// Monogram viewBox is 130×143 → width is height × (130/143).
const ASPECT = 130 / 143

export interface BrandMarkProps {
  color?: BrandMarkColor
  /** Rendered height in px. Width scales to preserve the aspect ratio. */
  height?: number
  /**
   * Hosted image URL for the monogram. Strongly recommended for production:
   * many clients (Outlook desktop, Gmail) strip inline SVG, so without a
   * hosted image the mark is invisible there. When omitted, an inline SVG is
   * used (renders in Apple Mail / iOS Mail / some webmail).
   */
  src?: string
  alt?: string
}

/**
 * The Tollerud monogram for email. Prefer `src` (a hosted PNG/GIF) for full
 * client coverage; the inline-SVG fallback is best-effort.
 */
export function BrandMark({ color = 'yellow', height = 24, src, alt = 'Tollerud' }: BrandMarkProps) {
  const width = Math.round(height * ASPECT)
  if (src) {
    return <Img src={src} alt={alt} height={height} width={width} style={{ display: 'block' }} />
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox={MONOGRAM_VIEW_BOX}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
      style={{ display: 'block' }}
    >
      <title>{alt}</title>
      <path d={MONOGRAM_PATH} fill={MARK_COLORS[color]} fillRule="evenodd" />
    </svg>
  )
}
