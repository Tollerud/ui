# Getting Started

## Install

### Full design system

Copy-paste — installs `@tollerud/ui` and all required peers:

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss@4 \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress \
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip \
  lucide-react framer-motion sonner
```

As of **v2.0.0**, Radix, Lucide, Framer Motion, and Sonner are **required peer dependencies**.

`@paper-design/shaders-react` is an **optional** peer dependency — only needed if you use `NoirGlowBackground`. All other components work without it.

```bash
npm install @paper-design/shaders-react
```

### Footer only (minimal)

If you only need the branded footer — no Radix, Lucide, Framer Motion, Sonner, or other full design-system peers:

```bash
npm install @tollerud/footer
```

```tsx
import { Footer } from '@tollerud/footer'

<Footer />
```

`@tollerud/footer` is **self-contained by design** — it bundles `clsx` and `tailwind-merge` so footer-only apps avoid extra peer installs. You still need Tailwind with Tollerud tokens (`@tollerud/ui/globals.css` or equivalent) for `text-tollerud-*` / `bg-tollerud-*` classes to resolve.

Use `@tollerud/ui` (or `@tollerud/ui/footer`) when you need the full component set. Apps using both packages may install duplicate `clsx` / `tailwind-merge` versions — harmless in practice; npm dedupes when ranges align.

### Next.js starter

Copy [`examples/next-starter/`](../examples/next-starter/) from this repo — minimal App Router app with `globals.css`, `source.css`, sample page, and `Toaster` mounted.

```bash
cp -R examples/next-starter my-app && cd my-app && npm install && npm run dev
```

---

## Tailwind Setup (v4)

**Recommended** — package-owned `@source` (works with npm, pnpm, Yarn workspaces, and Bun):

```css
/* app/globals.css */
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";
```

`globals.css` bundles Tailwind v4, design tokens, and all component layer styles. `source.css` points Tailwind at the installed package `dist` folder so component utility classes are not purged — no fragile `../node_modules` paths.

### Manual `@source` path (monorepos / custom layouts)

If you prefer an explicit path, resolve it **relative to your CSS file** to `node_modules/@tollerud/ui/dist`:

| Layout | Example CSS file | `@source` path |
|--------|------------------|----------------|
| Next.js App Router (default) | `app/globals.css` | `../node_modules/@tollerud/ui/dist` |
| `src/` app dir | `src/app/globals.css` | `../../node_modules/@tollerud/ui/dist` |
| Turborepo / npm workspace app | `apps/web/app/globals.css` | `../../../node_modules/@tollerud/ui/dist` |
| pnpm (package in workspace) | `app/globals.css` | Prefer `@import "@tollerud/ui/source.css"` — hoisting varies |
| Bun | `app/globals.css` | Prefer `@import "@tollerud/ui/source.css"` |

```css
@import "@tollerud/ui/globals.css";
@source "../node_modules/@tollerud/ui/dist";
```

If styles disappear in production, the `@source` path is wrong — switch to `@tollerud/ui/source.css` or fix the relative path.

**Optional preset shim** — for extra theme tokens from `@tollerud/ui/preset` (`tollerud-preset.cjs`):

```ts
// tailwind.config.ts
import tollerudPreset from '@tollerud/ui/preset'
export default { presets: [tollerudPreset] }
```

```css
@import "tailwindcss";
@config "./tailwind.config.ts";
@import "@tollerud/ui/tokens.css";
@import "@tollerud/ui/globals-layers.css";
@import "@tollerud/ui/source.css";
```

### Tailwind v3 (legacy)

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import tollerudPreset from '@tollerud/ui/preset'

const config: Config = {
  presets: [tollerudPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@tollerud/ui/dist/**/*.{js,mjs}',
  ],
}

export default config
```

```css
/* app/globals.css */
@import "tailwindcss/preflight";
@import "tailwindcss/utilities";
@import "@tollerud/ui/globals-v3.css";
```

---

## Consumer styling policy

`@tollerud/ui` ships Tailwind support intentionally. Tailwind is the implementation engine for the design system, but consumer projects should treat the component API as the primary design language.

Use this order in apps:

