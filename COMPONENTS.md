# Tollerud Design System — Component Library

All components come as CSS classes (in `globals.css` / `tokens.css`) with React `.tsx` examples in `components/`.

> **Note:** As of **v1.0.9** the vast majority of components documented here ship in `@tollerud/ui`. Sections for components that are still docs-site-only or roadmap-only are marked with a ⚠️ warning; sections already in the package are marked ✅. **For the authoritative, props-complete reference use [SKILL.md](SKILL.md)** (verified against `components/index.ts`) or [COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md).

## NoirGlowBackground

Tollerud.no-inspired animated WebGL background using `@paper-design/shaders-react`, with CSS fallback classes.

```tsx
<section className="relative overflow-hidden bg-black">
  <NoirGlowBackground
    intensity="medium"
    speed="slow"
    grain="soft"
    shape="corners"
    preserveCenter
  />
  <div className="relative z-10">Content</div>
</section>
```

See `BACKGROUNDS.md` for install, props, usage rules, and fallback HTML.

## Button

| Variant | Class | React Component | Usage |
|---------|-------|----------------|-------|
| Primary | `.tollerud-btn--primary` | `<Button variant="primary">` | Main CTA |
| Secondary | `.tollerud-btn--secondary` | `<Button variant="secondary">` | Secondary action |
| Ghost | `.tollerud-btn--ghost` | `<Button variant="ghost">` | Low emphasis |
| Destructive | `.tollerud-btn--destructive` | `<Button variant="destructive">` | Delete/remove |
| Terminal | `.tollerud-btn--terminal` | `<Button variant="terminal">` | Dev tools, CLIs |

Sizes: `--sm`, `--md`, `--lg`

```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Deploy
</Button>
<Button variant="terminal" size="sm">
  start_building
</Button>
```

## Card

| Class | React | Props |
|-------|-------|-------|
| `.tollerud-card` | `<Card>` | — |
| `.tollerud-card border-tollerud-yellow/25` | `<Card accent>` | accent: boolean |

```jsx
<Card>
  <h3 className="font-semibold mb-1">Title</h3>
  <p className="text-tollerud-text-secondary text-sm">Content</p>
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

## Pill Tag

> ✅ `Pill` ships in `@tollerud/ui >= 1.0.9`. Import: `import { Pill } from '@tollerud/ui'`


```html
<span class="tollerud-pill tollerud-pill--outline">new</span>
<span class="tollerud-pill tollerud-pill--muted">deprecated</span>
<span class="tollerud-pill tollerud-pill--success">stable</span>
<span class="tollerud-pill tollerud-pill--error">critical</span>
```

## StatCard

```jsx
<StatCard
  label="Active Sessions"
  value={42}
  change={{ value: "+12%", direction: "up" }}
/>
```

## CodeBlock

```jsx
<CodeBlock>
{`$ systemctl status tollerud-agent
● active (running)`}
</CodeBlock>
```

## Divider

> ✅ `Divider` ships in `@tollerud/ui >= 1.0.9`. Import: `import { Divider } from '@tollerud/ui'`


```html
<hr class="tollerud-divider" />
<hr class="tollerud-divider--accent" />
<hr class="tollerud-accent-bar" />   <!-- gradient -->
```

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

> ✅ `Panel` ships in `@tollerud/ui >= 1.0.9`. Import: `import { Panel } from '@tollerud/ui'`


A card with a header bar (title + optional actions) and optional footer — the structural workhorse behind the log viewer, data table, alert inbox and most dashboard surfaces.

```tsx
<Panel title="Compose stack" icon="grid"
  actions={<Button variant="ghost" size="sm">Edit</Button>}
  footer={<span className="ds-mono">compose.yml · 4 services</span>}>
  …content…
