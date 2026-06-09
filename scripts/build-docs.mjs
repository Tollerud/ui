#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const docsApp = join(root, 'docs-app')

copyFileSync(join(root, 'CHANGELOG.md'), join(docsApp, 'public/CHANGELOG.md'))

execSync('node scripts/generate-docs-props-json.mjs', { cwd: root, stdio: 'inherit' })

const brandDir = join(docsApp, 'public/brand')
mkdirSync(brandDir, { recursive: true })
for (const file of [
  'tollerud-logo.svg',
  'tollerud-avatar.svg',
  'tollerud-avatar.png',
  'tollerud-avatar-full.svg',
  'tollerud-avatar-full.png',
]) {
  const fromRoot = join(root, file)
  const fromPublic = join(docsApp, 'public', file)
  const fromBrand = join(docsApp, 'public/brand', file)
  const source = existsSync(fromRoot) ? fromRoot : existsSync(fromPublic) ? fromPublic : fromBrand
  if (existsSync(source)) {
    copyFileSync(source, join(brandDir, file))
  }
}

if (!existsSync(join(root, 'dist/index.js'))) {
  execSync('npm run build', { cwd: root, stdio: 'inherit' })
}

if (!existsSync(join(docsApp, 'node_modules/next'))) {
  execSync('npm install', { cwd: docsApp, stdio: 'inherit' })
}

execSync('npm run build', { cwd: docsApp, stdio: 'inherit' })

const cssDir = join(root, '_site/_next/static/css')
const cssBundle = readdirSync(cssDir)
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(join(cssDir, file), 'utf8'))
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
