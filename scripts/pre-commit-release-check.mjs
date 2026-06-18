#!/usr/bin/env node
/**
 * Pre-commit hook — enforces the release checklist whenever package.json version changes.
 *
 * Checks:
 *  1. All required files were staged alongside a version bump
 *  2. CHANGELOG.md contains an entry matching the new version
 *  3. COMPLETENESS_ROADMAP.md header matches the new version
 *  4. registry.json version matches package.json
 */

import { execSync } from 'child_process'

const REQUIRED_FILES = [
  'CHANGELOG.md',
  'COMPLETENESS_ROADMAP.md',
  'SKILL.md',
  'AGENTS.md',
  'COMPONENTS.md',
  'registry.json',
  'PROPS.generated.md',
  'docs-app/lib/props-data.json',
  'fixtures/consumer/package.json',
  'fixtures/consumer/package-lock.json',
]

function getStagedFiles() {
  return execSync('git diff --cached --name-only', { encoding: 'utf8' })
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)
}

function getStagedContent(file) {
  try {
    return execSync(`git show :${file}`, { encoding: 'utf8' })
  } catch {
    return null
  }
}

const staged = getStagedFiles()

// Only run checks when package.json is staged
if (!staged.includes('package.json')) process.exit(0)

const pkg = JSON.parse(getStagedContent('package.json') ?? '{}')
const version = pkg.version

if (!version) {
  console.error('pre-commit: could not read version from staged package.json')
  process.exit(1)
}

// Check staged content of the old version to detect an actual bump
let oldVersion
try {
  const oldPkg = JSON.parse(execSync('git show HEAD:package.json', { encoding: 'utf8' }))
  oldVersion = oldPkg.version
} catch {
  // No HEAD yet (initial commit) — skip version-bump checks
  process.exit(0)
}

if (oldVersion === version) process.exit(0)

// Version was bumped — enforce the checklist
let failed = false

// Generated files that are allowed to be unstaged only when unchanged since HEAD
const GENERATED_FILES = new Set([
  'PROPS.generated.md',
  'docs-app/lib/props-data.json',
  'fixtures/consumer/package.json',
  'fixtures/consumer/package-lock.json',
])

function isUnchangedSinceHead(file) {
  try {
    execSync(`git diff --quiet HEAD -- "${file}"`, { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

// 1. All required files must be staged (generated files may be absent if already current)
for (const file of REQUIRED_FILES) {
  if (!staged.includes(file)) {
    if (GENERATED_FILES.has(file) && isUnchangedSinceHead(file)) continue
    console.error(`pre-commit [release-checklist]: ${file} must be staged when bumping version (${oldVersion} → ${version})`)
    failed = true
  }
}

// 2. CHANGELOG.md must have a matching entry
const changelog = getStagedContent('CHANGELOG.md') ?? ''
if (!changelog.includes(`## ${version}`)) {
  console.error(`pre-commit [release-checklist]: CHANGELOG.md has no entry for v${version}`)
  failed = true
}

// 3. COMPLETENESS_ROADMAP.md header must match
const roadmap = getStagedContent('COMPLETENESS_ROADMAP.md') ?? ''
if (!roadmap.includes(`v${version}`)) {
  console.error(`pre-commit [release-checklist]: COMPLETENESS_ROADMAP.md header does not mention v${version}`)
  failed = true
}

// 4. registry.json version must match
const registry = JSON.parse(getStagedContent('registry.json') ?? '{}')
if (registry.version !== version) {
  console.error(`pre-commit [release-checklist]: registry.json version (${registry.version}) does not match package.json (${version}) — run: npm run sync:registry`)
  failed = true
}

if (failed) {
  console.error('\npre-commit: fix the above before committing. See CLAUDE.md for the full release checklist.')
  process.exit(1)
}

console.log(`pre-commit [release-checklist]: all checks passed for v${version} ✓`)
