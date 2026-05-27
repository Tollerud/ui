'use client'

import {
  ButtonPreviews,
  InputPreviews,
  TextareaPreviews,
  SelectPreviews,
  CheckboxPreviews,
  SwitchPreviews,
  RadioPreviews,
  BadgePreviews,
  StatusDotPreviews,
  CardPreviews,
  CodeBlockPreviews,
  StatCardPreviews,
  ContainerPreviews,
  ServiceHealthCardPreviews,
  HostCardPreviews,
  DockerStackCardPreviews,
  IncidentCardPreviews,
  ApprovalCardPreviews,
  BackupStatusPanelPreviews,
  TimelinePreviews,
  AlertInboxPreviews,
  RollbackPlanPreviews,
  ActionDiffPreviews,
  LogViewerPreviews,
  KbdPreviews,
  ActionRowPreviews,
  FooterPreviews,
  NoirGlowBackgroundPreviews,
  CommandMenuPreviews,
  DialogPreviews,
  ToastPreviews,
  TooltipPreviews,
  TabsPreviews,
  SkeletonPreviews,
  ProgressPreviews,
  DropdownMenuPreviews,
  SheetPreviews,
  DataTablePreviews,
  GlowCardPreviews,
  BentoDashboardPreviews,
  EmptyPreviews,
} from '../../components/ComponentPreviews'
import { PreviewFrame } from '../../components/PreviewFrame'
import { ComponentShowcase } from '../../components/ComponentShowcase'

