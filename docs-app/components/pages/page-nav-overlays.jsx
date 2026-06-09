'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, CommandMenu } = __p

import { adaptCommandGroups, docsCommandFilter } from '@/lib/adapt-command-groups'

/* Tollerud DS — Navigation & Overlays. → window.PageNavOverlays */

function PageNavOverlays() {
  const toast = useToast();
  const [dialog, setDialog] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cmd, setCmd] = useState(false);

  const cmdGroups = [
    { label: 'Servers', items: [
      { id: 'emma', label: 'emma.tollerud.no', description: 'SSH · 4 containers · uptime 14d', icon: 'server', onSelect: () => toast({ tone: 'info', title: 'Connecting to emma…' }) },
      { id: 'pia', label: 'pia.tollerud.no', description: 'SSH · 2 containers · uptime 9d', icon: 'server', onSelect: () => toast({ tone: 'info', title: 'Connecting to pia…' }) },
    ]},
    { label: 'Actions', items: [
      { id: 'backup', label: 'Run Backup', description: 'rclone to JottaCloud', icon: 'database', shortcut: '⌘B', onSelect: () => toast({ tone: 'success', title: 'Backup started' }) },
      { id: 'deploy', label: 'Deploy Stack', description: 'docker compose up -d', icon: 'rocket', shortcut: '↵', onSelect: () => toast({ tone: 'accent', title: 'Deploying…' }) },
    ]},
  ];

  return (
    <div>
      <PageHeader icon="compass" eyebrow="Navigation & Overlays" title="Navigation & Overlays"
        lede="Wayfinding and floating surfaces — breadcrumbs, pagination, menus, dialogs, toasts and the keyboard-first command palette."/>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0 32px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Navigation</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)', margin: 0 }}/>
      </div>

      <Section title="Breadcrumb" desc="Shows the user's location in the hierarchy. Items are clickable except the last (current).">
        <Demo name="breadcrumb" variant="col" code={`<Breadcrumb items={['Servers', 'emma', 'Containers']} />`}>
          <Breadcrumb items={['Servers', 'emma', 'Containers']}/>
        </Demo>
      </Section>

      <Section title="Segmented control" desc="Switch between a small set of mutually exclusive views.">
        <Demo name="segmented" variant="center" code={`<Segmented options={[{value:'grid',label:'Grid'},{value:'list',label:'List'}]} />`}>
          <div className="ds-row" style={{ gap: 14 }}>
            <Segmented options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'graph', label: 'Graph' }]}/>
            <Segmented options={[{ value: '24h', label: '24h' }, { value: '7d', label: '7d' }, { value: '30d', label: '30d' }]}/>
          </div>
        </Demo>
      </Section>

      <Section title="Pagination" desc="Numbered pages with prev/next, keyboard and disabled-edge handling.">
        <Demo name="pagination" variant="center" code={`<Pagination total={7} current={1} />`}>
          <Pagination total={7} current={1}/>
        </Demo>
      </Section>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0 32px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Overlays</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)', margin: 0 }}/>
      </div>

      <Section title="Dropdown menu" desc="A floating action menu with sections, icons and separators. Click outside to dismiss.">
        <Demo name="dropdown" variant="center" code={`<DropdownMenu trigger={<Button variant="secondary">Actions ▾</Button>} items={[
  { label: 'Account', heading: true },
  { label: 'Profile', icon: 'user', onSelect },
  { label: 'Settings', icon: 'settings', onSelect },
  { sep: true },
  { label: 'Sign out', icon: 'logout', onSelect },
]} />`}>
          <DropdownMenu trigger={<Button variant="secondary">Actions ▾</Button>} items={[
            { label: 'Account', heading: true },
            { label: 'Profile', icon: 'user', onSelect: () => toast({ tone: 'info', title: 'Profile' }) },
            { label: 'Settings', icon: 'settings', onSelect: () => toast({ tone: 'info', title: 'Settings' }) },
            { sep: true },
            { label: 'Sign out', icon: 'logout', onSelect: () => toast({ tone: 'info', title: 'Signed out' }) },
          ]}/>
        </Demo>
      </Section>

      <Section title="Dialog" desc="A focused modal for confirmation. Escape or backdrop click closes; destructive intent reads in the copy.">
        <Demo name="dialog" variant="center" code={`<Button variant="destructive" onClick={() => setOpen(true)}>Stop containers</Button>

<Dialog open={open} onClose={close}
  title="Stop all containers on emma?"
  description="This stops 4 running services. They can be restarted from the dashboard."
  footer={<>
    <Button variant="ghost" onClick={close}>Cancel</Button>
    <Button variant="destructive" onClick={confirm}>Stop</Button>
  </>} />`}>
          <Button variant="destructive" onClick={() => setDialog(true)}>Stop containers</Button>
          <Dialog open={dialog} onClose={() => setDialog(false)}
            title="Stop all containers on emma?"
            description="This stops 4 running services. They can be restarted from the dashboard at any time."
            footer={<>
              <Button variant="ghost" onClick={() => setDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { setDialog(false); toast({ tone: 'error', title: 'emma — 4 containers stopped' }); }}>Stop</Button>
            </>}/>
        </Demo>
      </Section>

      <Section title="Toasts" desc="Transient confirmations via useToast() or sonner. Mount <Toaster /> once near the app root.">
        <Demo name="toasts" variant="center" code={`const toast = useToast();
toast({ tone: 'success', title: 'emma — deployment complete' });

// app/layout.tsx
import { Toaster } from '@tollerud/ui'
<Toaster />`}>
          <Button variant="secondary" onClick={() => toast({ tone: 'success', title: 'emma — deployment complete', message: 'hermes v2.0 is live' })}>Success</Button>
          <Button variant="secondary" onClick={() => toast({ tone: 'error', title: 'Port 8080 is in use', message: 'Pick another port and retry' })}>Error</Button>
          <Button variant="secondary" onClick={() => toast.success('emma — deploy complete')}>Sonner</Button>
          <Toaster />
        </Demo>
      </Section>

      <Section title="Drawer / Sheet" desc="Side panel for detail views and slide-over forms. Opens from the right or left; closes on Esc or overlay click.">
        <Demo name="drawer" variant="center" code={`<Drawer open={open} onClose={() => setOpen(false)} title="Host details"
  description="emma.tollerud.no"
  footer={<><Button variant="ghost" size="sm">Close</Button><Button variant="primary" size="sm">Connect</Button></>}>
  …content…
</Drawer>`}>
          <Button variant="primary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Host details" description="emma.tollerud.no"
            footer={<><Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>Close</Button><Button variant="primary" size="sm" onClick={() => { setDrawerOpen(false); toast({ tone: 'info', title: 'Connecting to emma…' }); }}>Connect (SSH)</Button></>}>
            <div className="ds-col" style={{ gap: 14 }}>
              <Meter label="CPU" value={23} valueLabel="23%"/>
              <Meter label="Memory" value={62} valueLabel="62%"/>
              <Meter label="Disk" value={45} valueLabel="45%"/>
              <FormRow label="Auto-restart" hint="Restart on failure."><Switch defaultChecked/></FormRow>
            </div>
          </Drawer>
        </Demo>
      </Section>

      <Section title="Command palette" desc="The signature component. ⌘K opens it anywhere; arrow keys navigate, Enter selects, Esc closes.">
        <Demo name="command" variant="center" code={`useEffect(() => {
  const h = e => { if ((e.metaKey||e.ctrlKey) && e.key==='k') { e.preventDefault(); setOpen(true); } };
  document.addEventListener('keydown', h);
  return () => document.removeEventListener('keydown', h);
}, []);

<CommandMenu open={open} onOpenChange={setOpen} groups={groups} />`}>
          <div className="ds-row" style={{ gap: 12 }}>
            <Button variant="terminal" onClick={() => setCmd(true)}>open_command</Button>
            <span className="ds-row" style={{ gap: 7, fontSize: 13, color: 'var(--text-muted)' }}>or press <Kbd keys="⌘+K"/></span>
          </div>
          <CommandMenu open={cmd} onOpenChange={setCmd} groups={adaptCommandGroups(cmdGroups)} filter={docsCommandFilter}/>
        </Demo>
      </Section>
    </div>
  );
}

export default PageNavOverlays;
