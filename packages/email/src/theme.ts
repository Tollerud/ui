import { tokens } from './tokens'

/**
 * Email-facing semantic theme, derived from the synced Tollerud tokens.
 *
 * Email clients don't resolve CSS custom properties, so every value here is a
 * concrete literal that gets inlined onto elements. The palette is Tollerud's
 * dark noir + yellow accent; see the dark-mode notes in README before changing
 * background/foreground pairings.
 */
export const emailTheme = {
  color: {
    // Page background sits one step lighter than the card so the card reads as
    // a raised surface even in clients that don't honor borders.
    page: tokens.black, // #0A0A0A
    surface: tokens.surfaceRaised, // #121212
    surfaceOverlay: tokens.surfaceOverlay, // #1A1A1A
    border: tokens.border, // #333333
    borderSubtle: tokens.borderSubtle, // #252525
    accent: tokens.yellow, // #FFFF00
    accentText: tokens.black, // text on top of the yellow accent
    textPrimary: tokens.textPrimary, // #F5F5F5
    textSecondary: tokens.textSecondary, // #AAAAAA
    textMuted: tokens.textMuted, // #666666
    success: tokens.success,
    error: tokens.error,
  },
  font: {
    // Drop custom families for email — clients ignore @font-face reliably only
    // for web-safe stacks. Keep the sans intent, fall back hard.
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  },
  size: {
    xs: tokens.textXs,
    sm: tokens.textSm,
    base: tokens.textBase,
    lg: tokens.textLg,
    xl: tokens.textXl,
    h2: tokens.text2xl,
    h1: tokens.text3xl,
  },
  space: {
    1: tokens.space1,
    2: tokens.space2,
    3: tokens.space3,
    4: tokens.space4,
    5: tokens.space5,
    6: tokens.space6,
    8: tokens.space8,
    10: tokens.space10,
    12: tokens.space12,
  },
  radius: {
    sm: tokens.radiusSm,
    base: tokens.radius,
    md: tokens.radiusMd,
    lg: tokens.radiusLg,
  },
  /** Max content width — the classic email-safe container width. */
  containerWidth: 600,
} as const

export type EmailTheme = typeof emailTheme
