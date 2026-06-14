---
name: tollerud-ui
description: Use the @tollerud/ui design system correctly — components, props, Tailwind tokens, aesthetic rules, and known gotchas (Server Component imports, Button/Link composition). Trigger whenever a project imports from @tollerud/ui or @tollerud/footer, or when building UI that should match the Tollerud noir aesthetic.
---

# @tollerud/ui — Design System Skill

Dark, monochrome + single yellow-accent design system ("noir" aesthetic). This skill documents the package's **actual current exports** (verified against `components/index.ts` in the source repo) — not aspirational docs. If you see a component referenced elsewhere that isn't listed below, it does not exist yet; don't import it.

---

## Install & setup

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss@4 \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress \
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip \
  lucide-react framer-motion sonner
# Optional — only if using NoirGlowBackground
npm install @paper-design/shaders-react
```

As of **v4.0.1**, install is **npm-only** — `import { Button } from '@tollerud/ui'` or subpaths like `@tollerud/ui/button`. Copy-via-shadcn registry CLI is unsupported. As of **v4.0.0**, `@tollerud/ui/globals-v4.css` is removed — use `globals.css` only. Brand assets live at `@tollerud/ui/brand/*`. As of **v3.1.1**, `.tollerud-display-shimmer` ships in `globals.css` for animated hero accent text. As of **v3.1.0**, `Monogram` ships as an inline SVG component (`color`: `yellow` | `black` | `white`). As of **v3.0.0**, the package is **ESM-only** (no CJS `require` entry). As of **v2.0.0**, Radix, Lucide, Framer Motion, and Sonner are **required peers** (not bundled).

Apply the Tailwind preset when you need extra utilities from `@tollerud/ui/preset` — `globals.css` already includes tokens and component layers for v4:

```css
/* app/globals.css — Tailwind v4 (default) */
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";
```

As of **v1.4.0**, charts (`BarChart`, `AreaChart`, `Donut`, `Sparkline`) and marketing blocks (`HeroBlock`, `FeatureCard`, `CTABand`) ship in the package. As of **v1.3.0**, `@tollerud/ui/globals.css` is the Tailwind v4 entry. Tailwind colors are under `tollerud.*` only (`text-tollerud-yellow`, `bg-tollerud-surface-raised`, etc.) — not `tia-*`.

**Tailwind v3 legacy:** `@import "@tollerud/ui/globals-v3.css"` after preflight/utilities, with `tailwind.config.ts` preset + content paths.

**Subpath imports (tree-shaking):** `@tollerud/ui/button`, `@tollerud/ui/dialog`, `@tollerud/ui/utils`. The main `@tollerud/ui` barrel still works.

---

## Consumer styling policy

Tailwind is part of `@tollerud/ui` on purpose. Use it freely **inside this package** to implement components, variants, layout primitives, focus states, tokens, and docs-only demos.

In consumer apps, use Tailwind as a small escape hatch, not as the primary design language. The default order is:

1. Use exported `@tollerud/ui` components.
2. Use exported `@tollerud/ui` layout primitives or screen patterns when available.
3. Use Tailwind only for small local glue, such as one-off margins, alignment, or responsive visibility.
4. If branded structure repeats, add a component to `@tollerud/ui` or create a local semantic feature component; do not rebuild a parallel design system with raw utility classes.

Allowed consumer Tailwind:

```tsx
<div className="mt-6">
  <Button variant="primary">Deploy</Button>
</div>
```

Discouraged consumer Tailwind:

```tsx
<button className="rounded-lg bg-yellow-400 px-4 py-2 text-black">
  Deploy
</button>
```

```tsx
<section className="min-h-screen bg-black px-6 py-24">
  <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
    {/* branded cards built by hand */}
  </div>
