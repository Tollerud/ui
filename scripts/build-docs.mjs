#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const docsApp = join(root, 'docs-app')

if (!existsSync(join(root, 'dist/index.js'))) {
  execSync('npm run build', { cwd: root, stdio: 'inherit' })
}

if (!existsSync(join(docsApp, 'node_modules/next'))) {
  execSync('npm install', { cwd: docsApp, stdio: 'inherit' })
}

execSync('npm run build', { cwd: docsApp, stdio: 'inherit' })
