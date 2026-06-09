#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { DOC_SYMBOLS, REACT_HOOKS } from '../docs-app/lib/provide-symbols.js'

const dir = join(import.meta.dirname, '../docs-app/components/pages')

/** Defined locally in page-backgrounds.jsx — must not be destructured from __p in that file. */
const PAGE_BACKGROUND_LOCAL = new Set([
  'Squares',
  'GrainGradient',
  'BgFrame',
  'GradientReadabilityDemo',
  'PageBackgrounds',
])

function pageHeader(file) {
  const symbols =
    file === 'page-backgrounds.jsx'
      ? DOC_SYMBOLS.filter((s) => !PAGE_BACKGROUND_LOCAL.has(s))
      : DOC_SYMBOLS
  return `'use client'
import React, { ${REACT_HOOKS.join(', ')} } from 'react'
import * as __p from '@/lib/provide-pages'
const { ${symbols.join(', ')} } = __p

`
}

for (const file of readdirSync(dir).filter((f) => f.startsWith('page-') && f.endsWith('.jsx'))) {
  let src = readFileSync(join(dir, file), 'utf8')
  src = src.replace(/^'use client'\n[\s\S]*?const \{[^}]+\} = __p\n\n/, '')
  src = src.replace(/^'use client'\n/, '')
  if (file === 'page-patterns.jsx') {
    src = src.replace(/^import \{ Timeline \} from '\.\/page-components'\n\n/, '')
  }
  if (file === 'page-nav-overlays.jsx' && !src.includes('adapt-command-groups')) {
    src = `import { adaptCommandGroups, docsCommandFilter } from '@/lib/adapt-command-groups'\n\n${src}`
  }
  if (file === 'page-patterns.jsx' && !src.includes('adapt-command-groups')) {
    src = `import { adaptCommandGroups, docsCommandFilter } from '@/lib/adapt-command-groups'\n\n${src}`
  }
  writeFileSync(join(dir, file), pageHeader(file) + src.trimStart())
}

console.log('inject-page-imports: patched page-*.jsx files')