const sections: {
  label: string
  id: string
  desc: string
  preview: React.FC
  code?: string
}[] = [
  {
    label: 'Button',
    id: 'button',
    desc: 'Primary action button with terminal, ghost, and variant styles. disabled, focus-visible, loading states.',
    preview: ButtonPreviews,
    code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="terminal">start_building</Button>

{/* Sizes */}
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

{/* Disabled */}
<Button disabled>Disabled</Button>`,
  },
  {
    label: 'Input',
    id: 'input',
    desc: 'Text input with label, placeholder, error state, and disabled support.',
    preview: InputPreviews,
    code: `<Input placeholder="Placeholder text" />
<Input label="Server name" id="server-name" placeholder="e.g. emma" />
<Input label="Port" id="err-port" error="Required — enter a port number" />
<Input disabled value="readonly value" />`,
  },
  {
    label: 'Textarea',
    id: 'textarea',
    desc: 'Multiline text input with label, error state, and resizable textarea.',
    preview: TextareaPreviews,
    code: `<Textarea placeholder="Write your notes here…" />
<Textarea label="Deployment notes" id="deploy-notes" placeholder="e.g. rollback v1.2.3" />
<Textarea label="Commands" id="cmd" error="Required — enter at least one command" />
<Textarea disabled value="This field is read-only" />`,
  },
  {
    label: 'Select',
    id: 'select',
    desc: 'Custom dropdown selector with keyboard navigation (arrows/enter/escape), click-to-select, and click-outside dismiss.',
    preview: SelectPreviews,
    code: `const [value, setValue] = useState('')
const options = [
  { value: 'emma', label: 'Emma' },
  { value: 'embla', label: 'Embla' },
  { value: 'iris', label: 'Iris' },
]

<Select
  value={value}
  onValueChange={setValue}
  options={options}
  placeholder="Select a server…"
/>`,
  },
  {
    label: 'Checkbox',
    id: 'checkbox',
    desc: 'Custom-styled checkbox with SVG checkmark, label, focus-visible ring, disabled state.',
    preview: CheckboxPreviews,
    code: `const [checked, setChecked] = useState(false)

<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  label="Enable auto-deploy"
/>
<Checkbox checked disabled label="Disabled" />`,
  },
  {
    label: 'Switch',
    id: 'switch',
    desc: 'Toggle switch with role="switch", animated thumb, label, disabled state.',
    preview: SwitchPreviews,
    code: `const [enabled, setEnabled] = useState(false)

<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
  label="Enable monitoring"
/>
<Switch checked disabled label="Disabled" />`,
  },
  {
    label: 'RadioGroup / Radio',
    id: 'radio',
    desc: 'Fieldset-based radio group with custom dot indicator, legend label, error state.',
    preview: RadioPreviews,
    code: `const [selected, setSelected] = useState('emma')

<RadioGroup value={selected} onValueChange={setSelected} legend="Select server">
  <Radio value="emma" label="Emma" />
  <Radio value="embla" label="Embla" />
  <Radio value="iris" label="Iris" />
</RadioGroup>`,
  },
  {
    label: 'Badge',
    id: 'badge',
    desc: 'Status/notification badge — 6 variants: default, accent, success, error, info, warning.',
    preview: BadgePreviews,
    code: `<Badge variant="default">Default</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="success">Online</Badge>
<Badge variant="error">Offline</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="warning">Warning</Badge>`,
  },
  {
    label: 'StatusDot',
    id: 'status-dot',
    desc: 'Online/offline/warning/idle signal indicator with colored pulse.',
    preview: StatusDotPreviews,
    code: `<StatusDot status="online" />
<StatusDot status="offline" />
<StatusDot status="warning" />
<StatusDot status="idle" />

<StatusDot status="online" label="Emma" />`,
  },
  {
    label: 'Card',
    id: 'card',
    desc: 'Surface container with optional accent (yellow) border.',
    preview: CardPreviews,
    code: `<Card>
  Your content here
</Card>

{/* With yellow accent border */}
<Card accent>
  <h3 className="text-sm font-semibold text-tollerud-foreground">Alert</h3>
  <p className="text-xs text-tollerud-text-secondary mt-1">
    Disk usage at 85%
  </p>
</Card>`,
  },
  {
    label: 'CodeBlock',
    id: 'code-block',
    desc: 'Terminal-style code display with inline rendering and copy-to-clipboard.',
    preview: CodeBlockPreviews,
    code: `<CodeBlock code="docker compose up -d" />
<CodeBlock code="npm run dev" promptPrefix />`,
  },
  {
    label: 'StatCard',
    id: 'stat-card',
    desc: 'Dashboard metric card with label, value, optional change indicator.',
    preview: StatCardPreviews,
    code: `<StatCard label="CPU" value="68%" change={{ value: "+12%", direction: "up" }} />
<StatCard label="Memory" value="4.2 GB" change={{ value: "-8%", direction: "down" }} />
<StatCard label="Uptime" value="99.97%" />`,
  },
  {
    label: 'Kbd',
    id: 'kbd',
    desc: 'Keyboard shortcut chip — single key or chord (⌘K, ⌘⇧S).',
    preview: KbdPreviews,
    code: `<Kbd keys="K" />
<Kbd keys={["⌘", "K"]} />
<Kbd keys={["⌘", "⇧", "S"]} size="sm" />`,
  },
  {
    label: 'ActionRow',
    id: 'action-row',
    desc: 'Command/action item row with icon, label, shortcut badge, and click handler.',
    preview: ActionRowPreviews,
    code: `<ActionRow icon={<Zap size={18} />} label="Deploy latest" description="Push main to production" shortcut={{ keys: ["⌘", "⇧", "D"] }} />
<ActionRow icon={<RefreshCw size={18} />} label="Restart service" description="nginx on Embla" />`,
  },
  {
    label: 'Container',
    id: 'container',
    desc: 'Centered max-width layout wrapper (1100px). Accepts semantic HTML as element prop.',
    preview: ContainerPreviews,
    code: `<Container>Content goes here</Container>
<Container as="section">
  <h2>Dashboard</h2>
</Container>`,
  },
  {
    label: 'ServiceHealthCard',
    id: 'service-health-card',
    desc: 'Service status card with StatusDot, uptime, response time, and version info.',
    preview: ServiceHealthCardPreviews,
    code: `<ServiceHealthCard
  name="Homebridge"
  status="online"
  uptime="14d 6h"
  responseTime="42ms"
  version="1.8.4"
/>`,
  },
  {
    label: 'HostCard',
    id: 'host-card',
    desc: 'Homelab server card — hostname, IP, status dot, CPU/ram/disk metrics, container count.',
    preview: HostCardPreviews,
    code: `<HostCard
  hostname="Embla"
  ip="10.0.10.11"
  status="online"
  cpu={{ used: 34, total: 100 }}
  ram={{ used: 6.2, total: 16 }}
  disk={{ used: 340, total: 1000 }}
  containers={12}
/>`,
  },
  {
    label: 'DockerStackCard',
    id: 'docker-stack-card',
    desc: 'Docker Compose stack card listing services with their individual statuses.',
    preview: DockerStackCardPreviews,
    code: `<DockerStackCard
  name="Monitoring Stack"
  services={[
    { name: "prometheus", status: "running" },
    { name: "grafana", status: "running" },
    { name: "alertmanager", status: "stopped" },
  ]}
/>`,
  },
  {
    label: 'IncidentCard',
    id: 'incident-card',
    desc: 'Alert/incident card with severity color coding, timestamp, and acknowledgement state.',
    preview: IncidentCardPreviews,
    code: `<IncidentCard
  severity="critical"
  title="Disk usage above 90%"
  timestamp="2 min ago"
  acknowledged={false}
/>
<IncidentCard
  severity="warning"
  title="High memory usage on Iris"
  timestamp="15 min ago"
  acknowledged={true}
/>`,
  },
  {
    label: 'ApprovalCard',
    id: 'approval-card',
    desc: 'Deployment approval card with pending/approved/rejected states and action buttons.',
    preview: ApprovalCardPreviews,
    code: `<ApprovalCard
  title="Deploy v2.1.4 to production"
  requester="Mathias"
  status="pending"
  onApprove={() => {}}
  onReject={() => {}}
/>`,
  },
  {
    label: 'BackupStatusPanel',
    id: 'backup-status-panel',
    desc: 'Backup job list with status dots, last/next run, size, and overall panel summary.',
    preview: BackupStatusPanelPreviews,
    code: `<BackupStatusPanel
  jobs={[
    { name: "Embla Config", status: "success", lastRun: "03:00", nextRun: "03:00", size: "1.2 GB" },
    { name: "Iris Config", status: "success", lastRun: "03:00", nextRun: "03:00", size: "840 MB" },
    { name: "Database Dump", status: "warning", lastRun: "03:00", nextRun: "03:00", size: "2.4 GB" },
  ]}
/>`,
  },
  {
    label: 'Timeline',
    id: 'timeline',
    desc: 'Vertical event timeline with status-colored dots and metadata badges.',
    preview: TimelinePreviews,
    code: `<Timeline
  items={[
    { title: "Deploy initiated", description: "v2.1.4", time: "14:32", status: "success" },
    { title: "Health check passed", time: "14:33", status: "success" },
    { title: "Rolling update", time: "14:34", status: "active" },
  ]}
/>`,
  },
  {
    label: 'AlertInbox',
    id: 'alert-inbox',
    desc: 'Compound alert panel grouping IncidentCards with severity filter and acknowledge action.',
    preview: AlertInboxPreviews,
    code: `<AlertInbox
  alerts={[
    { severity: "critical", title: "Disk full on Emma", time: "2 min ago", acknowledged: false },
    { severity: "warning", title: "Memory > 85% on Iris", time: "10 min ago", acknowledged: false },
    { severity: "info", title: "Backup completed", time: "1h ago", acknowledged: true },
  ]}
  onAcknowledge={(id) => {}}
/>`,
  },
  {
    label: 'RollbackPlan',
    id: 'rollback-plan',
    desc: 'Rollback plan card with step-by-step status (pending/running/success/failed).',
    preview: RollbackPlanPreviews,
    code: `<RollbackPlan
  steps={[
    { label: "Stop current deployment", status: "success" },
    { label: "Restore previous image", status: "running" },
    { label: "Verify health checks", status: "pending" },
    { label: "Enable traffic", status: "pending" },
  ]}
/>`,
  },
  {
    label: 'ActionDiff',
    id: 'action-diff',
    desc: 'Unified diff viewer with add/remove context highlighting and line numbers.',
    preview: ActionDiffPreviews,
    code: `<ActionDiff
  additions={[
    { line: 42, content: '    "version": "2.1.4"' },
    { line: 58, content: '    "feature": "dark-mode"' },
  ]}
  removals={[
    { line: 42, content: '    "version": "2.1.3"' },
  ]}
/>`,
  },
  {
    label: 'LogViewer',
    id: 'log-viewer',
    desc: 'Scrollable terminal-style log viewer with search, line numbers, timestamps, and auto-follow.',
    preview: LogViewerPreviews,
    code: `<LogViewer
  lines={[
    { time: "14:32:01", level: "info", message: "Starting deployment v2.1.4" },
    { time: "14:32:05", level: "warn", message: "Disk at 82%, consider cleanup" },
    { time: "14:32:08", level: "error", message: "Connection timeout: port 5432" },
  ]}
/>`,
  },
  {
    label: 'Footer',
    id: 'footer',
    desc: 'Footer bar with Tollerud monogram — default/accent surfaces, responsive/row layouts, unstyled mode.',
    preview: FooterPreviews,
    code: `<Footer />
<Footer surface="accent" />`,
  },
  {
    label: 'NoirGlowBackground',
    id: 'noir-glow',
    desc: 'Tollerud signature animated background — WebGL grain gradient with acid-yellow blooms on black. CSS fallback for docs/static contexts.',
    preview: NoirGlowBackgroundPreviews,
    code: `<div className="relative h-48 w-full rounded-lg overflow-hidden">
  <NoirGlowBackground />
  <div className="relative z-10 flex items-center justify-center h-full">
    <span className="text-tollerud-yellow font-mono text-sm">tollerud.no</span>
  </div>
</div>`,
  },
  {
    label: 'CommandMenu',
    id: 'command-menu',
    desc: 'Keyboard-first command palette for infrastructure actions. Groups, keyboard navigation, composable with ActionRow + Kbd.',
    preview: CommandMenuPreviews,
    code: `<CommandMenu
  open={open}
  onOpenChange={setOpen}
  groups={[
    {
      label: "Actions",
      items: [
        { id: "deploy", label: "Deploy latest", icon: <Zap size={18} />, shortcut: { keys: ["⌘", "D"] } },
        { id: "restart", label: "Restart service", icon: <RefreshCw size={18} /> },
      ],
    },
  ]}
/>`,
  },
  {
    label: 'Dialog',
    id: 'dialog',
    desc: 'Modal dialog with Radix dialog primitives — trigger, overlay, content, header, title, description, and close button.',
    preview: DialogPreviews,
    code: `<Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">Open dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm deployment</DialogTitle>
      <DialogDescription>
        Are you sure you want to deploy v2.1.4 to production?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost">Cancel</Button>
      <Button>Deploy</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
  },
  {
    label: 'Tooltip',
    id: 'tooltip',
    desc: 'Hover tooltip with Radix primitives — trigger, content, arrow, and configurable side offset.',
    preview: TooltipPreviews,
    code: `<Tooltip content="Deploy to production">
  <Button variant="primary">Deploy</Button>
</Tooltip>
<Tooltip content="CPU temperature" side="right">
  <span className="text-xs text-tollerud-text-muted cursor-help">68°C</span>
</Tooltip>`,
  },
  {
    label: 'Tabs',
    id: 'tabs',
    desc: 'Tab switcher with Radix tabs primitive — list, trigger, content panels with default and line variants.',
    preview: TabsPreviews,
    code: `<Tabs defaultValue="logs">
  <TabsList>
    <TabsTrigger value="logs">Logs</TabsTrigger>
    <TabsTrigger value="metrics">Metrics</TabsTrigger>
    <TabsTrigger value="config">Config</TabsTrigger>
  </TabsList>
  <TabsContent value="logs">Recent log entries…</TabsContent>
  <TabsContent value="metrics">CPU / RAM / Disk…</TabsContent>
  <TabsContent value="config">Configuration YAML…</TabsContent>
</Tabs>`,
  },
  {
    label: 'Skeleton',
    id: 'skeleton',
    desc: 'Pulse-animated loading placeholder — compose into avatar, text lines, and card skeleton layouts.',
    preview: SkeletonPreviews,
    code: `<Skeleton className="w-10 h-10 rounded-full" />
<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-4 w-1/2" />

{/* Card skeleton */}
<div className="space-y-3 p-4 border rounded-lg">
  <div className="flex gap-3">
    <Skeleton className="w-10 h-10 rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
</div>`,
  },
  {
    label: 'Progress',
    id: 'progress',
    desc: 'Determinate progress bar with Radix progress primitive — animated indicator, customizable width.',
    preview: ProgressPreviews,
    code: `<Progress value={65} className="w-full" />
<Progress value={100} className="w-full" />`,
  },
  {
    label: 'Toast',
    id: 'toast',
    desc: 'Sonner toast notifications — success, error, info, warning variants with optional description text.',
    preview: ToastPreviews,
    code: `import { toast } from 'sonner'

<Button onClick={() => toast.success('Deployment complete')}>
  Success
</Button>
<Button onClick={() => toast.error('Deploy failed')}>
  Error
</Button>
<Button onClick={() => toast('Something happened')}>
  Default
</Button>`,
  },
  {
    label: 'Dropdown Menu',
    id: 'dropdown-menu',
    desc: 'Overflow menu with Radix dropdown — trigger, label, items, separator, and disabled state. Ideal for action overflow on cards and tables.',
    preview: DropdownMenuPreviews,
    code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Server Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={() => {}}>Restart</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => {}}>SSH</DropdownMenuItem>
    <DropdownMenuItem disabled>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  },
  {
    label: 'Sheet',
    id: 'sheet',
    desc: 'Slide-in panel from left or right — powered by Radix Dialog. Perfect for server details, config editing, or quick actions.',
    preview: SheetPreviews,
    code: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="secondary">Edit config</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Server Config</SheetTitle>
      <SheetDescription>Edit Embla configuration</SheetDescription>
    </SheetHeader>
    <div className="py-4">
      <Input label="Hostname" id="hostname" defaultValue="Embla" />
    </div>
  </SheetContent>
</Sheet>`,
  },
  {
    label: 'Data Table',
    id: 'data-table',
    desc: 'Sortable data table with header-click sorting, numeric/string comparison, custom cell renders, and empty state. No external dependencies.',
    preview: DataTablePreviews,
    code: `const columns = [
  { key: 'hostname' as const, label: 'Host', sortable: true },
  { key: 'status' as const, label: 'Status', sortable: true },
  { key: 'cpu' as const, label: 'CPU %', sortable: true },
]
const data = [
  { hostname: 'Embla', status: 'Online', cpu: 34 },
  { hostname: 'Iris', status: 'Online', cpu: 68 },
  { hostname: 'Emma', status: 'Offline', cpu: 0 },
]

<DataTable columns={columns} data={data} />`,
  },
  {
    label: 'Glow Card',
    id: 'glow-card',
    desc: 'Cursor-follow radial glow wrapper — wraps any card component with a subtle mouse-tracking highlight. Configurable color and intensity per card.',
    preview: GlowCardPreviews,
    code: `<GlowCard>
  <Card>
    <div className="text-center">
      <span className="text-lg font-bold">Embla</span>
      <p className="text-xs text-tollerud-text-muted mt-1">10.0.10.11</p>
    </div>
  </Card>
</GlowCard>`,
  },
  {
    label: 'Bento Dashboard',
    id: 'bento-dashboard',
    desc: 'Pre-built homelab dashboard template with asymmetric bento grid layout — hosts, metrics, services, and incident panels. Data-driven, responsive, zero-config.',
    preview: BentoDashboardPreviews,
    code: `<BentoDashboard
  hosts={[
    { hostname: "Embla", status: "online", ip: "10.0.10.11", cpu: 34, ram: 6.2, disk: 340, containers: 12 },
    { hostname: "Iris", status: "online", ip: "10.0.10.12", cpu: 68, ram: 12.8, disk: 780 },
  ]}
/>`,
  },
  {
    label: 'Empty',
    id: 'empty',
    desc: 'Empty state layout — icon, title, description, and content slot for CTAs. Composable sub-components.',
    preview: EmptyPreviews,
    code: `<Empty title="No servers found" description="Add your first server to get started.">
  <Button>Add Server</Button>
</Empty>
<Empty title="No alerts">
  <EmptyDescription>All systems are running normally.</EmptyDescription>
</Empty>`,
  },
]

export default function ComponentsPage() {
  return (
    <div className="docs-content">
      <h1>Components</h1>
      <p>42 React components across the system.</p>
      <p className="text-xs text-tollerud-text-muted mt-1">
        All components are <code>forwardRef</code> + <code>displayName</code> with full TypeScript types.
      </p>

      {sections.map(({ label, id, desc, preview: Preview, code }) => (
        <div key={id} id={id} className="mb-12">
          <h2>{label}</h2>
          <p className="text-sm text-tollerud-text-muted mb-4">{desc}</p>
          {code ? (
            <ComponentShowcase code={code}>
              <Preview />
            </ComponentShowcase>
          ) : (
            <PreviewFrame><Preview /></PreviewFrame>
          )}
        </div>
      ))}
    </div>
  )
}