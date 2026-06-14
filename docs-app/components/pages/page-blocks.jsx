'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, CommandMenu } = __p

/* @tollerud/ui docs — Marketing blocks
   HeroBlock, FeatureCard, CTABand from @tollerud/ui; PricingCard from @tollerud/ui. */

function PageBlocks() {
  return (
    <div>
      <PageHeader icon="blocks" eyebrow="Blocks" title="Blocks"
        lede="Prebuilt, full-width page sections assembled from the primitives — a landing hero, feature grid, pricing table and closing CTA. Drop them in whole, or compose local feature sections around them."/>

      <Section title="Hero block" desc="A drop-in landing hero on the noir glow background, built with the reusable <HeroBlock>. Terminal CTA, supporting copy, optional media slot. Pass `intense` for the live WebGL grain atmosphere.">
        <HeroBlock eyebrow="homelab control plane" title="Run your stack like production."
          description="Deploy, monitor and roll back from one keyboard-first console. No dashboards you have to babysit."
          actions={<>
            <Button variant="terminal">deploy --free</Button>
            <Button variant="secondary">Read the docs</Button>
          </>}/>
      </Section>

      <Section title="Feature grid" desc="Three-up <FeatureCard>s with iconography. Yellow icon chips, terse technical copy.">
        <div className="ds-grid-3">
          {[
            { icon: 'zap', t: 'Instant deploys', d: 'Push a compose file and watch it roll out with health checks and automatic rollback.' },
            { icon: 'shield', t: 'Secrets, sealed', d: 'Encrypted at rest, injected at runtime. Nothing sensitive ever lands in a log.' },
            { icon: 'activity', t: 'Live telemetry', d: 'CPU, memory and network streamed in real time with sane, quiet alerting.' },
          ].map((f, i) => <FeatureCard key={i} icon={f.icon} title={f.t} description={f.d}/>)}
        </div>
      </Section>

      <Section title="Pricing" desc="Three tiers built with the reusable <PricingCard>; the middle plan is marked with an accent border and ribbon.">
        <div className="ds-price-grid">
          {[
            { name: 'Hobby', price: '$0', note: 'For a single host', feats: ['1 server', 'Community support', 'Manual deploys'], cta: 'Choose Hobby', variant: 'secondary' },
            { name: 'Homelab', price: '$12', note: 'Per month', feats: ['Unlimited servers', 'Live telemetry', 'Auto rollback', 'Command palette'], cta: 'Start free trial', featured: true },
            { name: 'Fleet', price: '$49', note: 'Per month', feats: ['Everything in Homelab', 'Multi-site', 'Audit log', 'Priority support'], cta: 'Choose Fleet', variant: 'secondary' },
          ].map((p, i) => (
            <PricingCard key={i} name={p.name} price={p.price} period={p.price === '$0' ? '' : '/mo'}
              priceNote={p.note} features={p.feats} recommended={p.featured} ribbon="Popular"
              cta={p.cta} ctaVariant={p.featured ? 'primary' : p.variant}/>
          ))}
        </div>
      </Section>

      <Section title="CTA band" desc="A closing call-to-action with the accent gradient bar, built with the reusable <CTABand>.">
        <CTABand title="Ship your homelab like it matters."
          description="Free for one host. No card, no telemetry, no nonsense."
          actions={<>
            <Button variant="primary" size="lg">Get started</Button>
            <Button variant="terminal" size="lg">view_source</Button>
          </>}/>
      </Section>

      <Section title="Footer" desc="Site footer with monogram lockup and attribution line. Exported from @tollerud/ui (also available as @tollerud/footer).">
        <Demo name="footer" variant="col" code={`<Footer labels={{ tollerudProject: 'A Tollerud Project', allRightsReserved: 'All rights reserved.' }} />`}>
          <Footer labels={{ tollerudProject: 'A Tollerud Project', allRightsReserved: 'All rights reserved.' }} />
        </Demo>
      </Section>

      <Section title="Bento dashboard" desc="Precomposed homelab overview — host cards, metrics, services and incidents in an asymmetric grid.">
        <Demo name="bento-dashboard" variant="col" code={`<BentoDashboard
  title="Mission Control"
  hosts={[{ hostname: 'emma', ip: '10.0.10.10', status: 'online', cpu: '23%', memory: '6.2/16 GB' }]}
  metrics={[{ label: 'Active sessions', value: 42, change: { value: '+12%', direction: 'up' } }]}
  services={[{ service: 'hermes', status: 'online', uptime: '14d', responseTime: '23ms' }]}
  incidents={[{ title: 'High CPU on emma', severity: 'high', timestamp: '14:32', service: 'emma' }]}
/>`}>
          <BentoDashboard
            title="Mission Control"
            hosts={[{ hostname: 'emma', ip: '10.0.10.10', status: 'online', cpu: '23%', memory: '6.2/16 GB', disk: '45%', uptime: '14d', containers: 4 }]}
            metrics={[{ label: 'Active sessions', value: 42, change: { value: '+12%', direction: 'up' } }]}
            services={[{ service: 'emma.tollerud.no', status: 'online', uptime: '14d 3h', responseTime: '23ms' }]}
            incidents={[{ title: 'High CPU on emma', severity: 'high', timestamp: '14:32', service: 'emma', description: 'CPU at 92% for 5 min' }]}
          />
        </Demo>
      </Section>
    </div>
  );
}
export default PageBlocks;