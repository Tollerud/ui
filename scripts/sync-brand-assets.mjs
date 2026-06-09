#!/usr/bin/env node
/**
 * Copy canonical brand assets from brand/ into docs-app/public/brand/ for static export.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const sourceDir = join(root, 'brand')
const targetDir = join(root, 'docs-app/public/brand')

if (!existsSync(sourceDir)) {
  console.error('Missing brand/ directory at repo root')
  process.exit(1)
}

mkdirSync(targetDir, { recursive: true })

const files = readdirSync(sourceDir).filter((file) => /\.(svg|png)$/i.test(file))
for (const file of files) {
  copyFileSync(join(sourceDir, file), join(targetDir, file))
}

console.log(`Synced ${files.length} brand assets → docs-app/public/brand/`)
