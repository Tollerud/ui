'use client'
import React from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, CodeSnippet, PageHeader, Section, Alert, Icons } = __p

/* @tollerud/ui docs — Agent-safe recipes (component-first screen compositions) */

function ExampleLink({ go, id, children }) {
  return (
    <Button variant="secondary" size="sm" onClick={() => go(id)}>
      {children}
      <Icons.arrowRight size={14} />
    </Button>
  )
}

function RecipeLinks({ go, links }) {
  return (
    <div className="ds-row" style={{ gap: 12, flexWrap: 'wrap' }}>
      {links.map(({ id, label }) => (
        <ExampleLink key={id} go={go} id={id}>
          {label}
        </ExampleLink>
      ))}
    </div>
  )
}

function PageRecipes({ go }) {
  return (
    <div>
      <PageHeader
        icon="code"
        eyebrow="Start"
        title="Recipes"
        lede="Copy-paste, component-first screen compositions for consumer apps. Each recipe is a minimal file you can drop into a feature route — live component demos and prop reference live on Screen patterns."
      />

      <Section
        title="How to use these"
        desc="Paste a recipe into your app, customize props and children, then follow the Screen patterns link for the live demo and API details."
      >
        <Alert tone="accent" title="Recipes are snippets, not duplicates">
          Recipes stay code-only. Screen patterns holds the interactive demos for each export. Example pages (Mission Control, Settings, Data Table) show fuller product screens built from the same primitives.
        </Alert>
        <div className="ds-row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <ExampleLink go={go} id="layout">Layout primitives</ExampleLink>
          <ExampleLink go={go} id="screens">Screen patterns</ExampleLink>
          <ExampleLink go={go} id="getting-started">Consumer styling policy</ExampleLink>
        </div>
      </Section>

      <Section
        title="Marketing landing page"
        permalink="recipes/marketing-landing"
        desc="PageShell + HeroBlock + FeatureSection + CTABand + Footer."
      >
        <CodeSnippet
          name="marketing-landing.tsx"
          code={`import {
  PageShell, Section, Button, HeroBlock, FeatureSection,
  CTABand, Footer,
} from '@tollerud/ui'
import { Zap, Shield, Activity } from 'lucide-react'

const features = [
  { icon: <Zap size={18} />, title: 'Fast deploys', description: 'Roll out compose changes with health checks.' },
  { icon: <Shield size={18} />, title: 'Guarded actions', description: 'Review risky operations before they run.' },
  { icon: <Activity size={18} />, title: 'Quiet telemetry', description: 'Surface useful state without alert fatigue.' },
]

export function MarketingLandingPage() {
  return (
    <PageShell background="grid">
      <HeroBlock
        eyebrow="homelab control plane"
        title="Run your stack like production."
        description="Deploy, monitor and roll back from one keyboard-first console."
        actions={
          <>
            <Button variant="terminal">deploy --free</Button>
            <Button variant="secondary">Read the docs</Button>
          </>
        }
      />
      <Section>
        <FeatureSection
          eyebrow="why it works"
          title="Operate with guardrails"
          description="Common sections without raw utility grids."
          features={features}
        />
      </Section>
      <CTABand
        title="Ship your homelab like it matters."
        description="Free for one host. No card, no telemetry, no nonsense."
        actions={
          <>
            <Button variant="primary" size="lg">Get started</Button>
            <Button variant="terminal" size="lg">view_source</Button>
          </>
        }
      />
      <Footer />
    </PageShell>
  )
}`}
        />
        {go && (
          <RecipeLinks
            go={go}
            links={[
              { id: 'screens/featuresection-statssection', label: 'Screen patterns — FeatureSection' },
              { id: 'blocks', label: 'Blocks — hero, features, pricing, CTA' },
            ]}
          />
        )}
      </Section>

      <Section
        title="Dashboard overview"
        permalink="recipes/dashboard-overview"
        desc="Full dashboard route: DashboardShell frames the app; StatsSection and infra cards fill the main area."
      >
        <CodeSnippet
          name="dashboard-overview.tsx"
          code={`import {
  Button, Card, HostCard, PageHeader, StatsSection, Stack,
  DashboardShell,
} from '@tollerud/ui'

export function DashboardOverviewPage() {
  return (
    <DashboardShell
      projectName="Mission Control"
      projectSubtitle="fleet control"
      pageTitle="Overview"
      sidebarItems={[
        { id: 'overview', label: 'Overview', href: '/', active: true },
        { id: 'hosts', label: 'Hosts', href: '/hosts' },
        { id: 'logs', label: 'Logs', href: '/logs' },
      ]}
      topActions={<Button size="sm" variant="primary">Deploy</Button>}
      header={
        <PageHeader
          title="Overview"
          description="Fleet health at a glance."
        />
      }
    >
      <Stack gap="lg">
        <StatsSection
          title="Fleet health"
          stats={[
            { label: 'Hosts online', value: 3, accent: true },
            { label: 'Open alerts', value: 1 },
            { label: 'Deploys today', value: 12 },
          ]}
        />
        <Card>
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
        </Card>
      </Stack>
    </DashboardShell>
  )
}`}
        />
        {go && (
          <RecipeLinks
            go={go}
            links={[
              { id: 'screens/dashboard-shell', label: 'Screen patterns — DashboardShell' },
              { id: 'mission-control', label: 'Mission Control — live dashboard' },
            ]}
          />
        )}
      </Section>

      <Section
        title="Settings page"
        permalink="recipes/settings-page"
        desc="Minimal SettingsLayout + FormPanel starter for copy-paste. The Settings example page is a polished account demo with icons, sticky save bar, and extra sections — same information architecture, richer shell."
      >
        <CodeSnippet
          name="settings-page.tsx"
          code={`'use client'

import { useState } from 'react'
import {
  Button, Input, Switch, FormRow, Cluster, Stack,
  SettingsLayout, FormPanel,
} from '@tollerud/ui'

export function SettingsPage() {
  const [activeId, setActiveId] = useState('profile')

  return (
    <SettingsLayout
      title="Account settings"
      description="Manage profile and security preferences."
      navItems={[
        { id: 'profile', label: 'Profile' },
        { id: 'security', label: 'Security' },
      ]}
      activeId={activeId}
      onNavSelect={setActiveId}
    >
      {activeId === 'profile' && (
        <FormPanel
          title="Profile"
          description="Shown across the dashboard and in activity logs."
          footer={<Cluster justify="end"><Button variant="primary">Save changes</Button></Cluster>}
        >
          <Stack gap="md">
            <FormRow label="Display name">
              <Input defaultValue="Tia Tollerud" />
            </FormRow>
            <FormRow label="Email" hint="Used for sign-in and critical alerts.">
              <Input defaultValue="tia@tollerud.no" />
            </FormRow>
          </Stack>
        </FormPanel>
      )}
      {activeId === 'security' && (
        <FormPanel
          title="Security"
          description="Authentication and session controls."
          footer={<Cluster justify="end"><Button variant="primary">Save changes</Button></Cluster>}
        >
          <FormRow label="Two-factor auth" hint="Require a TOTP code at sign-in.">
            <Switch label="Enabled" defaultChecked />
          </FormRow>
        </FormPanel>
      )}
    </SettingsLayout>
  )
}`}
        />
        {go && (
          <RecipeLinks
            go={go}
            links={[
              { id: 'screens/settings-form', label: 'Screen patterns — SettingsLayout + FormPanel' },
              { id: 'settings', label: 'Settings — polished account demo' },
            ]}
          />
        )}
      </Section>

      <Section
        title="Auth page"
        permalink="recipes/auth-page"
        desc="FormPanel inside PageShell for a minimal sign-in route."
      >
        <CodeSnippet
          name="auth-page.tsx"
          code={`import {
  PageShell, Section, Button, Input, PasswordInput,
  FormPanel, Cluster,
} from '@tollerud/ui'

export function SignInPage() {
  return (
    <PageShell background="glow">
      <Section size="hero" width="narrow">
        <FormPanel
          title="Sign in to your account"
          description="Use your Tollerud credentials."
          footer={
            <Cluster justify="end">
              <Button variant="ghost">Request access</Button>
              <Button variant="primary">Sign in</Button>
            </Cluster>
          }
        >
          <Input label="Email" type="email" placeholder="tia@tollerud.no" />
          <PasswordInput label="Password" placeholder="••••••••" />
        </FormPanel>
      </Section>
    </PageShell>
  )
}`}
        />
        {go && (
          <RecipeLinks
            go={go}
            links={[
              { id: 'screens/settings-form', label: 'Screen patterns — FormPanel' },
              { id: 'auth', label: 'Sign in — cinematic split layout' },
            ]}
          />
        )}
      </Section>

      <Section
        title="Empty state page"
        permalink="recipes/empty-state-page"
        desc="EmptyPage wraps EmptyState in a full-page shell."
      >
        <CodeSnippet
          name="empty-state-page.tsx"
          code={`import { Button, EmptyPage } from '@tollerud/ui'

export function NoHostsPage() {
  return (
    <EmptyPage
      icon="server"
      title="No hosts connected"
      description="Connect your first machine and Tia will start watching it."
      action={<Button variant="primary">Connect a host</Button>}
      secondaryAction={<Button variant="ghost">Read docs</Button>}
    />
  )
}`}
        />
        {go && (
          <RecipeLinks
            go={go}
            links={[
              { id: 'components/empty-state', label: 'Components — EmptyState gallery' },
              { id: 'screens/empty-page', label: 'Screen patterns — EmptyPage' },
            ]}
          />
        )}
      </Section>

      <Section
        title="Detail page"
        permalink="recipes/detail-page"
        desc="DetailPage composes PageHeader, primary content, and an optional aside."
      >
        <CodeSnippet
          name="detail-page.tsx"
          code={`import { Button, Card, StatusDot, DetailPage } from '@tollerud/ui'

export function HostDetailPage() {
  return (
    <DetailPage
      eyebrow="host"
      title="emma.tollerud.no"
      description="Primary production host."
      actions={<Button variant="terminal">ssh emma</Button>}
      aside={<Card><StatusDot status="online" label="SSH connected" /></Card>}
    >
      <Card>Logs, metrics, and configuration.</Card>
    </DetailPage>
  )
}`}
        />
        {go && (
          <RecipeLinks
            go={go}
            links={[{ id: 'screens/resource-detail', label: 'Screen patterns — DetailPage' }]}
          />
        )}
      </Section>

      <Section
        title="List / table page"
        permalink="recipes/list-table-page"
        desc="ResourceList wraps the page header, filters, and table body."
      >
        <CodeSnippet
          name="list-table-page.tsx"
          code={`import { Button, Badge, Input, ResourceList, DataTable } from '@tollerud/ui'

const hosts = [
  { id: '1', hostname: 'emma', status: 'online' },
  { id: '2', hostname: 'iris', status: 'warning' },
  { id: '3', hostname: 'pia', status: 'idle' },
]

export function HostsListPage() {
  return (
    <ResourceList
      title="Hosts"
      description="Machines connected to Tollerud."
      count="3 hosts"
      actions={<Button variant="primary">Connect host</Button>}
      filters={<Input label="Search" placeholder="emma" />}
    >
      <DataTable
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
        data={hosts}
        rowKey="id"
        searchable
        pageSize={10}
      />
    </ResourceList>
  )
}`}
        />
        {go && (
          <RecipeLinks
            go={go}
            links={[
              { id: 'screens/resource-detail', label: 'Screen patterns — ResourceList' },
              { id: 'data-table', label: 'Data Table — full table pattern' },
            ]}
          />
        )}
      </Section>

      <Section
        title="Acceptable Tailwind glue"
        permalink="recipes/escape-hatch"
        desc="Small local spacing, alignment, or responsive visibility is fine. Do not rebuild branded structure with utilities."
      >
        <CodeSnippet
          name="allowed-glue.tsx"
          code={`import { Button, Card } from '@tollerud/ui'

export function DeployCard() {
  return (
    <Card>
      <p>Ready to deploy.</p>
      <div className="mt-6 flex justify-end">
        <Button variant="primary">Deploy</Button>
      </div>
    </Card>
  )
}`}
        />
        <CodeSnippet
          name="avoid-rebuilding.tsx"
          code={`// Avoid: bypasses Button variants, focus states, and brand tokens.
<button className="rounded-lg bg-yellow-400 px-4 py-2 text-black">
  Deploy
</button>

// Avoid: move repeated branded layout into @tollerud/ui
// or a semantic feature component.
<section className="min-h-screen bg-black px-6 py-24">
  <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
    {/* hand-built branded cards */}
  </div>
</section>`}
        />
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
          Full policy and setup notes live on{' '}
          <Button variant="secondary" size="sm" onClick={() => go('getting-started')}>Getting started</Button>.
        </p>
      </Section>
    </div>
  )
}

export default PageRecipes
