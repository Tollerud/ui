import { describe, expect, it } from 'vitest'
import { registerScrollLockPortalShard } from './scroll-lock-portal'

describe('registerScrollLockPortalShard', () => {
  it('returns cleanup that unregisters the shard', () => {
    const element = document.createElement('div')
    const cleanup = registerScrollLockPortalShard(element)

    expect(cleanup).toBeTypeOf('function')
    expect(() => cleanup()).not.toThrow()
  })
})
