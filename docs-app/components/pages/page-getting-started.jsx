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
        <SubHead>Full Tollerud UI</SubHead>
        <CodeSnippet
          name="terminal"
          code={`npm install @tollerud/ui clsx tailwind-merge tailwindcss@4 \\
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress \\
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip \\
  lucide-react framer-motion sonner

# Optional — NoirGlowBackground only
npm install @paper-design/shaders-react`}
        />
        <Alert tone="info" title="Required peers">
          As of v2.0.0, Radix, Lucide, Framer Motion, and Sonner are required peer dependencies — install them with the command above.
        </Alert>
        <SubHead>Footer only</SubHead>
        <CodeSnippet
          name="footer-only"
          code={`npm install @tollerud/footer

import { Footer } from '@tollerud/footer'

<Footer />`}
        />
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {'@tollerud/footer bundles clsx and tailwind-merge on purpose. You still need Tailwind with Tollerud tokens — '}
          <code className="ds-mono">@import &quot;@tollerud/ui/globals.css&quot;</code>
          {' — so '}<code className="ds-mono">text-tollerud-*</code> / <code className="ds-mono">bg-tollerud-*</code> classes resolve.
        </p>
      </Section>

      <Section
        title="Next.js starter"
        permalink="getting-started/next-starter"
        desc="Minimal App Router app with globals.css, source.css, sample page, and Toaster mounted."
      >
        <CodeSnippet
          name="terminal"
          code={`# From the Tollerud/ui repo:
cp -R examples/next-starter my-app && cd my-app && npm install && npm run dev

# Or clone and copy:
# https://github.com/Tollerud/ui/tree/main/examples/next-starter`}
        />
      </Section>

      <Section
        title="Start with an AI agent"
        permalink="getting-started/ai-agent"
        desc="Copy a prompt into Cursor or Claude Code instead of wiring setup by hand. Run npx tollerud-ui-audit when the agent finishes."
      >
        <Alert tone="accent" title="Sync SKILL.md">
          {'Prompts reference SKILL.md for exports and gotchas. Let the agent fetch it, or sync https://github.com/Tollerud/ui/blob/main/SKILL.md into your project skills folder first.'}
        </Alert>
        <SubHead>New Next.js project</SubHead>
        <CodeSnippet
          name="agent-prompt-new-project.txt"
          code={`Set up a new Next.js App Router project with @tollerud/ui (Tollerud User Interface / Tollerud UI).

Requirements:
1. Use Next.js with App Router and Tailwind CSS v4 (PostCSS).
2. Install @tollerud/ui and all required peers:
   npm install @tollerud/ui clsx tailwind-merge tailwindcss@4 @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip lucide-react framer-motion sonner
3. In app/globals.css, import BOTH:
   @import "@tollerud/ui/globals.css";
   @import "@tollerud/ui/source.css";
4. Mount <Toaster /> from @tollerud/ui in the root layout.
5. Build the sample home page with exported layout primitives and screen patterns (PageShell, Section, Stack, Button, etc.) — not hand-built min-h-screen/grid utilities. Follow https://design.tollerud.dev/recipes/ for screen structure.
6. Sync the Tollerud UI skill: fetch https://raw.githubusercontent.com/Tollerud/ui/main/SKILL.md and write it to .claude/skills/tollerud-ui/SKILL.md (or the equivalent skills folder for this agent).
7. Do NOT copy @tollerud/ui component source into components/ui. Import from @tollerud/ui only. Do NOT create a local cn() helper — use import { cn } from '@tollerud/ui'.
8. Style links with <Button asChild><Link … /></Button> or buttonVariants() — never nest <a> inside <button>.
9. Use Tollerud tokens (text-tollerud-yellow, bg-tollerud-noir-950) — never hardcode #FFFF00 or #0A0A0A.
10. When done, run npx tollerud-ui-audit and fix all errors before finishing.

If examples/next-starter exists in the Tollerud/ui repo, use it as the reference layout. Otherwise match its structure: globals.css + source.css, layout with Toaster, component-first sample page.

Tell me what you created and any audit output.`}
        />
        <SubHead>Add to an existing project</SubHead>
        <CodeSnippet
          name="agent-prompt-existing-project.txt"
          code={`Add @tollerud/ui (Tollerud User Interface / Tollerud UI) to this existing project.

Requirements:
1. Install @tollerud/ui and required peers if missing:
   npm install @tollerud/ui clsx tailwind-merge tailwindcss@4 @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip lucide-react framer-motion sonner
2. Ensure the Tailwind entry CSS imports BOTH:
   @import "@tollerud/ui/globals.css";
   @import "@tollerud/ui/source.css";
3. Mount <Toaster /> near the app root if we use sonner toasts.
4. Sync SKILL.md from https://raw.githubusercontent.com/Tollerud/ui/main/SKILL.md into the project skills folder (.claude/skills/tollerud-ui/SKILL.md or equivalent).
5. Replace any vendored components/ui copies with imports from @tollerud/ui. Delete local cn() helpers — use import { cn } from '@tollerud/ui/utils'.
6. Do NOT copy new component source from the Tollerud UI repo into this app.
7. Use component-first composition: @tollerud/ui exports, then layout/screen patterns, then small Tailwind glue only. Screen starting points: https://design.tollerud.dev/recipes/
8. Fix Button/Link nesting: use asChild or buttonVariants() on links.
9. Replace hardcoded brand hex (#FFFF00, #0A0A0A) with Tollerud tokens.
10. Run npx tollerud-ui-audit from the app package root and fix all errors.

Summarize changes and audit results when done.`}
        />
        <SubHead>Footer only</SubHead>
        <CodeSnippet
          name="agent-prompt-footer-only.txt"
          code={`Add the Tollerud branded footer to this project using @tollerud/footer (footer-only — not the full Tollerud UI package).

Requirements:
1. npm install @tollerud/footer
2. Ensure Tailwind is configured with Tollerud tokens via @import "@tollerud/ui/globals.css" (footer-only apps still need token utilities for text-tollerud-* / bg-tollerud-*).
3. import { Footer } from '@tollerud/footer' and render <Footer /> in the layout.
4. Do not install the full @tollerud/ui peer set unless I ask for more components later.

Tell me what you changed.`}
        />
        <div className="ds-row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="tollerud-btn tollerud-btn--ghost tollerud-btn--sm" onClick={() => go('getting-started/consumer-checklist')}>Consumer checklist</button>
          <button type="button" className="tollerud-btn tollerud-btn--ghost tollerud-btn--sm" onClick={() => go('recipes')}>Recipes</button>
        </div>
      </Section>

      <Section title="Tailwind v4" desc="globals.css bundles tokens and layers. source.css handles @source scanning inside node_modules (pnpm, workspaces, Bun).">
        <CodeSnippet
          name="globals.css"
          code={`/* app/globals.css */
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";`}
        />
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Without <code className="ds-mono">source.css</code> (or a correct manual <code className="ds-mono">@source</code> path), components render unstyled in production. See{' '}
          <button type="button" onClick={() => go('foundations')} style={{ color: 'var(--accent-text)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>Foundations</button> for tokens and{' '}
          <button type="button" onClick={() => go('components')} style={{ color: 'var(--accent-text)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>Components</button> for live examples.
        </p>
      </Section>

      <Section title="Tailwind v3 (legacy)" desc="Use the preset plus globals-v3.css when you cannot move to Tailwind v4 yet.">
        <CodeSnippet
          name="tailwind.config.ts"
          code={`import type { Config } from 'tailwindcss'
import tollerudPreset from '@tollerud/ui/preset'

const config: Config = {
  presets: [tollerudPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@tollerud/ui/dist/**/*.{js,mjs}',
  ],
}

export default config`}
        />
        <CodeSnippet
          name="globals.css"
          code={`@import "tailwindcss/preflight";
@import "tailwindcss/utilities";
@import "@tollerud/ui/globals-v3.css";`}
        />
      </Section>

      <Section title="Imports" desc="Named exports from the barrel, or subpaths for tree-shaking and smaller client boundaries.">
        <CodeSnippet
          name="imports.tsx"
          code={`import { Button, Card, Badge, Monogram, DataTable } from '@tollerud/ui'
import { PageShell, Section, Stack } from '@tollerud/ui'
import { PageHeader, ResourceList } from '@tollerud/ui'

// Tree-shaken subpaths:
import { Button } from '@tollerud/ui/button'
import { cn } from '@tollerud/ui/utils'`}
        />
      </Section>

      <Section title="Consumer styling policy" desc="Tailwind ships with Tollerud UI, but app code should use the component API as the primary design language.">
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
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          If a branded structure repeats across screens, add it to <code className="ds-mono">@tollerud/ui</code> or compose a local semantic feature component. Do not copy package internals into <code className="ds-mono">components/ui</code>, and import <code className="ds-mono">cn</code> from the package instead of reimplementing it. For copy-paste screen starting points, see{' '}
          <button type="button" onClick={() => go('recipes')} style={{ color: 'var(--accent-text)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>Recipes</button>.
        </p>
      </Section>

      <Section
        title="Consumer project checklist"
        permalink="getting-started/consumer-checklist"
        desc="Run npx tollerud-ui-audit before shipping. Fix errors for missing source.css, copied components/ui, hardcoded brand colors, and Button/Link nesting."
      >
        <CodeSnippet
          name="audit"
          code={`npx tollerud-ui-audit
# monorepo: npx tollerud-ui-audit ./apps/web
# without npx:
node node_modules/@tollerud/ui/scripts/audit-consumer-styling.mjs
# advisory CI (exit 0 even with errors):
npx tollerud-ui-audit --warn-only`}
        />
        <Alert tone="accent" title="Exit codes">
          Exit 0 when clean, or when only warnings exist with --warn-only. Exit 1 when errors are found — fix before merge.
        </Alert>
        <div className="ds-row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="tollerud-btn tollerud-btn--ghost tollerud-btn--sm" onClick={() => go('resources')}>Guides — error code reference</button>
          <button type="button" className="tollerud-btn tollerud-btn--ghost tollerud-btn--sm" onClick={() => go('recipes')}>Recipes</button>
        </div>
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

      <Section
        title="Migrating from copied components"
        permalink="getting-started/migrate-copied-ui"
        desc="Replace vendored components/ui trees and local cn() helpers with package imports."
      >
        <CodeSnippet
          name="detect-copies.sh"
          code={`grep -rl "tollerud-yellow\\|tollerud-noir\\|tollerud-surface" src --include="*.tsx" --include="*.ts"`}
        />
        <Alert tone="accent" title="Fix checklist">
          Install peers, swap imports to @tollerud/ui, delete copied files, sync SKILL.md for prop drift, add Toaster if using Sonner, then run npx tsc --noEmit and npx tollerud-ui-audit.
        </Alert>
        <CodeSnippet
          name="before-after.tsx"
          code={`// Before
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// After
import { Button } from '@tollerud/ui'
import { cn } from '@tollerud/ui/utils'`}
        />
        <div className="ds-row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="tollerud-btn tollerud-btn--ghost tollerud-btn--sm" onClick={() => go('resources')}>Guides — full anti-pattern table</button>
        </div>
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
