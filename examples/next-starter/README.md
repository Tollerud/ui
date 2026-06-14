# Tollerud UI — Next.js starter

Minimal **Next.js 16 + Tailwind v4** app wired for `@tollerud/ui`. Copy this folder into a new project or use it as a reference when bootstrapping.

> **CI tarball smoke test** lives in [`fixtures/consumer/`](../../fixtures/consumer/) — do not use that path for new apps.

## Quick start

```bash
cd examples/next-starter
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's included

| File | Purpose |
|------|---------|
| `app/globals.css` | `@tollerud/ui/globals.css` + `source.css` |
| `app/layout.tsx` | Dark page shell + `<Toaster />` |
| `app/page.tsx` | Sample components (Server Component + client boundaries) |
| `postcss.config.mjs` | Tailwind v4 PostCSS |
| `next.config.mjs` | Static export–ready defaults |

The sample page uses exported layout primitives and screen patterns — not hand-built `min-h-screen` / grid utilities. Copy [Recipes](https://design.tollerud.dev/recipes/) for full screens.

## Production build

```bash
npm run build
```

## Self-audit

After customizing, run from your app root:

```bash
npx tollerud-ui-audit
```

Monorepo app package:

```bash
npx tollerud-ui-audit ./apps/web
```

Without `npx`:

```bash
node node_modules/@tollerud/ui/scripts/audit-consumer-styling.mjs
```

Advisory CI (exit `0` even when errors are found):

```bash
npx tollerud-ui-audit --warn-only
```

Error codes and fixes: [GETTING_STARTED.md — Consumer project checklist](https://github.com/Tollerud/ui/blob/main/GETTING_STARTED.md#audit-error-codes) · [Guides on design.tollerud.dev](https://design.tollerud.dev/resources/consumer-checklist/).

## Docs

- [GETTING_STARTED.md](https://github.com/Tollerud/ui/blob/main/GETTING_STARTED.md) — install, Tailwind setup, consumer checklist
- [Recipes](https://design.tollerud.dev/recipes/) — copy-paste screen compositions
- [design.tollerud.dev](https://design.tollerud.dev/) — live component reference