</Panel>
```

Props: `title`, `icon` (icon-set name), `actions`, `footer`, `noPadding`, `className`, `style`. CSS: `.ds-panel__head` / `.ds-panel__title` / `.ds-panel__foot`.

### Meter

> ✅ `Meter` ships in `@tollerud/ui >= 1.0.9`. Import: `import { Meter } from '@tollerud/ui'`


A labeled progress row that turns red past a hot threshold.

```tsx
<Meter label="CPU" value={23} valueLabel="23%" />
<Meter label="Containers" value={28} unlimited valueLabel="28 running" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Left-hand label. |
| `value` | `number` | — | Current value. |
| `max` | `number` | `100` | Denominator for the percentage. |
| `valueLabel` | `string` | — | Overrides the right-hand readout (else `value / max`). |
| `hot` | `number` | `85` | Percentage past which the bar turns red. |
| `unlimited` | `boolean` | `false` | Full dimmed bar; shows `value` alone. |

### Stepper

> ✅ `Stepper` ships in `@tollerud/ui >= 1.0.9`. Import: `import { Stepper } from '@tollerud/ui'`


Horizontal step indicator for wizards. Completed steps fill yellow; the current one carries a ring.

```tsx
<Stepper steps={['Connect host', 'Choose stacks', 'Invite team', 'Finish']} current={1} />
```

Props: `steps: string[]`, `current` (0-indexed). CSS: `.ds-wizard__*`.

### PasswordInput

> ✅ `PasswordInput` ships in `@tollerud/ui >= 1.0.9`. Import: `import { PasswordInput } from '@tollerud/ui'`


A password field with a show/hide toggle and an optional label action (e.g. a "Forgot?" link).

```tsx
<PasswordInput label="Password" placeholder="••••••••"
  error={pwError}
  labelAction={<a href="#">Forgot?</a>} />
```

Props: `label`, `labelAction`, `error`, `id`, plus all native `<input>` props.

### Spinner

> ⚠️ **Not yet in the `@tollerud/ui` npm package** — this is a docs-site / roadmap component (see [COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md)). Do not import `Spinner` from `@tollerud/ui` — it will not resolve. Check [SKILL.md](SKILL.md) for what's actually shipped.


Inline loading spinner; respects reduced-motion.

```tsx
<Button variant="primary"><Spinner size={14} /> Signing in…</Button>
```

Props: `size` (px, default 16), `style`. CSS: `.ds-spin`.

### FormRow

> ✅ `FormRow` ships in `@tollerud/ui >= 1.0.9`. Import: `import { FormRow } from '@tollerud/ui'`


Label + hint on the left, control on the right. The canonical settings-form layout; stacks vertically under 560px.

```tsx
<FormRow label="Two-factor auth" hint="Require a TOTP code at sign-in.">
  <Switch defaultChecked />
</FormRow>
```

Props: `label`, `hint`, `children`. CSS: `.ds-formrow`.

### PricingCard

> ✅ `PricingCard` ships in `@tollerud/ui >= 1.0.9`. Import: `import { PricingCard } from '@tollerud/ui'`


A single plan tier with optional ribbon, feature list and CTA. Powers the Billing page and the marketing pricing block.

```tsx
<PricingCard name="Pro" tagline="For a growing fleet"
  price={12} priceNote="billed monthly" recommended
  features={['10 hosts', 'Approvals & rollback', 'Priority support']}
  cta="Upgrade to Pro" />
```

| Prop | Type | Description |
|------|------|-------------|
| `name` / `tagline` | `string` | Title + sub-line. |
| `price` | `number \| string` | `0`, `'Free'`, `'$12'` render as "Free"; numbers get a `$` prefix. |
| `period` | `string` | Suffix after the price (default `/mo`). |
| `priceNote` | `string` | Small line under the amount. |
| `features` | `string[]` | Checklist. |
| `recommended` | `boolean` | Accent border + ribbon. |
| `ribbon` | `string` | Ribbon label (default `Recommended`). |
| `cta` | `string` | Button label. |
| `ctaVariant` | `string` | Button variant (defaults by recommended/state). |
| `ctaDisabled` | `boolean` | Disable the CTA (e.g. current plan). |
| `onCta` | `fn` | CTA click handler. |

