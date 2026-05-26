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
} from '../../components/ComponentPreviews'

const sections: {
  label: string
  id: string
  desc: string
  preview: React.FC
}[] = [
  {
    label: 'Button',
    id: 'button',
    desc: 'Primary action button with terminal, ghost, and variant styles. disabled, focus-visible, loading states.',
    preview: ButtonPreviews,
  },
  {
    label: 'Input',
    id: 'input',
    desc: 'Text input with label, placeholder, error state, and disabled support.',
    preview: InputPreviews,
  },
  {
    label: 'Textarea',
    id: 'textarea',
    desc: 'Multiline text input with label, error state, and resizable textarea.',
    preview: TextareaPreviews,
  },
  {
    label: 'Select',
    id: 'select',
    desc: 'Styled native select dropdown with custom SVG chevron, label, error, and placeholder support.',
    preview: SelectPreviews,
  },
  {
    label: 'Checkbox',
    id: 'checkbox',
    desc: 'Custom-styled checkbox with SVG checkmark, label, focus-visible ring, disabled state.',
    preview: CheckboxPreviews,
  },
  {
    label: 'Switch',
    id: 'switch',
    desc: 'Toggle switch with role="switch", animated thumb, label, disabled state.',
    preview: SwitchPreviews,
  },
  {
    label: 'RadioGroup / Radio',
    id: 'radio',
    desc: 'Fieldset-based radio group with custom dot indicator, legend label, error state.',
    preview: RadioPreviews,
  },
  {
    label: 'Badge',
    id: 'badge',
    desc: 'Status/notification badge — 6 variants: default, accent, success, error, info, warning.',
    preview: BadgePreviews,
  },
  {
    label: 'StatusDot',
    id: 'status-dot',
    desc: 'Online/offline/warning/idle signal indicator with colored pulse.',
    preview: StatusDotPreviews,
  },
  {
    label: 'Card',
    id: 'card',
    desc: 'Surface container with optional accent (yellow) border.',
    preview: CardPreviews,
  },
  {
    label: 'CodeBlock',
    id: 'code-block',
    desc: 'Terminal-style code display with inline rendering.',
    preview: CodeBlockPreviews,
  },
  {
    label: 'StatCard',
    id: 'stat-card',
    desc: 'Dashboard metric card with label, value, optional change indicator.',
    preview: StatCardPreviews,
  },
  {
    label: 'Kbd',
    id: 'kbd',
    desc: 'Keyboard shortcut chip — single key or chord (⌘K, ⌘⇧S).',
    preview: KbdPreviews,
  },
  {
    label: 'ActionRow',
    id: 'action-row',
    desc: 'Command/action item row with icon, label, shortcut badge, and click handler.',
    preview: ActionRowPreviews,
  },
  {
    label: 'Container',
    id: 'container',
    desc: 'Centered max-width layout wrapper (1100px). Accepts semantic HTML as element prop.',
    preview: ContainerPreviews,
  },
  {
    label: 'ServiceHealthCard',
    id: 'service-health-card',
    desc: 'Service status card with StatusDot, uptime, response time, and version info.',
    preview: ServiceHealthCardPreviews,
  },
  {
    label: 'HostCard',
    id: 'host-card',
    desc: 'Homelab server card — hostname, IP, status dot, CPU/ram/disk metrics, container count.',
    preview: HostCardPreviews,
  },
  {
    label: 'DockerStackCard',
    id: 'docker-stack-card',
    desc: 'Docker Compose stack card listing services with their individual statuses.',
    preview: DockerStackCardPreviews,
  },
  {
    label: 'IncidentCard',
    id: 'incident-card',
    desc: 'Alert/incident card with severity color coding, timestamp, and acknowledgement state.',
    preview: IncidentCardPreviews,
  },
  {
    label: 'ApprovalCard',
    id: 'approval-card',
    desc: 'Deployment approval card with pending/approved/rejected states and action buttons.',
    preview: ApprovalCardPreviews,
  },
  {
    label: 'BackupStatusPanel',
    id: 'backup-status-panel',
    desc: 'Backup job list with status dots, last/next run, size, and overall panel summary.',
    preview: BackupStatusPanelPreviews,
  },
  {
    label: 'Timeline',
    id: 'timeline',
    desc: 'Vertical event timeline with status-colored dots and metadata badges.',
    preview: TimelinePreviews,
  },
  {
    label: 'AlertInbox',
    id: 'alert-inbox',
    desc: 'Compound alert panel grouping IncidentCards with severity filter and acknowledge action.',
    preview: AlertInboxPreviews,
  },
  {
    label: 'RollbackPlan',
    id: 'rollback-plan',
    desc: 'Rollback plan card with step-by-step status (pending/running/success/failed).',
    preview: RollbackPlanPreviews,
  },
  {
    label: 'ActionDiff',
    id: 'action-diff',
    desc: 'Unified diff viewer with add/remove context highlighting and line numbers.',
    preview: ActionDiffPreviews,
  },
  {
    label: 'LogViewer',
    id: 'log-viewer',
    desc: 'Scrollable terminal-style log viewer with search, line numbers, timestamps, and auto-follow.',
    preview: LogViewerPreviews,
  },
  {
    label: 'Footer',
    id: 'footer',
    desc: 'Footer bar with Tollerud monogram — default/accent surfaces, responsive/row layouts, unstyled mode.',
    preview: FooterPreviews,
  },
  {
    label: 'NoirGlowBackground',
    id: 'noir-glow',
    desc: 'Tollerud signature animated background — WebGL grain gradient with acid-yellow blooms on black. CSS fallback for docs/static contexts.',
    preview: NoirGlowBackgroundPreviews,
  },
  {
    label: 'CommandMenu',
    id: 'command-menu',
    desc: 'Keyboard-first command palette for infrastructure actions. Groups, keyboard navigation, composable with ActionRow + Kbd.',
    preview: CommandMenuPreviews,
  },
]

export default function ComponentsPage() {
  return (
    <div className="docs-content">
      <h1>Components</h1>
      <p>31 React components across form primitives, core UI, layout, atmosphere, command shell, and homelab categories.</p>
      <p className="text-xs text-tia-text-muted mt-1">
        All components are <code>forwardRef</code> + <code>displayName</code> with full TypeScript types.
      </p>

      {sections.map(({ label, id, desc, preview: Preview }) => (
        <div key={id} id={id} className="mb-12">
          <h2>{label}</h2>
          <p className="text-sm text-tia-text-muted mb-4">{desc}</p>
          <Preview />
        </div>
      ))}
    </div>
  )
}