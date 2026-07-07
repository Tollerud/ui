import { defineConfig } from 'tsup'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

/** Server-safe subpaths — no React hooks; safe to import from RSC without a client boundary. */
const NO_USE_CLIENT = new Set(['utils.js'])

function prependUseClient() {
  const dir = join(__dirname, 'dist')
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.js') || NO_USE_CLIENT.has(file)) continue
    const path = join(dir, file)
    const content = readFileSync(path, 'utf8')
    if (!content.startsWith("'use client'")) {
      writeFileSync(path, `'use client';\n${content}`)
    }
  }
}

const manifest = JSON.parse(
  readFileSync(join(__dirname, 'entries/manifest.json'), 'utf8')
) as string[]

const entry = Object.fromEntries(
  manifest.map((path) => {
    if (path === 'components/index.ts') return ['index', path]
    const name = path.replace(/^entries\//, '').replace(/\.ts$/, '')
    return [name, path]
  })
)

export default defineConfig({
  entry,
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  tsconfig: 'tsconfig.build.json',
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'clsx',
    'tailwind-merge',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-progress',
    '@radix-ui/react-tabs',
    '@radix-ui/react-tooltip',
    '@radix-ui/react-slot',
    'class-variance-authority',
    'framer-motion',
    'lucide-react',
    'sonner',
    '@paper-design/shaders-react',
  ],
  esbuildOptions(options) {
    options.alias = {
      '@/lib/utils': './lib/utils.ts',
      '@/lib/floating-dropdown': './lib/floating-dropdown.tsx',
      '@/lib/bypass-modal-scroll-lock': './lib/bypass-modal-scroll-lock.ts',
      '@/lib/use-mobile': './lib/use-mobile.ts',
      '@/lib/chart-series': './lib/chart-series.ts',
      '@/lib/chart-interaction': './lib/chart-interaction.tsx',
    }
  },
  onSuccess: async () => {
    prependUseClient()
  },
})
