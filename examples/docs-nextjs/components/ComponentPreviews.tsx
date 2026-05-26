'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '../lib/utils'

// ── Direct component imports from the design system ──
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { Textarea } from '../../../components/Textarea'
import { Select } from '../../../components/Select'
import { Checkbox } from '../../../components/Checkbox'
import { Switch } from '../../../components/Switch'
import { RadioGroup, Radio } from '../../../components/RadioGroup'
import { Badge } from '../../../components/Badge'
import { StatusDot } from '../../../components/StatusDot'
import { Card } from '../../../components/Card'
import { CodeBlock } from '../../../components/CodeBlock'
import { StatCard } from '../../../components/StatCard'
import { Container } from '../../../components/Container'
import { Kbd } from '../../../components/Kbd'
import { ActionRow } from '../../../components/ActionRow'
import { Footer } from '../../../components/Footer'
import { ServiceHealthCard } from '../../../components/ServiceHealthCard'
import { HostCard } from '../../../components/HostCard'
import { DockerStackCard } from '../../../components/DockerStackCard'
import type { StackService } from '../../../components/DockerStackCard'
import { IncidentCard } from '../../../components/IncidentCard'
import type { IncidentSeverity } from '../../../components/IncidentCard'
import { ApprovalCard } from '../../../components/ApprovalCard'
import { BackupStatusPanel } from '../../../components/BackupStatusPanel'
import type { BackupJob } from '../../../components/BackupStatusPanel'
import { Timeline } from '../../../components/Timeline'
import type { TimelineItemData } from '../../../components/Timeline'
import { AlertInbox } from '../../../components/AlertInbox'
import type { AlertItem } from '../../../components/AlertInbox'
import { RollbackPlan } from '../../../components/RollbackPlan'
import type { RollbackStep } from '../../../components/RollbackPlan'
import { ActionDiff } from '../../../components/ActionDiff'
import type { DiffLine } from '../../../components/ActionDiff'
import { LogViewer } from '../../../components/LogViewer'
import type { LogLine } from '../../../components/LogViewer'
import type { ActionItem } from '../../../components/ActionRow'
import type { Status } from '../../../components/StatusDot'
import { NoirGlowBackground } from '../../../components/NoirGlowBackground'
import { CommandMenu } from '../../../components/CommandMenu'
import type { CommandGroup } from '../../../components/CommandMenu'

// ── Tia Noir ported shadcn components (Radix-based) ──
import {
  Dialog as TiaDialog,
  DialogTrigger as TiaDialogTrigger,
  DialogContent as TiaDialogContent,
  DialogHeader as TiaDialogHeader,
  DialogFooter as TiaDialogFooter,
  DialogTitle as TiaDialogTitle,
  DialogDescription as TiaDialogDescription,
} from '../../../components/Dialog'
import {
  Tooltip as TiaTooltip,
  TooltipContent as TiaTooltipContent,
  TooltipTrigger as TiaTooltipTrigger,
  TooltipProvider as TiaTooltipProvider,
} from '../../../components/Tooltip'
import { Tabs as TiaTabs, TabsList as TiaTabsList, TabsTrigger as TiaTabsTrigger, TabsContent as TiaTabsContent } from '../../../components/Tabs'
import { Skeleton as TiaSkeleton } from '../../../components/Skeleton'
import { Progress as TiaProgress } from '../../../components/Progress'
import { Empty, EmptyHeader, EmptyIcon, EmptyTitle, EmptyDescription, EmptyContent } from '../../../components/Empty'
import { toast } from 'sonner'
import {
  DropdownMenu as TiaDropdownMenu,
  DropdownMenuTrigger as TiaDropdownMenuTrigger,
  DropdownMenuContent as TiaDropdownMenuContent,
  DropdownMenuItem as TiaDropdownMenuItem,
  DropdownMenuSeparator as TiaDropdownMenuSeparator,
  DropdownMenuLabel as TiaDropdownMenuLabel,
} from '../../../components/DropdownMenu'
import {
  Sheet as TiaSheet,
  SheetTrigger as TiaSheetTrigger,
  SheetContent as TiaSheetContent,
  SheetHeader as TiaSheetHeader,
  SheetTitle as TiaSheetTitle,
  SheetDescription as TiaSheetDescription,
} from '../../../components/Sheet'
import { DataTable as TiaDataTable } from '../../../components/DataTable'
import type { Column } from '../../../components/DataTable'
import { GlowCard as TiaGlowCard } from '../../../components/GlowCard'
import { BentoDashboard as TiaBentoDashboard } from '../../../components/BentoDashboard'

/* ────────── Preview wrapper ────────── */

function PreviewCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-tia-border/30 bg-tia-surface-raised p-4 space-y-3">
      <h4 className="text-xs font-semibold text-tia-text-muted uppercase tracking-wider">{title}</h4>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

/* ────────── BUTTON PREVIEWS ────────── */

export function ButtonPreviews() {
  return (
    <div className="space-y-3">
      <PreviewCard title="Variants">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="terminal">start_building</Button>
      </PreviewCard>
      <PreviewCard title="Sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </PreviewCard>
      <PreviewCard title="States">
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>Disabled</Button>
        <Button variant="terminal" disabled>Disabled</Button>
      </PreviewCard>
    </div>
  )
}

/* ────────── INPUT PREVIEWS ────────── */

