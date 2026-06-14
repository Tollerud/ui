'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, CommandMenu } = __p

import { PACKAGE_VERSION } from '@/lib/package-version'

/* @tollerud/ui docs — Getting started */

function PageGettingStarted({ go }) {
  return (
    <div>
      <PageHeader
        icon="code"
        eyebrow="Start"
        title="Getting started"
        lede={`Install @tollerud/ui v${PACKAGE_VERSION}, wire Tailwind v4, and avoid the gotchas that break Server Components or purge component styles.`}
      />

      <Section title="Install" desc="Core package plus required peers. Optional shader peer only if you use NoirGlowBackground.">
        <CodeSnippet
          name="terminal"
          code={`npm install @tollerud/ui clsx tailwind-merge tailwindcss@4 \\
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress \\
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip \\
  lucide-react framer-motion sonner

# Optional — NoirGlowBackground only
npm install @paper-design/shaders-react`}
        />
      </Section>

      <Section title="Tailwind v4" desc="globals.css bundles tokens and layers. source.css handles @source scanning inside node_modules (pnpm, workspaces, Bun).">
        <CodeSnippet
          name="globals.css"
          code={`/* app/globals.css */
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";`}
        />
        <p style={{ marginTop: 16, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Without <code className="ds-mono">source.css</code> (or a correct manual <code className="ds-mono">@source</code> path), components render unstyled in production. See{' '}
          <button type="button" onClick={() => go('foundations')} style={{ color: 'var(--accent-text)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>Foundations</button> for tokens and{' '}
          <button type="button" onClick={() => go('components')} style={{ color: 'var(--accent-text)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>Components</button> for live examples.
        </p>
      </Section>

      <Section title="Import components" desc="Named exports from the barrel, or subpaths for smaller client boundaries.">
        <CodeSnippet
          name="imports.tsx"
          code={`import { Button, Card, Badge, Monogram, DataTable } from '@tollerud/ui'
// or tree-shaken:
import { Button } from '@tollerud/ui/button'
import { cn } from '@tollerud/ui/utils'`}
        />
      </Section>

      <Section title="Consumer styling policy" desc="Tailwind ships with the design system, but app code should use the component API as the primary design language.">
        <Alert tone="accent" title="Component-first by default">
          {'Use @tollerud/ui components first, exported layout primitives or screen patterns when available, and Tailwind only for small local spacing, alignment, or responsive glue.'}
        </Alert>
        <CodeSnippet
          name="allowed-glue.tsx"
          code={`import { Button, Card } from '@tollerud/ui'

export function DeployCard() {
  return (
    <Card>
      <p>Ready to deploy.</p>
      <div className="mt-6">
        <Button variant="primary">Deploy</Button>
      </div>
    </Card>
  )
}`}
        />
        <CodeSnippet
          name="avoid-rebuilding.tsx"
          code={`// Avoid: this bypasses Button variants, focus states, and brand tokens.
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
        <p style={{ marginTop: 16, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          If a branded structure repeats across screens, add it to <code className="ds-mono">@tollerud/ui</code> or compose a local semantic feature component. Do not copy package internals into <code className="ds-mono">components/ui</code>, and import <code className="ds-mono">cn</code> from the package instead of reimplementing it.
        </p>
      </Section>

      <Section title="Server Components" desc="The bundle is marked 'use client'. Importing components or helpers like cn from a Server Component file is safe — your file does not become a Client Component.">
        <Demo name="server-components" variant="col" code={`// app/page.tsx — Server Component
import { buttonVariants } from '@tollerud/ui'
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/deploy" className={buttonVariants({ variant: 'primary' })}>
      Deploy
    </Link>
  )
}`}>
          <Alert tone="info" title="Use asChild or buttonVariants for links">
            {'Button only renders a native <button>. Style links with asChild or buttonVariants() — never nest <a> inside <button>.'}
          </Alert>
        </Demo>
      </Section>

      <Section title="Toaster" desc="Mount once near the app root when using sonner toasts.">
        <CodeSnippet
          name="layout.tsx"
          code={`import { Toaster } from '@tollerud/ui'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}`}
        />
      </Section>

      <Section title="Subpath imports" desc="Tree-shake individual components without pulling the full barrel.">
        <CodeSnippet
          name="subpath"
          code={`import { Button } from '@tollerud/ui/button'
import { cn } from '@tollerud/ui/utils'`}
        />
      </Section>

      <Section title="Next steps" desc="Explore the system by area.">
        <div className="ds-grid-3">
          {[
            { id: 'foundations', icon: 'palette', t: 'Foundations', d: 'Color, type, spacing, motion, brand.' },
            { id: 'layout', icon: 'layers', t: 'Layout', d: 'Page shells, sections, stacks, grids.' },
            { id: 'screens', icon: 'app', t: 'Screen patterns', d: 'Headers, nav, settings, list/detail pages.' },
            { id: 'components', icon: 'grid', t: 'Components', d: 'Core primitives — button, card, badge, status.' },
            { id: 'forms', icon: 'forms', t: 'Forms', d: 'Inputs, toggles, combobox, validation.' },
            { id: 'navigation', icon: 'compass', t: 'Navigation & Overlays', d: 'Dialogs, menus, command palette.' },
            { id: 'mission-control', icon: 'app', t: 'Mission Control', d: 'Full dashboard example.' },
            { id: 'data-table', icon: 'server', t: 'Data Table', d: 'Rich table with search and bulk actions.' },
          ].map((s) => {
            const I = Icons[s.icon]
            return (
              <button
                key={s.id}
                type="button"
                className="tollerud-card ds-themed ds-lift"
                onClick={() => go(s.id)}
                style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <span style={{ color: 'var(--tollerud-yellow)' }}><I size={20} /></span>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--foreground)' }}>{s.t}</div>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>{s.d}</p>
              </button>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

export default PageGettingStarted
