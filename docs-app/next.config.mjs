import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: '../_site',
  outputFileTracingRoot: path.join(root, '..'),
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ['@tollerud/ui'],
  turbopack: {
    resolveAlias: {
      '@tollerud/ui': '../dist/index.js',
      // Compile @tollerud/email from local source so the docs configurator always
      // reflects the current package (no post-publish version bump). Its runtime
      // deps (@react-email/*) resolve from docs-app, keeping a single React.
      '@tollerud/email': '../packages/email/src/index.ts',
      '@/lib/utils': '../lib/utils.ts',
      '@paper-design/shaders-react': './node_modules/@paper-design/shaders-react',
    },
  },
}

export default nextConfig
