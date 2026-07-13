#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

function collectCssFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return collectCssFiles(full)
    return entry.name.endsWith('.css') ? [full] : []
  })
}

const root = join(import.meta.dirname, '..')
const docsApp = join(root, 'docs-app')

copyFileSync(join(root, 'CHANGELOG.md'), join(docsApp, 'public/CHANGELOG.md'))

execSync('node scripts/generate-docs-props-json.mjs', { cwd: root, stdio: 'inherit' })
execSync('node scripts/sync-brand-assets.mjs', { cwd: root, stdio: 'inherit' })

if (!existsSync(join(root, 'dist/index.js'))) {
  execSync('npm run build', { cwd: root, stdio: 'inherit' })
}

if (!existsSync(join(docsApp, 'node_modules/next'))) {
  execSync('npm install', { cwd: docsApp, stdio: 'inherit' })
}

// The docs configurator aliases @tollerud/email to packages/email/src, whose
// @react-email/* imports resolve from packages/email/node_modules — so it must
// be installed (source only; no build needed).
if (!existsSync(join(root, 'packages/email/node_modules/@react-email'))) {
  execSync('npm install', { cwd: join(root, 'packages/email'), stdio: 'inherit' })
}

execSync('npm run build', { cwd: docsApp, stdio: 'inherit' })

const cssBundle = collectCssFiles(join(root, '_site/_next/static'))
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n')

const requiredUtilities = ['bg-tollerud-yellow', 'text-tollerud-text-primary', 'rounded-full']
const missing = requiredUtilities.filter((token) => !cssBundle.includes(token))
if (missing.length > 0) {
  console.error(
    `Docs CSS is missing npm component utilities: ${missing.join(', ')}. ` +
      'Check @source paths and tailwind.config.cjs in docs-app/app/globals.css.',
  )
  process.exit(1)
}

console.log('Docs CSS includes npm component utilities.')