</section>
```

Consumer apps must import the package CSS for Tailwind v4:

```css
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";
```

`globals.css` provides Tailwind, tokens, and component layers. `source.css` makes Tailwind scan the installed package so utility classes used only inside `@tollerud/ui` are generated.

Use `cn` from `@tollerud/ui` or `@tollerud/ui/utils`; do not reimplement a local `cn()` helper in consumer projects.

---

## Critical gotchas (read before writing code)

### 1. Server Components — just import normally (≥ 1.0.8)
`@tollerud/ui` ships as a single bundled file marked `'use client'`. As of **v1.0.8**, importing anything from it — components, hooks, or plain helpers like `buttonVariants` and `cn` — works fine from a Server Component file; the import itself doesn't force your file to become a Client Component, since you're just pulling in already-client-bundled code or plain functions.
- **If you're on `< 1.0.8`, upgrade first** — older versions crash on any import from a Server Component (the bundle wasn't marked `'use client'`, despite containing hook-based components).

### 2. Tailwind v4 — Alert tone colors missing (`@source` path issue)

`Alert` uses raw Tailwind color classes (`bg-red-500/5`, `border-red-500/30`, `text-red-400`, etc.) for its `error`, `info`, and `success` tones. In Tailwind v4, if your `@source` path doesn't correctly resolve to `node_modules/@tollerud/ui/dist`, these classes are never scanned and the colors silently don't apply.

**Fix (≥ 1.1.4):** `globals.css` now ships these classes in `@layer utilities` so they're always present regardless of your `@source` config. Just make sure you're importing `globals.css`:

```css
@import "@tollerud/ui/globals.css";
```

If you're on `< 1.1.4`, add this to your own CSS as a workaround:

```css
@layer utilities {
  .bg-red-500\/5   { background-color: rgb(239 68 68 / 0.05); }
  .bg-blue-500\/5  { background-color: rgb(59 130 246 / 0.05); }
  .bg-green-500\/5 { background-color: rgb(34 197 94 / 0.05); }
  .border-red-500\/30   { border-color: rgb(239 68 68 / 0.3); }
  .border-blue-500\/30  { border-color: rgb(59 130 246 / 0.3); }
  .border-green-500\/30 { border-color: rgb(34 197 94 / 0.3); }
  .text-red-400   { color: rgb(248 113 113); }
  .text-blue-400  { color: rgb(96 165 250); }
  .text-green-400 { color: rgb(74 222 128); }
}
```

### 3. `<Button>` only renders a native `<button>` — use `asChild` for links (≥ 1.0.7)
`Button` extends `ButtonHTMLAttributes<HTMLButtonElement>` and has no `href`. **Never nest `<a>` inside `<button>` or vice versa** — it's invalid HTML and breaks accessibility. Two ways to style a `<Link>`/`<a>` like a Button:

```tsx
// Option A — asChild (Radix Slot merges Button's classes/props onto the child)
import { Button } from '@tollerud/ui'
import Link from 'next/link'

<Button asChild variant="primary">
  <Link href="/deploy">Deploy</Link>
</Button>
```

```tsx
// Option B — buttonVariants() when wrapping is awkward
import { buttonVariants } from '@tollerud/ui'
import Link from 'next/link'

<Link href="/deploy" className={buttonVariants({ variant: 'primary', size: 'md' })}>
  Deploy
</Link>
```

For a real `<button>` (form submit, logout, toggle, dialog/menu trigger), just use `<Button>` directly — no `asChild` needed.

### 4. `cn` is exported — use it, don't reimplement
`@tollerud/ui` exports `cn` (clsx + tailwind-merge). Use it for conditional/merged class names instead of template strings or writing your own helper.

---

## Aesthetic rules (never violate)

- **Dark surfaces only.** Page background `#0A0A0A` / `bg-tollerud-noir-950`. Never white or light-gray backgrounds.
- **Yellow is for meaning, not decoration** — CTAs, focus rings, active states, key data points (`text-tollerud-yellow`, `#FFFF00`).
- **Never put yellow text on white** — contrast ratio is ~1.7:1, fails WCAG.
- **Borders over shadows.** Use `border-tollerud-noir-600` / `border-tollerud-noir-700` for separation; reserve shadows/glow for overlays (drawers, popovers, dialogs).
- **Strict monochrome + single accent.** No blues, greens, purples, or brand gradients — yellow is the only chromatic color (status colors like success/error/info exist as semantic exceptions inside `Badge`, `IncidentCard`, `Alert`, etc.).

## Color tokens

| Token | Value | Use |
|---|---|---|
| `tollerud-yellow` | `#FFFF00` | Accent, CTA, focus ring, key data |
| `tollerud-yellow-warm` | `#E8D500` | Secondary yellow, gradients, warm states |
| `tollerud-noir-950` | `#0A0A0A` | Page background |
| `tollerud-noir-900` | `#111111` | Card / surface |
| `tollerud-noir-800` | `#1A1A1A` | Elevated surface |
| `tollerud-noir-700` | `#222222` | Hover states |
| `tollerud-noir-600` | `#333333` | Borders |
| `tollerud-text-primary` | `#F5F5F5` | Body text |
| `tollerud-text-secondary` | `#AAAAAA` | Secondary text / labels |
| `tollerud-text-muted` | `#666666` | Placeholders, hints |

Standard focus ring (apply to every interactive element): `focus-visible:outline-2 focus-visible:outline-tollerud-yellow focus-visible:outline-offset-2`

---

## Component catalog (verified against actual exports)

Import everything as named exports from `@tollerud/ui`.

### Core / forms

