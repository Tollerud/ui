'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, CommandMenu } = __p

import { PACKAGE_VERSION } from '@/lib/package-version'

/* Tollerud DS — Getting started. → window.PageGettingStarted */

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

      <Section title="Tailwind v4" desc="One CSS import bundles tokens and component layers. Point @source at the package dist so utilities are not purged.">
        <CodeSnippet
          name="globals.css"
          code={`/* app/globals.css */
@import "@tollerud/ui/globals.css";
@source "../node_modules/@tollerud/ui/dist";`}
        />
        <p style={{ marginTop: 16, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Without a correct <code className="ds-mono">@source</code> path, components render unstyled in production. See{' '}
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

      <Section title="Registry" desc="Install individual components via the shadcn CLI.">
        <CodeSnippet
          name="registry"
          code={`npx shadcn@latest add button --registry https://unpkg.com/@tollerud/ui@latest/registry.json`}
        />
      </Section>

      <Section title="Next steps" desc="Explore the system by area.">
        <div className="ds-grid-3">
          {[
            { id: 'foundations', icon: 'palette', t: 'Foundations', d: 'Color, type, spacing, motion, brand.' },
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