export function InputPreviews() {
  const [val, setVal] = useState('')
  const [err, setErr] = useState('')
  return (
    <div className="space-y-3">
      <PreviewCard title="Default">
        <Input placeholder="Placeholder text" value={val} onChange={(e) => setVal(e.target.value)} />
      </PreviewCard>
      <PreviewCard title="With label">
        <Input label="Server name" id="server-name" placeholder="e.g. emma" />
      </PreviewCard>
      <PreviewCard title="With error">
        <Input
          label="Port"
          id="err-port"
          error={err || 'Required — enter a port number'}
          value={err}
          onChange={(e) => setErr(e.target.value)}
        />
      </PreviewCard>
      <PreviewCard title="Disabled">
        <Input disabled value="readonly value" />
      </PreviewCard>
    </div>
  )
}

/* ────────── TEXTAREA PREVIEWS ────────── */

export function TextareaPreviews() {
  const [val, setVal] = useState('')
  return (
    <div className="space-y-3">
      <PreviewCard title="Default">
        <Textarea placeholder="Type something…" value={val} onChange={(e) => setVal(e.target.value)} rows={3} />
      </PreviewCard>
      <PreviewCard title="With label & error">
        <Textarea
          label="Description"
          id="desc"
          placeholder="Enter deployment notes…"
          error="Max 500 characters"
          rows={3}
        />
      </PreviewCard>
    </div>
  )
}

/* ────────── SELECT PREVIEWS ────────── */

export function SelectPreviews() {
  const [val, setVal] = useState('')
  const servers = [
    { value: 'emma', label: 'Emma' },
    { value: 'miriam', label: 'Miriam' },
    { value: 'iris', label: 'Iris' },
    { value: 'victoria', label: 'Victoria' },
  ]
  return (
    <div className="space-y-3">
      <PreviewCard title="Default">
        <Select placeholder="Pick a server" options={servers} value={val} onChange={(v) => setVal(v)} />
      </PreviewCard>
      <PreviewCard title="With label & error">
        <Select label="Target" placeholder="Select…" options={servers} error="Required" />
      </PreviewCard>
    </div>
  )
}

/* ────────── CHECKBOX PREVIEWS ────────── */

export function CheckboxPreviews() {
  const [checked, setChecked] = useState(true)
  return (
    <div className="space-y-3">
      <PreviewCard title="States">
        <Checkbox label="Enable backups" checked={checked} onChange={() => setChecked(!checked)} />
        <Checkbox label="Send alerts" defaultChecked />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled (checked)" disabled defaultChecked />
      </PreviewCard>
    </div>
  )
}

/* ────────── SWITCH PREVIEWS ────────── */

export function SwitchPreviews() {
  const [on, setOn] = useState(true)
  const [notif, setNotif] = useState(true)
  return (
    <div className="space-y-3">
      <PreviewCard title="States">
        <Switch label="Dark mode" checked={on} onChange={() => setOn(!on)} />
        <Switch label="Notifications" checked={notif} onChange={() => setNotif(!notif)} />
        <Switch label="Beta features" disabled />
        <Switch label="Canary" disabled defaultChecked />
      </PreviewCard>
    </div>
  )
}

/* ────────── RADIO PREVIEWS ────────── */

export function RadioPreviews() {
  const [val, setVal] = useState('staging')
  return (
    <div className="space-y-3">
      <PreviewCard title="Radio group">
        <RadioGroup label="Deployment target">
          <Radio value="staging" label="Staging" name="target" checked={val === 'staging'} onChange={() => setVal('staging')} />
          <Radio value="production" label="Production" name="target" checked={val === 'production'} onChange={() => setVal('production')} />
          <Radio value="canary" label="Canary" name="target" disabled checked={val === 'canary'} onChange={() => setVal('canary')} />
        </RadioGroup>
      </PreviewCard>
    </div>
  )
}

/* ────────── BADGE PREVIEWS ────────── */

export function BadgePreviews() {
  return (
    <PreviewCard title="Variants">
      <Badge>Default</Badge>
      <Badge variant="accent">New</Badge>
      <Badge variant="success">Online</Badge>
      <Badge variant="error">Offline</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="warning">Warning</Badge>
    </PreviewCard>
  )
}

/* ────────── STATUS DOT PREVIEWS ────────── */

export function StatusDotPreviews() {
  return (
    <PreviewCard title="Statuses">
      <div className="flex gap-3">
        <StatusDot status="online" label="Online" />
        <StatusDot status="offline" label="Offline" />
        <StatusDot status="warning" label="Warning" />
        <StatusDot status="idle" label="Idle" />
      </div>
    </PreviewCard>
  )
}

/* ────────── CARD PREVIEWS ────────── */

export function CardPreviews() {
  return (
    <div className="space-y-3">
      <PreviewCard title="Default">
        <Card>Basic card with default styling</Card>
      </PreviewCard>
      <PreviewCard title="Accent">
        <Card accent>Accent card with yellow border</Card>
      </PreviewCard>
    </div>
  )
}

/* ────────── CODEBLOCK PREVIEWS ────────── */

export function CodeBlockPreviews() {
  return (
    <PreviewCard title="Code display">
      <CodeBlock code="npm run deploy" />
      <CodeBlock code="docker compose up -d" />
    </PreviewCard>
  )
}

/* ────────── STATCARD PREVIEWS ────────── */