```tsx
import {
  Button, buttonVariants, cn,
  Card, Badge, StatusDot, Kbd,
  Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio,
  PasswordInput, Combobox, TagInput, Slider, FormRow,
  Container, CodeBlock, StatCard, ActionRow, CommandMenu,
} from '@tollerud/ui'
```

### Layout primitives

```tsx
import {
  PageShell, Section, Stack, Cluster,
  Grid, CardGrid, Split, MainContent,
} from '@tollerud/ui'
```

**PageShell** — `as?: 'div' | 'main'`, `background?: 'plain' | 'grid' | 'glow'`, `density?: 'comfortable' | 'compact'`. Full-page dark shell for app routes and marketing pages.

**Section** — `as?: 'section' | 'div' | 'article' | 'header' | 'footer'`, `size?: 'sm' | 'md' | 'lg' | 'hero'`, `width?: 'narrow' | 'default' | 'wide' | 'full'`. Consistent vertical rhythm and width constraints.

**Stack** — vertical layout. `gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'`, `align?: 'start' | 'center' | 'end' | 'stretch'`.

**Cluster** — wrapping horizontal layout for actions, badges, and toolbars. `gap?: 'xs' | 'sm' | 'md' | 'lg'`, `align?`, `justify?: 'start' | 'center' | 'end' | 'between'`.

**Grid / CardGrid** — responsive grid primitives. `columns?: 1 | 2 | 3 | 4 | 'auto'` for `Grid`; `columns?: 2 | 3 | 4 | 'auto'` for `CardGrid`.

**Split** — responsive two-column layout. `ratio?: 'equal' | 'content' | 'sidebar'`, `gap?: 'md' | 'lg' | 'xl'`, `align?: 'start' | 'center' | 'stretch'`, `reverse?: boolean`.

**MainContent** — `as?: 'main' | 'div'`, `width?: 'narrow' | 'default' | 'wide' | 'full'`, `spacing?: 'none' | 'sm' | 'md' | 'lg'`, `density?: 'comfortable' | 'compact'`.

```tsx
<PageShell background="grid">
  <Section size="hero">
    <Stack gap="lg">
      <h1>Build with components first.</h1>
      <Cluster>
        <Button variant="primary">Start</Button>
        <Button variant="secondary">Read policy</Button>
      </Cluster>
    </Stack>
  </Section>
</PageShell>
```

### Screen patterns

```tsx
import {
  PageHeader, TopNav, DashboardShell, SettingsLayout,
  FormPanel, ResourceList, DetailPage, EmptyPage,
  FeatureSection, StatsSection,
} from '@tollerud/ui'
```

Use these before rebuilding common pages with raw Tailwind:

- **PageHeader** — title block with `eyebrow`, `description`, `actions`, `meta`, `align`, `size`.
- **TopNav** — branded monogram lockup with `projectName`, `navItems`, `actions`, `sticky`.
- **SidebarNav** — sidebar brand lockup with `projectName`, `projectSubtitle`, `groups` / `items`, icons, and active states.
- **DashboardTopBar** — context top bar with `breadcrumb`, `pageTitle`, `actions`, mobile menu toggle.
- **DashboardShell** — docs-aligned app frame (default `variant="sidebar"`) with `sidebarGroups`, `sidebarItems`, `pageTitle`, `topActions`, `header`, `contentWidth`, `density`. Use `variant="topnav"` for horizontal TopNav layout.
- **SettingsLayout** — settings page with `title`, `description`, `actions`, `navItems`, `activeId`, `onNavSelect`, and optional `tone="danger"` on nav items.
- **FormPanel** — titled form surface with `description`, `actions`, `footer`, `children`.
- **ResourceList** — list/table page wrapper with `title`, `description`, `actions`, `filters`, `count`, `emptyState`.
- **DetailPage** — detail header + primary content + optional `aside`.
- **EmptyPage** — full-page empty state using `EmptyState` on a `PageShell`.
- **FeatureSection** — section header + `features` rendered with `FeatureCard`.
- **StatsSection** — section header + `stats` rendered with `StatCard`.

```tsx
<ResourceList
  title="Hosts"
  description="Machines connected to Tollerud."
  actions={<Button variant="primary">Connect host</Button>}
  count="3 hosts"
>
  <CardGrid columns={3}>
    <Card><StatusDot status="online" label="emma" /></Card>
    <Card><StatusDot status="warning" label="iris" /></Card>
  </CardGrid>
</ResourceList>
```

### Agent-safe recipes

Copy-paste screen compositions live on the docs site at **Recipes** (`/recipes/`). Each recipe is a code-only file snippet — live component demos live on **Screen patterns**; fuller product screens link to Examples.

