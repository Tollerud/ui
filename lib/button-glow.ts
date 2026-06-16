/** Selectors that receive magnetic pointer glow when `initButtonGlow()` is mounted. */
export const BUTTON_GLOW_SELECTORS =
  '.tollerud-btn--primary, .tollerud-btn--terminal, .tollerud-btn-glow'

export interface ButtonGlowOptions {
  /** Additional CSS selector(s) to include. Default: primary, terminal, and `.tollerud-btn-glow`. */
  selector?: string
  /** Event root — defaults to `document`. Pass a layout container to scope listeners. */
  root?: Document | HTMLElement
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Pointer-following glow for primary/terminal buttons (and `.tollerud-btn-glow` opt-in).
 * Requires `@tollerud/ui/globals.css`. Call once near the app root; returns cleanup.
 */
export function initButtonGlow(options: ButtonGlowOptions = {}): () => void {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    return () => {}
  }

  const root = options.root ?? document
  const selector = options.selector ?? BUTTON_GLOW_SELECTORS

  const onPointerMove = (event: Event) => {
    if (!(event instanceof PointerEvent)) return
    const target = (event.target as Element | null)?.closest?.(selector) as HTMLElement | null
    if (!target) return
    const rect = target.getBoundingClientRect()
    target.style.setProperty('--glow-x', `${((event.clientX - rect.left) / rect.width) * 100}%`)
    target.style.setProperty('--glow-y', `${((event.clientY - rect.top) / rect.height) * 100}%`)
    target.classList.add('is-glowing')
  }

  const onPointerOut = (event: Event) => {
    if (!(event instanceof PointerEvent)) return
    const target = (event.target as Element | null)?.closest?.(selector) as HTMLElement | null
    if (target) target.classList.remove('is-glowing')
  }

  root.addEventListener('pointermove', onPointerMove)
  root.addEventListener('pointerout', onPointerOut)

  return () => {
    root.removeEventListener('pointermove', onPointerMove)
    root.removeEventListener('pointerout', onPointerOut)
    root.querySelectorAll(`${selector}.is-glowing`).forEach((el) => {
      el.classList.remove('is-glowing')
    })
  }
}
