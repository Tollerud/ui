'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, PropTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, CommandMenu } = __p

import { PACKAGE_VERSION } from '@/lib/package-version'

/* @tollerud/ui docs — Resources and guides */

function PageResources({ go }) {
  return (
    <div>
      <PageHeader
        icon="folder"
        eyebrow="Resources"
        title="Guides"
        lede="Migration notes, agent skills, and contributor workflows for @tollerud/ui."
      />

      <Section
        title="Email (@tollerud/email)"
        desc="HTML email is a separate render target — table layout, inline styles, no CSS variables. It ships as its own package that shares Tollerud's tokens (inlined as literals), not the web components. Built on React Email. Never render @tollerud/ui components into email."
      >
        <div className="ds-col" style={{ gap: 12 }}>
          <Card>
            <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>
              Primitives &amp; templates
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              Primitives: <code className="ds-mono">EmailLayout</code>, <code className="ds-mono">EmailButton</code>, <code className="ds-mono">EmailHeading</code>, <code className="ds-mono">EmailText</code>, <code className="ds-mono">EmailDivider</code>, <code className="ds-mono">EmailFooter</code>. Templates: <code className="ds-mono">WelcomeEmail</code>, <code className="ds-mono">VerifyEmail</code>, <code className="ds-mono">PasswordResetEmail</code>, <code className="ds-mono">ReceiptEmail</code>. Render with the re-exported <code className="ds-mono">render</code>.
            </p>
          </Card>
          <CodeSnippet
            name="email.tsx"
            code={`import { render, WelcomeEmail, EmailLayout, EmailButton, EmailText } from '@tollerud/email'

// Ready-made template
const html = await render(
  <WelcomeEmail name="Mathias" productName="Graphify" ctaUrl={dashboardUrl} />,
)

// Or compose your own from primitives
const custom = await render(
  <EmailLayout preview="Your report is ready">
    <EmailText>Your weekly report is ready to view.</EmailText>
    <EmailButton href={reportUrl}>View report</EmailButton>
  </EmailLayout>,
)
// hand the HTML to your mailer (Resend, SES, Nodemailer, …)`}
          />
          <Button asChild variant="secondary" size="sm">
            <a href="https://github.com/Tollerud/ui/blob/main/packages/email/README.md" target="_blank" rel="noreferrer">
              @tollerud/email README
              <Icons.arrowRight size={14} />
            </a>
          </Button>
        </div>
      </Section>

      <Section title="Migration" desc="Breaking changes ship with CHANGELOG entries. Recent majors to know about.">
        <div className="ds-col" style={{ gap: 12 }}>
          <Card>
            <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>v3.0.0 — ESM-only</div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.55 }}>
              Replace <code className="ds-mono">require('@tollerud/ui')</code> with ESM imports. CJS subpaths are removed.
            </p>
            <Button variant="secondary" size="sm" onClick={() => go('changelog')}>
              Read changelog
              <Icons.arrowRight size={14} />
            </Button>
          </Card>
          <Card>
            <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>v2.0.0 — Peer dependencies</div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.55 }}>
              Install Radix, Lucide, Framer Motion, and Sonner explicitly in consumer apps.
            </p>
            <Button variant="secondary" size="sm" onClick={() => go('getting-started')}>
              Getting started
              <Icons.arrowRight size={14} />
            </Button>
          </Card>
          <Card>
            <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Copied local components</div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.55 }}>
              Projects that vendored <code className="ds-mono">src/components/ui/*</code> should delete copies and import from the package. See AGENTS.md in the repo.
            </p>
            <Button asChild variant="secondary" size="sm">
              <a href="https://github.com/Tollerud/ui/blob/main/AGENTS.md" target="_blank" rel="noreferrer">
                AGENTS.md
                <Icons.arrowRight size={14} />
              </a>
            </Button>
          </Card>
          <Card>
            <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Consumer styling policy</div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.55 }}>
              Tailwind remains available, but consumer apps should use exported components first and reserve utilities for small layout glue.
            </p>
            <div className="ds-row" style={{ gap: 10, flexWrap: 'wrap' }}>
              <Button variant="secondary" size="sm" onClick={() => go('getting-started')}>
                Read policy
                <Icons.arrowRight size={14} />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => go('recipes')}>
                Recipes
                <Icons.arrowRight size={14} />
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        title="Consumer project checklist"
        permalink="resources/consumer-checklist"
        desc="Self-audit styling setup before shipping. Catches copied components, missing source.css, and invalid Button/Link composition."
      >
        <CodeSnippet
          name="audit"
          code={`# From your consumer app root
npx tollerud-ui-audit

# Monorepo app package
npx tollerud-ui-audit ./apps/web

# Without npx (direct script path)
node node_modules/@tollerud/ui/scripts/audit-consumer-styling.mjs

# Advisory CI — print findings but exit 0 even with errors
npx tollerud-ui-audit --warn-only`}
        />
        <Alert tone="accent" title="What the audit checks">
          Missing @tollerud/ui in package.json, missing globals.css or source.css imports, local components/ui clones, tollerud-* classes without package imports, hardcoded brand hex values, local cn() helpers, nested Button/Link patterns, and components/ui re-export shims.
        </Alert>
        <Alert tone="info" title="Exit codes">
          Exit 0 when no issues are found, or when --warn-only is set. Exit 1 when errors are found — use in required CI checks.
        </Alert>
        <SubHead>Audit error codes</SubHead>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 12px' }}>
          Findings print as <code className="ds-mono">ERROR [code]</code> or <code className="ds-mono">WARN [code]</code>:
        </p>
        <div className="tollerud-card ds-themed" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, lineHeight: 1.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>Code</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>Level</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>Fix</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['missing-ui-dep', 'error', 'Add @tollerud/ui and peers to package.json'],
                ['missing-globals-css', 'error', 'Import @tollerud/ui/globals.css in Tailwind entry'],
                ['missing-source-css', 'error', 'Import @tollerud/ui/source.css (prevents production purge)'],
                ['local-ui-clone', 'error', 'Delete components/ui copies; import from @tollerud/ui'],
                ['copied-ds-tokens', 'error', 'Replace vendored files using tollerud-* without package imports'],
                ['hardcoded-hex', 'error', 'Use text-tollerud-yellow, bg-tollerud-noir-950 tokens'],
                ['button-link-nesting', 'error', 'Button asChild + Link, or buttonVariants() on the link'],
                ['ui-reexport-shim', 'warn', 'Import from @tollerud/ui instead of local ui/index re-exports'],
                ['local-cn', 'warn', 'import { cn } from "@tollerud/ui/utils"'],
                ['generic-yellow-util', 'warn', 'Prefer Button variant="primary" or text-tollerud-yellow'],
                ['no-globals-css', 'warn', 'Verify Tailwind entry imports both Tollerud CSS files'],
                ['no-package-json', 'warn', 'Run audit from the consumer app package root'],
              ].map(([code, level, fix]) => (
                <tr key={code} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--tollerud-yellow)' }}>{code}</td>
                  <td style={{ padding: '10px 14px', color: level === 'error' ? 'var(--foreground)' : 'var(--text-secondary)' }}>{level}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeSnippet
          name="feature-component.tsx"
          code={`// src/features/hosts/HostDeployPanel.tsx — app-specific; composes @tollerud/ui
import { Button, FormPanel, Input, Stack } from '@tollerud/ui'

export function HostDeployPanel({ onDeploy }: { onDeploy: (host: string) => void }) {
  return (
    <FormPanel
      title="Connect host"
      footer={<Button variant="primary" onClick={() => onDeploy('emma.tollerud.no')}>Connect</Button>}
    >
      <Stack gap="md">
        <Input label="Hostname" placeholder="emma.tollerud.no" />
      </Stack>
    </FormPanel>
  )
}`}
        />
        <div className="ds-row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Button asChild variant="secondary" size="sm">
            <a href="https://github.com/Tollerud/ui/blob/main/GETTING_STARTED.md#consumer-project-checklist" target="_blank" rel="noreferrer">
              GETTING_STARTED.md
              <Icons.arrowRight size={14} />
            </a>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => go('recipes')}>
            Recipes
            <Icons.arrowRight size={14} />
          </Button>
        </div>
      </Section>

      <Section title="AI agents" desc="Sync SKILL.md into your project so coding assistants use verified exports and gotchas.">
        <CodeSnippet
          name="skill-sync"
          code={`# Claude Code / Cursor — copy verbatim on version bumps
mkdir -p .claude/skills/tollerud-ui
curl -fsSL https://raw.githubusercontent.com/Tollerud/ui/main/SKILL.md \\
  -o .claude/skills/tollerud-ui/SKILL.md

# Current package version: v${PACKAGE_VERSION}`}
        />
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
          SKILL.md reflects actual <code className="ds-mono">components/index.ts</code> exports — more reliable than stale copy-paste snippets.
        </p>
      </Section>

      <Section title="Contributing" desc="Validate before opening a PR. Component changes need registry + docs demo updates.">
        <CodeSnippet
          name="validate"
          code={`npm run validate    # typecheck, lint, test, build, package gates, docs build

# Component checklist (see AGENTS.md):
# components/*.tsx → index.ts → registry.json → docs page demo`}
        />
        <div className="ds-row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Button asChild variant="secondary" size="md">
            <a href="https://github.com/Tollerud/ui/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">
              CONTRIBUTING.md
              <Icons.arrowRight size={14} />
            </a>
          </Button>
          <Button asChild variant="terminal" size="md">
            <a href="https://github.com/Tollerud/ui" target="_blank" rel="noreferrer">
              open_repository
              <Icons.arrowRight size={14} />
            </a>
          </Button>
        </div>
      </Section>

      <Section title="Prop reference" desc="Full generated prop tables live in the repo; key components show props inline on docs pages.">
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
          Regenerate after interface changes: <code className="ds-mono">npm run docs:props</code> · drift check: <code className="ds-mono">npm run test:props</code>
        </p>
      </Section>
    </div>
  )
}

export default PageResources
