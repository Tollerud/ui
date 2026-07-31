import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    // .claude/worktrees/** are separate git checkouts created by Claude Code
    // sessions — they carry their own copies of the whole repo and must not
    // be linted as part of this one.
    ignores: ['dist/**', 'docs-app/public/**', 'docs-app/.next/**', 'docs-app/next-env.d.ts', 'docs-app/tailwind.config.cjs', 'docs-app/tollerud-docs-preset.cjs', 'docs-app/node_modules/**', 'node_modules/**', 'coverage/**', 'tollerud-preset.cjs', 'entries/**', '_site/**', 'fixtures/consumer/dist/**', 'fixtures/consumer/.next/**', 'fixtures/consumer/out/**', 'fixtures/consumer/next-env.d.ts', 'examples/next-starter/.next/**', 'examples/next-starter/out/**', 'examples/next-starter/next-env.d.ts', 'packages/footer/dist/**', '.claude/**'],
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
    // docs-app's .jsx page/component files aren't matched by the tsx block
    // above (typescript-eslint's parser only claims .ts/.tsx), so without
    // this block ESLint silently skips them entirely when running `eslint .`
    // ("ignored because no matching configuration was supplied") rather than
    // linting them with the plain-JS rules from js.configs.recommended.
    files: ['**/*.jsx'],
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
      // typescript-eslint's recommended config turns this on everywhere (only
      // its parser is scoped to .ts/.tsx), so on plain .jsx it'd double-report
      // every unused var alongside base no-unused-vars below.
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'packages/*/scripts/**/*.mjs', 'playwright.config.ts', 'e2e/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
)
