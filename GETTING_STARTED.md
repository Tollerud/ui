# Getting Started

## Install

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss
```

`@paper-design/shaders-react` is an **optional** peer dependency — only needed if you use `NoirGlowBackground`. All other components work without it.

```bash
npm install @paper-design/shaders-react
```

---

## Tailwind Setup

### Tailwind v3

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import tollerudPreset from '@tollerud/ui/preset'

const config: Config = {
  presets: [tollerudPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    // tell Tailwind to scan the package's dist so no classes get purged
    './node_modules/@tollerud/ui/dist/**/*.{js,mjs}',
  ],
}

export default config
```

```css
/* app/globals.css */
@import "tailwindcss/preflight";
@import "tailwindcss/utilities";
```

### Tailwind v4

```css
/* app/globals.css — recommended */
@import "@tollerud/ui/globals-v4.css";
@source "../../node_modules/@tollerud/ui/dist";
```

`globals-v4.css` bundles Tailwind v4, design tokens, and component layer styles. For Tailwind v3 projects, keep using `@tollerud/ui/globals.css`.

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
import { Select, Checkbox, Switch, RadioGroup, Radio } from '@tollerud/ui'
import { CodeBlock, StatCard, Container, ActionRow, CommandMenu } from '@tollerud/ui'

// New in 1.0.9
import { Divider, Pill, Avatar, AvatarGroup } from '@tollerud/ui'
import { Breadcrumb, Pagination, Segmented, Stepper } from '@tollerud/ui'
import { Panel, Meter, FormRow, PricingCard } from '@tollerud/ui'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@tollerud/ui'
import { Slider, PasswordInput, Combobox, DatePicker, FileUpload, TagInput } from '@tollerud/ui'

// Overlays (Radix-based)
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@tollerud/ui'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@tollerud/ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@tollerud/ui'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@tollerud/ui'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@tollerud/ui'

// Feedback & display
import { Alert, Skeleton, Progress, Empty, EmptyHeader, EmptyIcon, EmptyTitle, EmptyDescription, EmptyContent } from '@tollerud/ui'
import { Toaster } from '@tollerud/ui'
import { DataTable } from '@tollerud/ui'
import { GlowCard, NoirGlowBackground, BentoDashboard } from '@tollerud/ui'

// Infra / homelab set
import { HostCard, ServiceHealthCard, DockerStackCard, IncidentCard } from '@tollerud/ui'
import { ApprovalCard, ActionDiff, AlertInbox, Timeline, RollbackPlan, BackupStatusPanel, LogViewer } from '@tollerud/ui'

// Footer & layout
import { Footer } from '@tollerud/ui'  // or: import { Footer } from '@tollerud/footer'
import { Container } from '@tollerud/ui'
```

---

## Utils

`cn` is re-exported from `@tollerud/ui` for convenience — no need to set it up separately:

```tsx
import { cn } from '@tollerud/ui'
```

Or keep your own `src/lib/utils.ts` if you prefer:

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Server Components (Next.js App Router)

All components are bundled with `'use client'` (≥ 1.0.8) — safe to import into Server Component files. The RSC bundler will correctly treat the whole package as client code.

```tsx
// ✅ Fine in a Server Component
import { Button, Card } from '@tollerud/ui'
```

---

## Registry (shadcn-style)

Individual components can be added via the registry shipped with the npm package:

```bash
# Add a single component (example: button)
npx shadcn@latest add button --registry https://unpkg.com/@tollerud/ui/registry.json

# Or reference the file from node_modules after install
npx shadcn@latest add button --registry ./node_modules/@tollerud/ui/registry.json
```

The registry covers all 61 shipped components. Source of truth: `registry.json` in this repo (also exported as `@tollerud/ui/registry.json`).

---

## Live docs & examples

Interactive demos live in the repo root — not a separate Next.js app:

- **`index.html`** — docs site entry (React + Babel in-browser, Tailwind CDN)
- **`docs/`** — full SPA: component gallery, foundations, forms, infra patterns, changelog

Reference markdown (`README.md`, `COMPONENTS.md`, etc.) lives at the repo root; **`docs/`** is the interactive site source only.

Run locally: open `index.html` in a browser, or serve the repo root with any static server.

Published at **[tollerud.github.io/design-system](https://tollerud.github.io/design-system/)** via GitHub Pages.

See `README.md` for the complete setup guide and Tailwind v3/v4 instructions.
