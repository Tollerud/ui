#!/usr/bin/env node
/**
 * Ensures packages/footer matches components/Footer.tsx and root package version.
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const footerPkgPath = join(root, 'packages/footer/package.json')

let footerPkg
try {
  footerPkg = JSON.parse(readFileSync(footerPkgPath, 'utf8'))
} catch {
  console.error('packages/footer/package.json missing — run npm run sync:footer')
  process.exit(1)
}

if (footerPkg.version !== pkg.version) {
  console.error(`@tollerud/footer v${footerPkg.version} !== @tollerud/ui v${pkg.version}`)
  process.exit(1)
}

const before = readFileSync(join(root, 'packages/footer/src/Footer.tsx'), 'utf8')
execSync('node scripts/sync-footer-package.mjs', { cwd: root, stdio: 'pipe' })
const after = readFileSync(join(root, 'packages/footer/src/Footer.tsx'), 'utf8')

if (before !== after) {
  console.error('packages/footer is out of sync with components/Footer.tsx — run npm run sync:footer')
  process.exit(1)
}

console.log(`Footer package lockstep OK (v${pkg.version})`)
