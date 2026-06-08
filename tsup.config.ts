import { defineConfig } from 'tsup'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

// esbuild strips/rejects "use client" as a banner (treats it as a module
// directive and errors when bundling). Prepend it to the built files after
// the fact so consumers' RSC bundlers see the whole package as client code —
// it contains hooks (useState, useEffect, etc.) throughout.
function prependUseClient() {
  const dir = join(__dirname, 'dist')
  for (const file of readdirSync(dir)) {
    if (file === 'index.js' || file === 'index.cjs') {
      const path = join(dir, file)
      const content = readFileSync(path, 'utf8')
      if (!content.startsWith("'use client'")) {
        writeFileSync(path, `'use client';\n${content}`)
      }
    }
  }
}

export default defineConfig({
  entry: ['components/index.ts'],
  format: ['esm', 'cjs'],
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' }
  },
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
    'class-variance-authority',
    'framer-motion',
    'lucide-react',
    'sonner',
    '@paper-design/shaders-react',
  ],
  esbuildOptions(options) {
    options.alias = {
      '@/lib/utils': './lib/utils.ts',
    }
  },
  onSuccess: async () => {
    prependUseClient()
  },
})