| Recipe | Primary components | Live demo / example |
|--------|-------------------|---------------------|
| Marketing landing | `PageShell`, `HeroBlock`, `FeatureSection`, `CTABand`, `Footer` | Screen patterns → FeatureSection; Blocks |
| Dashboard overview | `DashboardShell`, `StatsSection`, `HostCard` | Screen patterns → DashboardShell; Mission Control |
| Settings | `SettingsLayout`, `FormPanel` | Screen patterns → SettingsLayout; Settings example (polished demo) |
| Auth | `PageShell`, `FormPanel` | Screen patterns → FormPanel; Sign in |
| Empty state | `EmptyPage` | Components → EmptyState; Screen patterns → EmptyPage |
| Detail | `DetailPage` | Screen patterns → DetailPage |
| List / table | `ResourceList`, `DataTable` | Screen patterns → ResourceList; Data Table |

Reserve Tailwind for small local glue (`mt-6`, `flex justify-end`) — not for rebuilding page structure. See the escape-hatch recipe and Getting started → Consumer styling policy.

### Consumer guardrails

**Self-audit** from a consumer app root:

```bash
npx tollerud-ui-audit
# monorepo: npx tollerud-ui-audit ./apps/web
# without npx: node node_modules/@tollerud/ui/scripts/audit-consumer-styling.mjs
# advisory CI (exit 0 even with errors): npx tollerud-ui-audit --warn-only
```

**Checks:** missing `@tollerud/ui` dependency, missing `globals.css` / `source.css`, `components/ui` clones, `tollerud-*` classes without package imports, hardcoded `#FFFF00` / `#0A0A0A` / `#E8D500`, local `cn()`, `<Button><Link>` nesting, and local `components/ui` re-export shims.

**Error codes:** findings print `ERROR [code]` or `WARN [code]` — full code→fix table in GETTING_STARTED.md → Consumer project checklist (`missing-ui-dep`, `missing-source-css`, `local-ui-clone`, `button-link-nesting`, `ui-reexport-shim`, etc.).

**Anti-patterns:** copied `Button.tsx`, `bg-yellow-400` CTAs, hand-built `min-h-screen bg-black` page grids, missing `<Toaster />`.

**When a pattern is missing:** compose a local feature component under `src/features/…` that wraps `@tollerud/ui` exports — do not fork primitives into `components/ui`. See GETTING_STARTED.md → Consumer project checklist.

**Button** — `variant`: `primary` · `secondary` · `ghost` · `destructive` · `terminal`. `size`: `sm` · `md` · `lg`. `asChild?: boolean`.
```tsx
<Button variant="primary" size="md">Deploy</Button>
<Button variant="destructive">Delete host</Button>
<Button variant="terminal" size="sm">start_building</Button>
```

**Card** — `accent?: boolean`, `density?: 'comfortable' | 'compact'`. Plain `<div>` wrapper — safe to nest in `<Link>`.
```tsx
<Card accent>Highlighted with yellow border</Card>
```

**Badge** — `variant`: `default` · `accent` · `success` · `error` · `info` · `warning`.
```tsx
<Badge variant="success">Online</Badge>
```

**StatusDot** — `status`: `online` · `offline` · `warning` · `idle` (exported as `Status`); `label?`, `noPulse?`.
```tsx
<StatusDot status="online" label="SSH Connected" />
```

**Input / Textarea / Select / Checkbox / Switch / RadioGroup**
```tsx
<Input label="Server Name" placeholder="e.g. emma.tollerud.no" error={errors.name} />
<Textarea label="Notes" rows={4} error={errors.notes} />
<Select label="Region" options={[{ value: 'eu', label: 'EU' }]} value={region} onChange={setRegion} />
<Checkbox label="Enable backups" checked={enabled} onChange={...} />
<Switch label="Dark mode" defaultChecked />
<RadioGroup label="Target" error={error}>
  <Radio value="staging" label="Staging" name="target" />
  <Radio value="production" label="Production" name="target" />
</RadioGroup>
```
All form primitives require a `label` (renders an actual `<label>` for a11y) and accept `error?: string`.

**Kbd** — keyboard shortcut chip. `keys: string | string[]`, `size?: 'sm' | 'md'`.
```tsx
<Kbd keys={["⌘", "⇧", "S"]} size="sm" />
```

**ActionRow** / **CommandMenu** — Raycast-style command palette.
```tsx
const [open, setOpen] = useState(false)
<CommandMenu
  open={open}
  onOpenChange={setOpen}
  groups={[{ label: 'Servers', items: [
    { id: 'emma', label: 'emma.tollerud.no', description: 'SSH · uptime 14d', onSelect: () => {} },
  ]}]}
  toggleShortcut="k"      // built-in ⌘K / Ctrl+K listener
/>
```

