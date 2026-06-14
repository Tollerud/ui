'use client'
import React from 'react'
import * as __p from '@/lib/provide-pages'
const {
  Button, Card, Badge, StatusDot, Input, Switch, FormRow,
  DashboardShell, SettingsLayout, FormPanel,
  ResourceList, DetailPage,
  Stack, Cluster, CardGrid,
  Demo, CodeSnippet, PageHeader, Section, Alert, Icons,
} = __p

/* @tollerud/ui docs — Agent-safe recipes (component-first screen compositions) */

function ExampleLink({ go, id, children }) {
  return (
    <button type="button" className="tollerud-btn tollerud-btn--ghost tollerud-btn--sm" onClick={() => go(id)}>
      {children}
      <Icons.arrowRight size={14} />
    </button>
  )
}

function PageRecipes({ go }) {
  const featureItems = [
    { icon: <Icons.zap size={18} />, title: 'Fast deploys', description: 'Roll out compose changes with health checks.' },
    { icon: <Icons.shield size={18} />, title: 'Guarded actions', description: 'Review risky operations before they run.' },
    { icon: <Icons.activity size={18} />, title: 'Quiet telemetry', description: 'Surface useful state without alert fatigue.' },
  ]

  return (
    <div>
      <PageHeader
        icon="code"
        eyebrow="Start"
        title="Recipes"
        lede="Copy-paste, component-first screen compositions for consumer apps. Each recipe uses exported layout primitives and screen patterns — not raw Tailwind page structure. Full interactive examples live on linked docs pages."
      />

      <Section
        title="How to use these"
        desc="Start from a recipe, paste into a feature route, then customize props and children. Reserve Tailwind for small local glue only."
      >
        <Alert tone="accent" title="Component-first by default">
          Use @tollerud/ui components and screen patterns first. If a recipe links to a fuller example page, treat that page as the live reference — the recipe is the minimal copy-paste starting point.
        </Alert>
        <div className="ds-row" style={{ gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <ExampleLink go={go} id="layout">Layout primitives</ExampleLink>
          <ExampleLink go={go} id="screens">Screen patterns</ExampleLink>
          <ExampleLink go={go} id="getting-started">Consumer styling policy</ExampleLink>
        </div>
      </Section>

      <Section
        title="Marketing landing page"
        permalink="recipes/marketing-landing"
        desc="PageShell + HeroBlock + FeatureSection + CTABand + Footer. Blocks page has live section demos for each piece."
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
        <div style={{ marginTop: 14 }}>
          <ExampleLink go={go} id="blocks">See Blocks — hero, features, pricing, CTA</ExampleLink>
        </div>
      </Section>

      <Section
        title="Dashboard overview"
        permalink="recipes/dashboard-overview"
        desc="DashboardShell frames the app; StatsSection and infra cards fill the main area. Mission Control is the full interactive reference."
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
      navItems={[
        { label: 'Overview', href: '/', active: true },
        { label: 'Hosts', href: '/hosts' },
        { label: 'Logs', href: '/logs' },
      ]}
      topActions={<Button size="sm" variant="primary">Deploy</Button>}
      sidebar={
        <Stack gap="sm">
          <Button variant="ghost">Hosts</Button>
          <Button variant="ghost">Alerts</Button>
          <Button variant="ghost">Settings</Button>
        </Stack>
      }
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
        <div style={{ marginTop: 14 }}>
          <ExampleLink go={go} id="mission-control">See Mission Control — live dashboard</ExampleLink>
        </div>
      </Section>

      <Section
        title="Settings page"
        permalink="recipes/settings-page"
        desc="SettingsLayout + FormPanel. The Settings example page adds avatar upload, danger zone, and a sticky save bar on top of the same structure."
      >
        <Demo
          name="settings-recipe"
          variant="col"
          code={`<SettingsLayout
  title="Settings"
  description="Manage workspace defaults."
  navItems={[
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
  ]}
  activeId="profile"
>
  <FormPanel
    title="Profile"
    description="Shown in audit trails."
    footer={<Cluster justify="end"><Button variant="primary">Save</Button></Cluster>}
  >
    <Input label="Workspace name" defaultValue="Mission Control" />
    <FormRow label="Require approvals" hint="Ask before risky actions.">
      <Switch defaultChecked />
    </FormRow>
  </FormPanel>
</SettingsLayout>`}
        >
          <SettingsLayout
            title="Settings"
            description="Manage workspace defaults."
            navItems={[
              { id: 'profile', label: 'Profile' },
              { id: 'security', label: 'Security' },
            ]}
            activeId="profile"
          >
            <FormPanel
              title="Profile"
              description="Shown in audit trails."
              footer={<Cluster justify="end"><Button variant="primary">Save</Button></Cluster>}
            >
              <Stack gap="md">
                <Input label="Workspace name" defaultValue="Mission Control" />
                <FormRow label="Require approvals" hint="Ask before risky actions.">
                  <Switch defaultChecked />
                </FormRow>
              </Stack>
            </FormPanel>
          </SettingsLayout>
        </Demo>
        <div style={{ marginTop: 14 }}>
          <ExampleLink go={go} id="settings">See Settings — full account screen</ExampleLink>
        </div>
      </Section>

      <Section
        title="Auth page"
        permalink="recipes/auth-page"
        desc="FormPanel inside PageShell for a minimal sign-in route. The Sign in example adds grain gradient, OAuth, and terminal typewriter for a cinematic auth surface."
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
        <div style={{ marginTop: 14 }}>
          <ExampleLink go={go} id="auth">See Sign in — cinematic split layout</ExampleLink>
        </div>
      </Section>

      <Section
        title="Empty state page"
        permalink="recipes/empty-state-page"
        desc="EmptyPage wraps EmptyState in a full-page shell. Onboarding has more empty-state variants and a setup wizard."
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
        <div style={{ marginTop: 14 }}>
          <ExampleLink go={go} id="onboarding">See Onboarding — wizard + empty-state gallery</ExampleLink>
        </div>
      </Section>

      <Section
        title="Detail page"
        permalink="recipes/detail-page"
        desc="DetailPage composes PageHeader, primary content, and an optional aside. Use Split ratio presets instead of hand-built two-column grids."
      >
        <Demo
          name="detail-recipe"
          variant="col"
          code={`<DetailPage
  eyebrow="host"
  title="emma.tollerud.no"
  description="Primary production host."
  actions={<Button variant="terminal">ssh emma</Button>}
  aside={<Card><StatusDot status="online" label="SSH connected" /></Card>}
>
  <Card>Logs, metrics, and configuration.</Card>
</DetailPage>`}
        >
          <DetailPage
            eyebrow="host"
            title="emma.tollerud.no"
            description="Primary production host."
            actions={<Button variant="terminal">ssh emma</Button>}
            aside={<Card><StatusDot status="online" label="SSH connected" /></Card>}
          >
            <Card>Logs, metrics, and configuration.</Card>
          </DetailPage>
        </Demo>
      </Section>

      <Section
        title="List / table page"
        permalink="recipes/list-table-page"
        desc="ResourceList wraps the page header, filters, and table body. Data Table example shows search, bulk actions, and pagination on the same DataTable primitive."
      >
        <Demo
          name="list-recipe"
          variant="col"
          code={`<ResourceList
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
</ResourceList>`}
        >
          <ResourceList
            title="Hosts"
            description="Machines connected to Tollerud."
            count="3 hosts"
            actions={<Button variant="primary">Connect host</Button>}
            filters={<Input label="Search" placeholder="emma" />}
          >
            <CardGrid columns={3}>
              <Card><StatusDot status="online" label="emma" /></Card>
              <Card><StatusDot status="warning" label="iris" /></Card>
              <Card><StatusDot status="idle" label="pia" /></Card>
            </CardGrid>
          </ResourceList>
        </Demo>
        <div style={{ marginTop: 14 }}>
          <ExampleLink go={go} id="data-table">See Data Table — full table pattern</ExampleLink>
        </div>
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
        <p style={{ marginTop: 14, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          Full policy and setup notes live on <button type="button" className="tollerud-btn tollerud-btn--ghost tollerud-btn--sm" onClick={() => go('getting-started')}>Getting started</button>.
        </p>
      </Section>
    </div>
  )
}

export default PageRecipes
