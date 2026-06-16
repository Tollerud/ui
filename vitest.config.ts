import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@/lib/utils': path.resolve(__dirname, './lib/utils.ts'),
      '@/lib/dropdown-placement': path.resolve(__dirname, './lib/dropdown-placement.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'docs', 'docs-app', 'e2e'],
  },
})
