'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import { TiaPortrait } from '@/components/brand'
import {
  PACKAGE_VERSION,
  REGISTRY_COMPONENT_COUNT,
  FOUNDATION_TOPIC_COUNT,
  COLOR_TOKEN_COUNT,
} from '@/lib/docs-stats'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, CommandMenu } = __p

/* Tollerud DS — Overview / landing (the bold moment). → window.PageOverview */
function PageOverview({ go }) {
  const [bold, setBold] = useState(true);

  const heroBg = bold
    ? { background: '#000' }
    : { background: 'var(--surface-raised)' };

  return (
    <div>
      {/* ── HERO ── */}
      <div className="ds-themed" style={{ position: 'relative', overflow: 'hidden', borderRadius: 14, border: '1px solid var(--border)', ...heroBg, marginBottom: 40 }}>
        {bold && (
          <NoirGlowBackground intensity="loud" speed="medium" className="absolute inset-0" />
        )}
        {bold && <div className="ds-hero-readable-shadow" aria-hidden="true"/>}
        <div className="tollerud-grid-bg" style={{ position: 'absolute', inset: 0, opacity: bold ? 0.4 : 1, zIndex: 1 }}/>
        <div className="ds-hero__grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, padding: '52px 48px', alignItems: 'center' }}>
          <div className="ds-hero__copy">
            <div className="ds-row" style={{ gap: 10, marginBottom: 22 }}>
              <span className="tollerud-pill tollerud-pill--outline">v{PACKAGE_VERSION} · noir + yellow</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: bold ? 'rgba(245,245,245,0.5)' : 'var(--text-muted)' }}>{'>'}{REGISTRY_COMPONENT_COUNT} registry components · {FOUNDATION_TOPIC_COUNT} foundation topics</span>
            </div>
            <h1 className="ds-hero__title" style={{ fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 0.98, color: bold ? '#F5F5F5' : 'var(--foreground)' }}>
              Dark. Monochrome.<br/><span className="ds-shimmer">Yellow where it counts.</span>
            </h1>
            <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.6, color: bold ? 'rgba(245,245,245,0.7)' : 'var(--text-secondary)', maxWidth: 480 }}>
              A high-contrast UI library for tools, dashboards and homelab UIs. Every token, component and pattern — live, themeable, and copy-paste ready.
            </p>
            <div className="ds-row" style={{ gap: 12, marginTop: 28 }}>
              <button className="tollerud-btn tollerud-btn--terminal tollerud-btn--lg" onClick={() => go('getting-started')}>npm_install</button>
              <button className="tollerud-btn tollerud-btn--secondary tollerud-btn--lg" style={bold ? { color: '#F5F5F5', borderColor: 'rgba(245,245,245,0.2)' } : {}} onClick={() => go('components')}>Components</button>
            </div>
            <div style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 9, padding: '9px 13px', borderRadius: 8, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(245,245,245,0.12)', fontFamily: 'var(--font-mono)', fontSize: 13, maxWidth: '100%' }}>
              <span style={{ color: 'var(--tollerud-yellow)' }}>❯</span>
              <Typewriter lines={['npm i @tollerud/ui', 'deploy --env production', 'systemctl status tia-agent', 'docker compose up -d']} style={{ color: '#E5E5E5', whiteSpace: 'nowrap', overflow: 'hidden' }}/>
            </div>
          </div>
          <div className="ds-hero__media" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', minHeight: 300 }}>
            <TiaPortrait variant="png" height={340} glow={bold} alt="Tia — Tollerud mascot" />
          </div>
        </div>
        {/* bold/calm toggle */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
          <div className={`tollerud-segmented${bold ? ' ds-hero__segmented' : ''}`}>
            <button aria-pressed={bold} onClick={() => setBold(true)}>Bold</button>
            <button aria-pressed={!bold} onClick={() => setBold(false)}>Calm</button>
          </div>
        </div>
      </div>

      {/* ── Stats band ── */}
      <div className="ds-grid-4" data-reveal style={{ marginBottom: 40 }}>
        {[
          { v: REGISTRY_COMPONENT_COUNT, suffix: '', label: 'Registry components' },
          { v: FOUNDATION_TOPIC_COUNT, suffix: '', label: 'Foundation topics' },
          { v: COLOR_TOKEN_COUNT, suffix: '+', label: 'Color tokens' },
          { v: 2, suffix: '', label: 'Themes · light & dark' },
        ].map((s, i) => (
          <div className="tollerud-card ds-themed ds-lift" key={i} style={{ textAlign: 'center', padding: '22px 16px' }}>
            <div className="ds-shimmer" style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
              <CountUp value={s.v} suffix={s.suffix}/>
            </div>
            <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Principles ── */}
      <Section title="Principles" desc="Five rules that keep the system coherent across any product built on it.">
        <div className="ds-grid-3">
          {[
            { icon: 'moon', t: 'Dark-first', d: 'Design starts in the dark. Light mode is a faithful translation, not the default.' },
            { icon: 'zap', t: 'Yellow is the signal', d: 'If it is yellow, you can click it. Interaction points only — never decoration.' },
            { icon: 'shield', t: 'One color pop', d: 'No rainbows. Yellow carries the weight; state colors stay muted to avoid noise.' },
            { icon: 'grid', t: 'Sharp when it counts', d: 'Subtle radius, full-round only for pills. Sharp corners hold the noir feel.' },
            { icon: 'activity', t: 'Glow with purpose', d: 'Yellow glow appears on hover and active states only. Never ambient.' },
            { icon: 'code', t: 'Terminal personality', d: 'The ❯ prefix and mono type signal "this is a tool, not a brochure".' },
          ].map((p, i) => {
            const I = Icons[p.icon];
            return (
              <div className="tollerud-card ds-themed" key={i}>
                <span style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: 8, background: 'rgba(232,213,0,0.12)', color: 'var(--tollerud-yellow)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><I size={18}/></span>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--foreground)', marginBottom: 5 }}>{p.t}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{p.d}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Explore ── */}
      <Section title="Explore the system" desc="Design reference and full-screen examples — each page has live demos and copy-paste React + Tailwind.">
        <div className="ds-grid-3">
          {[
            { id: 'getting-started', icon: 'code', t: 'Getting started', d: 'Install, Tailwind v4, peers, Server Components.' },
            { id: 'foundations', icon: 'palette', t: 'Foundations', d: 'Color, type, spacing, radius, shadow, motion, voice.' },
            { id: 'components', icon: 'grid', t: 'Components', d: 'Core primitives — button, card, badge, status, layout.' },
            { id: 'forms', icon: 'forms', t: 'Forms', d: 'Inputs, selects, combobox, form row, validation.' },
            { id: 'navigation', icon: 'compass', t: 'Navigation & Overlays', d: 'Breadcrumbs, dialogs, drawer, toasts, command.' },
            { id: 'charts', icon: 'chart', t: 'Charts', d: 'Bar, area, donut and sparkline — palette-aware.' },
            { id: 'blocks', icon: 'blocks', t: 'Blocks', d: 'Hero, feature grid, pricing and CTA sections.' },
            { id: 'mission-control', icon: 'app', t: 'Mission Control', d: 'A working dashboard built from the system.' },
            { id: 'data-table', icon: 'server', t: 'Data Table', d: 'Rich table with search, bulk actions, pagination.' },
          ].map((s, i) => {
            const I = Icons[s.icon];
            return (
              <button className="tollerud-card ds-themed ds-lift" key={i} onClick={() => go(s.id)} style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }} data-tilt>
                <div className="ds-row" style={{ justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--tollerud-yellow)' }}><I size={20}/></span>
                  <span style={{ color: 'var(--text-muted)' }}><Icons.arrowRight size={16}/></span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 15.5, color: 'var(--foreground)' }}>{s.t}</div>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>{s.d}</p>
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Install ── */}
      <Section title="Install" desc="Full setup lives on Getting started — install command, peers, and Tailwind @source.">
        <div className="ds-row" style={{ gap: 12 }}>
          <button className="tollerud-btn tollerud-btn--primary tollerud-btn--md" onClick={() => go('getting-started')}>Getting started</button>
          <button className="tollerud-btn tollerud-btn--ghost tollerud-btn--md" onClick={() => go('foundations')}>Foundations</button>
        </div>
      </Section>
    </div>
  );
}
export default PageOverview;