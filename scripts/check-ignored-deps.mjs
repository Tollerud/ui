#!/usr/bin/env node
/**
 * Guards against dependencies rotting silently in Dependabot's ignore list.
 *
 * Reads every `dependency-name` under an `ignore:` in .github/dependabot.yml,
 * finds where each is declared across the repo's package.json files (incl. root
 * peerDependencies), and compares the declared version to the latest on npm.
 * Reports anything that's fallen behind.
 *
 * Used by:
 *   - .github/workflows/stale-ignore-audit.yml (monthly → opens a tracking issue)
 *   - the release ritual (`npm run check:ignored-deps`) so lockstep-pinned deps
 *     like @paper-design/shaders-react get bumped when a ui release goes out.
 *
 * Prints a markdown report and, on the last line, `BEHIND_COUNT=<n>`. Always
 * exits 0 — being behind is informational, not a failure.
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')

// package.json files to scan for declared versions of an ignored dep.
const PKG_PATHS = [
  'package.json',
  'docs-app/package.json',
  'fixtures/consumer/package.json',
  'examples/next-starter/package.json',
  'packages/footer/package.json',
  'packages/email/package.json',
]

const DEP_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies']

/** Ignored dependency names from .github/dependabot.yml (dedup, dependency-free parse). */
function ignoredDeps() {
  const yml = readFileSync(join(root, '.github/dependabot.yml'), 'utf8')
  const names = new Set()
  for (const m of yml.matchAll(/dependency-name:\s*["']?([^"'\s]+)["']?/g)) {
    names.add(m[1])
  }
  return [...names]
}

/** Strip a range to a comparable x.y.z; ignores multi-range/`||` (returns the max). */
function cleanVersions(range) {
  return [...range.matchAll(/\d+\.\d+\.\d+/g)].map((m) => m[0])
}

function cmp(a, b) {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0)
  }
  return 0
}

function maxVersion(list) {
  return list.reduce((max, v) => (max && cmp(max, v) >= 0 ? max : v), null)
}

/** Where an ignored dep is declared, and at what version. */
function declarations(dep) {
  const out = []
  for (const rel of PKG_PATHS) {
    let pkg
    try {
      pkg = JSON.parse(readFileSync(join(root, rel), 'utf8'))
    } catch {
      continue
    }
    for (const field of DEP_FIELDS) {
      const range = pkg[field]?.[dep]
      if (range) out.push({ where: `${rel} (${field})`, range })
    }
  }
  return out
}

function latestOnNpm(dep) {
  try {
    return execSync(`npm view ${dep} version`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

const behind = []
const lines = ['## Ignored dependencies audit', '']

for (const dep of ignoredDeps().sort()) {
  const decls = declarations(dep)
  const latest = latestOnNpm(dep)
  if (decls.length === 0 || !latest) continue
  const declaredMax = maxVersion(decls.flatMap((d) => cleanVersions(d.range)))
  const isBehind = declaredMax && cmp(latest, declaredMax) > 0
  const mark = isBehind ? '⚠️ BEHIND' : '✓'
  lines.push(`- **${dep}** — declared \`${declaredMax ?? '?'}\`, latest \`${latest}\` ${mark}`)
  for (const d of decls) lines.push(`  - ${d.where}: \`${d.range}\``)
  if (isBehind) behind.push({ dep, declaredMax, latest })
}

if (behind.length === 0) {
  lines.push('', 'All ignored dependencies are up to date. ✅')
}

console.log(lines.join('\n'))
console.log(`\nBEHIND_COUNT=${behind.length}`)
