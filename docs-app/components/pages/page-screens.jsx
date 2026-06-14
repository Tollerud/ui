'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, StatusDot, Switch, Input, FormRow, PackagePageHeader, TopNav, DashboardShell, SettingsLayout, FormPanel, ResourceList, DetailPage, EmptyPage, FeatureSection, StatsSection, Stack, Cluster, CardGrid, Demo, CodeSnippet, PageHeader, Section, Icons } = __p

/* @tollerud/ui docs — Screen patterns */

function PageScreens({ go }) {
  const featureItems = [
    { icon: <Icons.zap size={18} />, title: 'Fast deploys', description: 'Roll out compose changes with health checks.' },
    { icon: <Icons.shield size={18} />, title: 'Guarded actions', description: 'Review risky operations before they run.' },
    { icon: <Icons.activity size={18} />, title: 'Quiet telemetry', description: 'Surface useful state without alert fatigue.' },
  ]

  return (
    <div>
      <PageHeader
        icon="app"
        eyebrow="Patterns"
        title="Screen patterns"
        lede="Full-page and section-level compositions for consumer apps. Use these before rebuilding branded page structure with raw Tailwind utilities. For copy-paste screen starting points, see Recipes."
      />

      {go && (
        <div className="ds-row" style={{ gap: 12, marginBottom: 24 }}>
          <button type="button" className="tollerud-btn tollerud-btn--ghost tollerud-btn--sm" onClick={() => go('recipes')}>
            Recipes — agent-safe screen compositions
            <Icons.arrowRight size={14} />
          </button>
        </div>
      )}

      <Section title="PageHeader" component="PageHeader" permalink="screens/page-header" desc="A consistent page title block with eyebrow, description, metadata, and action slots.">
        <Demo name="page-header" variant="col" code={`<PageHeader
  eyebrow="mission control"
  title="Hosts"
  description="Monitor machines, containers, and incidents from one view."
  actions={<Button variant="primary">Connect host</Button>}
  meta={<Badge variant="success">3 online</Badge>}
/>`}>
          <PackagePageHeader
            eyebrow="mission control"
            title="Hosts"
            description="Monitor machines, containers, and incidents from one view."
            actions={<Button variant="primary">Connect host</Button>}
            meta={<Badge variant="success">3 online</Badge>}
          />
        </Demo>
      </Section>

      <Section title="TopNav" component="TopNav" permalink="screens/top-nav" desc="The branded navigation lockup is built in: monogram plus project name, links, and action slots.">
        <Demo name="top-nav" variant="col" code={`<TopNav
  projectName="Mission Control"
  navItems={[
    { label: 'Overview', href: '/', active: true },
    { label: 'Hosts', href: '/hosts' },
  ]}
  actions={<Button size="sm" variant="primary">Deploy</Button>}
/>`}>
          <TopNav
            sticky={false}
            projectName="Mission Control"
            navItems={[
              { label: 'Overview', href: '#', active: true },
              { label: 'Hosts', href: '#' },
              { label: 'Logs', href: '#' },
            ]}
            actions={<Button size="sm" variant="primary">Deploy</Button>}
            className="rounded-lg border border-tollerud-border"
          />
        </Demo>
      </Section>

      <Section title="DashboardShell" component="DashboardShell" permalink="screens/dashboard-shell" desc="App shell with TopNav, optional sidebar, page header, and main content width/density presets.">
        <Demo
          name="dashboard-shell"
          variant="col"
          code={`<DashboardShell
  projectName="Mission Control"
  navItems={[{ label: 'Overview', href: '/', active: true }]}
  topActions={<Button size="sm" variant="primary">Deploy</Button>}
  sidebar={<Stack gap="sm"><Button variant="ghost">Hosts</Button><Button variant="ghost">Logs</Button></Stack>}
  header={<PageHeader title="Overview" description="Fleet health at a glance." />}
>
  <StatsSection stats={[
    { label: 'Hosts online', value: 3, accent: true },
    { label: 'Open alerts', value: 1 },
  ]} />
</DashboardShell>`}
        >
          <DashboardShell
            projectName="Mission Control"
            navItems={[{ label: 'Overview', href: '#', active: true }, { label: 'Hosts', href: '#' }]}
            topActions={<Button size="sm" variant="primary">Deploy</Button>}
            sidebar={<Stack gap="sm"><Button variant="ghost">Hosts</Button><Button variant="ghost">Logs</Button></Stack>}
            header={<PackagePageHeader title="Overview" description="Fleet health at a glance." />}
            className="min-h-[320px] rounded-lg border border-tollerud-border"
          >
            <StatsSection
              stats={[
                { label: 'Hosts online', value: 3, accent: true },
                { label: 'Open alerts', value: 1 },
              ]}
            />
          </DashboardShell>
        </Demo>
      </Section>

      <Section title="SettingsLayout + FormPanel" component="SettingsLayout" permalink="screens/settings-form" desc="Settings pages get section navigation, page header, form surfaces, and footer actions without rebuilding layout.">
        <Demo name="settings-form" variant="col" code={`<SettingsLayout
  title="Settings"
  description="Manage workspace defaults."
  navItems={[{ id: 'profile', label: 'Profile' }, { id: 'security', label: 'Security' }]}
  activeId="profile"
>
  <FormPanel title="Profile" description="Shown in audit trails."
    footer={<Cluster justify="end"><Button variant="primary">Save</Button></Cluster>}>
    <Input label="Workspace name" defaultValue="Mission Control" />
    <FormRow label="Require approvals" hint="Ask before risky actions.">
      <Switch defaultChecked />
    </FormRow>
  </FormPanel>
</SettingsLayout>`}>
          <SettingsLayout
            title="Settings"
            description="Manage workspace defaults."
            navItems={[{ id: 'profile', label: 'Profile' }, { id: 'security', label: 'Security' }]}
            activeId="profile"
          >
            <FormPanel title="Profile" description="Shown in audit trails."
              footer={<Cluster justify="end"><Button variant="primary">Save</Button></Cluster>}>
              <Stack gap="md">
                <Input label="Workspace name" defaultValue="Mission Control" />
                <FormRow label="Require approvals" hint="Ask before risky actions.">
                  <Switch defaultChecked />
                </FormRow>
              </Stack>
            </FormPanel>
          </SettingsLayout>
        </Demo>
      </Section>

      <Section title="ResourceList + DetailPage" component="ResourceList" permalink="screens/resource-detail" desc="List and detail pages share page-header structure, actions, filters, empty states, and optional aside columns.">
        <Demo name="resource-list" variant="col" code={`<ResourceList
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
</ResourceList>`}>
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
        <Demo
          name="detail-page"
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

      <Section title="EmptyPage" component="EmptyPage" permalink="screens/empty-page" desc="A full-page empty state composition for first-run, no-results, and error pages.">
        <Demo
          name="empty-page"
          variant="col"
          code={`<EmptyPage
  icon="server"
  title="No hosts connected"
  description="Connect your first machine and Tia will start watching it."
  action={<Button variant="primary">Connect a host</Button>}
  secondaryAction={<Button variant="ghost">Read docs</Button>}
/>`}
        >
          <div className="rounded-lg border border-tollerud-border overflow-hidden">
            <EmptyPage
              background="plain"
              icon="server"
              title="No hosts connected"
              description="Connect your first machine and Tia will start watching it."
              action={<Button variant="primary">Connect a host</Button>}
              secondaryAction={<Button variant="ghost">Read docs</Button>}
              className="min-h-[280px]"
            />
          </div>
        </Demo>
      </Section>

      <Section title="FeatureSection + StatsSection" component="FeatureSection" permalink="screens/featuresection-statssection" desc="Higher-level sections for marketing and dashboard overview pages.">
        <Demo name="feature-stats" variant="col" code={`<FeatureSection
  eyebrow="why it works"
  title="Operate with guardrails"
  description="Common sections without raw utility grids."
  features={features}
/>

<StatsSection
  title="Fleet health"
  stats={[
    { label: 'Hosts online', value: 3, accent: true },
    { label: 'Open alerts', value: 1 },
  ]}
/>`}>
          <FeatureSection
            eyebrow="why it works"
            title="Operate with guardrails"
            description="Common sections without raw utility grids."
            features={featureItems}
          />
          <StatsSection
            title="Fleet health"
            stats={[
              { label: 'Hosts online', value: 3, accent: true },
              { label: 'Open alerts', value: 1 },
              { label: 'Deploys today', value: 12 },
            ]}
          />
        </Demo>
      </Section>
    </div>
  )
}

export default PageScreens
