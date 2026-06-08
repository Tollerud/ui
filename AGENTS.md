# Tollerud Design System — AI Agent Guide

Guidance for AI coding assistants (Claude Code, Cursor, GitHub Copilot, Codex, etc.) working in projects that use `@tollerud/ui`.

---

## Install

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss
# Optional — only if using NoirGlowBackground
npm install @paper-design/shaders-react
```

For the footer alone (no full design system dependency):
```bash
npm install @tollerud/footer
```

## Tailwind Setup

The design system ships a Tailwind preset that provides all tokens. **Always apply it** — without it, `text-tollerud-yellow`, `bg-tollerud-noir-900`, etc. will not resolve.

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import tollerudPreset from '@tollerud/ui/preset'

const config: Config = {
  presets: [tollerudPreset],
  content: ['./src/**/*.{ts,tsx}'],
}
export default config
```

Import the CSS in your root layout or `globals.css`:
```css
@import "tailwindcss/preflight";
@import "tailwindcss/utilities";
```
And import the design system tokens/base styles from `@tollerud/ui/globals.css` or copy them locally.

---

## Aesthetic Rules

**Never violate these:**

- Dark surfaces only. Background: `#0A0A0A` (`bg-tollerud-noir-950`). Never white or light gray backgrounds.
- Yellow accent (`#E8D500`, `text-tollerud-yellow`) is for CTAs, focus rings, active states, and key data points — not decoration.
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

All components import from `@tollerud/ui`. Use named imports.

```tsx
import { Button, Card, Badge, Input, StatusDot, Kbd } from '@tollerud/ui'
import { CommandMenu, DataTable, LogViewer, Timeline } from '@tollerud/ui'
import { Toast, useToast, ToastProvider } from '@tollerud/ui'
import { Drawer, Combobox, AvatarGroup, EmptyState } from '@tollerud/ui'
import { Panel, Meter, Stepper, FormRow, Spinner } from '@tollerud/ui'
import { Checkbox, Switch, RadioGroup, Radio, Select, Textarea, PasswordInput } from '@tollerud/ui'
import { StatCard, CodeBlock, Divider, Container } from '@tollerud/ui'
import { BarChart, AreaChart, Donut, Sparkline } from '@tollerud/ui'
// Infra / homelab set
import { HostCard, ServiceHealthCard, DockerStackCard, IncidentCard } from '@tollerud/ui'
import { ApprovalCard, ActionDiff, LogViewer, AlertInbox, Timeline } from '@tollerud/ui'
import { RollbackPlan, BackupStatusPanel } from '@tollerud/ui'
// Marketing blocks
import { HeroBlock, FeatureCard, CTABand } from '@tollerud/ui'
// Footer
import { Footer } from '@tollerud/ui' // or: import { Footer } from '@tollerud/footer'
```

### Button

```tsx
<Button variant="primary" size="md">Deploy</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" size="sm">More</Button>
<Button variant="destructive">Delete host</Button>
<Button variant="terminal" size="sm">start_building</Button>
```

Variants: `primary` · `secondary` · `ghost` · `destructive` · `terminal`
Sizes: `sm` · `md` · `lg`

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

### Input / Textarea / Select / PasswordInput

```tsx
<Input label="Server Name" placeholder="e.g. emma.tollerud.no" error={errors.name} />
<Textarea label="Notes" rows={4} error={errors.notes} />
<Select label="Region" options={[{ value: 'eu', label: 'EU' }]} />
<PasswordInput label="Password" error={pwError} labelAction={<a href="#">Forgot?</a>} />
```

### Checkbox / Switch / RadioGroup

```tsx
<Checkbox label="Enable backups" checked={...} onChange={...} />
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
/>
```

Built-in `⌘K` / `Ctrl+K` listener, arrow navigation, Esc to close, search across all groups.

### StatCard

```tsx
<StatCard label="Active Sessions" value={42} change={{ value: "+12%", direction: "up" }} />
```

### CodeBlock

```tsx
<CodeBlock>{`$ systemctl status tollerud-agent\n● active (running)`}</CodeBlock>
```

### Panel

```tsx
<Panel title="Compose stack" icon="grid"
  actions={<Button variant="ghost" size="sm">Edit</Button>}
  footer={<span>compose.yml · 4 services</span>}>
  …content…
</Panel>
```

### Meter

```tsx
<Meter label="CPU" value={23} valueLabel="23%" />
<Meter label="Disk" value={91} hot={85} valueLabel="91%" />
```

### FormRow

```tsx
<FormRow label="Two-factor auth" hint="Require a TOTP code at sign-in.">
  <Switch defaultChecked />
</FormRow>
```

### DataTable

```tsx
<DataTable
  rows={hosts}
  rowKey="id"
  columns={[
    { key: 'hostname', header: 'Host', sortable: true },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'online' ? 'success' : 'error'}>{r.status}</Badge> },
  ]}
  searchable
  searchKeys={['hostname', 'ip']}
  pageSize={10}
  emptyState={<EmptyState icon="server" title="No hosts" description="Connect your first machine." />}
/>
```