export function StatCardPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Metrics">
        <div className="grid grid-cols-2 gap-3 w-full">
          <StatCard label="CPU" value="42%" change={{ value: '+5.2%', direction: 'up' }} />
          <StatCard label="Memory" value="3.2 GB" />
          <StatCard label="Uptime" value="14d 6h" />
          <StatCard label="Containers" value="12" change={{ value: '+2', direction: 'up' }} />
        </div>
      </PreviewCard>
      <PreviewCard title="Accent variant">
        <div className="grid grid-cols-2 gap-3 w-full">
          <StatCard label="Active Alerts" value="3" accent change={{ value: '+1', direction: 'up' }} />
          <StatCard label="Disk Usage" value="72%" accent change={{ value: '-5%', direction: 'down' }} />
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── CONTAINER PREVIEWS ────────── */

export function ContainerPreviews() {
  return (
    <PreviewCard title="Usage">
      <Container as="section" className="bg-tia-noir-800 rounded p-4">
        <p className="text-sm text-tia-text-secondary">
          Centered max-width container (1100px). Try resizing the browser.
        </p>
      </Container>
    </PreviewCard>
  )
}

/* ────────── SERVICE HEALTH CARD PREVIEWS ────────── */

export function ServiceHealthCardPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Statuses">
        <div className="grid grid-cols-2 gap-3 w-full">
          <ServiceHealthCard service="API Gateway" status="online" uptime="99.97%" responseTime="42ms" />
          <ServiceHealthCard service="PostgreSQL" status="warning" uptime="98.2%" responseTime="12ms" />
          <ServiceHealthCard service="Redis Cache" status="offline" version="7.2" />
          <ServiceHealthCard service="Auth Service" status="idle" uptime="-" responseTime="-" />
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── HOST CARD PREVIEWS ────────── */

export function HostCardPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Hosts">
        <div className="grid grid-cols-2 gap-3 w-full">
          <HostCard hostname="emma" ip="10.0.10.10" status="online" cpu="34%" memory="6.2/16 GB" disk="45%" uptime="42d" containers={8} />
          <HostCard hostname="miriam" ip="10.0.10.14" status="online" cpu="12%" memory="3.8/32 GB" disk="62%" uptime="89d" containers={12} />
          <HostCard hostname="iris" ip="10.0.10.12" status="warning" cpu="87%" memory="14.5/16 GB" disk="91%" uptime="14d" />
          <HostCard hostname="victoria" ip="10.0.10.15" status="offline" cpu="-" memory="-" disk="-" />
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── DOCKER STACK CARD PREVIEWS ────────── */

export function DockerStackCardPreviews() {
  const services: StackService[] = [
    { name: 'nginx', status: 'online' },
    { name: 'app', status: 'online' },
    { name: 'db', status: 'online' },
    { name: 'cache', status: 'warning' },
  ]
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Stacks">
        <div className="grid grid-cols-2 gap-3 w-full">
          <DockerStackCard name="infra-traefik" services={services} composePath="/opt/stacks/traefik" />
          <DockerStackCard name="media-stack" services={[{ name: 'plex', status: 'online' }, { name: 'sonarr', status: 'offline' }]} />
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── INCIDENT CARD PREVIEWS ────────── */

export function IncidentCardPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Severities">
        <div className="flex flex-col gap-2 w-full">
          <IncidentCard title="API Gateway unreachable" severity="critical" timestamp="2m ago" service="API Gateway" description="All incoming requests are failing with 502" />
          <IncidentCard title="Disk usage above 90%" severity="high" timestamp="15m ago" service="Miriam" description="/hdd volume at 92%" acknowledged />
          <IncidentCard title="Certificate expiring" severity="medium" timestamp="1h ago" service="Traefik" description="Wildcard cert expires in 7 days" />
          <IncidentCard title="Deprecated image" severity="low" timestamp="3h ago" service="Redis" />
          <IncidentCard title="Backup completed" severity="info" timestamp="5h ago" service="Rclone" description="JottaCloud sync finished" />
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── APPROVAL CARD PREVIEWS ────────── */

export function ApprovalCardPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="States">
        <div className="flex flex-col gap-2 w-full">
          <ApprovalCard action="Deploy to production" description="Roll out v2.4.1 to the production cluster" source="Mathias" state="pending" timestamp="2m ago" />
          <ApprovalCard action="Restart PostgreSQL" description="Apply config changes requiring restart" source="Tia" state="approved" timestamp="1h ago" />
          <ApprovalCard action="Deprecate old endpoint" description="Remove /v1/legacy endpoint" source="Bot" state="rejected" timestamp="1d ago" />
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── BACKUP STATUS PANEL PREVIEWS ────────── */

export function BackupStatusPanelPreviews() {
  const jobs: BackupJob[] = [
    { name: 'JottaCloud — Configs', status: 'online', lastRun: '3h ago', nextRun: 'tomorrow 03:00', size: '1.2 GB', target: 'JottaCloud' },
    { name: 'Embla /hdd/config', status: 'online', lastRun: '3h ago', nextRun: 'tomorrow 03:00', size: '450 MB', target: 'crypt' },
    { name: 'Iris /config', status: 'warning', lastRun: '2d ago', nextRun: 'tomorrow 03:00', target: 'crypt' },
    { name: 'Database dumps', status: 'offline', lastRun: '5d ago', nextRun: '-', target: 'local' },
  ]
  return (
    <PreviewCard title="Panel">
      <BackupStatusPanel jobs={jobs} totalSize="1.65 GB" lastFullBackup="2026-05-25 03:00" />
    </PreviewCard>
  )
}

/* ────────── TIMELINE PREVIEWS ────────── */

export function TimelinePreviews() {
  const items: TimelineItemData[] = [
    { id: '1', time: '14:32', title: 'Deploy v2.4.1', description: 'Rolled out to production — 4 containers updated', status: 'online' },
    { id: '2', time: '14:15', title: 'Backup completed', description: 'JottaCloud sync finished (1.2 GB)', status: 'online' },
    { id: '3', time: '13:48', title: 'Certificate renewal', description: 'LetsEncrypt wildcard renewed', status: 'warning' },
    { id: '4', time: '12:00', title: 'Database migration', description: 'Schema update for v2.4.0', status: 'online' },
  ]
  return (
    <PreviewCard title="Events">
      <Timeline items={items} active />
    </PreviewCard>
  )
}

/* ────────── ALERT INBOX PREVIEWS ────────── */

export function AlertInboxPreviews() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: 'a1', title: 'API Gateway unreachable', severity: 'critical', timestamp: '2m ago', service: 'API Gateway', description: '502 errors from all upstream services' },
    { id: 'a2', title: 'Disk at 92%', severity: 'high', timestamp: '15m ago', service: 'Miriam', acknowledged: true },
    { id: 'a3', title: 'Cert expiring', severity: 'medium', timestamp: '1h ago', service: 'Traefik' },
  ])

  function handleAcknowledge(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    )
  }

  return (
    <PreviewCard title="Inbox">
      <AlertInbox alerts={alerts} emptyMessage="All clear — no incidents" onAcknowledge={handleAcknowledge} />
    </PreviewCard>
  )
}

