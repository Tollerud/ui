#!/usr/bin/env node
/**
 * Generates lib/tokens.ts from the :root block of tokens.css.
 *
 * tokens.css stays the author-facing source of truth. This script parses its
 * single-line custom properties into a typed JS object so non-CSS consumers
 * (notably @tollerud/email, where `var(--tollerud-*)` will not resolve in mail
 * clients) can read literal token values.
 *
 * Usage:
 *   node scripts/gen-tokens.mjs           # write lib/tokens.ts
 *   node scripts/gen-tokens.mjs --check   # exit 1 if lib/tokens.ts is stale
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const cssPath = join(root, 'tokens.css')
const outPath = join(root, 'lib/tokens.ts')

const css = readFileSync(cssPath, 'utf8')

// Grab the first :root { ... } block only.
const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/)
if (!rootMatch) {
  console.error('gen-tokens: could not find :root block in tokens.css')
  process.exit(1)
}
const body = rootMatch[1]

// Match single-line declarations: --tollerud-name: value;  (skip multi-line
// values like gradients, and strip trailing /* comments */).
const declRe = /--tollerud-([a-z0-9-]+)\s*:\s*([^;\n]+?)\s*;/g

/** kebab → camelCase, e.g. "noir-900" → "noir900", "text-2xl" → "text2xl" */
function toKey(name) {
  return name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}

function stripComment(value) {
  return value.replace(/\/\*.*?\*\//g, '').trim()
}

const entries = []
const seen = new Set()
let m
while ((m = declRe.exec(body)) !== null) {
  const key = toKey(m[1])
  const value = stripComment(m[2])
  // Skip values that reference other custom properties — not resolvable as a
  // literal in email. (Keeps the JS module a flat map of concrete values.)
  if (value.includes('var(')) continue
  if (seen.has(key)) continue
  seen.add(key)
  entries.push([key, value])
}

const banner = `// AUTO-GENERATED from tokens.css by scripts/gen-tokens.mjs — do not edit by hand.
// Run \`npm run gen:tokens\` after changing tokens.css.
`

const lines = entries.map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`).join('\n')
const out = `${banner}
export const tokens = {
${lines}
} as const

export type TokenName = keyof typeof tokens
`

if (process.argv.includes('--check')) {
  let current = ''
  try {
    current = readFileSync(outPath, 'utf8')
  } catch {
    /* missing file → stale */
  }
  if (current !== out) {
    console.error(
      'gen-tokens: lib/tokens.ts is out of sync with tokens.css.\n' +
        'Run `npm run gen:tokens` and commit the result.',
    )
    process.exit(1)
  }
  console.log(`gen-tokens: lib/tokens.ts is in sync (${entries.length} tokens).`)
} else {
  writeFileSync(outPath, out)
  console.log(`gen-tokens: wrote lib/tokens.ts (${entries.length} tokens).`)
}
