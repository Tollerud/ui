import { tokens } from './tokens'

/**
 * Email-facing theme, derived from the synced Tollerud tokens.
 *
 * Email is LIGHT by default — a light background survives every client,
 * including Gmail (which ignores `color-scheme` and applies its own dark-mode
 * color transforms, so a dark-first email breaks there). Clients that honor
 * `prefers-color-scheme: dark` (Apple Mail, iOS Mail) get the noir palette back
 * via the dark-mode `<style>` block injected by EmailLayout — see `darkModeCss`.
 *
 * The yellow accent button keeps `#FFFF00` with black text in BOTH modes (it
 * reads on light and dark), so it never needs a dark override.
 */
export const emailTheme = {
  color: {
    // Light-mode defaults (inline styles use these).
    page: '#F4F4F5', // outer background
    surface: '#FFFFFF', // the card
    surfaceOverlay: '#FAFAFA',
    border: '#E4E4E7',
    borderSubtle: '#F1F1F3',
    accent: tokens.yellow, // #FFFF00 — button background
    accentText: tokens.black, // #0A0A0A — text on the yellow button
    accentLine: tokens.yellowWarm, // #E8D500 — underlines/dividers (visible on white)
    textPrimary: '#18181B',
    textSecondary: '#52525B',
    textMuted: '#A1A1AA',
    success: tokens.success,
    error: tokens.error,
  },
  // Dark-mode override values (noir), applied via @media prefers-color-scheme.
  dark: {
    page: tokens.black, // #0A0A0A
    surface: tokens.surfaceRaised, // #121212
    border: tokens.border, // #333333
    textPrimary: tokens.textPrimary, // #F5F5F5
    textSecondary: tokens.textSecondary, // #AAAAAA
    textMuted: tokens.textMuted, // #666666
  },
  font: {
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
  /** Hosted monogram PNGs (inline SVG is stripped by Gmail/Outlook). */
  monogram: {
    dark: 'https://design.tollerud.dev/brand/email-monogram-dark.png', // for light bg
    yellow: 'https://design.tollerud.dev/brand/email-monogram-yellow.png', // for dark bg
  },
} as const

/** Class names used to target elements from the dark-mode `<style>` block. */
export const emailClass = {
  body: 't-body',
  page: 't-page',
  card: 't-card',
  heading: 't-heading',
  text: 't-text',
  muted: 't-muted',
  fine: 't-fine',
  border: 't-border',
  monoLight: 't-mono-light',
  monoDark: 't-mono-dark',
} as const

const d = emailTheme.dark

/**
 * Dark-mode overrides, injected once by EmailLayout. `!important` is required to
 * beat the inline light-mode styles. Honored by Apple Mail / iOS Mail; Gmail
 * ignores it and keeps the (safe) light inline styles.
 */
export const darkModeCss = `
@media (prefers-color-scheme: dark) {
  .${emailClass.body}, .${emailClass.page} { background-color: ${d.page} !important; }
  .${emailClass.card} { background-color: ${d.surface} !important; border-color: ${d.border} !important; }
  .${emailClass.heading} { color: ${d.textPrimary} !important; }
  .${emailClass.text} { color: ${d.textPrimary} !important; }
  .${emailClass.muted} { color: ${d.textSecondary} !important; }
  .${emailClass.fine} { color: ${d.textMuted} !important; }
  .${emailClass.border} { border-color: ${d.border} !important; }
  .${emailClass.monoLight} { display: none !important; }
  .${emailClass.monoDark} { display: inline-block !important; }
}
`.trim()

export type EmailTheme = typeof emailTheme