/* ────────── ROLLBACK PLAN PREVIEWS ────────── */

export function RollbackPlanPreviews() {
  const steps: RollbackStep[] = [
    { id: 's1', label: 'Revert app to v2.4.0', description: 'docker compose pull v2.4.0 tag', status: 'success' },
    { id: 's2', label: 'Rollback DB schema', description: 'Apply 20260525_rollback.sql', status: 'running' },
    { id: 's3', label: 'Restart stack', description: 'docker compose up -d', status: 'pending' },
    { id: 's4', label: 'Health check', description: 'Verify /health endpoint responds 200', status: 'pending' },
  ]
  return (
    <PreviewCard title="Plan">
      <RollbackPlan name="v2.4.1 → v2.4.0" steps={steps} executing />
    </PreviewCard>
  )
}

/* ────────── ACTION DIFF PREVIEWS ────────── */

export function ActionDiffPreviews() {
  const lines: DiffLine[] = [
    { text: 'version: "3.8"', type: 'context', oldLine: 1, newLine: 1 },
    { text: 'services:', type: 'context', oldLine: 2, newLine: 2 },
    { text: '  app:', type: 'context', oldLine: 3, newLine: 3 },
    { text: '    image: nginx:1.25', type: 'remove', oldLine: 4 },
    { text: '    image: nginx:1.27', type: 'add', newLine: 4 },
    { text: '    ports:', type: 'context', oldLine: 5, newLine: 5 },
    { text: '      - "8080:80"', type: 'remove', oldLine: 6 },
    { text: '      - "80:80"', type: 'add', newLine: 6 },
    { text: '    restart: always', type: 'context', oldLine: 7, newLine: 7 },
  ]
  return (
    <PreviewCard title="Diff">
      <ActionDiff lines={lines} label="docker-compose.yml" />
    </PreviewCard>
  )
}

/* ────────── LOG VIEWER PREVIEWS ────────── */

export function LogViewerPreviews() {
  const logs: LogLine[] = [
    { text: 'Starting deployment pipeline…', level: 'info', timestamp: '14:32:01', source: 'deploy' },
    { text: 'Pulling image: nginx:1.27 (12 MB)', level: 'info', timestamp: '14:32:04', source: 'docker' },
    { text: 'Container app-web restarted', level: 'info', timestamp: '14:32:12', source: 'docker' },
    { text: 'Health check passed (200 OK)', level: 'info', timestamp: '14:32:18', source: 'deploy' },
    { text: 'WARNING: deprecation notice — v2.4.0 will be EOL in 30 days', level: 'warn', timestamp: '14:32:22', source: 'deploy' },
    { text: 'Deployment completed successfully', level: 'info', timestamp: '14:32:25', source: 'deploy' },
    { text: 'Connection timeout to replica-2 (10.0.10.12:5432)', level: 'error', timestamp: '14:33:01', source: 'postgres' },
    { text: 'Automatic failover to replica-1', level: 'warn', timestamp: '14:33:03', source: 'postgres' },
    { text: 'Replication lag: 0.2s', level: 'debug', timestamp: '14:33:05', source: 'postgres' },
  ]
  return (
    <PreviewCard title="Logs">
      <LogViewer lines={logs} height="200px" showTimestamps={true} showLineNumbers={true} searchable />
    </PreviewCard>
  )
}

/* ────────── KBD PREVIEWS ────────── */

export function KbdPreviews() {
  return (
    <PreviewCard title="Shortcuts">
      <Kbd keys="⌘K" />
      <Kbd keys={['⌘', '⇧', 'S']} />
      <Kbd keys="⌘⇧F" />
      <Kbd keys="Esc" />
    </PreviewCard>
  )
}

