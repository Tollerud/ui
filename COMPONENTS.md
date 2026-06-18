# Tollerud User Interface — Component Library

Human-oriented usage guide for `@tollerud/ui` **v4.8.23**. Components ship as React `.tsx` modules with matching CSS in `globals.css` / `tokens.css`.

**New here?** Install and wire Tailwind first — **[GETTING_STARTED.md](GETTING_STARTED.md)**. Then come back here for examples.

## Documentation map

| Resource | Use for |
|----------|---------|
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | Install, Tailwind, paths, migration — **start here** |
| **[SKILL.md](SKILL.md)** | Authoritative export catalog, import examples, gotchas (verified against `components/index.ts`) |
| **[PROPS.generated.md](PROPS.generated.md)** | Machine-generated prop tables — run `npm run docs:props` to refresh; `npm run test:props` catches drift |
| **This file** | Narrative examples, CSS class patterns, homelab/dashboard usage |
| **[COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md)** | Open roadmap items and release ritual |

## Consumer styling policy

Use this file as a component reference, not as an invitation to rebuild branded UI in each app. React consumers should prefer exported components first, layout primitives or screen patterns when available, and Tailwind only for small local glue. If a branded structure repeats, add it to `@tollerud/ui` or compose a local semantic feature component instead of copying package internals or creating a parallel `components/ui` system.

