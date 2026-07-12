#!/usr/bin/env node
/**
 * Syncs @tollerud/email with @tollerud/ui:
 *   - copies lib/tokens.ts → packages/email/src/tokens.ts (token source of truth)
 *   - copies root LICENSE
 *   - locks packages/email/package.json version to the root version
 *
 * The primitives and templates under packages/email/src are authored in place
 * (email is its own render target), so only tokens + version are synced here.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const emailRoot = join(root, 'packages/email')
const srcDir = join(emailRoot, 'src')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

mkdirSync(srcDir, { recursive: true })

// Token source of truth — lib/tokens.ts is itself generated from tokens.css.
const tokens = readFileSync(join(root, 'lib/tokens.ts'), 'utf8').replace(
  '// AUTO-GENERATED from tokens.css by scripts/gen-tokens.mjs — do not edit by hand.',
  '// AUTO-GENERATED — synced from @tollerud/ui lib/tokens.ts by scripts/sync-email-package.mjs.\n// Do not edit by hand. Run `npm run sync:email` after `npm run gen:tokens`.',
)
writeFileSync(join(srcDir, 'tokens.ts'), tokens)

copyFileSync(join(root, 'LICENSE'), join(emailRoot, 'LICENSE'))

// Lock version to the root package.
const emailPkgPath = join(emailRoot, 'package.json')
const emailPkg = JSON.parse(readFileSync(emailPkgPath, 'utf8'))
emailPkg.version = pkg.version
writeFileSync(emailPkgPath, JSON.stringify(emailPkg, null, 2) + '\n')

console.log(`Synced @tollerud/email tokens + version (v${pkg.version}).`)