/* ────────── ACTION ROW PREVIEWS ────────── */

export function ActionRowPreviews() {
  const actions: ActionItem[] = [
    { id: 'deploy', label: 'Deploy stack', description: 'Roll out the latest compose changes', shortcut: '⌘D' },
    { id: 'backup', label: 'Run backup', description: 'Trigger JottaCloud sync', shortcut: '⌘B' },
    { id: 'reboot', label: 'Reboot server', description: 'Restart the selected host', shortcut: '' },
  ]
  return (
    <PreviewCard title="Actions">
      {actions.map((a) => (
        <div key={a.id} className="w-full">
          <ActionRow action={a} onClick={() => alert(`Action: ${a.label}`)} />
        </div>
      ))}
    </PreviewCard>
  )
}

/* ────────── FOOTER PREVIEWS ────────── */

export function FooterPreviews() {
  return (
    <div className="space-y-4">
      <PreviewCard title="Default">
        <Footer />
      </PreviewCard>
      <PreviewCard title="Accent variant">
        <Footer accent />
      </PreviewCard>
      <PreviewCard title="Row layout">
        <Footer layout="row" />
      </PreviewCard>
      <PreviewCard title="Custom labels">
        <Footer
          labels={{
            tollerudProject: 'infra.tollerud.dev',
            attribution: 'for Advania Norge AS.',
            allRightsReserved: 'All rights reserved.',
          }}
        />
      </PreviewCard>
    </div>
  )
}

/* ────────── NOIR GLOW BACKGROUND PREVIEWS ────────── */

export function NoirGlowBackgroundPreviews() {
  return (
    <div className="space-y-3">
      <PreviewCard title="Default (CSS fallback)">
        <div className="relative w-full h-[200px] rounded overflow-hidden bg-tia-black">
          <NoirGlowBackground forceCssFallback />
          <div className="relative z-10 flex items-center justify-center h-full">
            <span className="text-tia-yellow font-mono text-sm">❯ Signal backdrop ready</span>
          </div>
        </div>
      </PreviewCard>
      <PreviewCard title="Props reference">
        <div className="text-xs text-tia-text-muted space-y-1">
          <p><code>intensity</code> — subtle | medium | loud</p>
          <p><code>speed</code> — still | slow | medium | fast</p>
          <p><code>shape</code> — corners | wave | dots | truchet | ripple | blob | sphere</p>
          <p><code>grain</code> — none | soft | high</p>
          <p><code>forceCssFallback</code> — renders static CSS glow without WebGL</p>
          <p className="mt-2">Requires <code>@paper-design/shaders-react</code> for canvas mode.</p>
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── COMMAND MENU PREVIEWS ────────── */

const cmdGroups: CommandGroup[] = [
  {
    label: 'Actions',
    items: [
      { id: 'deploy', label: 'Deploy stack', description: 'Roll out latest compose changes', shortcut: '⌘D' },
      { id: 'backup', label: 'Run backup', description: 'Trigger JottaCloud sync', shortcut: '⌘B' },
      { id: 'reboot', label: 'Reboot server', description: 'Restart selected host', shortcut: '' },
    ],
  },
]

export function CommandMenuPreviews() {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-3">
      <PreviewCard title="Trigger">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 text-sm border border-tia-border rounded bg-tia-surface-raised text-tia-text-primary hover:border-tia-yellow/50 transition-colors cursor-pointer"
        >
          ❯ Open command palette
        </button>
        {open && (
          <div className="mt-2">
            <CommandMenu
              open={open}
              onOpenChange={setOpen}
              groups={cmdGroups}
              placeholder="Search commands…"
            />
          </div>
        )}
      </PreviewCard>
      <PreviewCard title="Usage">
        <div className="text-xs text-tia-text-muted space-y-1">
          <p>Keyboard-first command palette for infrastructure actions.</p>
          <p>Groups via <code>CommandGroup[]</code> with keyboard navigation.</p>
          <p>Composes with <code>ActionRow</code> + <code>Kbd</code> under the hood.</p>
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── DIALOG PREVIEWS ────────── */

export function DialogPreviews() {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-3">
      <PreviewCard title="Basic">
        <TiaDialog open={open} onOpenChange={setOpen}>
          <TiaDialogTrigger asChild>
            <Button variant="secondary">Open Dialog</Button>
          </TiaDialogTrigger>
          <TiaDialogContent>
            <TiaDialogHeader>
              <TiaDialogTitle>Confirm deployment</TiaDialogTitle>
              <TiaDialogDescription>
                This will deploy v2.4.1 to the production cluster. Are you sure?
              </TiaDialogDescription>
            </TiaDialogHeader>
            <TiaDialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => { setOpen(false); alert('Deployed!') }}>Deploy</Button>
            </TiaDialogFooter>
          </TiaDialogContent>
        </TiaDialog>
      </PreviewCard>
    </div>
  )
}

/* ────────── TOOLTIP PREVIEWS ────────── */

export function TooltipPreviews() {
  return (
    <TiaTooltipProvider>
      <div className="space-y-3">
        <PreviewCard title="Basic">
          <TiaTooltip>
            <TiaTooltipTrigger asChild>
              <span className="inline-block px-3 py-1.5 rounded border border-tia-border/30 text-xs text-tia-text-muted cursor-default">Hover me</span>
            </TiaTooltipTrigger>
            <TiaTooltipContent>
              <p>I&apos;m a Tia Noir tooltip</p>
            </TiaTooltipContent>
          </TiaTooltip>
        </PreviewCard>
        <PreviewCard title="Placements">
          <div className="flex gap-2">
            <TiaTooltip>
              <TiaTooltipTrigger asChild><span className="px-2 py-1 rounded bg-tia-noir-800 text-xs cursor-default">Top</span></TiaTooltipTrigger>
              <TiaTooltipContent side="top">Top tooltip</TiaTooltipContent>
            </TiaTooltip>
            <TiaTooltip>
              <TiaTooltipTrigger asChild><span className="px-2 py-1 rounded bg-tia-noir-800 text-xs cursor-default">Bottom</span></TiaTooltipTrigger>
              <TiaTooltipContent side="bottom">Bottom tooltip</TiaTooltipContent>
            </TiaTooltip>
            <TiaTooltip>
              <TiaTooltipTrigger asChild><span className="px-2 py-1 rounded bg-tia-noir-800 text-xs cursor-default">Left</span></TiaTooltipTrigger>
              <TiaTooltipContent side="left">Left tooltip</TiaTooltipContent>
            </TiaTooltip>
            <TiaTooltip>
              <TiaTooltipTrigger asChild><span className="px-2 py-1 rounded bg-tia-noir-800 text-xs cursor-default">Right</span></TiaTooltipTrigger>
              <TiaTooltipContent side="right">Right tooltip</TiaTooltipContent>
            </TiaTooltip>
          </div>
        </PreviewCard>
      </div>
    </TiaTooltipProvider>
  )
}

/* ────────── TOAST PREVIEWS ────────── */

export function ToastPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Variants">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toast.success('Deployment complete')}
            className="px-3 py-1.5 rounded bg-tia-accent text-tia-noir-900 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Show Success
          </button>
          <button
            onClick={() => toast.error('Connection failed')}
            className="px-3 py-1.5 rounded bg-tia-error text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Show Error
          </button>
          <button
            onClick={() => toast.info('Backup completed')}
            className="px-3 py-1.5 rounded bg-tia-info text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Show Info
          </button>
          <button
            onClick={() => toast.warning('Disk at 85%')}
            className="px-3 py-1.5 rounded bg-tia-warning text-tia-noir-900 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Show Warning
          </button>
        </div>
        <p className="text-xs text-tia-text-muted mt-2">Click a button to trigger a toast notification. Toasts appear in the top-right corner.</p>
      </PreviewCard>
      <PreviewCard title="With Description">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toast('System update scheduled', {
                description: 'v2.4.1 will deploy at 03:00 UTC',
              })}
            className="px-3 py-1.5 rounded bg-tia-surface border border-tia-border/30 text-tia-text-primary text-xs font-medium hover:bg-tia-surface-raised transition-colors"
          >
            Show Description
          </button>
          <button
            onClick={() => toast('Action required', {
                description: 'Review 3 pending approvals',
                action: {
                  label: 'Review',
                  onClick: () => console.log('navigate to approvals'),
                },
              })}
            className="px-3 py-1.5 rounded bg-tia-surface border border-tia-border/30 text-tia-text-primary text-xs font-medium hover:bg-tia-surface-raised transition-colors"
          >
            Show Action
          </button>
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── TABS PREVIEWS ────────── */

