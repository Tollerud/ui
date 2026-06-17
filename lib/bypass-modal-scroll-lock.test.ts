import { describe, expect, it, vi } from 'vitest'
import { useBypassModalScrollLock } from './bypass-modal-scroll-lock'

describe('useBypassModalScrollLock', () => {
  it('exports a hook function', () => {
    expect(useBypassModalScrollLock).toBeTypeOf('function')
  })

  it('stops propagation on native wheel events', () => {
    const element = document.createElement('div')
    const stopImmediatePropagation = vi.fn()
    const stopPropagation = vi.fn()

    const stopCapture = (event: Event) => {
      event.stopImmediatePropagation()
    }
    const stopBubble = (event: Event) => {
      event.stopPropagation()
    }

    element.addEventListener('wheel', stopCapture, { capture: true })
    element.addEventListener('wheel', stopBubble)

    const event = new WheelEvent('wheel', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'stopImmediatePropagation', { value: stopImmediatePropagation })
    Object.defineProperty(event, 'stopPropagation', { value: stopPropagation })

    element.dispatchEvent(event)

    expect(stopImmediatePropagation).toHaveBeenCalled()
    expect(stopPropagation).toHaveBeenCalled()
  })
})
