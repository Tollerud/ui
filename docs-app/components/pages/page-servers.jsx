'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, PropTable, ToastProvider, useToast, Icons, Ico, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, CommandMenu } = __p

const SERVERS_CODE = `import { DataTable, Button, Badge, Empty } from '@tollerud/ui'
import { RefreshCw, Trash2, ExternalLink, Plus } from 'lucide-react'

const hosts = [
  { id: 'emma', ip: '10.0.10.10', region: 'eu-north', status: 'online', cpu: 23, owner: 'Tia' },
  { id: 'iris', ip: '10.0.10.12', region: 'eu-west', status: 'warning', cpu: 88, owner: 'Tia' },
]

<DataTable
  data={hosts}
  rowKey="id"
  columns={[
    { key: 'id', header: 'Host', sortable: true, render: (row) => row.id },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <Badge variant={row.status === 'online' ? 'success' : 'warning'}>{row.status}</Badge>,
    },
    { key: 'region', header: 'Region', sortable: true },
    { key: 'cpu', header: 'CPU', sortable: true, align: 'right' },
    { key: 'owner', header: 'Owner', sortable: true },
  ]}
  searchable
  searchKeys={['id', 'ip', 'owner']}
  searchPlaceholder="Search host, ip, owner…"
  filter={{ key: 'region', allLabel: 'All regions' }}
  selectable
  pageSize={5}
  striped
  pinColumns
  toolbarRight={
    <Button variant="terminal" size="sm">
      <Plus size={14} />
      add_host
    </Button>
  }
  bulkActions={[
    {
      label: 'Restart',
      icon: <RefreshCw size={13} />,
      variant: 'ghost',
      onRun: (ids, clear) => clear(),
    },
    {
      label: 'Stop',
      icon: <Trash2 size={13} />,
      variant: 'destructive',
      onRun: (ids, clear) => clear(),
    },
  ]}
  rowMenu={(row) => [
    { label: 'Connect (SSH)', icon: <ExternalLink size={14} />, onSelect: () => {} },
    { label: 'Restart', icon: <RefreshCw size={14} />, onSelect: () => {} },
    { sep: true },
    { label: 'Stop host', icon: <Trash2 size={14} />, onSelect: () => {} },
  ]}
  emptyState={
    <Empty>
      <EmptyTitle>No hosts found</EmptyTitle>
      <EmptyDescription>Try clearing search or filters.</EmptyDescription>
    </Empty>
  }
/>`