CSS: `.ds-price` and `.ds-price__*`; grid wrapper `.ds-price-grid`.

## Charts

> ⚠️ **Not yet in the `@tollerud/ui` npm package** — this is a docs-site / roadmap component (see [COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md)). Do not import `BarChart / AreaChart / Donut / Sparkline` from `@tollerud/ui` — it will not resolve. Check [SKILL.md](SKILL.md) for what's actually shipped.


Palette-aware SVG charts in `docs/charts.jsx`. Yellow is the highlight series; everything else stays monochrome. Grid/axis use the `--chart-grid` token, so all four are theme-aware.

```tsx
<BarChart data={[{ label: 'Mon', value: 12 }, { label: 'Tue', value: 18, accent: true }]} height={180} />
<AreaChart data={[28, 35, 30, 44, 52]} height={150} />
<Donut segments={[{ label: 'CPU', value: 40, color: '#E8D500' }, { label: 'Idle', value: 60, color: '#444' }]} size={160} />
<Sparkline data={[12, 18, 14, 22, 19]} w={84} h={26} color="#E8D500" />
```

- **BarChart** — `data: { label, value, accent? }[]`, `height`. `accent: true` paints a bar yellow.
- **AreaChart** — `data: number[]`, `height`. Gradient fill + point markers.
- **Donut** — `segments: { label, value, color }[]`, `size`. Renders a legend with percentages.
- **Sparkline** — `data: number[]`, `w`, `h`, `color`. Inline trend line (used in DataTable cells).

## Marketing blocks

Full-width page sections in `docs/marketing.jsx`, used on the Blocks page.

### HeroBlock

> ⚠️ **Not yet in the `@tollerud/ui` npm package** — this is a docs-site / roadmap component (see [COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md)). Do not import `HeroBlock` from `@tollerud/ui` — it will not resolve. Check [SKILL.md](SKILL.md) for what's actually shipped.


A landing hero on the noir glow background. Single-column by default; pass `media` for a two-column layout with a right-hand visual.

```tsx
<HeroBlock eyebrow="homelab control plane" title="Run your stack like production."
  description="Deploy, monitor and roll back from one keyboard-first console."
  actions={<><button className="tollerud-btn tollerud-btn--terminal tollerud-btn--md">deploy --free</button></>}
  media={<img src="tia.png" alt="" />} />
```

Props: `eyebrow` (pill text), `title`, `description`, `actions`, `media` (optional right column), `minHeight`, `intense`. Pass `intense` to swap the static noir glow for the live **GrainGradientGL** WebGL shader — the intense animated yellow grain atmosphere from tollerud.no (also used in the Overview "Bold" hero). It falls back to a static CSS gradient where WebGL is unavailable.

### FeatureCard

> ⚠️ **Not yet in the `@tollerud/ui` npm package** — this is a docs-site / roadmap component (see [COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md)). Do not import `FeatureCard` from `@tollerud/ui` — it will not resolve. Check [SKILL.md](SKILL.md) for what's actually shipped.


Icon chip + title + copy. Drop several into a `.ds-grid-3`.

```tsx
<FeatureCard icon="zap" title="Instant deploys"
  description="Push a compose file and watch it roll out with health checks." />
```

Props: `icon` (icon-set name), `title`, `description`.

### CTABand

> ⚠️ **Not yet in the `@tollerud/ui` npm package** — this is a docs-site / roadmap component (see [COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md)). Do not import `CTABand` from `@tollerud/ui` — it will not resolve. Check [SKILL.md](SKILL.md) for what's actually shipped.


A centered closing call-to-action with an optional accent bar.

```tsx
<CTABand title="Ship your homelab like it matters."
  description="Free for one host. No card, no telemetry, no nonsense."
  actions={<><Button variant="primary" size="lg">Get started</Button></>} />
```

Props: `title`, `description`, `actions`, `accentBar` (default true).

## Overlays & data

### Toast

