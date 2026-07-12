#!/usr/bin/env node
/**
 * Ensures packages/email is in lockstep with @tollerud/ui:
 *   - version matches the root package
 *   - src/tokens.ts matches the synced output of lib/tokens.ts
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const emailPkgPath = join(root, 'packages/email/package.json')

let emailPkg
try {
  emailPkg = JSON.parse(readFileSync(emailPkgPath, 'utf8'))
} catch {
  console.error('packages/email/package.json missing — run npm run sync:email')
  process.exit(1)
}

if (emailPkg.version !== pkg.version) {
  console.error(`@tollerud/email v${emailPkg.version} !== @tollerud/ui v${pkg.version}`)
  console.error('Run npm run sync:registry (or npm run sync:email) after bumping package.json')
  process.exit(1)
}

const syncedFiles = [
  'packages/email/src/tokens.ts',
  'packages/email/src/monogram-geometry.ts',
]
const before = syncedFiles.map((f) => readFileSync(join(root, f), 'utf8'))
execSync('node scripts/sync-email-package.mjs', { cwd: root, stdio: 'pipe' })
const after = syncedFiles.map((f) => readFileSync(join(root, f), 'utf8'))

for (let i = 0; i < syncedFiles.length; i++) {
  if (before[i] !== after[i]) {
    console.error(`${syncedFiles[i]} is out of sync — run npm run sync:email`)
    process.exit(1)
  }
}

console.log(`Email package lockstep OK (v${pkg.version})`)
