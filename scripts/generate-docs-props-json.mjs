#!/usr/bin/env node
/**
 * Build-time JSON for docs PropTable — same source as PROPS.generated.md.
 * Run: node scripts/generate-docs-props-json.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const componentsDir = join(root, 'components')
const outPath = join(root, 'docs-app/lib/props-data.json')

const files = readdirSync(componentsDir)
  .filter((f) => f.endsWith('.tsx') && !f.includes('.test.'))
  .sort()

/** @type {Record<string, Array<{ name: string, extends?: string, props: string[] }>>} */
const byComponent = {}

for (const file of files) {
  const source = readFileSync(join(componentsDir, file), 'utf8')
  const componentName = file.replace(/\.tsx$/, '')

  const ifaceRe = /export\s+interface\s+(\w+Props)(?:<(?:[^<>]|<[^<>]*>)*>)?\s*(extends\s+[^{]+)?\s*\{([\s\S]*?)\n\}/g
  let match
  while ((match = ifaceRe.exec(source)) !== null) {
    const [, name, extendsClause = '', body] = match
    const props = body
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//') && !line.startsWith('/*'))
      .map((line) => line.replace(/;$/, ''))

    if (props.length === 0) continue

    if (!byComponent[componentName]) byComponent[componentName] = []
    byComponent[componentName].push({
      name,
      extends: extendsClause.trim() || undefined,
      props,
    })
  }
}

writeFileSync(outPath, `${JSON.stringify(byComponent, null, 2)}\n`)
console.log(`Wrote props-data.json (${Object.keys(byComponent).length} components)`)
