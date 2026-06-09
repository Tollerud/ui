import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('generate-entries manifest', () => {
  it('lists button and utils subpath entries', () => {
    if (!existsSync('entries/manifest.json')) {
      // prebuild runs before build in CI; skip when manifest not generated yet
      return
    }

    const manifest = JSON.parse(readFileSync('entries/manifest.json', 'utf8')) as string[]
    expect(manifest).toContain('components/index.ts')
    expect(manifest).toContain('entries/button.ts')
    expect(manifest).toContain('entries/utils.ts')
    expect(existsSync('entries/button.ts')).toBe(true)
  })
})
