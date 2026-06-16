#!/usr/bin/env node
/**
 * Keeps registry.json and @tollerud/footer version aligned with package.json before publish.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const registryPath = join(root, 'registry.json')
const registry = JSON.parse(readFileSync(registryPath, 'utf8'))
const footerPkgPath = join(root, 'packages/footer/package.json')

let changed = false

if (registry.version !== pkg.version) {
  registry.version = pkg.version
  writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`)
  console.log(`Synced registry.json version → v${pkg.version}`)
  changed = true
} else {
  console.log(`registry.json already at v${pkg.version}`)
}

try {
  const footerPkg = JSON.parse(readFileSync(footerPkgPath, 'utf8'))
  if (footerPkg.version !== pkg.version) {
    footerPkg.version = pkg.version
    writeFileSync(footerPkgPath, `${JSON.stringify(footerPkg, null, 2)}\n`)
    console.log(`Synced packages/footer/package.json version → v${pkg.version}`)
    changed = true
  }
} catch {
  console.error('packages/footer/package.json missing — run npm run sync:footer')
  process.exit(1)
}

if (!changed) {
  console.log(`@tollerud/footer already at v${pkg.version}`)
}
