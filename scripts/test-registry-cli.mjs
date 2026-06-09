#!/usr/bin/env node
/**
 * Smoke test: npx shadcn add against built registry-dist items from the packed tarball.
 */
import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, unlinkSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const consumer = join(root, 'examples/registry-consumer')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const tgzName = `tollerud-ui-${pkg.version}.tgz`

execSync('node scripts/build-registry-dist.mjs', { cwd: root, stdio: 'inherit' })

const consumerPkgPath = join(consumer, 'package.json')
const consumerPkg = JSON.parse(readFileSync(consumerPkgPath, 'utf8'))
consumerPkg.dependencies['@tollerud/ui'] = `file:../../${tgzName}`
writeFileSync(consumerPkgPath, `${JSON.stringify(consumerPkg, null, 2)}\n`)

for (const file of readdirSync(root)) {
  if (file.startsWith('tollerud-ui-') && file.endsWith('.tgz')) {
    unlinkSync(join(root, file))
  }
}

execSync('npm pack --pack-destination .', { cwd: root, stdio: 'inherit' })

const tgz = readdirSync(root).find((f) => f.startsWith('tollerud-ui-') && f.endsWith('.tgz'))
if (!tgz || tgz !== tgzName) {
  throw new Error(`Expected tarball ${tgzName}`)
}

rmSync(join(consumer, 'node_modules'), { recursive: true, force: true })
rmSync(join(consumer, '.next'), { recursive: true, force: true })
rmSync(join(consumer, 'out'), { recursive: true, force: true })
rmSync(join(consumer, 'components'), { recursive: true, force: true })
rmSync(join(consumer, 'lib'), { recursive: true, force: true })

execSync(`npm install ../../${tgz}`, { cwd: consumer, stdio: 'inherit' })

const shadcnEnv = {
  ...process.env,
  CI: '1',
  npm_config_legacy_peer_deps: 'true',
}

const shadcn = (item) => {
  execSync(`npx shadcn@3.2.1 add ../../registry-dist/${item}.json -y -o -s`, {
    cwd: consumer,
    stdio: 'inherit',
    env: shadcnEnv,
  })
}

// utils first — registry components import @/lib/utils
shadcn('utils')
shadcn('button')

execSync('npm run build', { cwd: consumer, stdio: 'inherit' })

console.log('Registry CLI smoke test passed.')