**Agent-safe recipes** for common screens (marketing landing, dashboard, settings, auth, empty state, detail, list/table) live on the docs site at [Recipes](https://design.tollerud.dev/recipes/).

**Consumer guardrails** — run `npx tollerud-ui-audit` from your app root before shipping. The audit checks Tailwind CSS setup, copied `components/ui` trees, hardcoded brand hex values, local `cn()` helpers, and `<Button><Link>` nesting. Use `--warn-only` in CI when you want warnings without a failing exit code. Full command reference, error codes, and fixes: [GETTING_STARTED.md](GETTING_STARTED.md) → Consumer project checklist · [Guides on design.tollerud.dev](https://design.tollerud.dev/resources/consumer-checklist/).

## Component families

Use this map to pick the right layer — not every app needs infra widgets or glow backgrounds.

| Family | Components | Reach for these when… |
|--------|------------|-------------------------|
| **Core** | `Button`, `Card`, `Badge`, `Input`, `Select`, `Checkbox`, `Switch`, `Textarea`, `FormRow`, `Container`, `StatusDot`, `Kbd`, `CodeBlock`, `StatCard` | Building any screen — actions, forms, layout, status |
| **Overlays & navigation** | `Dialog`, `Sheet`, `Drawer`, `DropdownMenu`, `Tabs`, `Tooltip`, `CommandMenu`, `Alert`, `Empty`, `Toaster` | Modals, menus, multi-step flows, command palette, toasts |
| **Data & patterns** | `DataTable`, `ActionRow`, `Timeline`, `LogViewer`, `BentoDashboard` | Tables, logs, dashboards assembled from primitives |
| **Infra / ops** | `HostCard`, `ServiceHealthCard`, `DockerStackCard`, `IncidentCard`, `ApprovalCard`, `AlertInbox`, `RollbackPlan`, `BackupStatusPanel`, `ActionDiff` | Homelab, fleet, incident, and approval UIs |
| **Visual & marketing** | `TimeSeriesChart`, `HeroBlock`, `FeatureCard`, `CTABand`, `BarChart`, `AreaChart`, `Donut`, `Sparkline`, `GlowCard`, `BentoDashboard` | Landing sections, charts, marketing blocks |
| **Optional visual** | `NoirGlowBackground` (+ `@paper-design/shaders-react` peer) | Hero backgrounds with WebGL glow — optional install |
| **Branding** | `Monogram`, `Footer` | Nav lockups and page chrome (`Footer` also as [`@tollerud/footer`](https://www.npmjs.com/package/@tollerud/footer)) |

## Export index

All symbols below resolve from `import { … } from '@tollerud/ui'` unless noted. Prop signatures: see [PROPS.generated.md](PROPS.generated.md).

**Core & forms:** `Button`, `ButtonGroup`, `buttonVariants`, `cn`, `Card`, `Badge`, `StatusDot`, `Kbd`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `RadioGroup`, `Radio`, `PasswordInput`, `PasswordStrength`, `passwordRules`, `Combobox`, `TagInput`, `Slider`, `FormRow`, `Container`, `CodeBlock`, `StatCard`, `ActionRow`, `CommandMenu`

**Navigation & layout:** `PageShell`, `Section`, `Stack`, `Cluster`, `Grid`, `CardGrid`, `Split`, `MainContent`, `PageHeader`, `TopNav`, `SidebarNav`, `DashboardTopBar`, `DashboardShell`, `SettingsLayout`, `FormPanel`, `ResourceList`, `DetailPage`, `EmptyPage`, `FeatureSection`, `StatsSection`, `Divider`, `Pill`, `Avatar`, `AvatarGroup`, `Breadcrumb`, `Pagination`, `Segmented`, `Stepper`, `Panel`, `Meter`, `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`, `DatePicker`, `FileUpload`, `PricingCard`

**Overlays & feedback:** `Alert`, `Dialog` (+ `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`), `Tooltip` (+ `TooltipTrigger`, `TooltipContent`, `TooltipProvider`), `Tabs` (+ `TabsList`, `TabsTrigger`, `TabsContent`), `DropdownMenu` (+ trigger/content/item/label/separator), `Sheet` (+ `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetClose`), `Drawer`, `Toaster` (Sonner), `ToastProvider` / `useToast`, `Empty` (+ compound parts), `EmptyState`, `Skeleton`, `Progress`, `Spinner`

**Data & infra:** `DataTable`, `HostCard`, `ServiceHealthCard`, `DockerStackCard`, `IncidentCard`, `ApprovalCard`, `ActionDiff`, `LogViewer`, `AlertInbox`, `Timeline`, `RollbackPlan`, `BackupStatusPanel`

**Visual & marketing:** `Monogram`, `GlowCard`, `NoirGlowBackground`, `BentoDashboard`, `TimeSeriesChart`, `TIME_SERIES_PRESETS`, `formatChartDecimal`, `formatChartNumber`, `formatChartDateShort`, `formatChartDateLong`, `BarChart`, `AreaChart`, `Donut`, `Sparkline`, `HeroBlock`, `FeatureCard`, `CTABand`

**Footer:** `Footer` — also published as [`@tollerud/footer`](https://www.npmjs.com/package/@tollerud/footer)

## NoirGlowBackground

Tollerud.no-inspired animated WebGL background using `@paper-design/shaders-react`, with CSS fallback classes.

```tsx
<HeroBlock
  eyebrow="homelab control plane"
  title="Run your stack like production."
  description="Deploy, monitor, and roll back from one keyboard-first console."
  intense
/>
```

Use `NoirGlowBackground` directly only for custom background composition that cannot be represented by an exported block yet. See `BACKGROUNDS.md` for install, props, usage rules, and fallback HTML.

## Layout primitives

These primitives give consumer apps a component-first page structure before reaching for raw Tailwind layout classes.

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

| Component | Key props | Use for |
|-----------|-----------|---------|
| `PageShell` | `background`, `density`, `contentClassName` | Full-page noir/grid/glow background. Inner wrapper is always `flex flex-col flex-1` so `min-h-screen flex flex-col` layouts work correctly. |
| `Section` | `size`, `width` | Consistent page sections |
| `Stack` | `gap`, `align` | Vertical rhythm |
| `Cluster` | `gap`, `align`, `justify` | Wrapping actions, badges, and toolbars |
| `Grid` | `columns`, `gap` | Generic responsive grids |
| `CardGrid` | `columns`, `gap` | Card collections |
| `Split` | `ratio`, `gap`, `reverse` | Content/aside two-column layouts |
| `MainContent` | `width`, `spacing`, `density` | App route content wrapper |

## Screen patterns

These components assemble common page structures from the layout primitives and core components.

```tsx
<DashboardShell
  projectName="Mission Control"
  pageTitle="Overview"
  sidebarItems={[{ id: 'overview', label: 'Overview', href: '/', active: true }]}
  header={<PageHeader title="Overview" description="Fleet health at a glance." />}
>
  <StatsSection stats={[{ label: 'Hosts online', value: 3, accent: true }]} />
</DashboardShell>
```

| Component | Use for |
|-----------|---------|
| `PageHeader` | Page title, eyebrow, description, metadata, and actions |
| `TopNav` | Branded monogram lockup, nav links, and top-level actions; `TopNavAction` controls mobile placement |
| `SidebarNav` | Sidebar brand lockup and grouped navigation links |
| `DashboardTopBar` | Context top bar with breadcrumb, page title, and actions. `showMobileLogo={false}` hides the mobile monogram. |
| `DashboardShell` | Docs-aligned app shell with sidebar nav and context top bar. Threads `showMobileLogo` to `DashboardTopBar`. |
| `SettingsLayout` | Settings pages with section navigation |
| `FormPanel` | Titled form surface with actions and footer |
| `ResourceList` | List/table pages with filters, count, and empty state |
| `DetailPage` | Detail pages with optional aside |
| `EmptyPage` | First-run, no-results, or error pages |
| `FeatureSection` | Marketing/product feature grids |
| `StatsSection` | Metric overview sections |

## Button

| Variant | Class | React Component | Usage |
|---------|-------|----------------|-------|
| Primary | `.tollerud-btn--primary` | `<Button variant="primary">` | Main CTA |
| Secondary | `.tollerud-btn--secondary` | `<Button variant="secondary">` | Secondary action |
| Ghost | `.tollerud-btn--ghost` | `<Button variant="ghost">` | Low emphasis |
| Destructive | `.tollerud-btn--destructive` | `<Button variant="destructive">` | Delete/remove |
| Terminal | `.tollerud-btn--terminal` | `<Button variant="terminal">` | Dev tools, CLIs |

Sizes: `--sm` (28px), `--md` (40px), `--lg` (48px) — fixed height per size so text and icon-only buttons align in the same row.

```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Deploy
</Button>
<Button variant="terminal" size="sm">
  start_building
</Button>
```

`Button` renders a native `<button>`. To style a link, use `asChild` or `buttonVariants()` — see [SKILL.md](SKILL.md#3-button-only-renders-a-native-button--use-aschild-for-links--107).

**Pointer glow** — primary and terminal buttons support a magnetic cursor-following highlight. CSS ships in `globals-layers.css`; wire it once at the app root:

```tsx
'use client'
import { useEffect } from 'react'
import { initButtonGlow } from '@tollerud/ui'

export function ButtonGlowRoot() {
  useEffect(() => initButtonGlow(), [])
  return null
}
```

Add `tollerud-btn-glow` to opt in other surfaces. Disabled when `prefers-reduced-motion: reduce`.

## Button group

Fused action buttons for independent clicks — shared outer border, internal dividers, consistent height. Not a toggle; use `Segmented` for single-select view/sort controls.

```jsx
<ButtonGroup size="sm">
  <Button variant="secondary">Deploy</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="ghost" aria-label="More options"><MoreIcon /></Button>
</ButtonGroup>
```

Props: `size?: 'sm' | 'md' | 'lg'`, `orientation?: 'horizontal' | 'vertical'`. Children must be `<Button>` elements.

## Card

| Class | React | Props |
|-------|-------|-------|
| `.tollerud-card` | `<Card>` | — |
| `.tollerud-card border-tollerud-yellow/25` | `<Card accent>` | accent: boolean |

```jsx
<Card>
  <StatusDot status="online" label="Emma — ready" />
</Card>
<Card accent>
  <p>Highlighted card with yellow border</p>
</Card>
```

## Badge

| Variant | Class | React |
|---------|-------|-------|
| Default | `.tollerud-badge--default` | `<Badge>` |
| Accent | `.tollerud-badge--accent` | `<Badge variant="accent">` |
| Success | `.tollerud-badge--success` | `<Badge variant="success">` |
| Error | `.tollerud-badge--error` | `<Badge variant="error">` |
| Info | `.tollerud-badge--info` | `<Badge variant="info">` |
| Warning | `.tollerud-badge--warning` | `<Badge variant="warning">` |

```jsx
<Badge variant="success">Online</Badge>
<Badge variant="accent">New</Badge>
```

## StatusDot

| Status | Color | Glow |
|--------|-------|------|
| online | `#22C55E` | 6px green glow |
| offline | `#EF4444` | — |
| warning | `#E8D500` | 6px yellow glow |
| idle | `#666666` | — |

```jsx
<StatusDot status="online" label="SSH Connected" />
<StatusDot status="warning" label="CPU 87%" />
```

## Input

```jsx
<Input
  label="Server Name"
  placeholder="e.g. emma.tollerud.no"
  error={errors.name}
/>
```

## Pill

```tsx
<Pill variant="outline">new</Pill>
<Pill variant="accent">production</Pill>
```

Variants: `outline` · `solid` · `accent`. CSS classes: `.tollerud-pill`, `.tollerud-pill--outline`, `.tollerud-pill--muted`, etc.

## StatCard

```jsx
<StatCard label="Active Sessions" value={42} icon={<Activity size={14} />}
  change={{ value: '+12%', direction: 'up' }} />

// tone overrides the default up=success / down=error color
<StatCard label="Price change" value="-3.2%" icon={<TrendingDown size={14} />}
  change={{ value: '-3.2%', direction: 'down', tone: 'success' }} />
```

Props: `label`, `value`, `icon?: ReactNode`, `accent?`, `change?: { value, direction: 'up' | 'down', tone?: 'success' | 'error' | 'warning' | 'info' | 'accent' }`.

## CodeBlock

```jsx
<CodeBlock
  promptPrefix
  showCopy
  code={`$ systemctl status tollerud-agent
● active (running)`}
/>
```

## Divider

```tsx
<Divider />
<Divider label="or" />
<Divider orientation="vertical" className="h-6" />
```

CSS: `.tollerud-divider`, `.tollerud-divider--accent`, `.tollerud-accent-bar` (gradient).

## Kbd — Keyboard Shortcut Chip

Raycast-inspired shortcut badge for displaying key combinations.

```tsx
<Kbd keys="⌘K" />
<Kbd keys={["⌘", "⇧", "S"]} size="sm" />
<Kbd keys="Esc" />
```

Props:
- `keys: string | string[]` — The keys to display. Separate with `+` for chords.
- `size?: "sm" | "md"` — Small variant for inline use.

CSS class: `.tollerud-kbd`, children `.tollerud-kbd__key`.

## ActionRow — Command / Action Item

A single command/action row used by `CommandMenu` and standalone.

```tsx
<ActionRow
  action={{
    id: 'deploy',
    label: 'Deploy Stack',
    description: 'emma: docker-compose up -d',
    icon: <Rocket />,
    shortcut: '↵',
    onSelect: () => deploy()
  }}
  highlighted={index === 0}
/>
```

Used as a controlled row with keyboard navigation via the `highlighted` prop.

## CommandMenu — Raycast-style Command Palette

The signature keyboard-first component. Full command palette with search, groups, keyboard navigation, and overlay.

```tsx
const [open, setOpen] = useState(false)
const servers = ['Emma', 'Miriam', 'Pia', 'Iris', 'Victoria', 'Embla']

<Button onClick={() => setOpen(true)}>Open Menu</Button>

<CommandMenu
  open={open}
  onOpenChange={setOpen}
  groups={[
    {
      label: 'Servers',
      items: servers.map((name) => ({
        id: name.toLowerCase(),
        label: `${name}.tollerud.no`,
        description: 'SSH · 4 containers · uptime 14d',
        onSelect: () => ssh(name),
      })),
    },
    {
      label: 'Actions',
      items: [
        { id: 'backup', label: 'Run Backup', description: 'rclone to JottaCloud', onSelect: () => runBackup() },
        { id: 'update', label: 'System Update', description: 'apt update && upgrade', onSelect: () => update() },
      ],
    },
  ]}
/>
```

Features:
- Built-in `⌘K` / `Ctrl+K` global listener
- Arrow key navigation, `Enter` selects, `Esc` closes
- Search filters across groups, labels, and descriptions
- Auto-focus on open, body scroll lock
- Footer keyboard hints
- Optional `filter` prop for custom search logic
- `onAction` callback for analytics/tracking

Usage: Import as a client component in your page/layout.

See `KEYBOARD.md` for full keyboard contract.

## Homelab / Infrastructure Components

The Tier 2 component set — these make Tia a real infrastructure assistant. All ship from `components/*.tsx` (`@tollerud/ui`) and are showcased on the **Infrastructure** page; `HostCard`, `AlertInbox` and `ApprovalCard` also power the Mission Control dashboard. They share a five-level `SEVERITY` scale (`critical · high · medium · low · info`).

### ServiceHealthCard

```tsx
<ServiceHealthCard
  service="emma.tollerud.no"
  status="online"
  uptime="14d 3h"
  responseTime="23ms"
  version="22.04 LTS"
/>
```

Props: `service`, `status`, `uptime`, `responseTime`, `version`, `loading`.

### HostCard

```tsx
<HostCard
  hostname="emma"
  ip="10.0.10.10"
  status="online"
  cpu="23%"
  memory="6.2/16 GB"
  disk="45%"
  uptime="14d"
  containers={4}
/>
```

Props: `hostname`, `ip`, `status`, `cpu`, `memory`, `disk`, `uptime`, `containers`, `loading`.

### DockerStackCard

```tsx
<DockerStackCard
  name="monitoring"
  composePath="/hdd/config/prometheus-stack/compose.yml"
  services={[
    { name: 'prometheus', status: 'online' },
    { name: 'grafana', status: 'online' },
    { name: 'alertmanager', status: 'online' },
  ]}
/>
```

Props: `name`, `services: StackService[]`, `composePath`, `loading`.

### IncidentCard

```tsx
<IncidentCard
  title="High CPU on emma"
  severity="high"
  timestamp="2026-05-26 14:32"
  description="CPU sustained at 92% for 5 minutes"
  service="emma"
  acknowledged={false}
/>
```

Prop `severity`: `'critical' | 'high' | 'medium' | 'low' | 'info'`. Dot color and border match severity.

### ApprovalCard

```tsx
<ApprovalCard
  action="restart_container"
  description="Restart emma:tollerud-hermes container"
  source="emma → /hdd/config/tia/compose.yml"
  state="pending"
  timestamp="2026-05-26 14:35"
  onApprove={() => {}}
  onReject={() => {}}
/>
```

States: `pending` (shows Approve/Reject buttons), `approved`, `rejected`.

### ActionDiff

```tsx
<ActionDiff
  label="docker-compose.yml"
  lines={[
    { text: '    image: hermes:latest', type: 'remove', oldLine: 5 },
    { text: '    image: hermes:v2.0', type: 'add', newLine: 5 },
    { text: '    restart: unless-stopped', type: 'context', oldLine: 6, newLine: 6 },
  ]}
/>
```

Renders a unified diff. `showContext` (default true) toggles context lines off to focus on edits. Line shape: `{ type: 'add' | 'remove' | 'context', text, oldLine?, newLine? }`.

### LogViewer

```tsx
<LogViewer
  lines={[
    { text: 'Starting deployment...', level: 'info', timestamp: '14:32:01', source: 'deploy' },
    { text: 'Connection refused on port 443', level: 'error', timestamp: '14:32:05', source: 'nginx' },
    { text: 'Health check passed', level: 'info', timestamp: '14:32:10', source: 'hermes' },
  ]}
  follow
  searchable
  showLineNumbers
  height={300}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lines` | `{ text, level, timestamp?, source? }[]` | `[]` | Log entries. `level` is one of `trace` `debug` `info` `warn` `error`. |
| `follow` | `boolean` | `false` | Auto-scroll to the newest line whenever `lines` changes. |
| `searchable` | `boolean` | `false` | Show a filter input (matches `text` + `source`) with a live match count. |
| `showLineNumbers` | `boolean` | `false` | Prefix each row with a zero-padded line number. |
| `height` | `number` | `300` | Scroll-area height in px. |

Level color coding: `trace` (muted) → `debug` (info blue) → `info` (secondary) → `warn` (yellow) → `error` (red, brightened message). Errors carry a colored left border. For a streaming/level-filter/export toolbar on top of it, see the **Logs & Console** build page.

### AlertInbox

```tsx
<AlertInbox
  alerts={[
    { id: '1', title: 'emma high CPU', severity: 'high', timestamp: '14:32', acknowledged: false },
    { id: '2', title: 'pia disk 91%', severity: 'critical', timestamp: '13:15', acknowledged: true },
  ]}
  onAcknowledge={(id) => {}}
/>
```

Features: severity count badges, hover-to-acknowledge, severity filter, scrollable list. Pass `loading` for a skeleton state; shows “No alerts — everything looks good” when empty.

### Timeline

```tsx
<Timeline
  active={true}
  items={[
    { id: '1', time: '14:32', title: 'Deployed hermes v2.0', description: 'Rolled out to emma', status: 'online',
      meta: ['success', '3s'] },
    { id: '2', time: '14:31', title: 'Restarted nginx', description: 'Config reloaded', status: 'warning',
      meta: ['warning'] },
    { id: '3', time: '14:30', title: 'SSH connection failed', description: 'emma refused connection', status: 'offline' },
  ]}
/>
```

Features: status-colored dots, connecting vertical lines, animated pulse for active items, metadata badges, icon support.

### RollbackPlan

```tsx
<RollbackPlan
  name="Rollback hermes v2.0"
  executing={true}
  steps={[
    { id: '1', label: 'Stop hermes container', status: 'success' },
    { id: '2', label: 'Restore previous image tag', status: 'running' },
    { id: '3', label: 'Start container', status: 'pending' },
    { id: '4', label: 'Run health check', status: 'pending' },
  ]}
/>
```

Step statuses: `pending` `running` `success` `failed` `skipped` — each with distinct icon and color.

### BackupStatusPanel

```tsx
<BackupStatusPanel
  jobs={[
    { name: 'emma-config', status: 'online', lastRun: '03:00', size: '4.2 GB', target: 'JottaCloud' },
    { name: 'iris-config', status: 'online', lastRun: '03:05', size: '1.8 GB', target: 'JottaCloud' },
    { name: 'miriam-media', status: 'offline', lastRun: '02:45' },
  ]}
  totalSize="6.0 GB"
  lastFullBackup="2026-05-25"
/>
```

Features: per-job status dots, size/target display, failed job warning footer. Pass `loading` for a skeleton state and `emptyState` (or rely on the default) when no jobs are configured.

## Layout & form components

### Panel

A card with a header bar (title + optional description + actions) and padded body — the structural workhorse behind log viewer, data table, and alert inbox surfaces.

```tsx
<Panel title="Compose stack" description="4 services"
  actions={<Button variant="ghost" size="sm">Edit</Button>}>
  …content…
</Panel>
```

Props: `title`, `description`, `actions`, `children`, `className`.

### Meter

A labeled progress bar with semantic tone coloring.

```tsx
<Meter label="CPU" value={23} showValue />
<Meter label="RAM" value={72} max={100} showValue tone="warning" />
```

Props: `value`, `max?` (default 100), `label?`, `showValue?`, `tone?: 'default' | 'success' | 'warning' | 'error'`.

### Stepper

Horizontal or vertical step indicator for wizards. Completed steps fill yellow; the current one carries a ring.

```tsx
<Stepper
  steps={[
    { label: 'Connect host' },
    { label: 'Choose stacks', description: 'Pick compose files' },
    { label: 'Finish' },
  ]}
  current={1}
/>
<Stepper steps={['Connect', 'Deploy', 'Verify']} current={0} orientation="vertical" />
```

Props: `steps: string[] | { label, description? }[]`, `current` (0-indexed), `orientation?: 'horizontal' | 'vertical'`.

### PasswordInput

A password field with a show/hide toggle. Same API as `Input` (`label`, `error`, `id`, …) plus native `<input>` props.

```tsx
<PasswordInput label="Password" placeholder="••••••••" error={pwError} />
```

### PasswordStrength

Strength bar + rule checklist for signup and change-password flows. Compose below a `PasswordInput` and pass the same `value`.

```tsx
const [pw, setPw] = useState('')
<PasswordInput label="New password" value={pw} onChange={e => setPw(e.target.value)} />
<PasswordStrength value={pw} />
```

Default rules: min 8 characters, uppercase letter, lowercase letter, number, special character. Override with `rules` — use the exported `passwordRules` array as a base:

```tsx
import { PasswordStrength, passwordRules } from '@tollerud/ui'
<PasswordStrength value={pw} rules={[...passwordRules, { label: 'No spaces', test: v => !/\s/.test(v) }]} />
```

Props: `value: string`, `rules?: { label: string; test: (value: string) => boolean }[]`.

### Spinner

Inline loading indicator; respects `prefers-reduced-motion`.

```tsx
<Button variant="primary" disabled><Spinner size={14} /> Deploying…</Button>
```

Props: `size` (px, default 16). CSS class: `.tollerud-spinner`.

### FormRow

Accessible field wrapper — wires `aria-describedby` between label, description, error, and control.

```tsx
<FormRow label="Hostname" htmlFor="hostname" description="Unique within your network." required error={errors.hostname}>
  <Input id="hostname" placeholder="e.g. embla" />
</FormRow>
```

Props: `label?`, `description?`, `error?`, `required?`, `htmlFor?`, `children`.

### PricingCard

A single plan tier with optional badge, feature list, and CTA.

```tsx
<PricingCard
  name="Pro"
  price="$12"
  period="/month"
  description="For a growing fleet"
  features={['10 hosts', 'Approvals & rollback', 'Priority support']}
  featured
  badge="Most popular"
  ctaLabel="Upgrade to Pro"
  onCtaClick={() => {}}
/>
```

Props: `name`, `price`, `period?`, `description?`, `features?: ReactNode[]`, `ctaLabel?`, `onCtaClick?`, `featured?`, `badge?`.

## Charts

Palette-aware SVG charts — no Recharts dependency. Yellow is the highlight series; grid and axis use `--chart-grid` and `--chart-axis` from `globals.css`.

```tsx
import {
  TimeSeriesChart,
  TIME_SERIES_PRESETS,
  BarChart,
  AreaChart,
  Donut,
  Sparkline,
} from '@tollerud/ui'
```

### Choosing a chart

| Component | Use when |
|-----------|----------|
| `TimeSeriesChart` | Wide price/metric history — stepped curves, hover tooltip, range selector |
| `Sparkline` | Inline trends in tables, stat rows, or cards |
| `AreaChart` | Simple static trend — no interaction |
| `BarChart` | Category comparison with one highlighted bar |
| `Donut` | Part-to-whole breakdown with legend |

### TimeSeriesChart

Interactive wide SVG chart for `{ date, value }` points. Use `curve="step"` when values hold between samples (prices, discrete readings).

```tsx
<TimeSeriesChart
  data={[
    { date: '2026-03-23', value: 13999, label: 'Bygghjemme', meta: ['Vaskemaskin Miele WWR860'] },
    { date: '2026-04-06', value: 14250, label: 'Obs BYGG' },
    { date: '2026-04-13', value: 13800, label: 'Maxbo' },
  ]}
  curve="step"
  height={300}
  ranges={TIME_SERIES_PRESETS}
  range="3m"
/>
```

Controlled range (parent owns filter state):

```tsx
'use client'
import { useState } from 'react'
import { TimeSeriesChart, TIME_SERIES_PRESETS } from '@tollerud/ui'

export function PriceChart({ data }) {
  const [range, setRange] = useState('3m')

  return (
    <TimeSeriesChart
      data={data}
      curve="step"
      height={300}
      ranges={TIME_SERIES_PRESETS}
      range={range}
      onRangeChange={setRange}
      toolbarLeft={<span className="text-sm text-tollerud-text-secondary">Price history</span>}
    />
  )
}
```

Custom ranges — `TIME_SERIES_PRESETS` ships English labels. For Norwegian UI, pass custom `ranges` and `locale="nb-NO"`:

```tsx
const MS_DAY = 24 * 60 * 60 * 1000

const RANGES_NB = [
  { value: '3m', label: '3 mnd', durationMs: 90 * MS_DAY },
  { value: '6m', label: '6 mnd', durationMs: 180 * MS_DAY },
  { value: '1y', label: '1 år', durationMs: 365 * MS_DAY },
  { value: '2y', label: '2 år', durationMs: 730 * MS_DAY },
  { value: 'all', label: 'Alt' },
]

<TimeSeriesChart
  data={points}
  curve="step"
  ranges={RANGES_NB}
  range="3m"
  locale="nb-NO"
/>
```

`formatValue` formats Y-axis ticks, the latest-value badge, and the default tooltip — independent of `locale` (dates only). For simple affixes without a callback, use `valuePrefix` / `valueSuffix` (ignored when `formatValue` is set):

```tsx
<TimeSeriesChart data={points} locale="nb-NO" valueSuffix=" kr/l" />
```

Use `formatChartDecimal` for decimal unit rates like kr/l:

```tsx
import { TimeSeriesChart, formatChartDecimal } from '@tollerud/ui'

<TimeSeriesChart
  data={points}
  curve="step"
  locale="nb-NO"
  formatValue={(value) => formatChartDecimal(value, 'nb-NO', { suffix: ' kr/l' })}
/>
```

Custom tooltip — `renderTooltip` receives the pre-formatted value as a third argument (from `formatValue` or locale defaults):

```tsx
<TimeSeriesChart
  data={points}
  curve="step"
  renderTooltip={(point, _index, formattedValue) => (
    <div>
      <div>{formattedValue}</div>
      <div>{point.label}</div>
    </div>
  )}
/>
```

Props: `data: TimeSeriesPoint[]`, `curve?: 'linear' | 'step'`, `height?`, `yAxis?: 'left' | 'right' | 'none'`, `ranges?`, `range?`, `onRangeChange?`, `toolbarLeft?`, `formatValue?: (value: number) => string`, `valuePrefix?`, `valueSuffix?`, `formatDate?`, `formatAxisDate?`, `renderTooltip?: (point, index, formattedValue) => ReactNode`, `showLatestValue?`, `locale?` (default `en-US`), `emptyMessage?`, `ariaLabel?`.

Types: `TimeSeriesPoint` — `{ date: Date | string | number; value: number; label?; meta? }`. `TIME_SERIES_PRESETS` — English 3 mo · 6 mo · 1 yr · 2 yr · All.

### Sparkline

```tsx
<Sparkline data={[12, 18, 14, 22, 19]} width={84} height={26} color="var(--tollerud-yellow-warm, #E8D500)" />

<Sparkline
  data={[17200, 16800, 17100, 16500, 13999]}
  curve="step"
  fill
  interactive
  width={160}
  height={36}
/>
```

Props: `data: number[]`, `width?`, `height?`, `color?`, `curve?: 'linear' | 'step'`, `fill?`, `interactive?`. Deprecated aliases: `w`, `h`.

### AreaChart

```tsx
<AreaChart data={[28, 35, 30, 44, 52, 48, 63]} height={150} />
```

Props: `data: number[]`, `height?`. Static gradient fill + point markers — no hover.

### BarChart

```tsx
<BarChart
  data={[
    { label: 'Mon', value: 32 },
    { label: 'Tue', value: 48 },
    { label: 'Thu', value: 67, accent: true },
  ]}
  height={180}
/>
```

Props: `data: { label, value, accent? }[]`, `height?`. `accent: true` paints a bar yellow.

### Donut

```tsx
<Donut
  segments={[
    { label: 'emma', value: 45, color: '#E8D500' },
    { label: 'pia', value: 25, color: '#FFB800' },
    { label: 'iris', value: 18, color: '#666666' },
    { label: 'free', value: 12, color: '#333333' },
  ]}
  size={160}
/>
```

Props: `segments: { label, value, color }[]`, `size?`. Renders a legend with percentages.

Live demos and prop tables: [design.tollerud.dev/charts](https://design.tollerud.dev/charts/).

## Marketing blocks

Full-width page sections used on the Blocks page.

```tsx
import { HeroBlock, FeatureCard, CTABand } from '@tollerud/ui'
```

### HeroBlock

A landing hero on the noir glow background. Single-column by default; pass `media` for a two-column layout with a right-hand visual.

```tsx
<HeroBlock eyebrow="homelab control plane" title="Run your stack like production."
  description="Deploy, monitor and roll back from one keyboard-first console."
  actions={<Button variant="terminal">deploy --free</Button>}
  media={<img src="tia.png" alt="" />} />
```

Props: `eyebrow` (pill text), `title`, `description`, `actions`, `media` (optional right column), `minHeight`, `intense`. Pass `intense` to render `NoirGlowBackground` with loud intensity (requires `@paper-design/shaders-react` in the host app).

### FeatureCard

Icon chip + title + copy. Drop several into a `.ds-grid-3`.

```tsx
<FeatureCard icon="zap" title="Instant deploys"
  description="Push a compose file and watch it roll out with health checks." />
```

Props: `icon` (`ReactNode` — pass a Lucide icon or custom element), `title`, `description`.

### CTABand

A centered closing call-to-action with an optional accent bar.

```tsx
<CTABand title="Ship your homelab like it matters."
  description="Free for one host. No card, no telemetry, no nonsense."
  actions={<><Button variant="primary" size="lg">Get started</Button></>} />
```

Props: `title`, `description`, `actions`, `accentBar` (default true).

## Navigation primitives

### Breadcrumb

```tsx
<Breadcrumb items={[
  { label: 'Servers', href: '/servers' },
  { label: 'Embla' },
]} />
```

Props: `items: { label, href?, onClick? }[]`, `separator?`.

### Pagination

```tsx
<Pagination page={page} pageCount={20} onChange={setPage} siblingCount={1} />
```

Props: `page` (1-indexed), `pageCount`, `onChange`, `siblingCount?`.

### Segmented

Toggle between views or filter modes. Segment height is fixed per size so text and icon `label` values align in the same row.

```tsx
<Segmented
  value={view}
  onChange={setView}
  options={[
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
  ]}
  size="sm"
/>

<Segmented value={sort} onChange={setSort} options={SORTS} collapseMobile />
```

Props: `options: { value, label, disabled? }[]`, `value`, `onChange`, `size?: 'sm' | 'md'`, `collapseMobile?`.

With `collapseMobile`, viewports below Tailwind `md` show only the selected option until tapped; options open in a dropdown overlay and collapse again after a selection. Desktop behavior is unchanged.

### Accordion

```tsx
<Accordion defaultOpen="faq-1">
  <AccordionItem value="faq-1">
    <AccordionTrigger>What is Tia?</AccordionTrigger>
    <AccordionContent>An infrastructure assistant for homelabs.</AccordionContent>
  </AccordionItem>
</Accordion>
```

Props: `multiple?`, `defaultOpen?: string | string[]`. Items use `value` to identify panels.

## Advanced forms

### TagInput

Chip-style multi-value input. Enter or comma to add; Backspace removes the last tag.

```tsx
<TagInput label="Tags" value={tags} onChange={setTags} placeholder="Add tag…" max={10} />
```

### Slider

```tsx
<Slider label="Alert threshold" showValue value={threshold} onChange={setThreshold} min={0} max={100} />
```

### DatePicker

```tsx
<DatePicker label="Schedule deployment" value={date} onChange={setDate} placeholder="Pick a date" />
```

### FileUpload

```tsx
<FileUpload label="Upload config" accept=".yaml,.json" multiple onFilesChange={handleFiles} />
<FileUpload clickLabel="Klikk for å laste opp" dragLabel="eller dra og slipp" description="PDF · maks 10 MB" />
```

## Visual & branding

### Monogram

Inline SVG brand mark. Never recolor outside the Tollerud UI rules.

```tsx
<Monogram className="h-5 w-auto" color="yellow" />
```

Props: `color?: 'yellow' | 'black' | 'white'`, plus standard SVG attributes.

### GlowCard

Mouse-tracked glow border card.

```tsx
<GlowCard glowColor="#FFFF00" intensity={0.4}>
  <p>Interactive surface</p>
</GlowCard>
```

### BentoDashboard

Composed dashboard shell — pass arrays of host stats, services, incidents, and backup jobs.

```tsx
<BentoDashboard hosts={[…]} stats={[…]} services={[…]} incidents={[…]} backups={[…]} />
```

See [PROPS.generated.md](PROPS.generated.md) for the full `BentoDashboardProps` shape.

### Progress

```tsx
<Progress value={65} />
```

Determinate progress bar (Radix-based). Use inside panels, upload flows, or deploy wizards.

## Overlays & feedback

### Toaster (Sonner)

Sonner-based toast renderer. Mount once near the app root; trigger toasts with `toast()` from `sonner`.

```tsx
import { Toaster } from '@tollerud/ui'
import { toast } from 'sonner'

<Toaster theme="dark" />
toast.success('Deployed', { description: 'hermes v2.0 is live' })
```

Props: extends Sonner `ToasterProps` plus `theme?: 'light' | 'dark' | 'system'` (default `dark`).

### ToastProvider / useToast

Context-based toasts with the Tollerud stack UI (alternative to Sonner).

```tsx
import { ToastProvider, useToast } from '@tollerud/ui'

// app root
<ToastProvider>{children}</ToastProvider>

// client component
const toast = useToast()
toast({ tone: 'success', title: 'Deployed', message: 'hermes v2.0 is live' })
```

Tones: `success` · `error` · `info` · `accent`. `title` required; `message` and `duration` (default 3800ms) optional.

### Drawer

Controlled slide-over panel — simpler API than composing `Sheet` manually.

```tsx
<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Host details"
  description="emma.tollerud.no"
  footer={<Button variant="primary" size="sm">Connect</Button>}>
  …content…
</Drawer>
```

Props: `open`, `onClose`, `side` (`right` | `left`), `title`, `description`, `children`, `footer`, `width` (default 380).

### Sheet

Radix-based slide-over panel for detail views and forms. Use the compound API (`SheetTrigger`, `SheetContent`, etc.).

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="sm">Host details</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>emma.tollerud.no</SheetTitle>
      <SheetDescription>SSH · 4 containers</SheetDescription>
    </SheetHeader>
    …content…
    <Button variant="primary" size="sm">Connect</Button>
  </SheetContent>
</Sheet>
```

`SheetContent` accepts `side?: 'left' | 'right'`. Closes on Esc or overlay click. Prefer **`Drawer`** when you want a single controlled component with `open` / `onClose` / `footer`.

### Dialog, Tooltip, Tabs, DropdownMenu

Standard Radix/shadcn composition patterns. All require a client boundary in the consuming file.

```tsx
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Restart container</DialogTitle>
      <DialogDescription>This will interrupt active connections.</DialogDescription>
    </DialogHeader>
    <DialogFooter><Button variant="destructive">Restart</Button></DialogFooter>
  </DialogContent>
</Dialog>

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><Button variant="ghost" size="sm">?</Button></TooltipTrigger>
    <TooltipContent>Uptime since last deploy</TooltipContent>
  </Tooltip>
</TooltipProvider>

<Tabs defaultValue="overview">
  <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="logs">Logs</TabsTrigger></TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>
```

### Alert

Inline status banner for persistent messages (not transient like toasts).

```tsx
<Alert tone="error" title="Connection failed" description="emma.tollerud.no timed out after 30s" />
```

Tones: `default` · `error` · `info` · `success` · `warning`.

### Combobox

Searchable single-select with keyboard navigation (↑/↓/Enter/Esc). Pass flat `options` or grouped `groups` with section titles in the dropdown.

```tsx
<Combobox label="Host" value={value} onChange={setValue}
  options={[{ value: 'emma', label: 'emma.tollerud.no' }]}
  placeholder="Search…" error={errors.host} />

<Combobox label="Target" value={target} onChange={setTarget}
  groups={[
    { label: 'Servers', options: hostOptions },
    { label: 'Actions', options: actionOptions },
  ]} />
```

Props: `options?: { value, label, disabled? }[]`, `groups?: { label, options }[]`, `value?`, `onChange?`, `label?`, `placeholder?`, `error?`, `filter?`.

### Avatar / AvatarGroup

Stacked avatars with a `+N` overflow chip.

```tsx
<Avatar name="Mathias Tollerud" src="/avatar.jpg" size="md" />
<AvatarGroup max={3} size="md">
  <Avatar name="Emma" />
  <Avatar name="Iris" />
  <Avatar name="Pia" />
  <Avatar name="Victoria" />
</AvatarGroup>
```

`Avatar`: `src?`, `name?` (derives initials), `fallback?`, `size?: 'sm' | 'md' | 'lg' | number`. `AvatarGroup`: `max?`, `size?`, `children` (`<Avatar>` elements).

## Elevation & density

**Shadow scale** — four theme-aware tiers (deep + low-spread in dark, soft in light): `--shadow-sm` `--shadow-md` `--shadow-lg` `--shadow-xl`, plus `--shadow-glow` for the yellow interaction glow. Drawers use `--shadow-xl`, popovers `--shadow-lg`. Lean on borders first; reach for a shadow only to lift overlays off the page.

**Density** — set `data-density="compact"` on any container to tighten cards, table rows, form rows, panel headers and buttons inside it, without changing the components. Default is comfortable.

```html
<div data-density="compact"> … dense tables / forms … </div>
```

## Empty

Compound empty-state layout for tables, cards, and panels with no data yet.

```tsx
<Empty>
  <EmptyHeader>
    <EmptyIcon><ServerIcon className="h-6 w-6" /></EmptyIcon>
    <EmptyTitle>No hosts connected</EmptyTitle>
    <EmptyDescription>Connect your first machine and Tia will start watching it.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="primary" size="sm">Connect a host</Button>
  </EmptyContent>
</Empty>
```

Exports: `Empty`, `EmptyHeader`, `EmptyIcon`, `EmptyTitle`, `EmptyDescription`, `EmptyContent` — each accepts standard HTML attributes + `className`.

### EmptyState

Prop-driven empty state with built-in icon names — quicker than composing `Empty` by hand.

```tsx
<EmptyState
  icon="server"
  title="No hosts connected"
  description="Connect your first machine and Tia will start watching it."
  action={<Button variant="primary" size="sm">Connect a host</Button>}
/>
<EmptyState compact accent icon="checkCircle" title="All clear" description="No open alerts." />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string \| ReactNode` | `'folder'` | Built-in names: `folder`, `server`, `search`, `alert`, `bell`, `checkCircle`, `rocket` — or pass a custom icon element |
| `title` | `ReactNode` | — | Headline |
| `description` | `ReactNode` | — | Supporting copy |
| `action` | `ReactNode` | — | Primary action |
| `secondaryAction` | `ReactNode` | — | Optional second action |
| `compact` | `boolean` | `false` | Tighter padding |
| `accent` | `boolean` | `false` | Yellow-tinted surface |

CSS classes: `.tollerud-empty`, `.tollerud-empty__icon`, `.tollerud-empty__title`, `.tollerud-empty__desc`.

## DataTable

Config-driven table with optional search, segmented filter, selection, bulk actions, row menus, and pagination. Owns sort / filter / selection / pagination state internally.

```tsx
<DataTable
  data={hosts}
  rowKey="id"
  columns={[
    { key: 'hostname', label: 'Host', sortable: true, render: (_v, row) => <span>{row.hostname}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (_v, row) => (
      <Badge variant={row.status === 'online' ? 'success' : 'error'}>{row.status}</Badge>
    )},
    { key: 'cpu', label: 'CPU', align: 'right', sortable: true },
  ]}
  searchable
  searchKeys={['hostname', 'ip']}
  searchPlaceholder="Search host, ip…"
  filter={{ key: 'region', allLabel: 'All regions' }}
  selectable
  pageSize={10}
  toolbarRight={<Button variant="terminal" size="sm">add_host</Button>}
  bulkActions={[
    { label: 'Restart', variant: 'ghost', onRun: (ids, clear) => { clear() } },
    { label: 'Stop', variant: 'destructive', onRun: (ids, clear) => clear() },
  ]}
  rowMenu={(row) => [
    { label: 'Connect (SSH)', onSelect: () => {} },
    { sep: true },
    { label: 'Stop host', onSelect: () => {} },
  ]}
  emptyState={
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No hosts found</EmptyTitle>
        <EmptyDescription>Try clearing your filters.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  }
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` / `rows` | `object[]` | `[]` | Row data (`data` preferred; `rows` is an alias). |
| `rowKey` | `keyof T \| fn` | `row.id` / `row.key` | Unique key + selection id. |
| `columns` | `Column[]` | `[]` | Column spec — see below. |
| `onRowClick` | `(row) => void` | — | Row click handler. |
| `emptyMessage` | `string` | `'No data'` | Plain-text fallback when `emptyState` is not set. |
| `searchable` | `boolean` | `false` | Show the search input. |
| `searchKeys` | `string[]` | column keys | Fields the search matches. |
| `searchPlaceholder` | `string` | `'Search…'` | Search input placeholder. |
| `filter` | `{ key, options?, allLabel?, variant?: 'segmented' \| 'combobox', placeholder? }` | — | Column filter in rich mode. Default `variant` is `segmented`; use `combobox` for a searchable dropdown. |
| `selectable` | `boolean` | `false` | Row checkboxes + select-all. |
| `pageSize` | `number` | — | Rows per page (fixed unless `pageSizeOptions` is set). Enables footer row count and `Pagination` when `pageCount > 1`. |
| `pageSizeOptions` | `number[]` | — | Footer **Rows** `Select` so users can change page size; resets to page 1 on change. Initial value from `pageSize` or first option. |
| `bulkActions` | `BulkAction[]` | `[]` | Shown when rows are selected; fused with `ButtonGroup` when 2+ actions. `onRun(ids, clear)`. |
| `rowMenu` | `(row) => MenuItem[]` | — | Per-row ⋮ dropdown. |
| `toolbarRight` | `ReactNode` | — | Toolbar right slot (e.g. add button). |
| `emptyState` | `ReactNode` | — | Custom empty UI (use `<Empty>…</Empty>`). |
| `loading` | `boolean` | `false` | Skeleton rows instead of data. |
| `skeletonRows` | `number` | `5` | Skeleton row count while loading. |
| `striped` | `boolean` | `false` | Alternating row backgrounds in rich mode. |
| `pinColumns` | `boolean` | rich mode default | Pin first column and row ⋮ menu during horizontal scroll. |
| `footer` | `ReactNode` | — | Extra content in the footer bar (right of row count). |

**Pagination** — fully client-side; no `page` / `onPageChange` props. Pass `pageSize` (and optionally `pageSizeOptions`). The footer shows `Showing 1–5 of 12`. Page controls appear when `pageCount > 1`. Search and rich-mode filters reset to page 1. With `selectable`, checked rows persist across pages until cleared or bulk action runs `clear()`.

**Column:** `{ key, label?, header?, sortable?, filterable?, align?: 'left' | 'center' | 'right', width?, render?: (value, row) => ReactNode | (row) => ReactNode }`. Without `render`, `row[key]` is shown. `header` is an alias for `label`.

## Skeleton

```tsx
<Skeleton className="h-4 w-48" />
<Skeleton className="h-48 w-full" />
```

Variants: `variant?: 'default' | 'circular' | 'text'`. CSS class: `.tollerud-skeleton`.

## Grid Background

```html
<section class="tollerud-grid-bg">
  ...
</section>
```

## Display Heading

```html
<h1 class="tollerud-display text-[70px]">Dark. Monochrome.</h1>
<h2 class="tollerud-display--secondary text-[40px]">
  <span class="tollerud-display-shimmer">Yellow where it counts</span>
</h2>
<h3 class="tollerud-display--tertiary text-[28px]">Subtle hierarchy</h3>
```

## Display shimmer

Animated yellow gradient clipped to text — for hero accent lines and key metrics on **dark surfaces**. Respects `prefers-reduced-motion` (falls back to static `var(--primary)` / `var(--tollerud-yellow)`).

```html
<span class="tollerud-display-shimmer">Yellow where it counts.</span>
```

Pair with `.tollerud-display` on the parent heading. Not for body copy or light backgrounds (yellow fails contrast on white).

## Container

```jsx
<Container>
  <p>Content capped at 1100px with 24px padding</p>
</Container>
```

## Textarea

Multiline text input with label and error state.

```tsx
<Textarea
  id="description"
  label="Description"
  placeholder="Enter details..."
  rows={4}
/>
<Textarea
  label="Bio"
  value="..."
  error="Max 500 characters"
  onChange={...}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text |
| `error` | `string` | — | Error message, shows error styling |
| All native `<textarea>` props | — | — | rows, cols, placeholder, etc. |

## Select

Styled native `<select>` dropdown with custom chevron.

```tsx
<Select
  label="Server"
  placeholder="Select a server"
  options={[
    { value: 'emma', label: 'Emma' },
    { value: 'miriam', label: 'Miriam' },
    { value: 'iris', label: 'Iris' },
  ]}
/>
<Select label="Status" error="Required">
  <option value="running">Running</option>
  <option value="stopped">Stopped</option>
</Select>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text |
| `error` | `string` | — | Error message |
| `placeholder` | `string` | — | Disabled placeholder option |
| `options` | `{value, label}[]` | — | Option items (alternative to children) |
| All native `<select>` props | — | — | value, onChange, disabled, etc. |

## Checkbox

Custom-styled checkbox with checkmark SVG and label.

```tsx
<Checkbox label="Enable backups" checked={...} onChange={...} />
<Checkbox label="Send alerts" defaultChecked />
<Checkbox label="Action" disabled />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text (wraps input) |
| All `<input type="checkbox">` props | — | — | checked, defaultChecked, disabled, onChange |

## Switch

Toggle switch with `role="switch"` accessibility.

```tsx
<Switch label="Dark mode" checked={...} onChange={...} />
<Switch label="Notifications" defaultChecked />
<Switch label="Beta features" disabled />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text |
| All `<input type="checkbox">` props | — | — | checked, defaultChecked, disabled, onChange |

## RadioGroup / Radio

Fieldset-based radio group with custom dot indicator.

```tsx
<RadioGroup label="Deployment target" error={error}>
  <Radio value="staging" label="Staging" name="target" />
  <Radio value="production" label="Production" name="target" />
  <Radio value="canary" label="Canary" disabled name="target" />
</RadioGroup>
```

| RadioGroup Prop | Type | Default | Description |
|-----------------|------|---------|-------------|
| `label` | `string` | — | Group label (rendered as `<legend>`) |
| `error` | `string` | — | Error message |

| Radio Prop | Type | Default | Description |
|------------|------|---------|-------------|
| `label` | `string` | — | Radio label |
| All `<input type="radio">` props | — | — | value, checked, name, disabled |

## Footer

Footer bar with Tollerud monogram and branding link. The component is re-exported from [`@tollerud/footer`](https://www.npmjs.com/package/@tollerud/footer) — install that package directly if you need the footer without the full Tollerud UI package.

```tsx
<Footer />
<Footer layout="row" />
<Footer accent />
<Footer
  labels={{
    tollerudProject: 'A Tollerud Project',
    allRightsReserved: 'All rights reserved.',
  }}
  unstyled
  className="border-t border-tollerud-yellow/20 bg-black"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `'responsive' \| 'row'` | `'responsive'` | responsive = mobile-first stacking, row = horizontal |
| `accent` | `boolean` | `false` | Yellow-tinted surface |
| `unstyled` | `boolean` | `false` | Skip all surface styling |
| `labels` | `Partial<FooterLabels>` | — | tollerudProject, attribution, allRightsReserved |
| `className` | `string` | — | Footer element |
| `style` | `CSSProperties` | — | Footer element inline styles |
| `classNameInner` | `string` | — | Inner wrapper |
| `classNameLogo` | `string` | — | SVG monogram |
| `classNameText` | `string` | — | Text paragraph |
| `classNameLink` | `string` | — | tollerud.no link |

## State matrix

| Component | Default | Hover | Focus | Active/Check | Disabled | Error | Loading |
|-----------|---------|-------|-------|-------------|----------|-------|---------|
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ (disabled) |
| Input | ✅ | — | ✅ | — | ✅ | ✅ | — |
| Textarea | ✅ | — | ✅ | — | ✅ | ✅ | — |
| Select | ✅ | — | ✅ | — | ✅ | ✅ | — |
| Checkbox | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Switch | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Radio | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Badge | ✅ | — | — | — | — | — | — |
| Card | ✅ | ✅ | — | — | — | — | — |
| StatusDot | ✅ | — | — | — | — | — | — |
| Footer | ✅ | — | — | — | — | — | — |
