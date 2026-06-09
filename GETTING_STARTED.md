# Getting Started

## Install

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss@4
```

`@paper-design/shaders-react` is an **optional** peer dependency — only needed if you use `NoirGlowBackground`. All other components work without it.

```bash
npm install @paper-design/shaders-react
```

---

## Tailwind Setup (v4)

```css
/* app/globals.css */
@import "@tollerud/ui/globals.css";
@source "../node_modules/@tollerud/ui/dist";
```

`globals.css` bundles Tailwind v4, design tokens, and all component layer styles. Point `@source` at the package `dist` folder relative to your CSS file so component utility classes are not purged.

**Optional preset shim** — for extra theme tokens from `tollerud-preset.js`:

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
@source "../node_modules/@tollerud/ui/dist";
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

## Subpath imports (tree-shaking)

Import individual components without pulling the full barrel:

```tsx
import { Button } from '@tollerud/ui/button'
import { Dialog, DialogContent } from '@tollerud/ui/dialog'
import { cn } from '@tollerud/ui/utils'
```

Every component in the catalog has a matching subpath (kebab-case filename). The main `@tollerud/ui` entry still works for convenience.

---

## Toaster (optional)

Mount the `Toaster` once near your app root to enable `sonner` toast notifications:

```tsx
// app/layout.tsx
import { Toaster } from '@tollerud/ui'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

---

## Import Components

All 61 components are named exports from `@tollerud/ui`:

```tsx
// Basics
import { Button, Card, Badge, StatusDot, Kbd, Input, Textarea } from '@tollerud/ui'

// Overlays
import { Dialog, DialogContent, Tooltip, TooltipProvider, Sheet } from '@tollerud/ui'

// Data & infra
import { DataTable, HostCard, LogViewer, CommandMenu } from '@tollerud/ui'
```

See [COMPONENTS.md](COMPONENTS.md) for the full prop reference.

---

## shadcn / registry

Install individual components via the registry:

```bash
npx shadcn@latest add https://unpkg.com/@tollerud/ui@latest/registry.json
```

Or add a single component:

```bash
npx shadcn@latest add button --registry https://unpkg.com/@tollerud/ui@latest/registry.json
```

---

## Server Components

`@tollerud/ui` ships client bundles with `'use client'`. Importing components (or `cn`, `buttonVariants`) from a Server Component file is safe — the import does not force your file to become a Client Component.

Use subpath imports (`@tollerud/ui/button`) for smaller client boundaries when splitting files manually.

---

## AI agents

If you're using Claude Code or Cursor, sync [SKILL.md](SKILL.md) into your project skills folder — it reflects the actual current exports and known gotchas.

See `README.md` for the complete setup guide.
