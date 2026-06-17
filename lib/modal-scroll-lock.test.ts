import { describe, expect, it } from 'vitest'
import { ModalScrollLockShardsContext } from './modal-scroll-lock'

describe('ModalScrollLockShardsContext', () => {
  it('exports a context for portalled menu shard registration', () => {
    expect(ModalScrollLockShardsContext).toBeDefined()
    expect(ModalScrollLockShardsContext.Provider).toBeTruthy()
  })
})
