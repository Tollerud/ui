#!/usr/bin/env node
/**
 * Prepare docs-app/components/*.jsx for Next.js:
 * - prepend 'use client'
 * - convert window.PageX = PageX → export default PageX
 * - convert Object.assign(window, …) → export { … }
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(import.meta.dirname, '../docs-app/components/pages')

for (const file of readdirSync(dir).filter((f) => f.endsWith('.jsx'))) {
  let src = readFileSync(join(dir, file), 'utf8')
  if (!src.startsWith("'use client'")) {
    src = `'use client'\n${src}`
  }

  src = src.replace(/^window\.(Page\w+)\s*=\s*\1;\s*$/m, 'export default $1;')

  const singleExports = []
  src = src.replace(/^window\.(\w+)\s*=\s*\1;\s*$/gm, (_, name) => {
    if (name.startsWith('Page')) return `export default ${name};`
    singleExports.push(name)
    return ''
  })

  const assignMatch = src.match(/Object\.assign\(window,\s*\{([^}]+)\}\s*\);\s*$/s)
  if (assignMatch) {
    const names = assignMatch[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.split(':')[0].trim())
    src = src.replace(/Object\.assign\(window,\s*\{[^}]+\}\s*\);\s*$/s, `export { ${names.join(', ')} };\n`)
  }

  // primitives assigned react hooks to window — drop those from export
  src = src.replace(/,\s*useState,\s*useEffect,\s*useRef,\s*useCallback\s*\}/, ' }')

  if (singleExports.length) {
    src = `${src.trim()}\nexport { ${singleExports.join(', ')} };\n`
  }

  writeFileSync(join(dir, file), src)
}

console.log('nextify-docs: patched', readdirSync(dir).filter((f) => f.endsWith('.jsx')).length, 'files')
