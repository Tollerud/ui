#!/usr/bin/env node
/**
 * Keeps registry.json and the sibling packages (@tollerud/footer, @tollerud/email)
 * version-aligned with package.json before publish.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const registryPath = join(root, 'registry.json')
const registry = JSON.parse(readFileSync(registryPath, 'utf8'))

let changed = false

if (registry.version !== pkg.version) {
  registry.version = pkg.version
  writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`)
  console.log(`Synced registry.json version → v${pkg.version}`)
  changed = true
} else {
  console.log(`registry.json already at v${pkg.version}`)
}

for (const [name, syncCmd] of [
  ['footer', 'sync:footer'],
  ['email', 'sync:email'],
]) {
  const pkgPath = join(root, `packages/${name}/package.json`)
  try {
    const sub = JSON.parse(readFileSync(pkgPath, 'utf8'))
    if (sub.version !== pkg.version) {
      sub.version = pkg.version
      writeFileSync(pkgPath, `${JSON.stringify(sub, null, 2)}\n`)
      console.log(`Synced packages/${name}/package.json version → v${pkg.version}`)
      changed = true
    } else {
      console.log(`@tollerud/${name} already at v${pkg.version}`)
    }
  } catch {
    console.error(`packages/${name}/package.json missing — run npm run ${syncCmd}`)
    process.exit(1)
  }
}

if (!changed) {
  console.log('All package versions already aligned.')
}
