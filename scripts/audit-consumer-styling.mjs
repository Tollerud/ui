#!/usr/bin/env node
/**
 * Audit a consumer project for @tollerud/ui styling drift.
 *
 * Usage (from a consumer app root):
 *   npx tollerud-ui-audit
 *   npx tollerud-ui-audit ./apps/web
 *   node node_modules/@tollerud/ui/scripts/audit-consumer-styling.mjs
 *
 * Exit 0 when no issues (or only warnings with --warn-only).
 * Exit 1 when errors are found.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const args = process.argv.slice(2)
const warnOnly = args.includes('--warn-only')
const rootArg = args.find((a) => !a.startsWith('-'))
const root = rootArg ? resolve(rootArg) : process.cwd()

const SOURCE_DIRS = ['src', 'app', 'components', 'lib', 'pages']
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.css'])
const CSS_GLOBS = ['globals.css', 'global.css', 'app.css', 'index.css']

/** @type {{ level: 'error' | 'warn', code: string, message: string, hint?: string }[]} */
const findings = []

function add(level, code, message, hint) {
  findings.push({ level, code, message, hint })
}

function walk(dir, files = []) {
  if (!existsSync(dir)) return files
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'dist' || name === 'out' || name.startsWith('.')) {
      continue
    }
    const path = join(dir, name)
    const stat = statSync(path)
    if (stat.isDirectory()) {
      walk(path, files)
    } else if (CODE_EXT.has(name.slice(name.lastIndexOf('.')))) {
      files.push(path)
    }
  }
  return files
}

function readPkg(rootDir) {
  const path = join(rootDir, 'package.json')
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function collectSourceFiles(rootDir) {
  const files = []
  for (const dir of SOURCE_DIRS) {
    walk(join(rootDir, dir), files)
  }
  return files
}

function findCssEntryFiles(rootDir) {
  const hits = []
  for (const dir of ['app', 'src', 'styles', '.']) {
    const base = dir === '.' ? rootDir : join(rootDir, dir)
    if (!existsSync(base)) continue
    for (const name of CSS_GLOBS) {
      const path = join(base, name)
      if (existsSync(path)) hits.push(path)
    }
    const nestedApp = join(base, 'app')
    if (existsSync(nestedApp)) {
      for (const name of CSS_GLOBS) {
        const path = join(nestedApp, name)
        if (existsSync(path)) hits.push(path)
      }
    }
  }
  return [...new Set(hits)]
}

function rel(path) {
  return relative(root, path) || path
}

function checkPackage(rootDir) {
  const pkg = readPkg(rootDir)
  if (!pkg) {
    add('warn', 'no-package-json', 'No package.json found — skipping dependency checks.')
    return
  }
  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }
  if (!deps['@tollerud/ui']) {
    add('error', 'missing-ui-dep', '@tollerud/ui is not listed in package.json dependencies.')
  }
}

