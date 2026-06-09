#!/usr/bin/env node
/**
 * Installs the packed tarball in examples/consumer and runs a production build.
 */
import { execSync } from 'node:child_process'
import { readdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const consumer = join(root, 'examples/consumer')

for (const file of readdirSync(root)) {
  if (file.startsWith('tollerud-ui-') && file.endsWith('.tgz')) {
    unlinkSync(join(root, file))
  }
}

execSync('npm pack --pack-destination .', { cwd: root, stdio: 'inherit' })

const tgz = readdirSync(root).find((f) => f.startsWith('tollerud-ui-') && f.endsWith('.tgz'))
if (!tgz) throw new Error('npm pack did not produce a tarball')

execSync('rm -rf node_modules .next out', { cwd: consumer, stdio: 'inherit' })
execSync(`npm install ../../${tgz}`, { cwd: consumer, stdio: 'inherit' })
execSync('npm run build', { cwd: consumer, stdio: 'inherit' })

console.log('Consumer smoke test passed.')
