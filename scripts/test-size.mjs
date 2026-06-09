#!/usr/bin/env node
/**
 * Bundle size budget — file bytes (no headless Chrome).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const root = join(import.meta.dirname, '..')

const budgets = [
  { file: 'dist/button.js', limitKb: 12, label: 'button subpath' },
  { file: 'dist/index.js', limitKb: 220, label: 'main barrel' },
]

let failed = false

for (const { file, limitKb, label } of budgets) {
  const path = join(root, file)
  const raw = readFileSync(path)
  const gzipKb = gzipSync(raw).length / 1024
  const limit = limitKb
  const ok = gzipKb <= limit
  const status = ok ? 'OK' : 'FAIL'
  console.log(`${status} ${label}: ${gzipKb.toFixed(1)} KB gzip (limit ${limit} KB) — ${file}`)
  if (!ok) failed = true
}

if (failed) process.exit(1)
console.log('Size budget passed.')