export function TabsPreviews() {
  const [tab, setTab] = useState('overview')
  return (
    <PreviewCard title="Server Details">
      <TiaTabs value={tab} onValueChange={setTab} className="w-full">
        <TiaTabsList>
          <TiaTabsTrigger value="overview">Overview</TiaTabsTrigger>
          <TiaTabsTrigger value="metrics">Metrics</TiaTabsTrigger>
          <TiaTabsTrigger value="logs">Logs</TiaTabsTrigger>
        </TiaTabsList>
        <TiaTabsContent value="overview" className="text-xs text-tia-text-secondary p-2">
          Host: <code>emma</code> &middot; IP: 10.0.10.10 &middot; Uptime: 42d
        </TiaTabsContent>
        <TiaTabsContent value="metrics" className="text-xs text-tia-text-secondary p-2">
          CPU: 34% &middot; Memory: 6.2/16 GB &middot; Disk: 45%
        </TiaTabsContent>
        <TiaTabsContent value="logs" className="text-xs text-tia-text-secondary p-2">
          Last event: Container app-web restarted at 14:32:12
        </TiaTabsContent>
      </TiaTabs>
    </PreviewCard>
  )
}

/* ────────── SKELETON PREVIEWS ────────── */

export function SkeletonPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Card skeleton">
        <div className="space-y-3 p-4 rounded-lg border border-tia-border/30 bg-tia-surface-raised">
          <TiaSkeleton className="h-4 w-3/4" />
          <TiaSkeleton className="h-3 w-1/2" />
          <TiaSkeleton className="h-3 w-full" />
        </div>
      </PreviewCard>
      <PreviewCard title="Metrics skeleton">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 p-3 rounded-lg border border-tia-border/20 bg-tia-noir-900/50">
              <TiaSkeleton className="h-3 w-16" />
              <TiaSkeleton className="h-6 w-20" />
              <TiaSkeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── PROGRESS PREVIEWS ────────── */

