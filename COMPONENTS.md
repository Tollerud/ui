# Tollerud Design System — Component Library

All components come as CSS classes (in `globals.css` / `tokens.css`) with React `.tsx` examples in `components/`.

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

The Tier 2 component set — these make Tia a real infrastructure assistant.

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

Supports `view="unified"`, `showContext` toggle for hiding context lines.

### LogViewer

```tsx
<LogViewer
  lines={[
    { text: 'Starting deployment...', level: 'info', timestamp: '14:32:01', source: 'deploy' },
    { text: 'Connection refused on port 443', level: 'error', timestamp: '14:32:05', source: 'nginx' },
    { text: 'Health check passed', level: 'info', timestamp: '14:32:10', source: 'hermes' },
  ]}
  follow={true}
  searchable={true}
  showLineNumbers={true}
  height="300px"
/>
```

Features: level color coding (`debug`→`trace`→`info`→`warn`→`error`), live follow auto-scroll, text search, line count control, performance truncation at `maxLines`.

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

Features: severity count badges, hover-to-acknowledge, severity filter, scrollable list.

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

Features: per-job status dots, size/target display, failed job warning footer.

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

Footer bar with Tollerud monogram and branding link. Ported from `@tollerud/footer`.

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
