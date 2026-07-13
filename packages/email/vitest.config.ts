import { defineConfig } from 'vitest/config'

// The email package is standalone (not a root workspace), so its render tests
// run here — inside the package, against its own installed deps — rather than
// under the root vitest, which has no access to @react-email/*.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
