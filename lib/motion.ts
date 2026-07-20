// Mirrors the --motion-duration-* / --motion-ease-* custom properties in
// globals-layers.css. JS-side motion libraries (e.g. framer-motion) can't
// consume CSS custom properties directly, so these constants exist to keep
// JS-driven animation in sync with the CSS/Tailwind motion tokens instead of
// hardcoding independent values. Keep both in sync by hand.

export const motionDuration = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
} as const

export const motionEase = {
  out: [0.16, 1, 0.3, 1],
  in: [0.7, 0, 0.84, 0],
  inOut: [0.4, 0, 0.2, 1],
} as const
