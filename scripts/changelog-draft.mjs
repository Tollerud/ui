#!/usr/bin/env node
/**
 * Draft a CHANGELOG entry from git commits since the latest ## heading.
 * Output follows docs-site parser rules — review before committing.
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const changelog = readFileSync('CHANGELOG.md', 'utf8')
const latest = changelog.match(/^## (\d+\.\d+\.\d+) — (\d{4}-\d{2}-\d{2})/m)

if (!latest) {
  console.error('Could not find latest version heading in CHANGELOG.md')
  process.exit(1)
}

const [, version, date] = latest
const range = `v${version}..HEAD`
let commits = ''

try {
  commits = execSync(`git log ${range} --pretty=format:%s`, { encoding: 'utf8' })
} catch {
  commits = execSync('git log -20 --pretty=format:%s', { encoding: 'utf8' })
}

const lines = commits
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((line) => !line.startsWith('Merge '))

if (lines.length === 0) {
  console.log(`No commits since v${version}.`)
  process.exit(0)
}

const today = new Date().toISOString().slice(0, 10)

console.log(`## NEXT — ${today} — <title>`)
console.log('')
console.log('Short summary of what changed.')
console.log('')
console.log('### Changes')
console.log('')
for (const line of lines) {
  console.log(`- ${line}`)
}
console.log('')
console.log('### Migration')
console.log('')
console.log('Nothing breaking.')
console.log('')
console.log(`(Commits since v${version} on ${date})`)