export function ProgressPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Values">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-tia-text-muted mb-1"><span>Backup sync</span><span>75%</span></div>
            <TiaProgress value={75} />
          </div>
          <div>
            <div className="flex justify-between text-xs text-tia-text-muted mb-1"><span>Disk usage</span><span>42%</span></div>
            <TiaProgress value={42} />
          </div>
          <div>
            <div className="flex justify-between text-xs text-tia-text-muted mb-1"><span>Deployment</span><span>100%</span></div>
            <TiaProgress value={100} />
          </div>
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── GLOW CARD PREVIEWS ────────── */

export function GlowCardPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Cursor-follow glow on host cards">
        <div className="grid grid-cols-2 gap-3 w-full">
          <TiaGlowCard glowColor="var(--tia-accent, #FFFF00)" intensity={0.12}>
            <HostCard hostname="emma" ip="10.0.10.10" status="online" cpu="34%" memory="6.2/16 GB" disk="45%" uptime="42d" containers={8} />
          </TiaGlowCard>
          <TiaGlowCard glowColor="var(--tia-error)" intensity={0.08}>
            <HostCard hostname="iris" ip="10.0.10.12" status="warning" cpu="87%" memory="14.5/16 GB" disk="91%" uptime="14d" />
          </TiaGlowCard>
        </div>
        <p className="text-xs text-tia-text-muted mt-2">Move your cursor over each card — a subtle glow follows. Configurable color and intensity per card.</p>
      </PreviewCard>
      <PreviewCard title="Service health with glow">
        <div className="grid grid-cols-2 gap-3 w-full">
          <TiaGlowCard intensity={0.1}>
            <ServiceHealthCard service="API Gateway" status="online" uptime="99.97%" responseTime="42ms" />
          </TiaGlowCard>
          <TiaGlowCard glowColor="var(--tia-warning)" intensity={0.1}>
            <ServiceHealthCard service="PostgreSQL" status="warning" uptime="98.2%" responseTime="12ms" />
          </TiaGlowCard>
        </div>
      </PreviewCard>
    </div>
  )
}

/* ────────── BENTO DASHBOARD PREVIEWS ────────── */

export function BentoDashboardPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Homelab Dashboard">
        <TiaBentoDashboard
          title="Tollerud Infrastructure"
          hosts={[
            { hostname: 'emma', ip: '10.0.10.10', status: 'online', cpu: '34%', memory: '6.2/16 GB', disk: '45%', uptime: '42d', containers: 8 },
            { hostname: 'miriam', ip: '10.0.10.14', status: 'online', cpu: '12%', memory: '3.8/32 GB', disk: '62%', uptime: '89d', containers: 12 },
            { hostname: 'iris', ip: '10.0.10.12', status: 'warning', cpu: '87%', memory: '14.5/16 GB', disk: '91%', uptime: '14d' },
          ]}
          metrics={[
            { label: 'CPU Avg', value: '44%', change: { value: '+5%', direction: 'up' } },
            { label: 'Memory', value: '24.5 GB', change: { value: '-2%', direction: 'down' } },
            { label: 'Disk Avg', value: '66%', change: { value: '+8%', direction: 'up' } },
            { label: 'Uptime', value: '89d 14h' },
          ]}
          services={[
            { service: 'API Gateway', status: 'online', uptime: '99.97%', responseTime: '42ms' },
            { service: 'PostgreSQL', status: 'online', uptime: '99.9%', responseTime: '12ms' },
            { service: 'Redis Cache', status: 'warning', uptime: '98.2%', responseTime: '3ms' },
            { service: 'Auth Service', status: 'online', uptime: '99.99%', responseTime: '8ms' },
          ]}
          incidents={[
            { title: 'Disk usage above 90%', severity: 'high', timestamp: '15m ago', service: 'Iris', description: '/hdd volume at 91%', acknowledged: true },
            { title: 'Certificate expiring', severity: 'medium', timestamp: '1h ago', service: 'Traefik', description: 'Wildcard cert expires in 7 days' },
            { title: 'Backup completed', severity: 'info', timestamp: '3h ago', service: 'Rclone', description: 'JottaCloud sync finished — 1.2 GB' },
          ]}
        />
        <p className="text-xs text-tia-text-muted mt-2">A complete dashboard layout using 8 different Tollerud components. Data-driven and responsive.</p>
      </PreviewCard>
    </div>
  )
}

/* ────────── DATA TABLE PREVIEWS ────────── */

interface ServerRow {
  name: string
  ip: string
  cpu: string
  mem: string
  disk: string
  uptime: string
  status: string
}