**StatCard** — `label`, `value`, `change?: { value: string; direction: 'up' | 'down' }`, `accent?`.
```tsx
<StatCard label="Active Sessions" value={42} change={{ value: '+12%', direction: 'up' }} />
```

**CodeBlock** — `code?`, `promptPrefix?`, `showCopy?`. Renders a `<pre>`.
```tsx
<CodeBlock promptPrefix showCopy code={`systemctl status tollerud-agent`} />
```

**Container** — `as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer'`, capped width + padding.

**PasswordInput** — same API as `Input` (label, error, id, …) plus built-in show/hide toggle.
```tsx
<PasswordInput label="Password" placeholder="Enter password" error={errors.password} />
```

**Combobox** — searchable single-select. `options: { value, label, disabled? }[]`, `value?`, `onChange?`, `placeholder?`, `filter?`, `label?`, `error?`.
```tsx
<Combobox label="Connect to host" value={host} onChange={setHost} options={hostOptions} />
```

**TagInput** — chip-style multi-value input. `value?: string[]`, `onChange?`, `max?`, `placeholder?`, `label?`, `error?`. Enter/comma to add, Backspace to remove last.
```tsx
<TagInput label="Tags" value={tags} onChange={setTags} placeholder="Add tag…" max={10} />
```

**Slider** — native range input styled with yellow thumb. `label?`, `showValue?`, `onChange?: (value: number) => void`, plus all native `<input type="range">` props.
```tsx
<Slider label="Alert threshold" showValue value={threshold} onChange={setThreshold} min={0} max={100} />
```

**FormRow** — accessible field wrapper. `label?`, `description?`, `error?`, `required?`, `htmlFor?`. Wires `aria-describedby` automatically.
```tsx
<FormRow label="Hostname" htmlFor="hostname" description="Unique within your network." required error={errors.hostname}>
  <Input id="hostname" placeholder="e.g. embla" />
</FormRow>
```

### Navigation & layout primitives

```tsx
import {
  Divider, Pill, Avatar, AvatarGroup,
  Breadcrumb, Pagination, Segmented, Stepper,
  Panel, Meter, Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  DatePicker, FileUpload, PricingCard,
} from '@tollerud/ui'
```

**Divider** — `orientation?: 'horizontal' | 'vertical'`, `label?: ReactNode`.
```tsx
<Divider />
<Divider label="or" />
<Divider orientation="vertical" className="h-6" />
```

**Pill** — `variant?: 'outline' | 'solid' | 'accent'`.
```tsx
<Pill variant="accent">production</Pill>
```

**Avatar / AvatarGroup** — `src?`, `name?` (derives initials), `fallback?`, `size?: 'sm' | 'md' | 'lg'`. `AvatarGroup` takes `max?` and shows a +N chip.
```tsx
<Avatar name="Mathias Tollerud" size="md" />
<AvatarGroup max={3}><Avatar name="Emma" /><Avatar name="Iris" /></AvatarGroup>
```

**Breadcrumb** — `items: { label, href?, onClick? }[]`, `separator?`.
```tsx
<Breadcrumb items={[{ label: 'Servers', href: '/servers' }, { label: 'Embla' }]} />
```

**Pagination** — `page` (1-indexed), `pageCount`, `onChange`, `siblingCount?`.
```tsx
<Pagination page={page} pageCount={20} onChange={setPage} />
```

**Segmented** — `options: { value, label, disabled? }[]`, `value`, `onChange`, `size?: 'sm' | 'md'`.
```tsx
<Segmented value={view} onChange={setView} options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]} />
```

**Stepper** — `steps: { label, description? }[]`, `current` (0-indexed), `orientation?: 'horizontal' | 'vertical'`.
```tsx
<Stepper steps={onboardingSteps} current={1} orientation="vertical" />
```

**Panel** — `title?`, `description?`, `actions?: ReactNode` (renders in header), `children` (body with padding).
```tsx
<Panel title="Overview" description="Live metrics" actions={<Button size="sm">Refresh</Button>}>…</Panel>
```

**Meter** — `value`, `max?` (default 100), `label?`, `showValue?`, `tone?: 'default' | 'success' | 'warning' | 'error'`.
```tsx
<Meter value={72} label="RAM" showValue tone="warning" />
```

**Accordion** — compound. `multiple?: boolean`, `defaultOpen?: string | string[]`. Items use `value` prop to identify.
```tsx
<Accordion defaultOpen="faq-1">
  <AccordionItem value="faq-1">
    <AccordionTrigger>What is Tia?</AccordionTrigger>
    <AccordionContent>An infrastructure assistant for homelabs.</AccordionContent>
  </AccordionItem>
</Accordion>
```

