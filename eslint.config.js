import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist/**', 'docs/**', 'docs-app/public/**', 'docs-app/.next/**', 'docs-app/next-env.d.ts', 'docs-app/tailwind.config.cjs', 'docs-app/tollerud-docs-preset.cjs', 'docs-app/node_modules/**', 'node_modules/**', 'coverage/**', 'tollerud-preset.js', 'entries/**', '_site/**', 'examples/consumer/dist/**', 'examples/consumer/.next/**', 'examples/consumer/out/**', 'examples/consumer/next-env.d.ts', 'packages/footer/dist/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'playwright.config.ts', 'e2e/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
)
