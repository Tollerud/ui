#!/usr/bin/env node
/**
 * Ensures registry.json, components/index.ts, source files, and docs bridge stay aligned.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')

function parseIndexExports(source) {
  const names = new Set()
  for (const match of source.matchAll(/^export \{([^}]+)\}/gm)) {
    for (const part of match[1].split(',')) {
      const trimmed = part.trim()
      if (!trimmed || trimmed.startsWith('type ')) continue
      const name = trimmed.replace(/^type\s+/, '').split(/\s+/)[0]
      if (name) names.add(name)
    }
  }
  return names
}

function parseExportFrom(source, fromClause) {
  const names = new Set()
  const escaped = fromClause.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`export \\{([^}]+)\\} from '${escaped}'`, 'g')
  for (const match of source.matchAll(re)) {
    for (const part of match[1].split(',')) {
      const name = part.trim()
      if (name) names.add(name)
    }
  }
  return names
}

const indexExports = parseIndexExports(readFileSync(join(root, 'components/index.ts'), 'utf8'))
const registry = JSON.parse(readFileSync(join(root, 'registry.json'), 'utf8'))
const registryKeys = Object.keys(registry.components)

const errors = []

for (const key of registryKeys) {
  const entry = registry.components[key]
  const { name } = entry
  if (!indexExports.has(name)) {
    errors.push(`registry "${key}" (${name}) is not exported from components/index.ts`)
  }
  for (const file of entry.files ?? []) {
    if (!existsSync(join(root, file))) {
      errors.push(`registry "${key}" references missing file ${file}`)
    }
  }
}

const registryBases = new Set(
  registryKeys.map((key) => {
    const file = registry.components[key].files?.[0]
    return file?.replace(/^components\//, '').replace(/\.tsx$/, '')
  }).filter(Boolean),
)

for (const file of readdirSync(join(root, 'components'))) {
  if (!file.endsWith('.tsx') || file.endsWith('.test.tsx')) continue
  const base = file.replace(/\.tsx$/, '')
  if (!registryBases.has(base)) {
    errors.push(`components/${file} has no registry.json entry`)
  }
}

const uiMerged = readFileSync(join(root, 'docs-app/lib/ui-merged.js'), 'utf8')
const npmBridge = parseExportFrom(uiMerged, '@tollerud/ui')
const destructuring = uiMerged.match(/export const \{([^}]+)\} = NPM/)
if (destructuring) {
  for (const part of destructuring[1].split(',')) {
    const name = part.trim()
    if (name) npmBridge.add(name)
  }
}
const legacyBridge = parseExportFrom(uiMerged, '../components/legacy-ui')

const legacyStillInPackage = [...legacyBridge].filter((name) => indexExports.has(name))
if (legacyStillInPackage.length) {
  errors.push(
    `docs-app/lib/ui-merged.js still routes npm exports through legacy-ui: ${legacyStillInPackage.join(', ')}`,
  )
}

if (errors.length) {
  console.error('Registry drift detected:\n')
  for (const err of errors) console.error(`  • ${err}`)
  process.exit(1)
}

console.log(
  `Registry drift OK — ${registryKeys.length} registry entries, ${indexExports.size} index exports, ${npmBridge.size} npm bridge exports`,
)