### EmptyState

```tsx
<EmptyState
  icon="server"
  title="No hosts connected"
  description="Connect your first machine and Tia will start watching it."
  action={<Button variant="primary" size="sm">Connect a host</Button>}
/>
<EmptyState compact accent icon="checkCircle" title="All clear" description="No open alerts." />
```

### Toast

Wrap the app in `<ToastProvider>`, then use the hook:
```tsx
const toast = useToast()
toast({ tone: 'success', title: 'Deployed', message: 'hermes v2.0 is live' })
// tones: success · error · info · accent
```

### Drawer

```tsx
<Drawer open={open} onClose={() => setOpen(false)} title="Host details" description="emma.tollerud.no"
  footer={<Button variant="primary" size="sm">Connect</Button>}>
  …content…
</Drawer>
```

### Charts

```tsx
<BarChart data={[{ label: 'Mon', value: 12 }, { label: 'Tue', value: 18, accent: true }]} height={180} />
<AreaChart data={[28, 35, 30, 44, 52]} height={150} />
<Donut segments={[{ label: 'CPU', value: 40, color: '#E8D500' }, { label: 'Idle', value: 60, color: '#444' }]} size={160} />
<Sparkline data={[12, 18, 14, 22, 19]} w={84} h={26} color="#E8D500" />
```

Yellow (`#E8D500`) is the highlight series. All other series stay monochrome.

### Infra / homelab components

```tsx
<HostCard hostname="emma" ip="10.0.10.10" status="online" cpu="23%" memory="6.2/16 GB" disk="45%" uptime="14d" containers={4} />
<ServiceHealthCard service="emma.tollerud.no" status="online" uptime="14d 3h" responseTime="23ms" />
<IncidentCard title="High CPU" severity="high" timestamp="2026-05-26 14:32" description="CPU at 92% for 5 min" service="emma" />
<ApprovalCard action="restart_container" description="Restart emma:hermes" state="pending" onApprove={() => {}} onReject={() => {}} />
<LogViewer lines={[{ text: 'Health check passed', level: 'info', timestamp: '14:32:01', source: 'hermes' }]} follow searchable showLineNumbers height={300} />
<AlertInbox alerts={[{ id: '1', title: 'emma high CPU', severity: 'high', timestamp: '14:32', acknowledged: false }]} onAcknowledge={(id) => {}} />
```

Severity scale: `critical` · `high` · `medium` · `low` · `info`

---

## Layout Patterns

### Navigation lockup

The monogram must always appear left of the project name with `gap-2`. Never show the name without the monogram or the monogram alone in a nav context.

```tsx
import logo from '@tollerud/ui/tollerud-logo.svg'

// Top bar
<nav className="tollerud-glass fixed top-0 inset-x-0 z-50 h-14 flex items-center px-6 gap-6">
  <div className="flex items-center gap-2 shrink-0">
    <img src={logo} alt="Tollerud" className="h-5 w-auto" />
    <span className="font-semibold text-sm text-white">Project Name</span>
  </div>
  <div className="flex items-center gap-4 ml-4">
    <a href="/overview" className="text-sm text-tollerud-text-secondary hover:text-white transition-colors">Overview</a>
  </div>
  <div className="ml-auto flex items-center gap-3">
    <Button variant="ghost" size="sm">Sign in</Button>
    <Button variant="primary" size="sm">Get started</Button>
  </div>
</nav>
<main className="pt-14">…</main>
```

Monogram sizing: top bar/sidebar expanded → `h-5`, sidebar collapsed → `h-6`, footer → `h-4` (handled automatically by `<Footer />`).

### Glass nav

```html
<nav class="tollerud-glass fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6">…</nav>
```

### Grid background

```html
<section class="tollerud-grid-bg">…</section>
```

### Display headings

```html
<h1 class="tollerud-display text-[70px]">Dark. Monochrome.</h1>
<h2 class="tollerud-display--secondary text-[40px]">Yellow where it counts</h2>
```

### Container

```tsx
<Container>Content capped at 1100px with 24px padding</Container>
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

## Reference

| File | Contents |
|------|----------|
| [COMPONENTS.md](COMPONENTS.md) | Full prop tables for every component |
| [BRAND.md](BRAND.md) | Logo usage, nav lockup, sizing rules |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | Contrast ratios, focus, ARIA patterns |
| [VOICE.md](VOICE.md) | Copy tone, terminal-style CTAs, error messages |
| [KEYBOARD.md](KEYBOARD.md) | Keyboard contract for CommandMenu and navigation |
| [BACKGROUNDS.md](BACKGROUNDS.md) | NoirGlowBackground props and fallback rules |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Install, Tailwind config, registry usage |