function checkSourceCss(rootDir) {
  const cssFiles = findCssEntryFiles(rootDir)
  if (cssFiles.length === 0) {
    add('warn', 'no-globals-css', 'No globals.css (or similar) found — verify Tailwind entry imports @tollerud/ui/globals.css and source.css.')
    return
  }

  let hasGlobals = false
  let hasSource = false
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf8')
    if (/@tollerud\/ui\/globals(-v3)?\.css/.test(content) || /@import\s+["']@tollerud\/ui\/globals/.test(content)) {
      hasGlobals = true
    }
    if (/@tollerud\/ui\/source\.css/.test(content) || /@source\s+["'][^"']*@tollerud\/ui\/dist/.test(content)) {
      hasSource = true
    }
  }

  if (!hasGlobals) {
    add('error', 'missing-globals-css', 'Tailwind entry CSS is missing @import "@tollerud/ui/globals.css".', 'Add both globals.css and source.css — see GETTING_STARTED.md.')
  }
  if (!hasSource) {
    add('error', 'missing-source-css', 'Tailwind entry CSS is missing @import "@tollerud/ui/source.css" (or a correct @source path).', 'Without source.css, @tollerud/ui utility classes may be purged in production.')
  }
}

function checkCopiedComponents(files) {
  const tokenPattern = /\btollerud-(yellow|noir|surface|btn|card|badge|glass|grid-bg|display)\b/
  for (const file of files) {
    if (file.includes('node_modules')) continue
    const content = readFileSync(file, 'utf8')
    if (!tokenPattern.test(content)) continue
    if (/@tollerud\/ui/.test(content)) continue
    add(
      'error',
      'copied-ds-tokens',
      `${rel(file)} uses tollerud-* classes without importing from @tollerud/ui.`,
      'Delete copied component files and import from the package instead.'
    )
  }
}

function checkHardcodedColors(files) {
  const hexPattern = /#(?:FFFF00|ffff00|0A0A0A|0a0a0a|E8D500|e8d500)\b/
  const utilityPattern = /\b(?:bg|text|border)-(?:yellow-400|yellow-500|black|zinc-9\d{2})\b/
  for (const file of files) {
    const content = readFileSync(file, 'utf8')
    if (hexPattern.test(content)) {
      add('error', 'hardcoded-hex', `${rel(file)} hardcodes Tollerud brand hex values.`, 'Use tokens: text-tollerud-yellow, bg-tollerud-noir-950, text-tollerud-yellow-warm.')
    }
    if (utilityPattern.test(content) && /\b(?:Button|Card|Badge|button className)/.test(content) === false) {
      if (/\bbg-yellow-400\b|\btext-yellow-400\b/.test(content)) {
        add('warn', 'generic-yellow-util', `${rel(file)} uses generic yellow Tailwind utilities for branded UI.`, 'Prefer <Button variant="primary"> or text-tollerud-yellow.')
      }
    }
  }
}

function checkUiClones(rootDir) {
  const cloneDirs = [
    join(rootDir, 'src', 'components', 'ui'),
    join(rootDir, 'components', 'ui'),
    join(rootDir, 'app', 'components', 'ui'),
  ]
  for (const dir of cloneDirs) {
    if (!existsSync(dir)) continue
    const entries = readdirSync(dir).filter((f) => /\.(tsx|ts|jsx|js)$/.test(f))
    if (entries.length > 0) {
      add(
        'error',
        'local-ui-clone',
        `Found local design-system clone at ${rel(dir)}/ (${entries.slice(0, 4).join(', ')}${entries.length > 4 ? ', …' : ''}).`,
        'Replace with imports from @tollerud/ui and delete the copied files.'
      )
    }
  }
}

function checkLocalCn(files) {
  for (const file of files) {
    if (!/\/(utils|cn)\.(ts|tsx|js)$/.test(file) && !file.endsWith('lib/utils.ts')) continue
    const content = readFileSync(file, 'utf8')
    if (/export\s+function\s+cn\b|export\s+const\s+cn\s*=/.test(content) && !/@tollerud\/ui/.test(content)) {
      add('warn', 'local-cn', `${rel(file)} defines a local cn() helper.`, 'import { cn } from "@tollerud/ui" or "@tollerud/ui/utils" instead.')
    }
  }
}

function checkButtonLinkNesting(files) {
  const patterns = [
    { re: /<Button[^>]*>\s*<\s*(?:Link|a)\b/, label: '<Button> wrapping <Link> or <a>' },
    { re: /<button[^>]*>\s*<\s*(?:Link|a)\b/, label: '<button> wrapping <Link> or <a>' },
  ]
  for (const file of files) {
    if (!/\.(tsx|jsx)$/.test(file)) continue
    const content = readFileSync(file, 'utf8')
    for (const { re, label } of patterns) {
      if (re.test(content)) {
        add(
          'error',
          'button-link-nesting',
          `${rel(file)} nests a link inside a button (${label}).`,
          'Use <Button asChild><Link … /></Button> or className={buttonVariants({ variant: "primary" })} on the link.'
        )
        break
      }
    }
  }
}

function checkUiReexports(files) {
  for (const file of files) {
    if (!/components\/ui\/index\.(ts|tsx)$/.test(file) && !/components\/ui\.ts$/.test(file)) continue
    const content = readFileSync(file, 'utf8')
    if (/from\s+['"]\.\.?\/|from\s+['"]@\/components\/ui\//.test(content) && !/from\s+['"]@tollerud\/ui['"]/.test(content)) {
      add(
        'warn',
        'ui-reexport-shim',
        `${rel(file)} re-exports local UI copies instead of @tollerud/ui.`,
        'Point imports at @tollerud/ui directly or export * from "@tollerud/ui" if you need a single entry.'
      )
    }
  }
}

function main() {
  if (!existsSync(root)) {
    console.error(`Project root not found: ${root}`)
    process.exit(1)
  }

  console.log(`Auditing @tollerud/ui consumer styling: ${root}\n`)

  checkPackage(root)
  checkSourceCss(root)
  checkUiClones(root)

  const files = collectSourceFiles(root)
  checkCopiedComponents(files)
  checkHardcodedColors(files)
  checkLocalCn(files)
  checkButtonLinkNesting(files)
  checkUiReexports(files)

  const errors = findings.filter((f) => f.level === 'error')
  const warnings = findings.filter((f) => f.level === 'warn')

  if (findings.length === 0) {
    console.log('No styling drift detected.')
    process.exit(0)
  }

  for (const f of findings) {
    const tag = f.level === 'error' ? 'ERROR' : 'WARN '
    console.log(`${tag} [${f.code}] ${f.message}`)
    if (f.hint) console.log(`       → ${f.hint}`)
  }

  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`)
  console.log('See GETTING_STARTED.md → Consumer project checklist for fixes.')

  if (errors.length > 0 && !warnOnly) {
    process.exit(1)
  }
  process.exit(0)
}

main()
