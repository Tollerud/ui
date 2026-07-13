import * as React from 'react'
import { Img } from '@react-email/components'
import { emailTheme as t, emailClass } from '../theme'

// Monogram source aspect ratio is 130×143 → width is height × (130/143).
const ASPECT = 130 / 143

export interface BrandMarkProps {
  /** Rendered height in px. Width scales to preserve the aspect ratio. */
  height?: number
  /**
   * Custom logo image URL. When set, this single image is used as-is (no
   * dark-mode swap). When omitted, the hosted Tollerud monogram is used: a dark
   * mark on light backgrounds, auto-swapped to a yellow mark in dark mode.
   */
  src?: string
  alt?: string
  /** Escape hatch: inline styles merged last. */
  style?: React.CSSProperties
}

/**
 * The Tollerud monogram for email — a hosted PNG, because inline SVG is stripped
 * by Gmail and Outlook. With no `src`, renders the dark monogram for light
 * backgrounds and swaps to the yellow monogram in dark mode (via the class-based
 * `@media prefers-color-scheme` rules injected by EmailLayout).
 */
export function BrandMark({ height = 24, src, alt = 'Tollerud', style }: BrandMarkProps) {
  const width = Math.round(height * ASPECT)
  if (src) {
    return <Img src={src} alt={alt} height={height} width={width} style={{ display: 'block', ...style }} />
  }
  return (
    <>
      <Img
        className={emailClass.monoLight}
        src={t.monogram.dark}
        alt={alt}
        height={height}
        width={width}
        style={{ display: 'inline-block', ...style }}
      />
      <Img
        className={emailClass.monoDark}
        src={t.monogram.yellow}
        alt={alt}
        height={height}
        width={width}
        style={{ display: 'none', ...style }}
      />
    </>
  )
}
