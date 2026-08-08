'use client'
/* eslint-disable no-unused-vars -- intentionally over-broad shared import; see docs-app/lib/provide-pages.js */
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, StatusDot, Switch, Input, FormRow, PackagePageHeader, TopNav, TopNavAction, Avatar, SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, DashboardShell, SettingsLayout, FormPanel, ResourceList, DetailPage, EmptyPage, FeatureSection, StatsSection, Stack, Cluster, CardGrid, Demo, CodeSnippet, PageHeader, Section, Icons } = __p
/* eslint-enable no-unused-vars */

/* @tollerud/ui docs — Screen patterns */

function PageScreens({ go }) {
  const [settingsTab, setSettingsTab] = useState('profile')
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
        lede="Component-level API reference with live demos for each screen pattern export. For copy-paste full-page files, see Recipes — snippets only, no duplicate demos here."
      />

      {go && (
        <div className="ds-row" style={{ gap: 12, marginBottom: 24 }}>
          <Button variant="secondary" size="sm" onClick={() => go('recipes')}>
            Recipes — agent-safe screen compositions
            <Icons.arrowRight size={14} />
          </Button>
        </div>
      )}

      <Section title="PageHeader" component="PageHeader" permalink="screens/page-header" desc="A consistent page title block with eyebrow, description, metadata, and action slots.">
        <Demo name="page-header" variant="col" code={`<PageHeader
  title="Keep beer prices honest."
  shimmer="honest"
/>

<PageHeader
  title="What does beer really cost — store by store."
  shimmer="really"
/>

<PageHeader
  eyebrow="mission control"
  title="Hosts online"
  shimmer="online"
  description="Monitor machines, containers, and incidents from one view."
/>`}>
          <Stack gap="lg">
            <PackagePageHeader
              title="Keep beer prices honest."
              shimmer="honest"
            />
            <PackagePageHeader
              title="What does beer really cost — store by store."
              shimmer="really"
            />
            <PackagePageHeader
              eyebrow="mission control"
              title="Hosts online"
              shimmer="online"
              description="Monitor machines, containers, and incidents from one view."
              actions={<Button variant="primary">Connect host</Button>}
              meta={<Badge variant="success">3 online</Badge>}
            />
          </Stack>
        </Demo>
      </Section>

      <Section title="TopNav" component="TopNav" permalink="screens/top-nav" desc="Branded monogram lockup with nav links and actions. Below lg, links and menu actions open in a modal overlay with backdrop; wrap actions in TopNavAction to keep a primary CTA inline next to the menu toggle. TopNavItem accepts an optional icon, shown in dropdown/mobile rows (not the top bar), and an optional onClick — renders the row as a button instead of a link, for actions like sign out (ignored if href is set). Desktop flyout groups (items) show a small indicator caret tracking the open trigger. Pass mobileMenuSections for labeled row groups appended to the mobile sheet (e.g. an account section) — styled consistently, no hand-rolled dividers needed. Pass userMenu for a single account/user menu rendered from one data structure — a DropdownMenu next to the desktop actions, and the same sections appended to the mobile sheet automatically, so the two can't drift out of sync. Pass mobileMenuExtra for anything more custom, injected at the very bottom of the mobile sheet, separated by a divider — consumer controls all markup.">
        <Demo name="top-nav" variant="col" code={`<TopNav
  projectName="Mission Control"
  maxWidth="default"
  navItems={[
    { label: 'Overview', href: '/', active: true },
    { label: 'Hosts', href: '/hosts' },
  ]}
  actions={
    <>
      <TopNavAction mobile="inline">
        <Button size="sm" variant="primary">Deploy</Button>
      </TopNavAction>
      <TopNavAction mobile="menu">
        <Button size="sm" variant="secondary">Sign in</Button>
      </TopNavAction>
    </>
  }
/>`}>
          <TopNav
            sticky={false}
            maxWidth="default"
            projectName="Mission Control"
            navItems={[
              { label: 'Overview', href: '#', active: true },
              { label: 'Hosts', href: '#' },
              { label: 'Logs', href: '#' },
              { label: 'Services', items: [
                { label: 'API', href: '#', icon: <Icons.server size={15} /> },
                { label: 'Worker', href: '#', icon: <Icons.cpu size={15} /> },
                { label: 'Scheduler', href: '#', icon: <Icons.clock size={15} /> },
              ] },
            ]}
            actions={
              <>
                <TopNavAction mobile="inline">
                  <Button size="sm" variant="primary">Deploy</Button>
                </TopNavAction>
                <TopNavAction mobile="menu">
                  <Button size="sm" variant="secondary">Sign in</Button>
                </TopNavAction>
              </>
            }
            className="rounded-lg border border-tollerud-border"
          />
        </Demo>
        <Demo name="top-nav-mobile-extra" variant="col" desc="mobileMenuExtra — extra slot at the bottom of the mobile sheet" code={`<TopNav
  projectName="Mission Control"
  navItems={[{ label: 'Overview', href: '/', active: true }]}
  mobileMenuExtra={
    <p className="text-sm text-tollerud-text-muted">Signed in as ops@tollerud.dev</p>
  }
/>`}>
          <TopNav
            sticky={false}
            projectName="Mission Control"
            navItems={[
              { label: 'Overview', href: '#', active: true },
              { label: 'Hosts', href: '#' },
            ]}
            mobileMenuExtra={
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Signed in as ops@tollerud.dev</p>
            }
            className="rounded-lg border border-tollerud-border"
          />
        </Demo>
        <Demo name="top-nav-mobile-sections" variant="col" desc="icon + mobileMenuSections + onClick — labeled row groups in the mobile sheet, styled consistently; onClick renders a row as a button instead of a link, e.g. sign out (open on a narrow viewport to see it)" code={`<TopNav
  projectName="Mission Control"
  navItems={[
    { label: 'Overview', href: '/', active: true, icon: <Icons.home size={15} /> },
    { label: 'Hosts', href: '/hosts', icon: <Icons.server size={15} /> },
  ]}
  mobileMenuSections={[
    {
      label: 'Account',
      items: [
        { label: 'Settings', href: '/settings', icon: <Icons.settings size={15} /> },
        { label: 'Sign out', onClick: handleSignOut, icon: <Icons.logout size={15} /> },
      ],
    },
  ]}
/>`}>
          <TopNav
            sticky={false}
            projectName="Mission Control"
            navItems={[
              { label: 'Overview', href: '#', active: true, icon: <Icons.home size={15} /> },
              { label: 'Hosts', href: '#', icon: <Icons.server size={15} /> },
            ]}
            mobileMenuSections={[
              {
                label: 'Account',
                items: [
                  { label: 'Settings', href: '#', icon: <Icons.settings size={15} /> },
                  { label: 'Sign out', onClick: () => alert('Signed out (demo)'), icon: <Icons.logout size={15} /> },
                ],
              },
            ]}
            className="rounded-lg border border-tollerud-border"
          />
        </Demo>
        <Demo name="top-nav-user-menu" variant="col" desc="userMenu — one data structure rendered as a desktop DropdownMenu and appended to the mobile sheet's sections, so the two can't drift out of sync (open on a narrow viewport to see the mobile side)" code={`<TopNav
  projectName="Mission Control"
  navItems={[{ label: 'Overview', href: '/', active: true }]}
  userMenu={{
    trigger: (
      <>
        <span className="text-sm text-tollerud-text-secondary">Ada</span>
        <Avatar name="Ada Lovelace" size="sm" />
      </>
    ),
    triggerLabel: 'Account menu',
    sections: [
      {
        label: 'Account',
        items: [
          { label: 'Settings', href: '/settings', icon: <Icons.settings size={15} /> },
          { label: 'Sign out', onClick: handleSignOut, icon: <Icons.logout size={15} /> },
        ],
      },
    ],
  }}
/>`}>
          <TopNav
            sticky={false}
            projectName="Mission Control"
            navItems={[{ label: 'Overview', href: '#', active: true }]}
            userMenu={{
              trigger: (
                <>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Ada</span>
                  <Avatar name="Ada Lovelace" size="sm" />
                </>
              ),
              triggerLabel: 'Account menu',
              sections: [
                {
                  label: 'Account',
                  items: [
                    { label: 'Settings', href: '#', icon: <Icons.settings size={15} /> },
                    { label: 'Sign out', onClick: () => alert('Signed out (demo)'), icon: <Icons.logout size={15} /> },
                  ],
                },
              ],
            }}
            className="rounded-lg border border-tollerud-border"
          />
        </Demo>
      </Section>

      <Section title="Sidebar" component="Sidebar" permalink="screens/sidebar" desc="Collapsible sidebar primitive family — SidebarProvider owns expand/collapse state (Cmd/Ctrl+B toggles by default) and exposes it via useSidebar(). Sidebar renders a sticky rail on desktop and a Sheet-based off-canvas panel on mobile — both inherit real focus-trap/Escape handling from Sheet. collapsible=&quot;icon&quot; collapses to an icon-only rail; SidebarMenuButton's tooltip prop then shows on hover/focus. DashboardShell is built on this primitive — reach for Sidebar directly when you need a custom shell.">
        <Demo
          name="sidebar"
          variant="col"
          code={`<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <span className="text-sm font-semibold">Mission Control</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Servers</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive icon={<Icons.server size={15} />} tooltip="Emma">
                Emma
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton icon={<Icons.server size={15} />} tooltip="Pia">
                Pia
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <div className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <SidebarTrigger />
      <span className="text-sm text-tollerud-text-muted">Cmd/Ctrl+B also toggles</span>
    </div>
    {/* page content */}
  </SidebarInset>
</SidebarProvider>`}
        >
          <SidebarProvider
            className="min-h-[360px] overflow-hidden rounded-lg border border-tollerud-border"
            style={{ '--sidebar-height': '360px' }}
          >
            <Sidebar collapsible="icon">
              <SidebarHeader>
                <span className="text-sm font-semibold text-tollerud-text-primary">Mission Control</span>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Servers</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive icon={<Icons.server size={15} />} tooltip="Emma">
                          Emma
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton icon={<Icons.server size={15} />} tooltip="Pia">
                          Pia
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <SidebarInset>
              <div className="flex h-14 shrink-0 items-center gap-3 border-b border-tollerud-border px-4">
                <SidebarTrigger />
                <span className="text-sm text-tollerud-text-muted">Cmd/Ctrl+B also toggles</span>
              </div>
              <div className="p-4 text-sm text-tollerud-text-secondary">Page content goes here.</div>
            </SidebarInset>
          </SidebarProvider>
        </Demo>
      </Section>

      <Section title="DashboardShell" component="DashboardShell" permalink="screens/dashboard-shell" desc="Docs-aligned app shell: sidebar brand lockup, structured nav, context top bar, and main content. The sidebar stays pinned while the content scrolls on lg+ (≥ 4.8.41 — earlier versions scrolled it away: PageShell's overflow-hidden root disabled sticky for all descendants, and the flex row stretched the sidebar to full content height). Use variant=&quot;topnav&quot; for the legacy horizontal TopNav layout. Pass showMobileLogo={false} to hide the mobile monogram when the consumer renders its own logo.">
        <Demo
          name="dashboard-shell"
          variant="col"
          code={`<DashboardShell
  projectName="Mission Control"
  projectSubtitle="fleet control"
  pageTitle="Overview"
  sidebarItems={[
    { id: 'overview', label: 'Overview', href: '/', active: true, icon: <Icons.app size={15} /> },
    { id: 'hosts', label: 'Hosts', href: '/hosts', icon: <Icons.server size={15} /> },
    { id: 'logs', label: 'Logs', href: '/logs', icon: <Icons.terminal size={15} /> },
  ]}
  topActions={<Button size="sm" variant="primary">Deploy</Button>}
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
            projectSubtitle="fleet control"
            pageTitle="Overview"
            sidebarItems={[
              { id: 'overview', label: 'Overview', href: '#', active: true, icon: <Icons.app size={15} /> },
              { id: 'hosts', label: 'Hosts', href: '#', icon: <Icons.server size={15} /> },
              { id: 'logs', label: 'Logs', href: '#', icon: <Icons.terminal size={15} /> },
            ]}
            topActions={<Button size="sm" variant="primary">Deploy</Button>}
            header={<PackagePageHeader title="Overview" description="Fleet health at a glance." />}
            className="min-h-[420px] overflow-hidden rounded-lg border border-tollerud-border"
            style={{ '--sidebar-height': '420px' }}
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

      <Section title="SettingsLayout + FormPanel" component="SettingsLayout" permalink="screens/settings-form" desc="Settings pages get section navigation, page header, form surfaces, and footer actions. Pass onNavSelect for client-side section switching.">
        <Demo name="settings-form" variant="col" code={`<SettingsLayout
  title="Account settings"
  description="Manage profile and security preferences."
  navItems={[{ id: 'profile', label: 'Profile' }, { id: 'security', label: 'Security' }]}
  activeId={activeId}
  onNavSelect={setActiveId}
>
  <FormPanel title="Profile" description="Shown in activity logs."
    footer={<Cluster justify="end"><Button variant="primary">Save changes</Button></Cluster>}>
    <Input label="Display name" defaultValue="Tia Tollerud" />
    <FormRow label="Require approvals" hint="Ask before risky actions.">
      <Switch defaultChecked />
    </FormRow>
  </FormPanel>
</SettingsLayout>`}>
          <SettingsLayout
            title="Account settings"
            description="Manage profile and security preferences."
            navItems={[{ id: 'profile', label: 'Profile' }, { id: 'security', label: 'Security' }]}
            activeId={settingsTab}
            onNavSelect={setSettingsTab}
          >
            {settingsTab === 'profile' ? (
              <FormPanel title="Profile" description="Shown in activity logs."
                footer={<Cluster justify="end"><Button variant="primary">Save changes</Button></Cluster>}>
                <Stack gap="md">
                  <Input label="Display name" defaultValue="Tia Tollerud" />
                  <FormRow label="Require approvals" hint="Ask before risky actions.">
                    <Switch defaultChecked />
                  </FormRow>
                </Stack>
              </FormPanel>
            ) : (
              <FormPanel title="Security" description="Authentication and session controls."
                footer={<Cluster justify="end"><Button variant="primary">Save changes</Button></Cluster>}>
                <FormRow label="Two-factor auth" hint="Require a TOTP code at sign-in.">
                  <Switch label="Enabled" defaultChecked />
                </FormRow>
              </FormPanel>
            )}
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
