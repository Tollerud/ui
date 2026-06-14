'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import { Monogram, TiaPortrait, TollerudAvatarFull } from '@/components/brand'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, CommandMenu, TopNav } = __p

/* @tollerud/ui docs — Foundations */

/* Live, replay-able motion demos */
function MotionLab() {
  const [k, setK] = useState(0);
  const easings = [
    ['ease-out', 'cubic-bezier(.16,1,.3,1)', 'Entrances — overshoot-free settle'],
    ['ease-in-out', 'cubic-bezier(.4,0,.2,1)', 'Movement between two states'],
    ['linear', 'linear', 'Progress, shimmer, marquee'],
  ];
  return (
    <div className="ds-demo ds-themed" style={{ padding: 0 }}>
      <div style={{ padding: '22px 24px' }}>
        <div className="ds-row" style={{ justifyContent: 'space-between', marginBottom: 18 }}>
          <span className="ds-subhead" style={{ margin: 0 }}>Easing curves</span>
          <button className="ds-demo__btn" onClick={() => setK(k + 1)}><Icons.refresh size={13}/>Replay</button>
        </div>
        <div className="ds-col" style={{ gap: 14 }}>
          {easings.map(([name, curve, use], i) => (
            <div key={name} className="ds-row" style={{ gap: 16 }}>
              <span className="ds-mono" style={{ fontSize: 12, color: 'var(--foreground)', width: 92, flexShrink: 0 }}>{name}</span>
              <div style={{ flex: 1, position: 'relative', height: 28, background: 'var(--muted)', borderRadius: 999 }}>
                <span key={k} style={{ position: 'absolute', top: 4, left: 4, width: 20, height: 20, borderRadius: '50%', background: 'var(--tollerud-yellow)',
                  animation: `motionlab-run 1.6s ${curve} ${i * 0.12}s infinite alternate` }}/>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 230, flexShrink: 0 }}>{use}</span>
            </div>
          ))}
        </div>
        <div className="ds-section__head" style={{ marginTop: 26, marginBottom: 14 }}><span className="ds-subhead" style={{ margin: 0 }}>Interaction patterns</span></div>
        <div className="ds-grid-3">
          <div key={'rev' + k} className="tollerud-card ds-themed" data-reveal style={{ textAlign: 'center', padding: '20px 12px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>Scroll reveal</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>fade + rise, staggered</div>
          </div>
          <div className="tollerud-card ds-themed ds-lift" style={{ textAlign: 'center', padding: '20px 12px', cursor: 'pointer' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>Hover lift</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>hover me</div>
          </div>
          <div style={{ textAlign: 'center', padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <button className="tollerud-btn tollerud-btn--terminal tollerud-btn--md">glow_follow</button>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>move cursor over button</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageFoundations() {
  const brand = [
    ['Yellow', '#FFFF00', '--tollerud-yellow'],
    ['Yellow warm', '#E8D500', '--tollerud-yellow-warm'],
    ['Yellow dim', '#B8A800', '--tollerud-yellow-dim'],
    ['Amber', '#FFB800', '--tollerud-amber'],
    ['Amber glow', '#FF8C00', '--tollerud-amber-glow'],
  ];
  const noir = [
    ['Black', '#0A0A0A', '--tollerud-black'],
    ['Noir 900', '#121212', '--tollerud-noir-900'],
    ['Noir 800', '#1A1A1A', '--tollerud-noir-800'],
    ['Noir 700', '#252525', '--tollerud-noir-700'],
    ['Noir 600', '#333333', '--tollerud-noir-600'],
    ['Noir 500', '#4A4A4A', '--tollerud-noir-500'],
    ['Noir 400', '#666666', '--tollerud-noir-400'],
    ['Noir 300', '#888888', '--tollerud-noir-300'],
    ['Noir 200', '#AAAAAA', '--tollerud-noir-200'],
    ['Noir 100', '#CCCCCC', '--tollerud-noir-100'],
    ['Noir 50', '#E5E5E5', '--tollerud-noir-50'],
    ['White', '#F5F5F5', '--tollerud-white'],
  ];
  const state = [
    ['Success', '#22C55E', '--success'],
    ['Warning', '#E8D500', '--warning'],
    ['Error', '#EF4444', '--destructive'],
    ['Info', '#3B82F6', '--info'],
  ];
  const semantic = [
    ['background', 'Page background', 'var(--background)'],
    ['foreground', 'Primary text', 'var(--foreground)'],
    ['card', 'Raised surface', 'var(--card)'],
    ['popover', 'Overlay surface', 'var(--popover)'],
    ['primary', 'Yellow action', 'var(--primary)'],
    ['secondary', 'Muted surface', 'var(--secondary)'],
    ['muted', 'Muted fill', 'var(--muted)'],
    ['border', 'Hairline border', 'var(--border)'],
    ['ring', 'Focus ring', 'var(--ring)'],
  ];

  const typeScale = [
    ['Display', '56 / 0.98 / -0.045em', 600, 56, 'Dark. Yellow.'],
    ['Heading 1', '40 / 1.02 / -0.04em', 600, 40, 'Mission control'],
    ['Heading 2', '28 / 1.1 / -0.025em', 600, 28, 'Service health'],
    ['Heading 3', '20 / 1.2 / -0.02em', 600, 20, 'Active sessions'],
    ['Body', '16 / 1.5', 400, 16, 'Direct, technical, warm-but-not-corporate copy.'],
    ['Small', '14 / 1.5', 400, 14, 'Secondary descriptions and metadata.'],
    ['Mono', '14 / 1.7', 500, 14, '❯ systemctl status tollerud-agent'],
  ];

  const radii = [['none', '0'], ['sm', '2px'], ['DEFAULT', '4px'], ['md', '6px'], ['lg', '8px'], ['xl', '12px'], ['2xl', '16px']];
  const space = [['1', 4], ['2', 8], ['3', 12], ['4', 16], ['6', 24], ['8', 32], ['12', 48], ['16', 64]];
  const shadows = [
    ['sm', 'var(--shadow-sm)'],
    ['md', 'var(--shadow-md)'],
    ['lg', 'var(--shadow-lg)'],
    ['xl', 'var(--shadow-xl)'],
    ['glow', 'var(--shadow-glow)'],
  ];
  const motion = [
    ['fast', '150ms', 'Hover, focus, small toggles'],
    ['normal', '250ms', 'Most transitions, fades'],
    ['slow', '350ms', 'Overlays, large movement'],
    ['ease-out', 'cubic-bezier(.16,1,.3,1)', 'Entrances'],
    ['ease-in-out', 'cubic-bezier(.4,0,.2,1)', 'Movement'],
  ];

  return (
    <div>
      <PageHeader icon="palette" eyebrow="Foundations" title="Foundations"
        lede="The atomic decisions every component inherits — color, type, space, depth and motion. All defined as CSS variables that flip cleanly between dark and light."/>

      <Section title="Brand color" desc="Yellow is the only chromatic color in the system. It signals interaction; everything else is monochrome.">
        <SubHead>Yellow & amber</SubHead>
        <div className="ds-swatchgrid" style={{ marginBottom: 28 }}>
          {brand.map(([n, v, t]) => <Swatch key={n} name={n} value={v} varName={t}/>)}
        </div>
        <SubHead>Noir scale</SubHead>
        <div className="ds-swatchgrid">
          {noir.map(([n, v, t]) => <Swatch key={n} name={n} value={v} varName={t}/>)}
        </div>
      </Section>

      <Section title="Monogram" desc="The Tollerud mark is a single continuous path — a stylised T in acid yellow (#FFFF00). There is no separate wordmark; use the monogram everywhere the brand needs to appear at small scale.">
        <div className="ds-demo ds-themed" style={{ padding: '28px 24px' }}>
          <div className="ds-row" style={{ gap: 32, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {[[96, 'App chrome'], [48, 'Nav / favicon'], [26, 'Inline badge'], [20, 'Minimum']].map(([size, label]) => (
              <div key={size} style={{ textAlign: 'center' }}>
                <div style={{ width: size + 24, height: size + 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--tollerud-black)', borderRadius: 8, border: '1px solid var(--border)', margin: '0 auto 8px' }}>
                  <Monogram size={size} alt="" />
                </div>
                <span className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{size}px · {label}</span>
              </div>
            ))}
          </div>
        </div>
        <SubHead>When to use</SubHead>
        <TokenTable cols={['Context', 'Asset', 'Notes']}
          rows={[
            ['Sidebar, topbar, favicon', '<code>&lt;Monogram /&gt;</code>', 'Primary brand mark — always on noir/black'],
            ['Sign-in panel, auth flows', '<code>&lt;Monogram size={26} /&gt;</code>', '26–32px beside product name'],
            ['Hero / marketing', 'Monogram + wordmark in copy', 'No separate wordmark file — set product name in Inter next to the mark'],
          ]}/>
        <SubHead>Clear space & background</SubHead>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Preserve at least one T-width of padding on all sides. The monogram is designed for dark surfaces — black, noir-900, or the grain gradient. Never place on white or light backgrounds; contrast breaks and the yellow reads as noise.
        </p>
        <div className="ds-grid-2">
          <div className="tollerud-card ds-themed">
            <div className="ds-row" style={{ gap: 7, marginBottom: 14, color: 'var(--success)' }}><Icons.checkCircle size={16}/><span style={{ fontWeight: 600, fontSize: 13, color: 'var(--foreground)' }}>Do</span></div>
            <div className="ds-col" style={{ gap: 10 }}>
              {['Place on noir/black backgrounds only', 'Use acid yellow fill as shipped — no recolor', 'Scale proportionally; 20px is the minimum width', 'Pair with Inter for product name when space allows'].map((s, i) =>
                <span key={i} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s}</span>)}
            </div>
          </div>
          <div className="tollerud-card ds-themed">
            <div className="ds-row" style={{ gap: 7, marginBottom: 14, color: 'var(--destructive)' }}><Icons.xCircle size={16}/><span style={{ fontWeight: 600, fontSize: 13, color: 'var(--foreground)' }}>Don&apos;t</span></div>
            <div className="ds-col" style={{ gap: 10 }}>
              {['Place on white or light card backgrounds', 'Stretch, rotate, outline, or add drop shadows', 'Recolor the fill or use gradients', 'Use as a decorative pattern or watermark'].map((s, i) =>
                <span key={i} style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through', textDecorationColor: 'rgba(239,68,68,.5)' }}>{s}</span>)}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <CodeSnippet name="monogram.jsx" code={`import { Monogram } from '@tollerud/ui'

// Default — acid yellow on dark surfaces
<Monogram size={26} />

// Light-mode nav / cards
<Monogram color="black" size={20} />

// On tinted or photo backgrounds
<Monogram color="white" className="h-5 w-auto" />`}/>
        </div>
        <SubHead>Navigation lockup</SubHead>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
          The monogram always appears to the left of the project name — never the name alone, never the mark alone. Use <code className="ds-mono" style={{ fontSize: 12 }}>TopNav</code> for top bars so the lockup, link states, focus styles, and spacing stay consistent.
        </p>
        <div className="ds-demo ds-themed" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TopNav
            sticky={false}
            projectName="Dashboard"
            navItems={[
              { label: 'Overview', href: '#', active: true },
              { label: 'Services', href: '#' },
              { label: 'Logs', href: '#' },
            ]}
            actions={<Button size="sm" variant="primary">Deploy</Button>}
            className="rounded-lg border border-tollerud-border"
          />
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CodeSnippet name="top-nav.jsx" code={`import { Button, TopNav } from '@tollerud/ui'

<TopNav
  projectName="Dashboard"
  navItems={[
    { label: 'Overview', href: '/', active: true },
    { label: 'Services', href: '/services' },
    { label: 'Logs', href: '/logs' },
  ]}
  actions={<Button size="sm" variant="primary">Deploy</Button>}
/>`}/>
          <CodeSnippet name="app-shell.jsx" code={`import { DashboardShell, PageHeader } from '@tollerud/ui'

<DashboardShell
  projectName="Dashboard"
  pageTitle="Overview"
  sidebarItems={[
    { id: 'overview', label: 'Overview', href: '/', active: true },
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'settings', label: 'Settings', href: '/settings' },
  ]}
  header={<PageHeader title="Overview" description="Fleet health at a glance." />}
>
  {/* page content */}
</DashboardShell>`}/>
        </div>
      </Section>

      <Section title="State color" desc="Used sparingly for status only — kept muted so yellow stays the loudest thing on screen.">
        <div className="ds-swatchgrid">
          {state.map(([n, v, t]) => <Swatch key={n} name={n} value={v} varName={t}/>)}
        </div>
      </Section>

      <Section title="Semantic tokens" desc="CSS variable aliases for background, foreground, card, and accent. Components reference these — re-theming is a matter of remapping nine variables.">
        <TokenTable cols={['Token', 'Role', 'Reference']}
          rows={semantic.map(([t, r, v]) => [
            `<code>--${t}</code>`,
            r,
            <span className="ds-row" style={{ gap: 8 }}><span style={{ width: 16, height: 16, borderRadius: 4, background: v, border: '1px solid var(--border)' }}/><span className="ds-mono" style={{ fontSize: 12 }}>{v}</span></span>,
          ])}/>
      </Section>

      <Section title="Typography" desc="Inter for display and body, JetBrains Mono for code, metrics and terminal moments. Tight tracking on display sizes.">
        <div className="ds-demo ds-themed">
          <div style={{ padding: '8px 4px' }}>
            {typeScale.map(([name, spec, w, size, sample], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 24, alignItems: 'baseline', padding: '16px 24px', borderBottom: i < typeScale.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{name}</div>
                  <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{spec}</div>
                </div>
                <div style={{ fontSize: Math.min(size, 40), fontWeight: w, letterSpacing: size >= 28 ? '-0.03em' : 0, lineHeight: 1.1, color: 'var(--foreground)', fontFamily: name === 'Mono' ? 'var(--font-mono)' : 'var(--font-sans)', color: name === 'Mono' ? 'var(--tollerud-yellow)' : 'var(--foreground)' }}>{sample}</div>
              </div>
            ))}
          </div>
        </div>

        <SubHead>Display shimmer</SubHead>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 16, maxWidth: 640 }}>
          Animated yellow sweep clipped to text — for hero accent lines and key metrics on dark surfaces. Ships with the standard <span className="ds-mono" style={{ fontSize: 12 }}>@import &quot;@tollerud/ui/globals.css&quot;</span> setup; no extra install step. Use on a short accent span inside <span className="ds-mono" style={{ fontSize: 12 }}>.tollerud-display</span>, not body copy. Respects <span className="ds-mono" style={{ fontSize: 12 }}>prefers-reduced-motion</span> (static yellow). For a static gradient, use <span className="ds-mono" style={{ fontSize: 12 }}>.tollerud-gradient-text</span> instead.
        </p>
        <Demo name="display-shimmer" code={`<h1 class="tollerud-display text-[70px] text-tollerud-text-primary">
  Dark. Monochrome.<br>
  <span class="tollerud-display-shimmer">Yellow where it counts.</span>
</h1>

{/* Key metric — same class on the number */}
<div class="tollerud-display-shimmer text-[38px] font-bold tracking-tight">
  42
</div>`}>
          <div style={{ padding: '28px 24px', background: 'var(--tollerud-black)', borderRadius: 8 }}>
            <h2 className="tollerud-display" style={{ fontSize: 40, color: '#F5F5F5', lineHeight: 0.98 }}>
              Dark. Monochrome.<br/><span className="tollerud-display-shimmer">Yellow where it counts.</span>
            </h2>
            <div className="tollerud-display-shimmer" style={{ marginTop: 20, fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
              42
            </div>
          </div>
        </Demo>
      </Section>

      <Section title="Spacing" desc="A 4px base grid. These eight steps cover the vast majority of layout.">
        <div className="ds-col" style={{ gap: 10 }}>
          {space.map(([n, px]) => (
            <div key={n} className="ds-row" style={{ gap: 16 }}>
              <span className="ds-mono" style={{ fontSize: 12, color: 'var(--text-muted)', width: 90 }}>space-{n}</span>
              <span style={{ height: 14, width: px, background: 'var(--tollerud-yellow)', borderRadius: 2 }}/>
              <span className="ds-mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{px}px</span>
            </div>
          ))}
        </div>
      </Section>

      <div className="ds-grid-2" style={{ alignItems: 'start' }}>
        <Section title="Radius" desc="Subtle by default. Sharp corners hold the noir feel.">
          <div className="ds-col" style={{ gap: 10 }}>
            {radii.map(([n, v]) => (
              <div key={n} className="ds-row" style={{ gap: 14 }}>
                <span style={{ width: 46, height: 46, background: 'var(--muted)', border: '1.5px solid var(--tollerud-yellow)', borderRadius: v }}/>
                <div>
                  <div className="ds-mono" style={{ fontSize: 12.5, color: 'var(--foreground)' }}>radius-{n}</div>
                  <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Elevation" desc="A four-tier shadow scale plus a yellow glow — theme-aware (deep in dark, soft in light). Lean on borders first; reach for a shadow only to lift overlays (drawers, popovers, menus) off the page.">
          <div className="ds-col" style={{ gap: 16 }}>
            {shadows.map(([n, v]) => (
              <div key={n} className="ds-row" style={{ gap: 16 }}>
                <span style={{ width: 64, height: 44, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: v }}/>
                <span className="ds-mono" style={{ fontSize: 12.5, color: 'var(--foreground)' }}>--shadow-{n}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Density" desc="Two modes: comfortable (default) and compact. Set data-density='compact' on any container, or use density='compact' directly on Card. Live demo → Components.">
        <TokenTable cols={['Token', 'Effect']} rows={[
          ['<code>data-density="comfortable"</code>', 'Default. Card padding 24px, table rows 48px, form rows relaxed.'],
          ['<code>data-density="compact"</code>', 'Card padding 12px, table rows 36px, panel headers 32px, button heights trimmed.'],
          ['<code>&lt;Card density="compact"&gt;</code>', 'Per-card override — no wrapper needed.'],
        ]}/>
      </Section>

      <Section title="Motion" desc="Quick and confident. Durations stay short; easing does the expressive work. Everything here respects prefers-reduced-motion.">
        <TokenTable cols={['Token', 'Value', 'Use for']} rows={motion.map(([t, v, u]) => [`<code>--motion-${t.includes('ease') ? '' : 'duration-'}${t}</code>`, `<span class="ds-mono">${v}</span>`, u])}/>
        <div style={{ marginTop: 22 }}><MotionLab/></div>
      </Section>

      <Section title="Iconography" desc="Docs demos use lucide-react via the Icons registry (24px grid, 1.8 stroke). Yellow is reserved for interactive icons — most sit in the current text color.">
        <div className="ds-icon-grid">
          {Object.keys(Icons).sort().map((name) => {
            const I = Icons[name];
            return (
              <button key={name} className="ds-icon-cell" title={`Icons.${name}`}
                onClick={() => { navigator.clipboard && navigator.clipboard.writeText(`<Icons.${name} size={18}/>`); }}>
                <I size={20}/>
                <span className="ds-icon-cell__name">{name}</span>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 16 }}>
          <CodeSnippet name="adding-an-icon.jsx" code={`// 1. Map a lucide icon in docs-app/components/kit/icons.jsx:
import { Container } from 'lucide-react'
// ...
container: icon(Container),

// 2. Use it anywhere — by component or by name string:
<Icons.container size={18}/>
<StatCard icon="container" .../>   // components that take an icon prop`}/>
        </div>
      </Section>

      <Section title="Voice" desc="Direct. Technical. Warm-but-not-corporate. Think terminal prompt, not marketing email.">
        <div className="ds-grid-2">
          <div className="tollerud-card ds-themed">
            <div className="ds-row" style={{ gap: 7, marginBottom: 14, color: 'var(--success)' }}><Icons.checkCircle size={16}/><span style={{ fontWeight: 600, fontSize: 13, color: 'var(--foreground)' }}>Say this</span></div>
            <div className="ds-col" style={{ gap: 9 }}>
              {['❯ deploy --env production', 'Open Dashboard', 'Port 8080 is in use', 'emma — deployment complete', 'No alerts — everything looks good'].map((s, i) =>
                <code key={i} className="ds-mono" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s}</code>)}
            </div>
          </div>
          <div className="tollerud-card ds-themed">
            <div className="ds-row" style={{ gap: 7, marginBottom: 14, color: 'var(--destructive)' }}><Icons.xCircle size={16}/><span style={{ fontWeight: 600, fontSize: 13, color: 'var(--foreground)' }}>Not this</span></div>
            <div className="ds-col" style={{ gap: 9 }}>
              {['Submit deployment request', 'Click here to get started', 'Oops! Something went wrong!', 'Your deployment was successful', 'There are no items to display'].map((s, i) =>
                <code key={i} className="ds-mono" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through', textDecorationColor: 'rgba(239,68,68,.5)' }}>{s}</code>)}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Tia" desc="Tia — Tollerud Infrastructure Agent — is the brand mascot. Cel-shaded monochrome gakuran, amber eyes, gold buttons. A brand signature, not a UI icon. Use sparingly on landing pages, about sections, agent-running moments and loading states.">
        <div className="ds-grid-2" style={{ alignItems: 'start' }}>
          <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="ds-panel__head"><span className="ds-panel__title">Portrait</span><span className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>brand/tollerud-avatar.svg</span></div>
            <div style={{ padding: 24, display: 'flex', justifyContent: 'center', background: 'var(--tollerud-black)' }}>
              <TiaPortrait width={160} alt="Tia portrait" />
            </div>
            <div style={{ padding: '14px 18px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, borderTop: '1px solid var(--border)' }}>
              Waist-up wave — the default avatar for nav badges, chat bubbles, and compact brand moments. PNG variant (<code className="ds-mono" style={{ fontSize: 12 }}>brand/tollerud-avatar.png</code>) ships for hero-scale renders with drop shadow.
            </div>
          </div>
          <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="ds-panel__head"><span className="ds-panel__title">Full figure</span><span className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>brand/tollerud-avatar-full.svg · .png</span></div>
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'center', background: 'var(--tollerud-black)', maxHeight: 420, overflow: 'hidden' }}>
              <TollerudAvatarFull height={380} alt="Tia full figure" />
            </div>
            <div style={{ padding: '14px 18px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, borderTop: '1px solid var(--border)' }}>
              Head-to-toe illustration for hero sections, empty states, and onboarding. PNG variant (<code className="ds-mono" style={{ fontSize: 12 }}>brand/tollerud-avatar-full.png</code>) ships for hero-scale renders with drop shadow.
            </div>
          </div>
        </div>
        <div className="ds-grid-2" style={{ marginTop: 16 }}>
          <div className="tollerud-card ds-themed">
            <div className="ds-row" style={{ gap: 7, marginBottom: 14, color: 'var(--success)' }}><Icons.checkCircle size={16}/><span style={{ fontWeight: 600, fontSize: 13, color: 'var(--foreground)' }}>Do</span></div>
            <div className="ds-col" style={{ gap: 9 }}>
              {['Use portrait for avatars, chat, and compact UI chrome', 'Use full figure for hero and onboarding moments', 'Place on noir/black or grain-gradient backgrounds', 'One Tia per viewport — she is a signature, not wallpaper'].map((s, i) =>
                <span key={i} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s}</span>)}
            </div>
          </div>
          <div className="tollerud-card ds-themed">
            <div className="ds-row" style={{ gap: 7, marginBottom: 14, color: 'var(--destructive)' }}><Icons.xCircle size={16}/><span style={{ fontWeight: 600, fontSize: 13, color: 'var(--foreground)' }}>Don&apos;t</span></div>
            <div className="ds-col" style={{ gap: 9 }}>
              {['Use Tia as a generic user avatar or icon substitute', 'Crop below the shoulders on the full-figure asset', 'Place on light backgrounds without a dark scrim', 'Inline the SVG — reference the asset file instead'].map((s, i) =>
                <span key={i} style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through', textDecorationColor: 'rgba(239,68,68,.5)' }}>{s}</span>)}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <CodeSnippet name="tia-avatar.jsx" code={`import { TiaPortrait, TollerudAvatarFull } from '@/components/brand'

// Portrait — SVG for crisp scaling, PNG for hero glow
<TiaPortrait width={96} alt="Tia" />
<TiaPortrait variant="png" height={340} glow alt="Tia" />

// Full figure — SVG for docs panels, PNG for hero glow
<TollerudAvatarFull height={480} alt="Tia" />
<TollerudAvatarFull variant="png" height={520} glow alt="Tia" />`}/>
        </div>
      </Section>
    </div>
  );
}
export default PageFoundations;