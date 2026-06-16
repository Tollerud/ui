#!/usr/bin/env node
/**
 * Generate PROPS.generated.md from exported *Props interfaces in components/*.tsx.
 * Run: npm run docs:props
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const componentsDir = join(root, 'components')
const outPath = join(root, 'PROPS.generated.md')

const files = readdirSync(componentsDir)
  .filter((f) => f.endsWith('.tsx') && !f.includes('.test.'))
  .sort()

const sections = []

for (const file of files) {
  const source = readFileSync(join(componentsDir, file), 'utf8')
  const componentName = file.replace(/\.tsx$/, '')

  const ifaceRe = /export\s+interface\s+(\w+Props)(?:<(?:[^<>]|<[^<>]*>)*>)?\s*(extends\s+[^{]+)?\s*\{([\s\S]*?)\n\}/g
  let match
  while ((match = ifaceRe.exec(source)) !== null) {
    const [, name, extendsClause = '', body] = match
    const extendsLine = extendsClause.trim() ? ` extends ${extendsClause.trim()}` : ''
    const props = body
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//') && !line.startsWith('/*'))
      .map((line) => line.replace(/;$/, ''))

    if (props.length === 0) continue

    sections.push({
      component: componentName,
      name,
      extendsLine,
      props,
    })
  }
}

sections.sort((a, b) => a.component.localeCompare(b.component) || a.name.localeCompare(b.name))

const lines = [
  '# Generated component props',
  '',
  '> Auto-generated from `components/*.tsx`. Do not edit by hand.',
  '> Regenerate: `npm run docs:props` · Drift check: `npm run test:props`',
  '',
]

for (const section of sections) {
  lines.push(`## ${section.component} — \`${section.name}\`${section.extendsLine}`)
  lines.push('')
  for (const prop of section.props) {
    lines.push(`- \`${prop}\``)
  }
  lines.push('')
}

writeFileSync(outPath, `${lines.join('\n').trimEnd()}\n`)
console.log(`Wrote ${sections.length} prop interfaces to PROPS.generated.md`)
