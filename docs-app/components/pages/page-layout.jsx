'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, StatusDot, CodeBlock, PageShell, LayoutSection, Stack, Cluster, Grid, CardGrid, ScrollRail, Split, MainContent, Demo, PageHeader, Section, Icons } = __p

/* @tollerud/ui docs — Layout primitives */

function PageLayout() {
  return (
    <div>
      <PageHeader
        icon="layers"
        eyebrow="Layout"
        title="Layout primitives"
        lede="Semantic page structure for consumer apps: shells, sections, stacks, clusters, grids, splits, and main content wrappers."
      />

      <Section
        title="PageShell + Section"
        component="PageShell"
        permalink="layout/page-shell"
        desc="Start pages with a dark shell and a semantic section instead of hand-writing page backgrounds and spacing. The inner content wrapper is always flex flex-col flex-1 — add className='flex flex-col min-h-screen' to the shell and the flex chain works: header stays top, footer sticks bottom. Use contentClassName to add extra classes to the inner wrapper."
      >
        <Demo name="page-shell" variant="col" code={`<PageShell background="grid">
  <Section size="hero">
    <Stack gap="lg">
      <Badge variant="accent">Phase 2</Badge>
      <h1>Build with components first.</h1>
      <p>Use Tailwind only for small local glue in consumer apps.</p>
      <Cluster>
        <Button variant="primary">Start</Button>
        <Button variant="secondary">Read policy</Button>
      </Cluster>
    </Stack>
  </Section>
</PageShell>`}>
          <PageShell as="div" background="grid" className="min-h-[340px] rounded-xl border border-tollerud-border">
            <LayoutSection size="sm">
              <Stack gap="lg">
                <Badge variant="accent">Phase 2</Badge>
                <Stack gap="sm">
                  <h2 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--foreground)', margin: 0 }}>Build with components first.</h2>
                  <p style={{ maxWidth: 520, color: 'var(--text-secondary)', margin: 0 }}>Use Tailwind only for small local glue in consumer apps.</p>
                </Stack>
                <Cluster>
                  <Button variant="primary">Start</Button>
                  <Button variant="secondary">Read policy</Button>
                </Cluster>
              </Stack>
            </LayoutSection>
          </PageShell>
        </Demo>
      </Section>

      <Section
        title="Stack + Cluster"
        component="Stack"
        permalink="layout/stack-cluster"
        desc="Use Stack for vertical rhythm and Cluster for wrapping action rows, chips, toolbars, and nav groups."
      >
        <Demo name="stack-cluster" code={`<Stack gap="lg">
  <Stack gap="sm">
    <h2>Production guardrails</h2>
    <p>Every action is logged and reversible.</p>
  </Stack>
  <Cluster gap="sm">
    <Badge variant="success">Online</Badge>
    <Badge variant="warning">Review required</Badge>
    <Button size="sm" variant="terminal">deploy --dry-run</Button>
  </Cluster>
</Stack>`}>
          <Card style={{ width: '100%', maxWidth: 540 }}>
            <Stack gap="lg">
              <Stack gap="sm">
                <h3 style={{ fontSize: 18, fontWeight: 650, color: 'var(--foreground)', margin: 0 }}>Production guardrails</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Every action is logged and reversible.</p>
              </Stack>
              <Cluster gap="sm">
                <Badge variant="success">Online</Badge>
                <Badge variant="warning">Review required</Badge>
                <Button size="sm" variant="terminal">deploy --dry-run</Button>
              </Cluster>
            </Stack>
          </Card>
        </Demo>
      </Section>

      <Section
        title="Grid + CardGrid"
        component="Grid"
        permalink="layout/grid-cardgrid"
        desc="Use Grid for generic responsive tracks and CardGrid for card collections with Tollerud spacing defaults."
      >
        <Demo name="card-grid" variant="col" code={`<CardGrid columns={3}>
  <Card><StatusDot status="online" label="Emma" /></Card>
  <Card><StatusDot status="warning" label="Iris" /></Card>
  <Card><StatusDot status="idle" label="Pia" /></Card>
</CardGrid>`}>
          <CardGrid columns={3}>
            <Card><StatusDot status="online" label="Emma" /></Card>
            <Card><StatusDot status="warning" label="Iris" /></Card>
            <Card><StatusDot status="idle" label="Pia" /></Card>
          </CardGrid>
        </Demo>
        <Demo name="generic-grid" variant="col" code={`<Grid columns="auto" gap="md">
  <CodeBlock code="systemctl status tollerud-agent" />
  <CodeBlock code="docker compose ps" />
</Grid>`}>
          <Grid columns="auto" gap="md">
            <CodeBlock code="systemctl status tollerud-agent" />
            <CodeBlock code="docker compose ps" />
          </Grid>
        </Demo>
      </Section>

      <Section
        title="ScrollRail"
        component="ScrollRail"
        permalink="layout/scroll-rail"
        desc="Horizontal scroll rail for card rows, image strips, and any overflow content. Continuous scroll with a peek of the next item, optional edge fades (default on), and optional prev/next controls (`controls` or `controls='auto'` when content overflows). Does not block vertical page scroll on touch."
      >
        <Demo
          name="scroll-rail-cards"
          variant="col"
          code={`<ScrollRail peek="md" itemWidth={260} controls="auto" ariaLabel="Featured hosts">
  <Card><StatusDot status="online" label="Emma" /></Card>
  <Card><StatusDot status="warning" label="Iris" /></Card>
  <Card><StatusDot status="idle" label="Pia" /></Card>
  <Card><StatusDot status="online" label="Miriam" /></Card>
</ScrollRail>`}
        >
          <ScrollRail peek="md" itemWidth={260} controls="auto" ariaLabel="Featured hosts">
            <Card><StatusDot status="online" label="Emma" /></Card>
            <Card><StatusDot status="warning" label="Iris" /></Card>
            <Card><StatusDot status="idle" label="Pia" /></Card>
            <Card><StatusDot status="online" label="Miriam" /></Card>
          </ScrollRail>
        </Demo>
        <Demo
          name="scroll-rail-images"
          variant="col"
          code={`<ScrollRail peek="sm" gap="sm" controls ariaLabel="Deployment photos">
  <img src="/photo-1.jpg" alt="Rack overview" className="h-28 w-44 rounded-lg object-cover" />
  <img src="/photo-2.jpg" alt="Cable management" className="h-28 w-44 rounded-lg object-cover" />
</ScrollRail>`}
        >
          <ScrollRail peek="sm" gap="sm" controls ariaLabel="Deployment photos">
            {['Rack overview', 'Cable management', 'PDU detail', 'Label pass'].map((label) => (
              <div
                key={label}
                className="flex h-28 w-44 shrink-0 items-end rounded-lg border border-tollerud-border/30 bg-tollerud-noir-800 p-3"
              >
                <span className="text-xs text-tollerud-text-secondary">{label}</span>
              </div>
            ))}
          </ScrollRail>
        </Demo>
      </Section>

      <Section
        title="Split + MainContent"
        component="Split"
        permalink="layout/split-maincontent"
        desc="Use Split for content/aside pages and MainContent for app routes that need consistent width, padding, and density."
      >
        <Demo name="split-main" variant="col" code={`<MainContent width="wide">
  <Split ratio="content">
    <Card>Primary content</Card>
    <Card accent>Aside</Card>
  </Split>
</MainContent>`}>
          <MainContent as="div" width="wide" spacing="none">
            <Split ratio="content">
              <Card>
                <Stack gap="sm">
                  <h3 style={{ fontSize: 18, fontWeight: 650, color: 'var(--foreground)', margin: 0 }}>Primary content</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>A wider column for tables, forms, or detail content.</p>
                </Stack>
              </Card>
              <Card accent>
                <Stack gap="sm">
                  <h3 style={{ fontSize: 18, fontWeight: 650, color: 'var(--foreground)', margin: 0 }}>Aside</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>A narrower panel for metadata, actions, or status.</p>
                </Stack>
              </Card>
            </Split>
          </MainContent>
        </Demo>
      </Section>
    </div>
  )
}

export default PageLayout
