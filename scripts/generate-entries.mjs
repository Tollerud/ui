#!/usr/bin/env node
/**
 * Generates per-component entry files for subpath exports (@tollerud/ui/button).
 * Run automatically via `prebuild`.
 */
import { readdirSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

const root = join(import.meta.dirname, '..')
const componentsDir = join(root, 'components')
const entriesDir = join(root, 'entries')

rmSync(entriesDir, { recursive: true, force: true })
mkdirSync(entriesDir, { recursive: true })

const componentFiles = readdirSync(componentsDir)
  .filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
  .sort()

const manifest = ['components/index.ts']

for (const file of componentFiles) {
  const base = file.replace(/\.tsx$/, '')
  const kebab = toKebab(base)
  writeFileSync(join(entriesDir, `${kebab}.ts`), `export * from '../components/${base}'\n`)
  manifest.push(`entries/${kebab}.ts`)
}

writeFileSync(join(entriesDir, 'utils.ts'), `export { cn } from '../lib/utils'\n`)
manifest.push('entries/utils.ts')

writeFileSync(
  join(entriesDir, 'button-glow.ts'),
  `export { initButtonGlow, BUTTON_GLOW_SELECTORS } from '../lib/button-glow'\nexport type { ButtonGlowOptions } from '../lib/button-glow'\n`,
)
manifest.push('entries/button-glow.ts')

writeFileSync(join(entriesDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`Generated ${componentFiles.length + 1} subpath entries in entries/`)