**DatePicker** — `value?: Date | null`, `onChange?`, `label?`, `error?`, `placeholder?`, `formatDate?`.
```tsx
<DatePicker label="Schedule deployment" value={date} onChange={setDate} />
```

**FileUpload** — `accept?`, `multiple?`, `onFilesChange?`, `label?`, `description?`, `error?`.
```tsx
<FileUpload label="Upload config" accept=".yaml,.json" onFilesChange={handleFiles} />
```

**PricingCard** — `name`, `price`, `period?`, `description?`, `features?: ReactNode[]`, `ctaLabel?`, `onCtaClick?`, `featured?`, `badge?`.
```tsx
<PricingCard name="Pro" price="$9" period="/month" features={['Unlimited servers']} featured badge="Most popular" />
```

### Overlays (Radix-based, all need `'use client'` boundary in the *consumer* component)

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
  Tabs, TabsList, TabsTrigger, TabsContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose,
  Drawer, Toaster, ToastProvider, useToast,
} from '@tollerud/ui'
```
- `Dialog` / `Sheet` / `DropdownMenu` follow the standard shadcn/Radix composition pattern — `Trigger` wraps the activating element with `asChild`. `Sheet` takes a `side?: 'left' | 'right'`.
- `Drawer` — controlled API: `open`, `onClose`, `side`, `title`, `description`, `footer`, `width`.
- `Tooltip` requires a `<TooltipProvider>` ancestor.
- `Toaster` — Sonner renderer; mount once, call `toast()` from `sonner`.
- `ToastProvider` + `useToast` — context API: `toast({ tone, title, message?, duration? })`.

### Empty states & loading

```tsx
import {
  Empty, EmptyHeader, EmptyIcon, EmptyTitle, EmptyDescription, EmptyContent,
  EmptyState, Skeleton, Progress, Spinner,
} from '@tollerud/ui'

<Empty>
  <EmptyHeader>
    <EmptyIcon>{/* icon */}</EmptyIcon>
    <EmptyTitle>No hosts connected</EmptyTitle>
    <EmptyDescription>Connect your first machine and Tia will start watching it.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button variant="primary" size="sm">Connect a host</Button></EmptyContent>
</Empty>
```

**EmptyState** — prop-driven shortcut: `icon` (built-in name or custom element), `title`, `description`, `action`, `secondaryAction`, `compact`, `accent`.
```tsx
<EmptyState icon="server" title="No hosts connected" description="Connect your first machine."
  action={<Button variant="primary" size="sm">Connect</Button>} />
```

**Spinner** — `size?: number` (px, default 16). Inline loading indicator.

### Visual / decorative

```tsx
import {
  GlowCard, NoirGlowBackground, BentoDashboard,
  BarChart, AreaChart, Donut, Sparkline,
  HeroBlock, FeatureCard, CTABand,
} from '@tollerud/ui'
```
- **GlowCard** — `children`, `className?`, `glowColor?`, `intensity?: number`. Mouse-tracked glow card.
- **NoirGlowBackground** — animated WebGL shader background (needs `@paper-design/shaders-react`). `shape?: 'corners' | 'wave' | 'dots' | 'truchet' | 'ripple' | 'blob' | 'sphere'`, `intensity?: 'subtle' | 'medium' | 'loud'`, `speed?: 'still' | 'slow' | 'medium' | 'fast'`, `grain?: 'none' | 'soft' | 'high'`, `colors?: string[]`, `forceCssFallback?: boolean`.
- **BentoDashboard** — composed dashboard shell taking arrays of `HostCardProps`, `StatCardProps`, `ServiceHealthCardProps`, incidents, `BackupJob[]`.

**Charts** — palette-aware SVG; yellow highlights one series.
```tsx
<BarChart data={[{ label: 'Mon', value: 32, accent: true }]} height={180} />
<AreaChart data={[28, 35, 30, 44, 52]} height={150} />
<Donut segments={[{ label: 'CPU', value: 40, color: 'var(--chart-1)' }]} size={160} />
<Sparkline data={[12, 18, 14, 22]} width={84} height={26} />
```

**Marketing blocks**
```tsx
<HeroBlock eyebrow="homelab" title="Run your stack" intense actions={<Button>Deploy</Button>} />
<FeatureCard icon={<Zap size={20} />} title="Instant deploys" description="…" />
<CTABand title="Ship it" actions={<Button variant="primary">Get started</Button>} />
```
`HeroBlock.intense` mounts `NoirGlowBackground` (needs `@paper-design/shaders-react`).

### Data & tables

```tsx
import { DataTable } from '@tollerud/ui'

