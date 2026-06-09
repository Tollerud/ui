'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, CommandMenu } = __p

/* Tollerud DS — Components gallery. → window.PageComponents */
function PageComponents({ go }) {
  const toast = useToast();
  const [density, setDensity] = useState('comfortable');
  const morePages = [
    { id: 'forms', icon: 'forms', t: 'Forms', d: 'Inputs, toggles, combobox, form row, validation.' },
    { id: 'navigation', icon: 'compass', t: 'Navigation & Overlays', d: 'Dialogs, drawer, menus, toasts, command palette.' },
    { id: 'infra', icon: 'server', t: 'Infrastructure', d: 'Host, incident, approval, and ops cards.' },
    { id: 'charts', icon: 'chart', t: 'Charts', d: 'Bar, area, donut, sparkline.' },
    { id: 'blocks', icon: 'blocks', t: 'Blocks', d: 'Hero, pricing, CTA, bento dashboard.' },
    { id: 'data-table', icon: 'server', t: 'Data Table', d: 'Sortable and rich table patterns.' },
    { id: 'console', icon: 'code', t: 'Logs & Console', d: 'LogViewer and streaming terminal.' },
  ];
  return (
    <div>
      <PageHeader icon="grid" eyebrow="Components" title="Components"
        lede="Core primitives — button, card, badge, status, layout. Form controls, overlays, data views, and full-screen examples live on their own pages."/>

      <Section title="More components" desc="This page covers primitives only. Everything else has a canonical home.">
        <div className="ds-grid-3">
          {morePages.map((s) => {
            const I = Icons[s.icon];
            return (
              <button key={s.id} type="button" className="tollerud-card ds-themed ds-lift" onClick={() => go?.(s.id)}
                style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ color: 'var(--tollerud-yellow)' }}><I size={18}/></span>
                <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--foreground)' }}>{s.t}</div>
                <p style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>{s.d}</p>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Button" desc="Five variants, three sizes. Supports icons, loading spinners, disabled state, and icon-only. Primary is yellow; terminal carries the ❯ for technical actions.">
        <Demo name="buttons" variant="center" code={`<Button variant="primary">Deploy</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">More</Button>
<Button variant="destructive">Delete</Button>
<Button variant="terminal">start_building</Button>`}>
          <Button variant="primary">Deploy</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost">More</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="terminal">start_building</Button>
        </Demo>
        <Demo name="button-sizes" variant="center" code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Demo>
        <Demo name="button-icons" variant="center" code={`{/* With icon */}
<Button variant="primary"><Icons.rocket size={15}/>Deploy</Button>
<Button variant="secondary"><Icons.refresh size={15}/>Restart</Button>
<Button variant="destructive"><Icons.trash size={15}/>Delete</Button>

{/* Loading */}
<Button variant="primary" disabled><Spinner size={14}/>Deploying…</Button>

{/* Icon-only */}
<Button variant="ghost" style={{width:36,height:36,padding:0}}><Icons.settings size={16}/></Button>

{/* Disabled */}
<Button variant="primary" disabled>Disabled</Button>
<Button variant="secondary" disabled>Disabled</Button>`}>
          <Button variant="primary"><Icons.rocket size={15}/>Deploy</Button>
          <Button variant="secondary"><Icons.refresh size={15}/>Restart</Button>
          <Button variant="destructive"><Icons.trash size={15}/>Delete</Button>
          <Button variant="primary" disabled><Spinner size={14}/>Deploying…</Button>
          <Button variant="ghost" style={{ width: 36, height: 36, padding: 0 }}><Icons.settings size={16}/></Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </Demo>
      </Section>

      <Section title="Card" desc="The default surface. Add an accent for a yellow-bordered, highlighted card.">
        <Demo name="cards" code={`<Card>
  <h3 className="font-semibold mb-1">Standard card</h3>
  <p className="text-sm text-tollerud-noir-200">A raised surface with a hairline border.</p>
</Card>
<Card accent>
  <h3 className="font-semibold mb-1">Accent card</h3>
  <p className="text-sm text-tollerud-noir-200">Yellow border for emphasis.</p>
</Card>`}>
          <Card style={{ flex: 1, minWidth: 220 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Standard card</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>A raised surface with a hairline border.</p>
          </Card>
          <Card accent style={{ flex: 1, minWidth: 220 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Accent card</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>Yellow border for emphasis.</p>
          </Card>
        </Demo>
      </Section>

      <Section title="Divider" desc="A horizontal rule. Default uses the border token; accent variant draws a short yellow rule for section breaks.">
        <Demo name="dividers" variant="col" code={`<Divider />
<Divider accent />`}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 12 }}>Content above the divider</p>
            <Divider/>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '12px 0' }}>Content below the divider</p>
            <Divider accent/>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 12 }}>Accent variant — short yellow rule</p>
          </div>
        </Demo>
      </Section>

      <Section title="Badge & Pill" desc="Badges label status inline. Pills are tiny mono-flavored tags.">
        <Demo name="badges" variant="center" code={`<Badge variant="accent">New</Badge>
<Badge variant="success">Online</Badge>
<Badge variant="warning">Degraded</Badge>
<Badge variant="error">Offline</Badge>
<Badge variant="info">Beta</Badge>`}>
          <Badge variant="accent">New</Badge>
          <Badge variant="success">Online</Badge>
          <Badge variant="warning">Degraded</Badge>
          <Badge variant="error">Offline</Badge>
          <Badge variant="info">Beta</Badge>
          <Badge variant="default">Default</Badge>
        </Demo>
        <Demo name="pills" variant="center" code={`<Pill variant="outline">new</Pill>
<Pill variant="muted">deprecated</Pill>
<Pill variant="success">stable</Pill>
<Pill variant="error">critical</Pill>`}>
          <Pill variant="outline">new</Pill>
          <Pill variant="muted">deprecated</Pill>
          <Pill variant="success">stable</Pill>
          <Pill variant="error">critical</Pill>
        </Demo>
      </Section>

      <Section title="Status & Kbd" desc="Status dots show liveness with a soft glow. Kbd renders shortcut chips.">
        <Demo name="status" variant="center" code={`<StatusDot status="online" label="emma — ready" />
<StatusDot status="warning" label="CPU 87%" />
<StatusDot status="offline" label="pia — unreachable" />
<StatusDot status="idle" label="iris — idle" />`}>
          <StatusDot status="online" label="emma — ready"/>
          <StatusDot status="warning" label="CPU 87%"/>
          <StatusDot status="offline" label="pia — unreachable"/>
          <StatusDot status="idle" label="iris — idle"/>
        </Demo>
        <Demo name="kbd" variant="center" code={`<Kbd keys="⌘+K" />
<Kbd keys={["⌘","⇧","S"]} />
<Kbd keys="Esc" size="sm" />`}>
          <Kbd keys="⌘+K"/>
          <Kbd keys={["⌘", "⇧", "S"]}/>
          <Kbd keys="Esc" size="sm"/>
        </Demo>
      </Section>

      <Section title="Stat card" desc="Compact metric tiles for dashboards, with optional trend.">
        <Demo name="stats" code={`<StatCard label="Active Sessions" value="42" change={{ value: "12%", direction: "up" }} icon="activity" />
<StatCard label="CPU Load" value="63%" change={{ value: "4%", direction: "down" }} icon="cpu" />
<StatCard label="Storage" value="1.2 TB" icon="database" />`}>
          <div className="ds-grid-3" style={{ width: '100%' }}>
            <StatCard label="Active Sessions" value="42" change={{ value: '12%', direction: 'up' }} icon="activity"/>
            <StatCard label="CPU Load" value="63%" change={{ value: '4%', direction: 'down' }} icon="cpu"/>
            <StatCard label="Storage" value="1.2 TB" icon="database"/>
          </div>
        </Demo>
      </Section>

      <Section title="Progress, Skeleton & Avatar" desc="Loading and identity primitives. Avatar and AvatarGroup stack naturally.">
        <Demo name="progress" variant="col" code={`<Progress value={72} />
<Skeleton h={14} w="60%" />
<Avatar name="Tia Tollerud" />`}>
          <div style={{ maxWidth: 320 }}><Progress value={72}/></div>
          <div className="ds-col" style={{ gap: 8, maxWidth: 320 }}>
            <Skeleton h={14} w="60%"/>
            <Skeleton h={14} w="90%"/>
            <Skeleton h={48} w="100%" r={8}/>
          </div>
          <div className="ds-row"><Avatar name="Tia Tollerud"/><Avatar name="Emma R" size={44}/><Avatar name="Pia K" size={28}/></div>
        </Demo>
        <Demo name="avatar-group" variant="center" code={`<AvatarGroup max={4} users={[
  { name: 'Tia', status: 'online' },
  { name: 'Emma Pung', status: 'online' },
  { name: 'Pia Berg', status: 'warning' },
]} />`}>
          <AvatarGroup max={4} size={36} users={[
            { name: 'Tia', status: 'online' },
            { name: 'Emma Pung', status: 'online' },
            { name: 'Pia Berg', status: 'warning' },
            { name: 'Sigrid Vik', status: 'offline' },
            { name: 'Astrid Lund' },
            { name: 'Embla Ro' },
          ]}/>
        </Demo>
      </Section>

      <Section title="Tooltip" desc="Appears on hover and focus. Supports top (default) and bottom placement.">
        <Demo name="tooltip" variant="center" code={`<Tooltip label="⌘K to open">
  <Button variant="secondary">Hover me</Button>
</Tooltip>`}>
          <Tooltip label="⌘K to open"><Button variant="secondary">Hover me</Button></Tooltip>
          <Tooltip label="Restart container" side="bottom"><Button variant="ghost">Bottom</Button></Tooltip>
        </Demo>
      </Section>

      <Section title="Alert" desc="Four semantic tones. Pass icon to override the default icon per tone.">
        <Demo name="alerts" variant="col" code={`<Alert tone="accent"  title="Heads up">Yellow signals an action worth noticing.</Alert>
<Alert tone="info"    title="Scheduled">Maintenance window at 03:00 UTC.</Alert>
<Alert tone="success" title="Deployed">emma — hermes v2.0 is live.</Alert>
<Alert tone="error"   title="Connection failed">Could not resolve host — check DNS.</Alert>
<Alert tone="error"   title="Storage full" icon="database">Custom icon via icon prop.</Alert>`}>
          <Alert tone="accent"  title="Heads up">Yellow signals an action worth noticing.</Alert>
          <Alert tone="info"    title="Scheduled">Maintenance window at 03:00 UTC. No action needed.</Alert>
          <Alert tone="success" title="Deployed">emma — hermes v2.0 is live.</Alert>
          <Alert tone="error"   title="Connection failed">Could not resolve host — check DNS.</Alert>
          <Alert tone="error"   title="Storage full" icon="database">Custom icon via the <code>icon</code> prop.</Alert>
        </Demo>
      </Section>

      <Section title="Tabs & Accordion" desc="Organize content. Tabs ship pill and underline variants.">
        <Demo name="tabs" variant="col" code={`<Tabs tabs={[
  { id: 'overview', label: 'Overview', content: '...' },
  { id: 'logs', label: 'Logs', content: '...' },
  { id: 'config', label: 'Config', content: '...' },
]} />`}>
          <Tabs tabs={[
            { id: 'overview', label: 'Overview', content: 'Pill tabs — the default. Good for switching views inside a card.' },
            { id: 'logs', label: 'Logs', content: 'Each tab swaps the panel below it.' },
            { id: 'config', label: 'Config', content: 'Keyboard and click both work.' },
          ]}/>
          <Tabs variant="underline" tabs={[
            { id: 'a', label: 'Services', content: 'Underline tabs — for page-level sections.' },
            { id: 'b', label: 'Hosts', content: 'A yellow underline marks the active tab.' },
            { id: 'c', label: 'Backups', content: 'Lower-chrome, more editorial.' },
          ]}/>
        </Demo>
        <Demo name="accordion" variant="col" code={`<Accordion items={[
  { q: 'How do I install?', a: '...' },
  { q: 'Does it support light mode?', a: '...' },
]} />`}>
          <div style={{ width: '100%', maxWidth: 560 }}>
            <Accordion items={[
              { q: 'How do I install the system?', a: 'npm install @tollerud/ui tailwindcss@4, then @import globals.css and @source the package dist in app/globals.css.' },
              { q: 'Does it support light mode?', a: 'Yes — the entire system flips on a single data-theme attribute. Try the toggle in the top bar.' },
              { q: 'Can I use it without React?', a: 'Yes. Every component has a matching .tollerud-* CSS class in globals.css for plain HTML.' },
            ]}/>
          </div>
        </Demo>
      </Section>

      <Section title="Timeline" desc="Vertical activity feed with status-colored dots and metadata.">
        <Demo name="timeline" variant="col" code={`<Timeline items={[
  { time: '14:32', title: 'Deployed hermes v2.0', description: 'Rolled out to emma', status: 'online', meta: ['success','3s'] },
  { time: '14:31', title: 'Restarted nginx', description: 'Config reloaded', status: 'warning', meta: ['warning'] },
  { time: '14:30', title: 'SSH connection failed', description: 'emma refused connection', status: 'offline' },
]} />`}>
          <div style={{ width: '100%', maxWidth: 520 }}>
            <Timeline items={[
              { time: '14:32', title: 'Deployed hermes v2.0', description: 'Rolled out to emma', status: 'online', meta: ['success', '3s'] },
              { time: '14:31', title: 'Restarted nginx', description: 'Config reloaded', status: 'warning', meta: ['warning'] },
              { time: '14:30', title: 'SSH connection failed', description: 'emma refused connection', status: 'offline' },
            ]}/>
          </div>
        </Demo>
      </Section>

      <Section title="Panel" desc="A card with a header bar (title + optional actions) and optional footer. Pass a fragment with multiple buttons to actions for a toolbar.">
        <Demo name="panel" variant="col" code={`<Panel title="Compose stack" icon="grid"
  actions={<Button variant="ghost" size="sm">Edit</Button>}
  footer={<span className="ds-mono">compose.yml · 4 services</span>}>
  …content…
</Panel>

{/* Multiple actions */}
<Panel title="hermes" icon="server"
  actions={<>
    <Button variant="ghost" size="sm">Logs</Button>
    <Button variant="ghost" size="sm">Restart</Button>
    <Button variant="destructive" size="sm">Stop</Button>
  </>}>
  …content…
</Panel>`}>
          <div className="ds-col" style={{ width: '100%', maxWidth: 460, gap: 16 }}>
            <Panel title="Compose stack" icon="grid" actions={<Button variant="ghost" size="sm">Edit</Button>}
              footer={<span className="ds-mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>compose.yml · 4 services</span>}>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0 }}>Single action in the header.</p>
            </Panel>
            <Panel title="hermes" icon="server"
              actions={<><Button variant="ghost" size="sm">Logs</Button><Button variant="ghost" size="sm">Restart</Button><Button variant="destructive" size="sm">Stop</Button></>}>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0 }}>Multiple actions — pass a React fragment to <code>actions</code>.</p>
            </Panel>
          </div>
        </Demo>
      </Section>

      <Section title="Meter" desc="A labeled progress row that turns red past a hot threshold (default 85%). Used for CPU/memory/disk and plan-usage limits.">
        <Demo name="meter" variant="col" code={`<Meter label="CPU" value={23} valueLabel="23%" />
<Meter label="Disk" value={88} valueLabel="88%" />
<Meter label="Containers" value={28} unlimited valueLabel="28 running" />`}>
          <div className="ds-col" style={{ width: '100%', maxWidth: 380, gap: 12 }}>
            <Meter label="CPU" value={23} valueLabel="23%"/>
            <Meter label="Disk" value={88} valueLabel="88%"/>
            <Meter label="Containers" value={28} unlimited valueLabel="28 running"/>
          </div>
        </Demo>
      </Section>

      <Section title="Stepper" desc="Horizontal step indicator for wizards and multi-stage flows. Pass an array of step labels and the current step index (0-based). Completed steps fill yellow; the active step carries a ring.">
        <Demo name="stepper" variant="col" code={`const steps = ['Connect host', 'Choose stacks', 'Invite team', 'Finish'];

// Step 0 = first (active), step 1 = second (active), etc.
<Stepper steps={steps} current={0} />  {/* on step 1 of 4 */}
<Stepper steps={steps} current={2} />  {/* on step 3, first two done */}
<Stepper steps={steps} current={3} />  {/* last step */}`}>
          <div className="ds-col" style={{ width: '100%', gap: 24 }}>
            <Stepper steps={['Connect host', 'Choose stacks', 'Invite team', 'Finish']} current={0}/>
            <Stepper steps={['Connect host', 'Choose stacks', 'Invite team', 'Finish']} current={2}/>
            <Stepper steps={['Connect host', 'Choose stacks', 'Invite team', 'Finish']} current={3}/>
          </div>
        </Demo>
      </Section>

      <Section title="Density" desc="Two ways to apply compact density: set density='compact' directly on a Card, or wrap a group with data-density='compact' to tighten everything inside.">
        <Demo name="density" variant="col" code={`{/* Per-card density prop */}
<Card density="compact">…</Card>
<Card>…</Card>

{/* Or wrap a container */}
<div data-density="compact">
  {/* all cards, tables, form rows inside are compact */}
</div>`}>
          <div style={{ width: '100%' }}>
            <div className="ds-row" style={{ marginBottom: 14 }}>
              <Segmented value={density} onChange={setDensity} options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]}/>
            </div>
            <div data-density={density}>
              <div className="ds-grid-2" style={{ gap: 12 }}>
                <Card><div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Card title</div><p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Padding tightens in compact mode.</p></Card>
                <Card><FormRow label="Two-factor" hint="TOTP at sign-in."><Switch defaultChecked/></FormRow></Card>
              </div>
            </div>
            <div className="ds-row" style={{ gap: 12, marginTop: 12 }}>
              <Card density="compact" style={{ flex: 1 }}><div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>density="compact"</div><p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Always compact via prop.</p></Card>
              <Card style={{ flex: 1 }}><div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Default</div><p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Comfortable by default.</p></Card>
            </div>
          </div>
        </Demo>
      </Section>

      <Section title="Empty state" desc="For surfaces with no data, no results, or an error. Icon, headline, calm explanation, one clear action. A compact variant fits inside cards.">
        <Demo name="empty-state" code={`<EmptyState
  icon="server"
  title="No hosts connected"
  description="Connect your first machine and Tia will start watching it."
  action={<Button variant="primary" size="sm">Connect a host</Button>}
/>`}>
          <div className="ds-grid-2" style={{ width: '100%' }}>
            <EmptyState icon="server" title="No hosts connected"
              description="Connect your first machine and Tia will start watching it."
              action={<Button variant="primary" size="sm"><Icons.plus size={14}/>Connect a host</Button>}/>
            <EmptyState icon="checkCircle" accent title="All clear"
              description="No open alerts across your fleet."
              action={<Button variant="ghost" size="sm">View history</Button>}/>
          </div>
        </Demo>
      </Section>

      <Section title="Code block" desc="Terminal-style code display with an optional copy button. Use the code prop for a single string, or children for richer markup.">
        <Demo name="code-block" variant="col" code={`<CodeBlock showCopy promptPrefix code="systemctl status tollerud-agent" />`}>
          <CodeBlock showCopy promptPrefix code="systemctl status tollerud-agent" />
        </Demo>
      </Section>

      <Section title="Container" desc="Layout width constraint — 1100px max with 24px horizontal padding. Use as a page wrapper or section cap.">
        <Demo name="container" variant="col" code={`<Container className="py-6 text-center text-sm text-tollerud-text-secondary border border-dashed border-tollerud-border rounded-lg">
  Content capped at 1100px
</Container>`}>
          <Container className="py-6 text-center text-sm text-tollerud-text-secondary border border-dashed border-tollerud-border rounded-lg">
            Content capped at 1100px · px-6
          </Container>
        </Demo>
      </Section>

      <Section title="Action row" desc="A single command-list row — icon, label, description and shortcut. Used inside CommandMenu-style surfaces.">
        <Demo name="action-row" variant="col" code={`<ActionRow
  highlighted
  action={{
    id: 'deploy',
    label: 'Deploy to production',
    description: 'emma.tollerud.no · hermes stack',
    shortcut: ['⌘', 'D'],
    onSelect: () => {},
  }}
/>`}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <ActionRow
              highlighted
              action={{
                id: 'deploy',
                label: 'Deploy to production',
                description: 'emma.tollerud.no · hermes stack',
                shortcut: ['⌘', 'D'],
                onSelect: () => toast({ tone: 'info', title: 'Deploy queued' }),
              }}
            />
            <ActionRow
              action={{
                id: 'logs',
                label: 'View logs',
                description: 'Stream hermes stdout',
                shortcut: 'L',
                onSelect: () => toast({ tone: 'info', title: 'Opening logs' }),
              }}
            />
          </div>
        </Demo>
      </Section>

      <Section title="Glow card" desc="Wraps any surface with a cursor-tracking yellow glow. Intensity and color are configurable.">
        <Demo name="glow-card" variant="center" code={`<GlowCard className="rounded-lg border border-tollerud-border p-6 max-w-sm">
  <p className="text-sm text-tollerud-text-secondary">Hover to see the glow follow the cursor.</p>
</GlowCard>`}>
          <GlowCard className="rounded-lg border border-tollerud-border p-6 max-w-sm">
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>Hover to see the glow follow the cursor.</p>
          </GlowCard>
        </Demo>
      </Section>

    </div>
  );
}

export default PageComponents;
