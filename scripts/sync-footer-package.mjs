#!/usr/bin/env node
/**
 * Syncs @tollerud/footer package sources from @tollerud/ui components and locks version.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const footerRoot = join(root, 'packages/footer')
const srcDir = join(footerRoot, 'src')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

mkdirSync(srcDir, { recursive: true })

function copyWithRewrite(from, to, rewrite) {
  let content = readFileSync(join(root, from), 'utf8')
  if (rewrite) content = rewrite(content)
  writeFileSync(join(srcDir, to), content)
}

copyWithRewrite('lib/utils.ts', 'utils.ts')
copyFileSync(join(root, 'components/monogram-geometry.ts'), join(srcDir, 'monogram-geometry.ts'))

copyWithRewrite('components/Monogram.tsx', 'Monogram.tsx', (s) =>
  s.replace("from '@/lib/utils'", "from './utils'"),
)

copyWithRewrite('components/Footer.tsx', 'Footer.tsx', (s) =>
  s
    .replace("from '@/lib/utils'", "from './utils'")
    .replace("from './Monogram'", "from './Monogram'"),
)

writeFileSync(
  join(srcDir, 'index.ts'),
  "export { Footer, type FooterProps, type FooterLabels } from './Footer'\nexport { Monogram, type MonogramProps, type MonogramColor } from './Monogram'\n",
)

const footerPkg = {
  name: '@tollerud/footer',
  version: pkg.version,
  description: 'Tollerud branded footer — synced from @tollerud/ui Footer export',
  private: false,
  type: 'module',
  repository: {
    type: 'git',
    url: 'git+https://github.com/Tollerud/ui.git',
    directory: 'packages/footer',
  },
  homepage: 'https://design.tollerud.dev/',
  license: 'MIT',
  author: pkg.author,
  sideEffects: false,
  main: './dist/index.js',
  module: './dist/index.js',
  types: './dist/index.d.ts',
  exports: {
    '.': {
      import: {
        types: './dist/index.d.ts',
        default: './dist/index.js',
      },
    },
  },
  files: ['dist'],
  scripts: {
    build: 'tsup src/index.ts --format esm --dts --clean',
    typecheck: 'tsc --noEmit',
  },
  peerDependencies: {
    react: '>=18',
    'react-dom': '>=18',
  },
  dependencies: {
    clsx: '^2.1.1',
    'tailwind-merge': '^3.0.0',
  },
  devDependencies: {
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    tsup: '^8.5.0',
    typescript: '^5.8.0',
  },
}

writeFileSync(join(footerRoot, 'package.json'), `${JSON.stringify(footerPkg, null, 2)}\n`)

console.log(`Synced packages/footer → v${pkg.version}`)
