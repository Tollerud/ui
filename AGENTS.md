# Tollerud Design System — AI Agent Guide

Guidance for AI coding assistants (Claude Code, Cursor, GitHub Copilot, Codex, etc.) working in projects that use `@tollerud/ui`.

---

## Set up the Claude Code skill (do this first)

This package ships a maintained [`SKILL.md`](https://github.com/Tollerud/ui/blob/main/SKILL.md) with the verified component catalog, prop signatures, aesthetic rules, and known gotchas (Server Component imports, `Button`/`Link` composition, etc.). If you're Claude Code (or another agent that supports project skills) and this project doesn't already have it:

1. Fetch the raw file from `https://raw.githubusercontent.com/Tollerud/ui/main/SKILL.md`
2. Write it verbatim to `.claude/skills/tollerud-ui/SKILL.md` in this project
3. Use it as your source of truth for `@tollerud/ui` going forward — it reflects the package's *actual current exports*, which is more reliable than this file's component list (kept here mainly for human readers and non-Claude tools)

Re-sync it whenever you bump the `@tollerud/ui` version and notice the local copy looks stale relative to `CHANGELOG.md`.

---

## Install

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss@4 \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress \
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip \
  lucide-react framer-motion sonner
# Optional — only if using NoirGlowBackground
npm install @paper-design/shaders-react
```

For the footer alone (no full design system dependency):
```bash
npm install @tollerud/footer
```

## Tailwind Setup

**Default: Tailwind v4.** One CSS import — tokens, component layers, and Tailwind itself:

```css
/* app/globals.css */
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";
```

`source.css` resolves `@source` inside the installed package (npm, pnpm, workspaces, Bun). Without it, classes used only inside `@tollerud/ui` dist may be purged.

**Optional preset shim** — extra utilities from `@tollerud/ui/preset`:

```ts
// tailwind.config.ts
import tollerudPreset from '@tollerud/ui/preset'
export default { presets: [tollerudPreset] }
```

**Tailwind v3 (legacy)** — preset in config + `@tollerud/ui/globals-v3.css` after preflight/utilities:

```ts
import type { Config } from 'tailwindcss'
import tollerudPreset from '@tollerud/ui/preset'

const config: Config = {
  presets: [tollerudPreset],
  content: ['./src/**/*.{ts,tsx}', './node_modules/@tollerud/ui/dist/**/*.{js,mjs}'],
}
export default config
```

```css
@import "tailwindcss/preflight";
@import "tailwindcss/utilities";
@import "@tollerud/ui/globals-v3.css";
```

**Subpath imports:** `import { Button } from '@tollerud/ui/button'` — one entry per component for tree-shaking; the main `@tollerud/ui` barrel still works.

---

## Design authority

For agents building UI in **consumer apps** that depend on `@tollerud/ui` (not when contributing to this design-system repo):

**When screenshots or mocks exist** for a screen, they win on layout, spacing, and structure for that screen.

**When they don't** (common), use this fallback order:

1. **Existing UI in the same app** — match sibling pages, nav, density, and component usage already in the repo.
2. **`@tollerud/ui` + [SKILL.md](SKILL.md)** — components, tokens, composition patterns, accessibility.
3. **[BRAND.md](BRAND.md) + aesthetic rules below** — non-negotiable Tollerud look (dark surfaces, yellow accent, nav lockup).
4. **[Live docs](https://design.tollerud.dev/)** — reference for how primitives compose on real pages.

| Source | Role |
|--------|------|
| **Mocks / screenshots** (if provided) | Page-specific layout truth |
| **In-repo patterns** | Consistency when no mock exists |
| **`@tollerud/ui` + SKILL.md** | What to build with |
| **BRAND.md + aesthetic rules** | How it must look |

Agents must:

- Follow mocks when provided; otherwise extend existing app patterns before inventing new layouts.
- Prefer `import { … } from '@tollerud/ui'` over bespoke UI primitives.
- Compose **local feature components** (`src/features/…`, `src/components/…`) when a screen needs app-specific structure — not a parallel `components/ui` design system.
- Use Tollerud tokens (`text-tollerud-*`, `bg-tollerud-noir-*`) — never hardcode `#FFFF00` / `#0A0A0A` or copy component source from the package into the repo (see [Fixing copy/paste component patterns](#fixing-copypaste-component-patterns-for-agents-working-in-consumer-projects)).
- **Do not modify** `node_modules/@tollerud/ui` or vendor forked DS files in the consumer app. Bump the package version or open an issue upstream instead.

### Consumer styling policy

Tailwind is allowed and expected **inside `@tollerud/ui`**. Use it in this package to implement components, variants, layout primitives, responsive behavior, focus states, and docs demos.

In consumer apps, Tailwind is allowed as small local glue, but it should not become the primary design language. Prefer this order:

1. Exported `@tollerud/ui` components.
2. Exported layout primitives or screen patterns from `@tollerud/ui`.
3. Small Tailwind adjustments for local spacing, alignment, or responsive visibility.
4. A local semantic feature component when app-specific structure is needed.

If a branded layout or interaction repeats, add it to `@tollerud/ui` rather than rebuilding it with raw utility classes in each app.

| Allowed in consumer apps | Discouraged in consumer apps |
|--------------------------|------------------------------|
| `<div className="mt-6"><Button>Deploy</Button></div>` for local spacing glue | Hand-rolled `<button className="rounded-lg bg-yellow-400 px-4 py-2">...` |
| Tollerud token utilities when no primitive exists yet | Hardcoded colors like `#FFFF00`, `#0A0A0A`, or generic blue/gray/red palettes for branded UI |
| Local feature components that compose `@tollerud/ui` exports | A parallel `components/ui` design system copied from this package |
| `className` escape hatches merged through exported components | Inline styles for static branded design decisions |

For Tailwind v4 consumer apps, both imports are required:

```css
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";
```

`globals.css` provides tokens and component layers. `source.css` makes Tailwind scan `@tollerud/ui`'s dist classes. Without `source.css`, styles used only inside the package can disappear in production builds.

Use `import { cn } from '@tollerud/ui'` or `@tollerud/ui/utils`; do not create a local `cn()` helper in consumer projects.

**Agent-safe recipes** — copy-paste screen compositions for common pages (marketing landing, dashboard, settings, auth, empty state, detail, list/table) live on the docs site at [Recipes](https://design.tollerud.dev/recipes/). Each recipe is component-first and links to a fuller interactive example where one exists. See also [CONSUMER_STYLING_ROADMAP.md](CONSUMER_STYLING_ROADMAP.md) Phase 4.

**Consumer guardrails** — run `npx tollerud-ui-audit` from consumer app roots to detect styling drift (missing `@tollerud/ui` dep, `source.css`, copied `components/ui`, hardcoded brand hex, local `cn()`, Button/Link nesting). Use `--warn-only` for advisory CI. Alternative: `node node_modules/@tollerud/ui/scripts/audit-consumer-styling.mjs`. Error codes and fixes: GETTING_STARTED.md → Consumer project checklist.

When contributing **to this repository**, changing `components/*.tsx` is expected when the task explicitly calls for it — follow the release checklist in [Updating the npm package](#updating-the-npm-package-for-agents-working-in-this-repo) below.

---

## Aesthetic Rules

**Never violate these:**

- Dark surfaces only. Background: `#0A0A0A` (`bg-tollerud-noir-950`). Never white or light gray backgrounds.
- Yellow accent (`#FFFF00`, `text-tollerud-yellow`) is for CTAs, focus rings, active states, and key data points — not decoration.
- Never put yellow text on white. The ratio is 1.7:1 — it fails contrast.
- Borders are decorative thin lines (`border-tollerud-noir-600` or `border-tollerud-noir-700`). Use them freely; reach for shadows only for overlays.
- Monochrome everywhere except the single yellow accent. No blues, no greens, no brand gradients.

---

## Color Tokens

| Token | Value | Use |
|-------|-------|-----|
| `tollerud-yellow` | `#FFFF00` | Accent, CTA, focus, key data |
| `tollerud-yellow-warm` | `#E8D500` | Secondary yellow, gradients, warm states |
| `tollerud-noir-950` | `#0A0A0A` | Page background |
| `tollerud-noir-900` | `#111111` | Card / surface |
| `tollerud-noir-800` | `#1A1A1A` | Elevated surface |
| `tollerud-noir-700` | `#222222` | Hover states |
| `tollerud-noir-600` | `#333333` | Borders |
| `tollerud-text-primary` | `#F5F5F5` | Body text |
| `tollerud-text-secondary` | `#AAAAAA` | Secondary / labels |
| `tollerud-text-muted` | `#666666` | Placeholders, hints |

---

## Components

> **Full, verified catalog with props lives in [SKILL.md](SKILL.md)** — that file is checked against the actual `components/index.ts` exports and is the source of truth. The list below is a quick-reference subset.

All components import from `@tollerud/ui`. Use named imports.

```tsx
// Core / forms
import { Button, buttonVariants, cn, Card, Badge, Input, StatusDot, Kbd } from '@tollerud/ui'
import { CommandMenu, ActionRow, DataTable, LogViewer, Timeline, CodeBlock, StatCard, Container } from '@tollerud/ui'
import { Checkbox, Switch, RadioGroup, Radio, Select, Textarea } from '@tollerud/ui'
import { PasswordInput, Combobox, TagInput, Slider, FormRow } from '@tollerud/ui'
// Layout primitives (added in 4.2.0)
import { PageShell, Section, Stack, Cluster, Grid, CardGrid, Split, MainContent } from '@tollerud/ui'
// Screen patterns (added in 4.3.0)
import { PageHeader, TopNav, SidebarNav, DashboardTopBar, DashboardShell, SettingsLayout, FormPanel, ResourceList, DetailPage, EmptyPage, FeatureSection, StatsSection } from '@tollerud/ui'
// Primitives & navigation (added in 1.0.9)
import { Divider, Pill, Avatar, AvatarGroup } from '@tollerud/ui'
import { Breadcrumb, Pagination, Segmented, Stepper } from '@tollerud/ui'
import { Panel, Meter, PricingCard } from '@tollerud/ui'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@tollerud/ui'
import { DatePicker, FileUpload } from '@tollerud/ui'
// Overlays & feedback
import { Empty, EmptyHeader, EmptyIcon, EmptyTitle, EmptyDescription, EmptyContent, EmptyState } from '@tollerud/ui'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@tollerud/ui'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@tollerud/ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@tollerud/ui'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@tollerud/ui'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, Drawer } from '@tollerud/ui'
import { Skeleton, Progress, Spinner, Toaster, ToastProvider, useToast, GlowCard, NoirGlowBackground, BentoDashboard, Alert } from '@tollerud/ui'
import { BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand } from '@tollerud/ui'
// Infra / homelab set
import { HostCard, ServiceHealthCard, DockerStackCard, IncidentCard } from '@tollerud/ui'
import { ApprovalCard, ActionDiff, AlertInbox, RollbackPlan, BackupStatusPanel } from '@tollerud/ui'
// Footer & branding
import { Footer, Monogram } from '@tollerud/ui' // or: import { Footer } from '@tollerud/footer'
```

### Button

```tsx
<Button variant="primary" size="md">Deploy</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" size="sm">More</Button>
<Button variant="destructive">Delete host</Button>
<Button variant="terminal" size="sm">start_building</Button>

// Styling a <Link> as a button — Button only renders a native <button>,
// so use asChild (Radix Slot) or buttonVariants() instead of nesting <a> in <button>
<Button asChild variant="primary"><Link href="/deploy">Deploy</Link></Button>
<Link href="/deploy" className={buttonVariants({ variant: 'primary' })}>Deploy</Link>
```

Variants: `primary` · `secondary` · `ghost` · `destructive` · `terminal`
Sizes: `sm` · `md` · `lg`
`asChild` and `buttonVariants` require `@tollerud/ui >= 1.0.7`.

### Card

```tsx
<Card>Content</Card>
<Card accent>Highlighted with yellow border</Card>
```

### Badge

```tsx
<Badge>Default</Badge>
<Badge variant="accent">New</Badge>
<Badge variant="success">Online</Badge>
<Badge variant="error">Down</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="warning">Degraded</Badge>
```

### StatusDot

```tsx
<StatusDot status="online" label="SSH Connected" />
<StatusDot status="warning" label="CPU 87%" />
<StatusDot status="offline" label="Unreachable" />
<StatusDot status="idle" label="Idle" />
```

### Input / Textarea / Select / Checkbox / Switch / RadioGroup

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

### Kbd — Keyboard shortcut chip

```tsx
<Kbd keys="⌘K" />
<Kbd keys={["⌘", "⇧", "S"]} size="sm" />
```

### CommandMenu — Raycast-style command palette

```tsx
const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open</Button>
<CommandMenu
  open={open}
  onOpenChange={setOpen}
  groups={[
    {
      label: 'Servers',
      items: [
        { id: 'emma', label: 'emma.tollerud.no', description: 'SSH · uptime 14d', onSelect: () => {} },
      ],
    },
  ]}
  toggleShortcut="k"
/>
```

Built-in `⌘K` / `Ctrl+K` listener, arrow navigation, Esc to close, search across all groups.

### StatCard

```tsx
<StatCard label="Active Sessions" value={42} change={{ value: "+12%", direction: "up" }} />
```

### CodeBlock

```tsx
<CodeBlock promptPrefix showCopy code={`systemctl status tollerud-agent`} />
```

### DataTable

```tsx
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

// Optional rich mode: searchable, filter, selectable, pageSize, bulkActions, rowMenu, toolbarRight, emptyState
```

### Empty (empty states)

```tsx
<Empty>
  <EmptyHeader>
    <EmptyIcon>{/* icon */}</EmptyIcon>
    <EmptyTitle>No hosts connected</EmptyTitle>
    <EmptyDescription>Connect your first machine and Tia will start watching it.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button variant="primary" size="sm">Connect a host</Button></EmptyContent>
</Empty>
```

### Infra / homelab components

```tsx
<HostCard hostname="emma" ip="10.0.10.10" status="online" cpu="23%" memory="6.2/16 GB" disk="45%" uptime="14d" containers={4} />
<ServiceHealthCard service="emma.tollerud.no" status="online" uptime="14d 3h" responseTime="23ms" />
<IncidentCard title="High CPU" severity="high" timestamp="2026-05-26 14:32" description="CPU at 92% for 5 min" service="emma" />
<ApprovalCard action="restart_container" description="Restart emma:hermes" state="pending" onApprove={() => {}} onReject={() => {}} />
<LogViewer lines={[{ text: 'Health check passed', level: 'info', timestamp: '14:32:01', source: 'hermes' }]} follow searchable showLineNumbers height="300px" />
<AlertInbox alerts={[{ id: '1', title: 'emma high CPU', severity: 'high', timestamp: '14:32', acknowledged: false }]} onAcknowledge={(id) => {}} />
```

Severity scale: `critical` · `high` · `medium` · `low` · `info`


---

## Layout Patterns

These class-level patterns are references for package internals, docs demos, and custom cases. In consumer apps, prefer exported components and layout/screen primitives first. Use raw classes only as small local glue or when a component does not exist yet.

### Navigation lockup

The monogram must always appear left of the project name with `gap-2`. Never show the name without the monogram or the monogram alone in a nav context.

```tsx
<TopNav
 projectName="Project Name"
 navItems={[{ label: 'Overview', href: '/overview', active: true }]}
 actions={<Button variant="primary" size="sm">Get started</Button>}
/>
```

Monogram sizing is handled automatically by `TopNav` and `Footer`. If you build a custom layout inside `@tollerud/ui`, use top bar/sidebar expanded → `h-5`, sidebar collapsed → `h-6`, footer → `h-4`.

### Grid background

```html
<section class="tollerud-grid-bg">…</section>
```

### Display headings

```html
<h1 class="tollerud-display text-[70px]">Dark. Monochrome.</h1>
<h2 class="tollerud-display--secondary text-[40px]">
  <span class="tollerud-display-shimmer">Yellow where it counts</span>
</h2>
```

### Container

```tsx
<Container>Content capped at 1100px with 24px padding</Container>
```

### Component-first page layout

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

### Density

Apply `data-density="compact"` to any container to tighten spacing for tables, forms, and panels inside it.

```html
<div data-density="compact">…dense tables / forms…</div>
```

### Elevation

Use borders as the primary separation method. Only add shadows to lift overlays. Shadow scale: `--shadow-sm` `--shadow-md` `--shadow-lg` `--shadow-xl` `--shadow-glow`. Drawers use `--shadow-xl`; popovers `--shadow-lg`.

---

## Copy & Voice

- Labels are short and action-first: "Deploy", "View Logs", "Restart" — not "Click here to initiate deployment"
- Terminal-style CTAs for technical actions: `❯ deploy --env production`, `$ init`
- Error messages name the cause: "Connection to emma.tollerud.no timed out" — not "Something went wrong"
- Avoid exclamation marks and corporate filler ("Oops!", "Great!", "Please try again later")

---

## Accessibility

- Every interactive element needs a visible focus ring: `focus-visible:outline-2 focus-visible:outline-tollerud-yellow focus-visible:outline-offset-2` (or `.tollerud-focus-ring`)
- Icon-only buttons must have `aria-label`
- Inputs must have `<label>` — always use the `label` prop on `Input`, `Select`, `Textarea`
- Error messages use `role="alert"` or `aria-live="polite"`
- Never convey information by color alone
- Respect `prefers-reduced-motion: reduce` — disable shimmer and animations

---

## What NOT to do

| Don't | Why |
|-------|-----|
| Use light/white backgrounds | The system is dark-only |
| Put yellow text on white | Fails contrast at 1.7:1 |
| Recolor the monogram | Yellow on dark is non-negotiable |
| Use non-system colors (blue, green, purple) | Only yellow accent + monochrome grays |
| Add drop shadows or glows to the monogram | Glow is for interactive UI, not branding |
| Show the project name without the monogram | The lockup is the brand |
| Use verbose copy or exclamation marks | Violates voice guidelines |

---

## Updating the npm package (for agents working in this repo)

When asked to add components, fix bugs, or cut a release:

### 1. Build and validate before committing

```bash
npm run validate   # typecheck + lint + test + build
```

### 1b. `package-lock.json` must match CI npm

GitHub Actions uses **Node 24 + npm 11** (`packageManager` in `package.json` pins `npm@11.16.0`). Regenerating the lockfile with a different npm major can produce entries that **`npm ci` rejects on CI**.

When you change dependencies or bump the package version:

```bash
npx npm@11.16.0 install          # refresh lockfile — use the pinned npm, not an arbitrary local version
rm -rf node_modules && npx npm@11.16.0 ci   # verify before push
```

Never use `npm install --package-lock-only` alone for version bumps — it can desync optional peer entries. Commit `package-lock.json` in the same commit as `package.json` changes.

### 2. Every new component needs all four of these

| What | Where |
|------|-------|
| Component file | `components/ComponentName.tsx` |
| Named export + type export | `components/index.ts` |
| Registry entry | `registry.json` — add a `kebab-case` key with `name`, `description`, `files`, `dependencies`, `registryDependencies`, `type: "components:ui"` |
| Docs preview | Add a `<Section>` + `<Demo>` in `docs-app/components/pages/page-*.jsx`. Register routes in `docs-app/components/docs-shell.jsx` (`NAV`, `PAGES`, `PAGE_TITLES`). Support code lives in `kit/`, `blocks/`, `backgrounds/`. Build: `npm run build:docs` → `_site/`. |

### 3. Version bump rules

| Change | Version bump |
|--------|-------------|
| New components, no breaking changes | minor (`1.x.0`) |
| Bug fixes only | patch (`1.0.x`) |
| Prop renames, removed exports, token renames | major (`x.0.0`) |

Edit `package.json` version, then update these to match:
- `COMPLETENESS_ROADMAP.md` — header line `### npm package (components/*.tsx) — vX.X.X`
- `registry.json` — top-level `"version"` field (or run `npm run sync:registry`)

The docs sidebar version reads live from `package.json` via `PACKAGE_VERSION` in `docs-app/lib/docs-stats.js` — no manual edit.

### 4. Always update these files in the same commit

- `CHANGELOG.md` — add an entry at the top following the **exact format rules below**
- `COMPLETENESS_ROADMAP.md` — move completed items to the done list, strike through fixed quality items
- `SKILL.md` — add new components to the catalog, update version notes
- `AGENTS.md` (this file) — update the component import blocks if new exports were added

**Consumer styling / recipes / guardrails** (no version bump required for docs-only): also sync `GETTING_STARTED.md`, relevant `docs-app/components/pages/page-*.jsx`, `docs-app/lib/docs-routes.js`, `docs-app/lib/component-catalog.js`, and `CONSUMER_STYLING_ROADMAP.md` — see [CONTRIBUTING.md](CONTRIBUTING.md) and `.cursor/rules/consumer-styling-docs.mdc`.

### 5. CHANGELOG.md format rules

The docs site parses `CHANGELOG.md` at runtime. Wrong formatting causes entries to render as a wall of text or missing content. Follow these rules exactly:

**Entry heading** — always `## version — YYYY-MM-DD — Title`:
```
## 1.2.0 — 2026-07-01 — Add DataGrid component
```

**Blank lines are mandatory** between every distinct block (paragraph, heading, list, code fence). The parser breaks sections at blank lines — without them everything merges into one paragraph.

**Section headings inside an entry** — use `###` or a `**Bold line**` on its own line preceded by a blank line:
```
## 1.2.0 — 2026-07-01 — Add DataGrid component

Short summary of what changed.

### New components

- `DataGrid` — sortable, filterable data grid with ...

### Migration

Nothing breaking. Drop-in replacement for `DataTable` where needed.
```

**Never do this** — bold inline mid-paragraph acting as a heading with no blank line before it:
```
## 1.2.0 — bad example
Summary text. **New components** - DataGrid does X. **Migration** nothing breaking.
```

**Lists** — standard markdown `- item`. One blank line before the first item if preceded by a paragraph.

**Code blocks** — standard triple-backtick fences. Always close the fence, always a blank line before and after.

### 6. Commit and push

```bash
git add <changed files>
git commit -m "Brief description — vX.X.X"
git push origin main
```

---

## Fixing copy/paste component patterns (for agents working in consumer projects)

Older versions of projects that use `@tollerud/ui` sometimes copied component source files directly into the repo (e.g. `src/components/ui/Button.tsx` copied from the design system). These need to be replaced with package imports.

### How to detect it

```bash
# Find files that look like copied DS components (contain tollerud- tokens but aren't node_modules)
grep -rl "tollerud-yellow\|tollerud-noir\|tollerud-surface" src --include="*.tsx" --include="*.ts"
```

Also check for a local `components/ui.ts` or `components/ui/index.ts` that re-exports from relative paths instead of `@tollerud/ui`.

### How to fix it

1. **Verify `@tollerud/ui` is installed** — check `package.json`. If not: `npm install @tollerud/ui clsx tailwind-merge`.

2. **Replace the local copy with a package import** — for each copied component:
   ```tsx
   // Before (copied file)
   import { Button } from '@/components/ui/Button'

   // After
   import { Button } from '@tollerud/ui'
   ```

3. **Delete the copied files** once all imports are updated and the project builds.

4. **Check for prop drift** — copied files may be outdated. Verify against `SKILL.md` (or `.claude/skills/tollerud-ui/SKILL.md`) that prop names haven't changed (e.g. `onValueChange` vs `onChange`, `label` vs `children` on form components).

5. **Check for inline token usage** — copied files sometimes hardcode hex values instead of using tokens. Replace any hardcoded `#FFFF00`, `#0A0A0A`, `#E8D500` etc. with `text-tollerud-yellow`, `bg-tollerud-noir-950`, `text-tollerud-yellow-warm`.

6. **Run typecheck** — `npx tsc --noEmit`. Prop signatures in the package may differ slightly from the copied version; fix any type errors before committing.

### Common copy/paste patterns to look for

| Pattern | Fix |
|---------|-----|
| `src/components/ui/Button.tsx` with `tollerud-btn` classes | Delete, import from `@tollerud/ui` |
| `lib/utils.ts` defining `cn()` manually | Replace with `import { cn } from '@tollerud/ui'` |
| `components/ui.ts` re-exporting from `'../../../components/Button'` | Replace all with `export * from '@tollerud/ui'` or direct named imports |
| Inline `bg-[#FFFF00]` or `text-[#0A0A0A]` | Replace with `bg-tollerud-yellow` / `text-tollerud-noir-950` |
| `import { toast } from 'sonner'` without a `<Toaster />` mount | Add `<Toaster />` near app root |

---

## Reference

| File | Contents |
|------|----------|
| [SKILL.md](SKILL.md) | **Verified** component catalog, props, gotchas — source of truth for what's actually shipped |
| [COMPONENTS.md](COMPONENTS.md) | Human usage guide + export index; roadmap-only components marked ⚠️ — verify exports in SKILL.md |
| [PROPS.generated.md](PROPS.generated.md) | Auto-generated `*Props` tables — `npm run docs:props` / `npm run test:props` |
| [BRAND.md](BRAND.md) | Logo usage, nav lockup, sizing rules |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | Contrast ratios, focus, ARIA patterns |
| [VOICE.md](VOICE.md) | Copy tone, terminal-style CTAs, error messages |
| [KEYBOARD.md](KEYBOARD.md) | Keyboard contract for CommandMenu and navigation |
| [BACKGROUNDS.md](BACKGROUNDS.md) | NoirGlowBackground props and fallback rules |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Install, Tailwind config, registry usage |
| [CONSUMER_STYLING_ROADMAP.md](CONSUMER_STYLING_ROADMAP.md) | Component-first consumer styling phases and acceptance criteria |
| [Recipes (docs)](https://design.tollerud.dev/recipes/) | Agent-safe copy-paste screen compositions |
| `npx tollerud-ui-audit` | Consumer styling drift checker (ships with `@tollerud/ui`); `--warn-only` for advisory CI; error codes in GETTING_STARTED.md |
| [CONTRIBUTING.md](CONTRIBUTING.md) | PR gates, component checklist, consumer styling doc sync matrix |
