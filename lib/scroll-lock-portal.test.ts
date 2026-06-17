import { describe, expect, it, vi } from 'vitest'
import { allowScrollInsideScrollLock } from './scroll-lock-portal'

describe('allowScrollInsideScrollLock', () => {
  it('stops wheel and touch propagation for modal scroll-lock compatibility', () => {
    const stopPropagation = vi.fn()

    allowScrollInsideScrollLock({ stopPropagation } as unknown as UIEvent)
    allowScrollInsideScrollLock({ stopPropagation } as unknown as TouchEvent)

    expect(stopPropagation).toHaveBeenCalledTimes(2)
  })
})
