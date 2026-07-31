import { act, render } from '@testing-library/react'
import { createElement, type RefCallback } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useBypassModalScrollLock } from './bypass-modal-scroll-lock'

/** Renders the hook inside a throwaway component and captures its return value. */
function renderBypassRef(enabled: boolean) {
  let refCallback: RefCallback<HTMLElement> | undefined
  function TestComponent({ enabled: isEnabled }: { enabled: boolean }) {
    refCallback = useBypassModalScrollLock(isEnabled)
    return null
  }
  const { rerender } = render(createElement(TestComponent, { enabled }))
  return {
    getRef: () => refCallback!,
    setEnabled: (next: boolean) => rerender(createElement(TestComponent, { enabled: next })),
  }
}

describe('useBypassModalScrollLock', () => {
  it('exports a hook function', () => {
    expect(useBypassModalScrollLock).toBeTypeOf('function')
  })

  it('stops wheel/touchmove propagation on the element the ref callback attaches to', () => {
    const { getRef } = renderBypassRef(true)

    const element = document.createElement('div')
    document.body.appendChild(element)
    act(() => {
      getRef()(element)
    })

    const documentWheel = vi.fn()
    document.addEventListener('wheel', documentWheel)

    element.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true }))
    expect(documentWheel).not.toHaveBeenCalled()

    document.removeEventListener('wheel', documentWheel)
    document.body.removeChild(element)
  })

  it('reattaches to a new element on every mount (open -> close -> reopen)', () => {
    const { getRef } = renderBypassRef(true)

    const first = document.createElement('div')
    document.body.appendChild(first)
    act(() => {
      getRef()(first)
    })
    act(() => {
      getRef()(null) // unmount, as Radix does on close
    })

    const second = document.createElement('div')
    document.body.appendChild(second)
    act(() => {
      getRef()(second) // remount, as Radix does on reopen
    })

    const documentWheel = vi.fn()
    document.addEventListener('wheel', documentWheel)

    second.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true }))
    expect(documentWheel).not.toHaveBeenCalled()

    document.removeEventListener('wheel', documentWheel)
    document.body.removeChild(first)
    document.body.removeChild(second)
  })

  it('does not attach when disabled', () => {
    const { getRef } = renderBypassRef(false)

    const element = document.createElement('div')
    document.body.appendChild(element)
    act(() => {
      getRef()(element)
    })

    const documentWheel = vi.fn()
    document.addEventListener('wheel', documentWheel)

    element.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true }))
    expect(documentWheel).toHaveBeenCalled()

    document.removeEventListener('wheel', documentWheel)
    document.body.removeChild(element)
  })
})