> ⚠️ **Not yet in the `@tollerud/ui` npm package** — this is a docs-site / roadmap component (see [COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md)). Do not import `Toast / useToast / ToastProvider` from `@tollerud/ui` — it will not resolve. Check [SKILL.md](SKILL.md) for what's actually shipped.


Transient feedback via the `useToast()` hook (provided by `ToastProvider` at the app root). Toasts auto-dismiss and stack bottom-right.

```tsx
const toast = useToast();
toast({ tone: 'success', title: 'Deployed', message: 'hermes v2.0 is live' });
```

Tones: `success` · `error` · `info` · `accent`. `title` required; `message` optional.

### Drawer / Sheet

> ⚠️ **`Drawer` is not yet in the npm package** (roadmap only — see [COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md)). `Sheet` (with `SheetTrigger`/`SheetContent`/etc.) **is** shipped and is the closest available primitive — see [SKILL.md](SKILL.md) for its API.


A side panel for detail views and slide-over forms. Closes on Esc or overlay click.

```tsx
<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Host details"
  description="emma.tollerud.no"
  footer={<Button variant="primary" size="sm">Connect</Button>}>
  …content…
</Drawer>
```

Props: `open`, `onClose`, `side` (`right` | `left`, default right), `title`, `description`, `children`, `footer`, `width` (default 380).

### Combobox

> ✅ `Combobox` ships in `@tollerud/ui >= 1.0.9`. Import: `import { Combobox } from '@tollerud/ui'`


Searchable single-select with keyboard navigation (↑/↓/Enter/Esc), controlled or uncontrolled.

```tsx
<Combobox label="Host" value={value} onChange={setValue}
  options={[{ value: 'emma', label: 'emma.tollerud.no' }, …]}
  placeholder="Search…" emptyText="No matches" />
```

Props: `options: { value, label }[]`, `value`, `onChange`, `label`, `placeholder`, `emptyText`.

### AvatarGroup

> ✅ `Avatar` and `AvatarGroup` ship in `@tollerud/ui >= 1.0.9`. Import: `import { Avatar, AvatarGroup } from '@tollerud/ui'`


Stacked avatars with an overflow count and optional presence dots.

```tsx
<AvatarGroup max={4} size={32} users={[
  { name: 'Tia', status: 'online' },
  { name: 'Emma Pung', src: '/emma.jpg', status: 'warning' },
]} />
```

Props: `users: { name, src?, status? }[]` (`status`: `online` | `offline` | `warning`), `max` (default 4), `size` (default 32).

## Elevation & density

**Shadow scale** — four theme-aware tiers (deep + low-spread in dark, soft in light): `--shadow-sm` `--shadow-md` `--shadow-lg` `--shadow-xl`, plus `--shadow-glow` for the yellow interaction glow. Drawers use `--shadow-xl`, popovers `--shadow-lg`. Lean on borders first; reach for a shadow only to lift overlays off the page.

**Density** — set `data-density="compact"` on any container to tighten cards, table rows, form rows, panel headers and buttons inside it, without changing the components. Default is comfortable.

```html
<div data-density="compact"> … dense tables / forms … </div>
```

## EmptyState

> ⚠️ **Not yet in the `@tollerud/ui` npm package** — this is a docs-site / roadmap component (see [COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md)). Do not import `EmptyState` from `@tollerud/ui` — it will not resolve. Check [SKILL.md](SKILL.md) for what's actually shipped.


For any surface with no data yet, no search results, or an error. Pairs an icon, a one-line headline, a calm explanation and up to two actions. A `compact` variant fits inside cards, tables and panels.

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
| `icon` | `string` | `'folder'` | Icon name from the icon set. |
| `title` | `string` | — | Headline. |
| `description` | `string` | — | Supporting copy (max ~340px wide). |
| `action` | `ReactNode` | — | Primary action, usually a `<Button>`. |
| `secondaryAction` | `ReactNode` | — | Optional second action. |
| `compact` | `boolean` | `false` | Tighter padding for inline use. |
| `accent` | `boolean` | `false` | Yellow-tinted surface + border. |

