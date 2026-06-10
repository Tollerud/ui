import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  tsconfig: 'tsconfig.json',
  external: ['react', 'react-dom', 'react/jsx-runtime', 'clsx', 'tailwind-merge'],
})
