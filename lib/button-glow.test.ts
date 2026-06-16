import { afterEach, describe, expect, it, vi } from 'vitest'
import { BUTTON_GLOW_SELECTORS, initButtonGlow } from './button-glow'

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList)
  )
}

describe('initButtonGlow', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('exports default selectors for primary and terminal buttons', () => {
    expect(BUTTON_GLOW_SELECTORS).toContain('.tollerud-btn--primary')
    expect(BUTTON_GLOW_SELECTORS).toContain('.tollerud-btn--terminal')
    expect(BUTTON_GLOW_SELECTORS).toContain('.tollerud-btn-glow')
  })

  it('no-ops when reduced motion is preferred', () => {
    stubMatchMedia(true)

    const addSpy = vi.spyOn(document, 'addEventListener')
    const cleanup = initButtonGlow()
    cleanup()

    expect(addSpy).not.toHaveBeenCalled()
  })

  it('tracks pointer position on matching buttons', () => {
    stubMatchMedia(false)

    document.body.innerHTML =
      '<button class="tollerud-btn tollerud-btn--terminal" type="button">deploy</button>'
    const button = document.querySelector('button') as HTMLButtonElement
    button.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 100,
        height: 40,
        right: 100,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect

    const cleanup = initButtonGlow()
    button.dispatchEvent(
      new PointerEvent('pointermove', { bubbles: true, clientX: 50, clientY: 20 })
    )

    expect(button.classList.contains('is-glowing')).toBe(true)
    expect(button.style.getPropertyValue('--glow-x')).toBe('50%')
    expect(button.style.getPropertyValue('--glow-y')).toBe('50%')

    cleanup()
    expect(button.classList.contains('is-glowing')).toBe(false)
  })
})