// Simple: sort + per-column text filters
<DataTable
  columns={[
    { key: 'hostname', label: 'Host', sortable: true, filterable: true },
    { key: 'status', label: 'Status', render: (_v, row) => <Badge variant={row.status === 'online' ? 'success' : 'error'}>{row.status}</Badge> },
  ]}
  data={hosts}
  rowKey="id"
  onRowClick={(row) => {}}
  emptyMessage="No hosts found"
/>

// Rich: search, segmented filter, selection, bulk actions, row menus, pagination
<DataTable
  columns={[...]}
  data={hosts}
  rowKey="id"
  searchable
  searchKeys={['hostname', 'ip']}
  filter={{ key: 'region', allLabel: 'All regions' }}
  selectable
  pageSize={10}
  bulkActions={[{ label: 'Restart', variant: 'ghost', onRun: (ids, clear) => { clear() } }]}
  rowMenu={(row) => [{ label: 'View logs', onSelect: () => {} }]}
  toolbarRight={<Button size="sm">Add host</Button>}
  emptyState={<Empty>...</Empty>}
/>
```

`data` and `rows` are aliases. Column labels use `label` (docs demos may use `header` via the docs adapter only).

### Infra / homelab set

```tsx
import {
  HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, ApprovalCard,
  ActionDiff, LogViewer, AlertInbox, Timeline, RollbackPlan, BackupStatusPanel,
} from '@tollerud/ui'
import type { IncidentSeverity } from '@tollerud/ui'
```

```tsx
<HostCard hostname="emma" ip="10.0.10.10" status="online" cpu="23%" memory="6.2/16 GB" disk="45%" uptime="14d" containers={4} />
<ServiceHealthCard service="emma.tollerud.no" status="online" uptime="14d 3h" responseTime="23ms" />
<DockerStackCard name="hermes" services={[{ name: 'web', status: 'online' }]} composePath="compose.yml" />
<IncidentCard title="High CPU" severity="high" timestamp="2026-05-26 14:32" description="CPU at 92% for 5 min" service="emma" />
<ApprovalCard action="restart_container" description="Restart emma:hermes" state="pending" onApprove={() => {}} onReject={() => {}} />
<ActionDiff label="docker-compose.yml" lines={[{ text: 'image: nginx:1.27', type: 'add', newLine: 12 }]} />
<LogViewer lines={[{ text: 'Health check passed', level: 'info', timestamp: '14:32:01', source: 'hermes' }]} follow searchable showLineNumbers height="300px" />
<AlertInbox alerts={[{ id: '1', title: 'emma high CPU', severity: 'high', timestamp: '14:32', acknowledged: false }]} onAcknowledge={(id) => {}} />
<Timeline items={[{ id: '1', time: '14:32', title: 'Deploy started', status: 'online' }]} active loading={false} />
<RollbackPlan name="hermes-v2.1-rollback" steps={[{ id: '1', label: 'Stop container', status: 'success' }]} executing />
<BackupStatusPanel jobs={[{ name: 'nightly-db', status: 'online', lastRun: '02:00', nextRun: 'tomorrow 02:00', size: '4.2 GB' }]} totalSize="120 GB" />
```

`IncidentSeverity` = `critical | high | medium | low | info` · `Status` (StatusDot/HostCard/etc) = `online | offline | warning | idle` · `LogLevel` = `debug | info | warn | error | trace` · `RollbackStepStatus` = `pending | running | success | failed | skipped` · `ApprovalState` = `pending | approved | rejected`.

### Footer & branding

```tsx
import { Button, Footer, TopNav } from '@tollerud/ui'

<Footer layout="responsive" accent labels={{ tollerudProject: 'A Tollerud Project' }} />
```
The monogram must always sit left of the project name with `gap-2`. Never show the name without the monogram, or the monogram alone, in nav contexts.

```tsx
<TopNav
  projectName="Project Name"
  navItems={[{ label: 'Overview', href: '/overview', active: true }]}
  actions={<Button variant="primary" size="sm">Get started</Button>}
/>
```

**Monogram** — `color?: 'yellow' | 'black' | 'white'` (default `yellow`), `size?: number`, `title?: string` (default `'Tollerud'`). Brand avatars: `@tollerud/ui/brand/tollerud-avatar.svg`, `brand/tollerud-avatar-full.svg` (+ `.png` variants).
Monogram sizing is handled automatically by `TopNav` and `Footer`; use `Monogram` directly only for custom brand moments.

---

## Layout utility classes

These are low-level class references for package internals, docs demos, and custom cases. In consumer apps, prefer exported components and screen/layout primitives first; use these classes only when no component covers the need yet.

```html
<section class="tollerud-grid-bg">…</section>
<h1 class="tollerud-display text-[70px]">Dark. Monochrome.</h1>
<h2 class="tollerud-display--secondary text-[40px]">
  <span class="tollerud-display-shimmer">Yellow where it counts</span>