/* @tollerud/ui docs — Servers / DataTable build example */
function PageServers() {
  const toast = useToast();
  const ALL = [
    { id: 'emma',     ip: '10.0.10.10', region: 'eu-north', status: 'online',  cpu: 23, containers: 4, owner: 'Tia',   load: [12, 18, 14, 22, 19, 26, 23] },
    { id: 'pia',      ip: '10.0.10.11', region: 'eu-north', status: 'online',  cpu: 51, containers: 2, owner: 'Emma',  load: [40, 44, 39, 48, 51, 47, 51] },
    { id: 'iris',     ip: '10.0.10.12', region: 'eu-west',  status: 'warning', cpu: 88, containers: 6, owner: 'Tia',   load: [70, 78, 82, 80, 86, 90, 88] },
    { id: 'miriam',   ip: '10.0.10.13', region: 'us-east',  status: 'online',  cpu: 34, containers: 3, owner: 'Pia',   load: [28, 30, 33, 31, 36, 34, 34] },
    { id: 'victoria', ip: '10.0.10.14', region: 'us-east',  status: 'offline', cpu: 0,  containers: 0, owner: 'Emma',  load: [20, 12, 8, 4, 0, 0, 0] },
    { id: 'embla',    ip: '10.0.10.15', region: 'eu-west',  status: 'online',  cpu: 47, containers: 5, owner: 'Tia',   load: [42, 45, 44, 48, 46, 49, 47] },
    { id: 'sigrid',   ip: '10.0.10.16', region: 'eu-north', status: 'warning', cpu: 76, containers: 4, owner: 'Pia',   load: [60, 64, 70, 72, 74, 78, 76] },
    { id: 'astrid',   ip: '10.0.10.17', region: 'us-west',  status: 'online',  cpu: 19, containers: 2, owner: 'Emma',  load: [16, 18, 15, 20, 17, 21, 19] },
  ];
  const statusVariant = { online: 'success', warning: 'warning', offline: 'error' };

  const columns = [
    { key: 'id', header: 'Host', sortable: true, render: (s) => (
      <div className="ds-row" style={{ gap: 9 }}>
        <span style={{ color: 'var(--tollerud-yellow)' }}><Icons.server size={15}/></span>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>{s.id}</div>
          <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.ip}</div>
        </div>
      </div>
    ) },
    { key: 'status', header: 'Status', sortable: true, render: (s) => <Badge variant={statusVariant[s.status]}>{s.status}</Badge> },
    { key: 'region', header: 'Region', sortable: true, render: (s) => <span className="ds-mono" style={{ fontSize: 12.5 }}>{s.region}</span> },
    { key: 'cpu', header: 'CPU', sortable: true, align: 'right', render: (s) => <span className="ds-mono" style={{ color: s.cpu > 80 ? 'var(--destructive)' : 'var(--text-secondary)' }}>{s.cpu}%</span> },
    { key: 'load', header: 'Load · 7d', render: (s) => <Sparkline data={s.load} w={84} h={26} color={s.status === 'offline' ? '#666' : s.cpu > 80 ? '#EF4444' : '#E8D500'}/> },
    { key: 'containers', header: 'Containers', sortable: true, align: 'right', render: (s) => <span className="ds-mono">{s.containers}</span> },
    { key: 'owner', header: 'Owner', sortable: true },
  ];

  return (
    <div>
      <PageHeader icon="server" eyebrow="Examples · data table" title="Data Table"
        lede="Config-driven table from @tollerud/ui: search, filters, sort, selection, bulk actions, per-row menus, pagination footer, loading skeletons, and horizontal scroll with pinned columns on narrow viewports."/>

      <Section title="Props" component="DataTable" desc="Auto-generated from DataTableProps in components/DataTable.tsx. Rich features activate when you pass searchable, selectable, pageSize, rowMenu, and related props."/>

      <Section title="Simple table" desc="Bordered table with sortable headers. Add filterable: true on columns for per-column text filters (simple mode).">
        <Demo name="package-data-table" variant="col" code={`<DataTable
  columns={[
    { key: 'hostname', label: 'Host', sortable: true },
    { key: 'status', label: 'Status', render: (_v, row) => (
      <Badge variant={row.status === 'online' ? 'success' : 'error'}>{row.status}</Badge>
    )},
  ]}
  data={hosts}
  rowKey="id"
/>`}>
          <div style={{ width: '100%' }}>
            <PackageDataTable
              columns={[
                { key: 'hostname', label: 'Host', sortable: true },
                {
                  key: 'status',
                  label: 'Status',
                  render: (_v, row) => (
                    <Badge variant={row.status === 'online' ? 'success' : 'error'}>{row.status}</Badge>
                  ),
                },
              ]}
              data={[
                { id: 'emma', hostname: 'emma.tollerud.no', status: 'online' },
                { id: 'pia', hostname: 'pia.tollerud.no', status: 'offline' },
                { id: 'iris', hostname: 'iris.tollerud.no', status: 'online' },
              ]}
              rowKey="id"
            />
          </div>
        </Demo>
      </Section>

      <Section title="Column filters" desc="Simple mode (no searchable / pageSize) adds a filter row under the headers. Rich mode uses global search and segmented filter instead.">
        <Demo name="data-table-filters" variant="col" code={`<DataTable
  columns={[
    { key: 'hostname', label: 'Host', sortable: true, filterable: true },
    { key: 'region', label: 'Region', sortable: true, filterable: true },
    { key: 'status', label: 'Status', filterable: true },
  ]}
  data={hosts}
  rowKey="id"
/>`}>
          <PackageDataTable
            columns={[
              { key: 'hostname', label: 'Host', sortable: true, filterable: true },
              { key: 'region', label: 'Region', sortable: true, filterable: true },
              {
                key: 'status',
                label: 'Status',
                filterable: true,
                render: (_v, row) => (
                  <Badge variant={row.status === 'online' ? 'success' : 'error'}>{row.status}</Badge>
                ),
              },
            ]}
            data={ALL}
            rowKey="id"
          />
        </Demo>
      </Section>

      <Section title="Filter control" desc="Rich-mode filter uses Segmented by default. Set filter.variant to combobox for a searchable dropdown — better when there are many values or on narrow viewports.">
        <div className="ds-stack" style={{ gap: 28 }}>
          <div>
            <SubHead>Segmented (default)</SubHead>
            <Demo name="data-table-filter-segmented" variant="col" code={`filter={{ key: 'region', allLabel: 'All regions' }}
// variant defaults to 'segmented'`}>
              <PackageDataTable
                data={ALL}
                rowKey="id"
                columns={[
                  { key: 'id', label: 'Host', sortable: true },
                  { key: 'region', label: 'Region', sortable: true },
                  { key: 'status', label: 'Status', sortable: true },
                ]}
                searchable
                searchKeys={['id']}
                filter={{ key: 'region', allLabel: 'All regions' }}
                pageSize={5}
              />
            </Demo>
          </div>
          <div>
            <SubHead>Combobox</SubHead>
            <Demo name="data-table-filter-combobox" variant="col" code={`filter={{
  key: 'region',
  allLabel: 'All regions',
  variant: 'combobox',
  placeholder: 'Filter region…',
}}`}>
              <PackageDataTable
                data={ALL}
                rowKey="id"
                columns={[
                  { key: 'id', label: 'Host', sortable: true },
                  { key: 'region', label: 'Region', sortable: true },
                  { key: 'owner', label: 'Owner', sortable: true },
                ]}
                searchable
                searchKeys={['id', 'owner']}
                filter={{
                  key: 'region',
                  allLabel: 'All regions',
                  variant: 'combobox',
                  placeholder: 'Filter region…',
                }}
                pageSize={5}
                pinColumns
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section title="Servers" desc="Full rich table — the canonical pattern for homelab and ops lists.">
        <Demo name="servers-data-table" variant="col" code={SERVERS_CODE}>
          <PackageDataTable
            data={ALL}
            rowKey="id"
            columns={columns}
            searchable
            searchKeys={['id', 'ip', 'owner']}
            searchPlaceholder="Search host, ip, owner…"
            filter={{ key: 'region', allLabel: 'All regions' }}
            selectable
            pageSize={5}
            striped
            pinColumns
            toolbarRight={<Button variant="terminal" size="sm" onClick={() => toast({ tone: 'accent', title: 'Provisioning new host…' })}><Icons.plus size={14}/>add_host</Button>}
            bulkActions={[
              { label: 'Restart', icon: <Icons.refresh size={13}/>, variant: 'ghost', onRun: (ids, clear) => { toast({ tone: 'success', title: `Restarting ${ids.length} hosts` }); clear(); } },
              { label: 'Stop', icon: <Icons.trash size={13}/>, variant: 'destructive', onRun: (ids, clear) => { toast({ tone: 'error', title: `Stopped ${ids.length} hosts` }); clear(); } },
            ]}
            rowMenu={(s) => [
              { label: 'Connect (SSH)', icon: <Icons.external size={14}/>, onSelect: () => toast({ tone: 'info', title: `Connecting to ${s.id}…` }) },
              { label: 'Restart', icon: <Icons.refresh size={14}/>, onSelect: () => toast({ tone: 'success', title: `${s.id} restarting` }) },
              { sep: true },
              { label: 'Stop host', icon: <Icons.trash size={14}/>, onSelect: () => toast({ tone: 'error', title: `${s.id} stopped` }) },
            ]}
            emptyState={<EmptyState icon="search" title="No hosts found" description="No hosts match your search and filter. Try clearing them."/>}
          />
        </Demo>
      </Section>

      <Section title="Loading and footer" desc="Pass loading for skeleton rows. Use footer for extra controls beside pagination.">
        <div className="ds-stack" style={{ gap: 28 }}>
          <div>
            <SubHead>Loading</SubHead>
            <Demo name="data-table-loading" variant="col" code={`<DataTable
  loading
  skeletonRows={4}
  columns={[{ key: 'host', label: 'Host' }, { key: 'status', label: 'Status' }]}
  data={[]}
  searchable
  pageSize={5}
/>`}>
              <PackageDataTable
                loading
                skeletonRows={4}
                columns={[
                  { key: 'id', label: 'Host' },
                  { key: 'status', label: 'Status' },
                  { key: 'region', label: 'Region' },
                ]}
                data={[]}
                searchable
                pageSize={5}
              />
            </Demo>
          </div>
          <div>
            <SubHead>Footer slot</SubHead>
            <Demo name="data-table-footer" variant="col" code={`<DataTable
  data={hosts}
  rowKey="id"
  pageSize={3}
  columns={[{ key: 'hostname', label: 'Host', sortable: true }]}
  footer={<Button variant="ghost" size="sm">Export CSV</Button>}
/>`}>
              <PackageDataTable
                data={ALL.slice(0, 6)}
                rowKey="id"
                pageSize={3}
                columns={[
                  { key: 'id', label: 'Host', sortable: true },
                  { key: 'region', label: 'Region', sortable: true },
                ]}
                footer={<Button variant="ghost" size="sm" onClick={() => toast({ tone: 'info', title: 'Export started' })}><Icons.download size={14}/>Export CSV</Button>}
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section title="Mobile and horizontal scroll" desc="On narrow viewports the table scrolls horizontally inside a focusable region. pinColumns (default in rich mode) keeps the first column and row ⋮ menu visible while you scroll — WCAG allows horizontal scroll for data tables when content cannot reflow.">
        <Alert tone="info" title="Design note">
          Prefer fewer columns on mobile when you can. When comparison matters, horizontal scroll with a pinned anchor column beats squashing cells or hiding critical context.
        </Alert>
        <Demo name="data-table-mobile" variant="col" code={`<div className="max-w-[320px]">
  <DataTable
    data={hosts}
    rowKey="id"
    columns={[…]}
    searchable
    selectable
    pageSize={4}
    rowMenu={(row) => [{ label: 'View', onSelect: () => {} }]}
    pinColumns
  />
</div>`}>
          <div style={{ maxWidth: 320, width: '100%', border: '1px dashed var(--border)', borderRadius: 8, padding: 8 }}>
            <PackageDataTable
              data={ALL}
              rowKey="id"
              columns={columns}
              searchable
              searchKeys={['id', 'owner']}
              selectable
              pageSize={4}
              striped
              pinColumns
              rowMenu={(s) => [
                { label: 'SSH', onSelect: () => toast({ tone: 'info', title: s.id }) },
                { label: 'Restart', onSelect: () => toast({ tone: 'success', title: s.id }) },
              ]}
            />
          </div>
        </Demo>
      </Section>
    </div>
  );
}
export default PageServers;
