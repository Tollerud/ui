#!/usr/bin/env node
/**
 * Builds shadcn v3-compatible per-item JSON from legacy registry.json + lib/utils.
 * Output: registry-dist/{name}.json — embedded file content for `npx shadcn add`.
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const legacy = JSON.parse(readFileSync(join(root, 'registry.json'), 'utf8'))

const typeMap = {
  'components:ui': 'registry:ui',
}

const items = Object.entries(legacy.components).map(([name, entry]) => ({
  name,
  type: typeMap[entry.type] ?? 'registry:ui',
  title: entry.name,
  description: entry.description,
  dependencies: entry.dependencies ?? [],
  registryDependencies: entry.registryDependencies ?? [],
  files: (entry.files ?? []).map((path) => ({
    path,
    type: typeMap[entry.type] ?? 'registry:ui',
  })),
}))

items.push({
  name: 'utils',
  type: 'registry:lib',
  title: 'Utils',
  description: 'cn() helper used by registry components',
  dependencies: ['clsx', 'tailwind-merge'],
  registryDependencies: [],
  files: [{ path: 'lib/utils.ts', type: 'registry:lib' }],
})

const buildManifest = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'tollerud',
  homepage: legacy.homepage ?? 'https://design.tollerud.dev',
  items,
}

const manifestPath = join(root, 'scripts', 'registry-build.json')
writeFileSync(manifestPath, `${JSON.stringify(buildManifest, null, 2)}\n`)

execSync('npx shadcn@3.2.1 build scripts/registry-build.json -o registry-dist', {
  cwd: root,
  stdio: 'inherit',
})

console.log('Built registry-dist for shadcn CLI.')