export function DataTablePreviews() {
  const servers: ServerRow[] = [
    { name: 'emma', ip: '10.0.10.10', cpu: '34%', mem: '6.2/16', disk: '45%', uptime: '42d', status: 'online' },
    { name: 'miriam', ip: '10.0.10.14', cpu: '12%', mem: '3.8/32', disk: '62%', uptime: '89d', status: 'online' },
    { name: 'iris', ip: '10.0.10.12', cpu: '87%', mem: '14.5/16', disk: '91%', uptime: '14d', status: 'warning' },
    { name: 'victoria', ip: '10.0.10.15', cpu: '—', mem: '—', disk: '—', uptime: '—', status: 'offline' },
    { name: 'pia', ip: '10.0.10.13', cpu: '5%', mem: '2.1/8', disk: '22%', uptime: '120d', status: 'online' },
  ]

  const columns: Column<ServerRow>[] = [
    { key: 'name', label: 'Server', sortable: true, filterable: true },
    { key: 'ip', label: 'IP Address', filterable: true },
    { key: 'cpu', label: 'CPU', sortable: true, align: 'right' },
    { key: 'mem', label: 'Memory', sortable: true, align: 'right' },
    { key: 'disk', label: 'Disk', sortable: true, align: 'right' },
    { key: 'uptime', label: 'Uptime', sortable: true, align: 'right' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      align: 'center',
      render: (val) => (
        <span className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
          val === 'online' && 'bg-tia-accent/15 text-tia-accent',
          val === 'warning' && 'bg-tia-warning/15 text-tia-warning',
          val === 'offline' && 'bg-tia-error/15 text-tia-error',
        )}>
          <span className={cn(
            'w-1.5 h-1.5 rounded-full',
            val === 'online' && 'bg-tia-accent',
            val === 'warning' && 'bg-tia-warning',
            val === 'offline' && 'bg-tia-error',
          )} />
          {val as string}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Server inventory">
        <TiaDataTable columns={columns} data={servers} className="w-full" />
        <p className="text-xs text-tia-text-muted mt-2">Click column headers to sort. Type in filter inputs to narrow results — try filtering by server name or status.</p>
      </PreviewCard>
    </div>
  )
}

/* ────────── SHEET PREVIEWS ────────── */

export function SheetPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Server details (right side)">
        <TiaSheet>
          <TiaSheetTrigger asChild>
            <button className="px-3 py-1.5 rounded border border-tia-border/30 bg-tia-surface text-xs text-tia-text-primary hover:bg-tia-surface-raised transition-colors">
              Open server details
            </button>
          </TiaSheetTrigger>
          <TiaSheetContent side="right">
            <TiaSheetHeader>
              <TiaSheetTitle>emma.tollerud</TiaSheetTitle>
              <TiaSheetDescription>10.0.10.10 · Ubuntu 24.04 · Uptime: 42d</TiaSheetDescription>
            </TiaSheetHeader>
            <div className="mt-6 space-y-4 text-sm text-tia-text-secondary">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-tia-surface-raised p-3">
                  <div className="text-xs text-tia-text-muted">CPU</div>
                  <div className="text-base font-semibold text-tia-text-primary">34%</div>
                </div>
                <div className="rounded bg-tia-surface-raised p-3">
                  <div className="text-xs text-tia-text-muted">Memory</div>
                  <div className="text-base font-semibold text-tia-text-primary">6.2/16 GB</div>
                </div>
                <div className="rounded bg-tia-surface-raised p-3">
                  <div className="text-xs text-tia-text-muted">Disk</div>
                  <div className="text-base font-semibold text-tia-text-primary">45%</div>
                </div>
                <div className="rounded bg-tia-surface-raised p-3">
                  <div className="text-xs text-tia-text-muted">Containers</div>
                  <div className="text-base font-semibold text-tia-text-primary">8</div>
                </div>
              </div>
            </div>
          </TiaSheetContent>
        </TiaSheet>
        <p className="text-xs text-tia-text-muted mt-2">Click to open a slide-in panel with server details. Press Esc or click the X to close.</p>
      </PreviewCard>
    </div>
  )
}

/* ────────── DROPDOWN MENU PREVIEWS ────────── */

export function DropdownMenuPreviews() {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="Overflow menu">
        <TiaDropdownMenu open={open} onOpenChange={setOpen}>
          <TiaDropdownMenuTrigger asChild>
            <button className="px-3 py-1.5 rounded border border-tia-border/30 bg-tia-surface text-xs text-tia-text-primary hover:bg-tia-surface-raised transition-colors">
              Actions ▾
            </button>
          </TiaDropdownMenuTrigger>
          <TiaDropdownMenuContent>
            <TiaDropdownMenuLabel>Server Actions</TiaDropdownMenuLabel>
            <TiaDropdownMenuItem onSelect={() => alert('Restarting…')}>
              Restart
            </TiaDropdownMenuItem>
            <TiaDropdownMenuItem onSelect={() => alert('Backup triggered')}>
              Run Backup
            </TiaDropdownMenuItem>
            <TiaDropdownMenuItem disabled>
              Deploy (unavailable)
            </TiaDropdownMenuItem>
            <TiaDropdownMenuSeparator />
            <TiaDropdownMenuItem onSelect={() => alert('Logs opened')}>
              View Logs
            </TiaDropdownMenuItem>
          </TiaDropdownMenuContent>
        </TiaDropdownMenu>
        <p className="text-xs text-tia-text-muted mt-2">Click to open. Items with disabled state, a label group, and separator.</p>
      </PreviewCard>
    </div>
  )
}

/* ────────── EMPTY PREVIEWS ────────── */

export function EmptyPreviews() {
  return (
    <div className="space-y-3 w-full">
      <PreviewCard title="No results">
        <Empty>
          <EmptyHeader>
            <EmptyIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </EmptyIcon>
            <EmptyTitle>No servers found</EmptyTitle>
            <EmptyDescription>No servers match your current filters. Try adjusting your search.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </PreviewCard>
      <PreviewCard title="All clear">
        <Empty>
          <EmptyHeader>
            <EmptyIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </EmptyIcon>
            <EmptyTitle>All clear</EmptyTitle>
            <EmptyDescription>No incidents reported. Your infrastructure is healthy.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </PreviewCard>
    </div>
  )
}