CSS class: `.ds-empty` (with `.ds-empty__icon`, `.ds-empty__title`, `.ds-empty__desc`).

## DataTable

The config-driven table. Pass `rows` + a `columns` spec and opt into search, a filter, selection with bulk actions, per-row menus, pagination and an empty state. It owns all sort / filter / selection / pagination state internally. Powers the **Data Table** build page and the invoice history on **Billing**.

```tsx
<DataTable
  rows={hosts}
  rowKey="id"
  columns={[
    { key: 'id', header: 'Host', sortable: true, render: (r) => <HostCell {...r} /> },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <Badge variant={...}>{r.status}</Badge> },
    { key: 'cpu', header: 'CPU', align: 'right', sortable: true },
  ]}
  searchable
  searchKeys={['id', 'ip', 'owner']}
  searchPlaceholder="Search host, ip, owner…"
  filter={{ key: 'region', allLabel: 'All regions' }}
  selectable
  pageSize={5}
  toolbarRight={<Button variant="terminal" size="sm">add_host</Button>}
  bulkActions={[
    { label: 'Restart', icon: 'refresh', variant: 'ghost', onRun: (ids, clear) => { /* … */ clear(); } },
    { label: 'Stop', icon: 'trash', variant: 'destructive', onRun: (ids, clear) => clear() },
  ]}
  rowMenu={(row) => [
    { label: 'Connect (SSH)', icon: 'external', onSelect: () => {} },
    { sep: true },
    { label: 'Stop host', icon: 'trash', onSelect: () => {} },
  ]}
  emptyState={<EmptyState icon="search" title="No hosts found" description="Try clearing your filters." />}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `object[]` | `[]` | Row data. |
| `rowKey` | `string` | `'id'` | Field used as the unique key + selection id. |
| `columns` | `Column[]` | `[]` | Column spec — see below. |
| `searchable` | `boolean` | `false` | Show the search input. |
| `searchKeys` | `string[]` | all column keys | Which fields the search matches against. |
| `searchPlaceholder` | `string` | `'Search…'` | Search input placeholder. |
| `filter` | `{ key, options?, allLabel? }` | — | Segmented filter on one field; `options` defaults to the field's distinct values. |
| `selectable` | `boolean` | `false` | Row checkboxes + select-all. |
| `pageSize` | `number` | `8` | Rows per page. |
| `bulkActions` | `BulkAction[]` | `[]` | Buttons shown when rows are selected; `onRun(ids, clear)`. |
| `rowMenu` | `(row) => MenuItem[]` | — | Per-row ⋮ dropdown (same item shape as `DropdownMenu`). |
| `toolbarRight` | `ReactNode` | — | Content pinned to the right of the toolbar (e.g. an add button). |
| `emptyState` | `ReactNode` | default text | Shown when no rows match. |
| `loading` | `boolean` | `false` | Render shimmer skeleton rows instead of data. |
| `skeletonRows` | `number` | `5` | How many skeleton rows while `loading`. |

**Column:** `{ key, header, sortable?, align?: 'left' | 'right', width?, render?: (row) => ReactNode }`. Without `render`, the raw `row[key]` is shown in mono.

## Skeleton

```html
<div class="tollerud-skeleton h-4 w-48" />
<div class="tollerud-skeleton h-48 w-full" />
```

## Glass Nav

```html
<nav class="tollerud-glass fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6">
  ...
</nav>
```

## Grid Background

```html
<section class="tollerud-grid-bg">
  ...
</section>
```

## Display Heading

```html
<h1 class="tollerud-display text-[70px]">Dark. Monochrome.</h1>
<h2 class="tollerud-display--secondary text-[40px]">Yellow where it counts</h2>
<h3 class="tollerud-display--tertiary text-[28px]">Subtle hierarchy</h3>
```

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

Footer bar with Tollerud monogram and branding link. The component is re-exported from [`@tollerud/footer`](https://www.npmjs.com/package/@tollerud/footer) — install that package directly if you need the footer without the full design system.

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