</h2>
<div data-density="compact">…dense tables / forms…</div>
```

Shadow scale: `--shadow-sm` `--shadow-md` `--shadow-lg` `--shadow-xl` `--shadow-glow`. Drawers/Sheets use `--shadow-xl`; popovers/tooltips `--shadow-lg`. Borders are the default separator — only reach for shadows on overlays.

---

## Copy & voice

- Action-first labels: "Deploy", "View Logs", "Restart" — not "Click here to initiate deployment"
- Terminal-style CTAs for technical actions: `❯ deploy --env production`, `$ init`
- Name the cause in errors: "Connection to emma.tollerud.no timed out" — not "Something went wrong"
- No exclamation marks or corporate filler ("Oops!", "Great!", "Please try again later")

## Accessibility checklist

- Every interactive element gets a visible focus ring (see token section above, or class `.tollerud-focus-ring`)
- Icon-only buttons need `aria-label`
- Always pass `label` to `Input` / `Select` / `Textarea` / `Checkbox` / `Switch` / `Radio` — never rely on placeholder-as-label
- Error text uses `role="alert"` or `aria-live="polite"`
- Never convey state by color alone — pair `StatusDot` / `Badge` color with text/icon
- Respect `prefers-reduced-motion: reduce` — disable shimmer/pulse/shader animations

## What NOT to do

| Don't | Why |
|---|---|
| Use light/white backgrounds | System is dark-only |
| Put yellow text on white | Fails contrast at ~1.7:1 |
| Recolor or add glow to the monogram | Yellow-on-dark branding is non-negotiable; glow is for interactive UI only |
| Introduce non-system chromatic colors (blue, green, purple) for decoration | Only the yellow accent + monochrome grays (status semantics are the lone exception) |
| Nest `<a>`/`<Link>` inside `<Button>` (or vice versa) | Invalid HTML — use `asChild` or `buttonVariants()` instead |
| Import a component name you saw in older docs without checking it exists | Verify against this catalog or `components/index.ts`. Common renames: `EmptyState` → `Empty`, `Toast` → `Toaster` + `sonner`'s `toast()`, `Drawer` → `Sheet`. Charts (`BarChart`, `AreaChart`, `Donut`, `Sparkline`) and marketing blocks (`HeroBlock`, `FeatureCard`, `CTABand`) ship since **v1.4.0**. Brand assets: `@tollerud/ui/brand/*` (not repo root). |

---

## Version notes

- **`asChild` / `buttonVariants` require `@tollerud/ui >= 1.0.7`**
- **Server Component import safety requires `@tollerud/ui >= 1.0.8`** (earlier versions crash when imported into a Server Component file — the bundle wasn't marked `'use client'`)
- **19 new components (`Divider`, `Pill`, `Avatar`/`AvatarGroup`, `Breadcrumb`, `Pagination`, `Segmented`, `Stepper`, `Panel`, `Meter`, `FormRow`, `Accordion`, `Slider`, `PasswordInput`, `Combobox`, `DatePicker`, `FileUpload`, `TagInput`, `PricingCard`) require `>= 1.0.9`**
- **`Combobox` + `DatePicker` close on window resize (≥ 1.1.0)** — earlier versions left the popover open and misaligned after viewport changes
- Always pin to the latest patch and check `CHANGELOG.md` in the design-system repo for breaking changes (e.g. the 1.0.5 yellow token rename: `tollerud-yellow-bright` → `tollerud-yellow`, old `tollerud-yellow` `#E8D500` → `tollerud-yellow-warm`)

---

## CHANGELOG.md format rules

The docs site at `design.tollerud.dev` parses `CHANGELOG.md` at runtime. Wrong formatting causes entries to render as a wall of text. Follow these rules whenever you write a changelog entry:

**Entry heading:** `## version — YYYY-MM-DD — Title`
```
## 1.2.0 — 2026-07-01 — Add DataGrid component
```

**Blank lines are required** between every distinct block. The parser splits sections at blank lines — missing blank lines cause everything to merge into one paragraph.

**Section headings inside an entry:** `###` heading or a `**Bold line**` on its own line, preceded by a blank line:
```
## 1.2.0 — 2026-07-01 — Add DataGrid component

Short summary.

### New components

- `DataGrid` — sortable, filterable grid ...

### Migration

Nothing breaking.
```

**Never** write bold inline mid-paragraph as a heading substitute with no blank line before it — it will merge with surrounding text into one unreadable block.