1. Use exported `@tollerud/ui` components.
2. Use exported layout primitives and screen patterns when available.
3. Use Tailwind only for small local glue, such as spacing, alignment, or responsive visibility.
4. If a branded pattern repeats, add it to `@tollerud/ui` or create a local semantic feature component that composes `@tollerud/ui`.

### Allowed Tailwind glue

Small layout adjustments around package components are fine:

```tsx
import { Button, Card } from '@tollerud/ui'

export function DeployCard() {
  return (
    <Card>
      <p>Ready to deploy.</p>
      <div className="mt-6">
        <Button variant="primary">Deploy</Button>
      </div>
    </Card>
  )
}
```

### Avoid rebuilding branded UI with utilities

Do not recreate design-system primitives in app code:

```tsx
// Avoid: this bypasses Button variants, focus states, and brand tokens.
<button className="rounded-lg bg-yellow-400 px-4 py-2 text-black">
  Deploy
</button>
```

Do not recreate full branded page structure with raw layout utilities when a component or pattern should own it:

```tsx
// Avoid: move repeated branded layout into @tollerud/ui or a semantic feature component.
<section className="min-h-screen bg-black px-6 py-24">
  <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
    {/* hand-built branded cards */}
  </div>
</section>
```

### Required CSS and shared utilities

For Tailwind v4, keep both imports in your app stylesheet:

```css
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";
```

`globals.css` provides Tailwind, tokens, and component layers. `source.css` makes Tailwind scan the installed package so utility classes used only inside `@tollerud/ui` are generated.

Use the exported class merge helper instead of adding a local copy:

```tsx
import { cn } from '@tollerud/ui'
// or: import { cn } from '@tollerud/ui/utils'
```

---

## Subpath imports (tree-shaking)

Import individual components without pulling the full barrel:

```tsx
import { Button } from '@tollerud/ui/button'
import { PageShell, Section, Stack } from '@tollerud/ui'
import { PageHeader, ResourceList } from '@tollerud/ui'
import { cn } from '@tollerud/ui/utils'
```

See [SKILL.md](SKILL.md) for the export catalog, [PROPS.generated.md](PROPS.generated.md) for prop signatures, and [COMPONENTS.md](COMPONENTS.md) for usage examples.

---

## Server Components

`@tollerud/ui` ships client bundles with `'use client'`. Importing components (or `cn`, `buttonVariants`) from a Server Component file is safe — the import does not force your file to become a Client Component.

Use subpath imports (`@tollerud/ui/button`) for smaller client boundaries when splitting files manually.

---

## Migrating from copied components

Older projects sometimes copied `Button.tsx`, `lib/utils.ts`, or whole `components/ui/` trees from this design system. Replace them with package imports.

### Detect copied files

```bash
grep -rl "tollerud-yellow\|tollerud-noir\|tollerud-surface" src --include="*.tsx" --include="*.ts"
```

Also look for `components/ui/index.ts` re-exporting relative paths instead of `@tollerud/ui`.

### Fix checklist

1. Install the package and peers (see [Install](#install) above).
2. Replace local imports — `import { Button } from '@/components/ui/Button'` → `import { Button } from '@tollerud/ui'` (or `@tollerud/ui/button`).
3. Replace hand-rolled `cn()` — `import { cn } from '@tollerud/ui'` or `@tollerud/ui/utils`.
4. Delete copied files after imports compile.
5. Check **prop drift** against [SKILL.md](SKILL.md) — copied files may use outdated prop names (`onChange` vs `onValueChange`, etc.).
6. Replace hardcoded hex (`#FFFF00`, `#0A0A0A`) with tokens (`text-tollerud-yellow`, `bg-tollerud-noir-950`).
7. Add `<Toaster />` near the app root if you use Sonner toasts.
8. Run `npx tsc --noEmit` and fix type errors from signature changes.

| Copied pattern | Fix |
|----------------|-----|
| `src/components/ui/Button.tsx` | Delete; import from `@tollerud/ui` |
| Local `lib/utils.ts` with `cn()` | Delete; `import { cn } from '@tollerud/ui/utils'` |
| `components/ui.ts` re-exporting relatives | Direct `@tollerud/ui` imports |

---

## AI agents

If you're using Claude Code or Cursor, sync [SKILL.md](SKILL.md) into your project skills folder — it reflects the actual current exports and known gotchas.

See `README.md` for the complete setup guide.
