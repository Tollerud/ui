'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, CommandMenu } = __p

/* @tollerud/ui docs — Background treatments */

/* ───────────────────────────────────────────────────────────────
   Squares — faithful port of the animated canvas grid on tollerud.no.
   Scrolls in a direction, fills the hovered cell, and fades to the
   base color at the edges with a radial vignette.
   ─────────────────────────────────────────────────────────────── */
function Squares({ direction = 'diagonal', speed = 0.5, borderColor = '#333', squareSize = 40, hoverFillColor = '#222', base = '#060606', className = '', style }) {
  const canvasRef = useRef(null);
  const reqRef = useRef();
  const offset = useRef({ x: 0, y: 0 });
  const hovered = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.style.background = base;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width; canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const startX = Math.floor(offset.current.x / squareSize) * squareSize;
      const startY = Math.floor(offset.current.y / squareSize) * squareSize;
      ctx.lineWidth = 0.5;
      for (let x = startX; x < w + squareSize; x += squareSize) {
        for (let y = startY; y < h + squareSize; y += squareSize) {
          const sx = x - (offset.current.x % squareSize);
          const sy = y - (offset.current.y % squareSize);
          if (hovered.current &&
              Math.floor((x - startX) / squareSize) === hovered.current.x &&
              Math.floor((y - startY) / squareSize) === hovered.current.y) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(sx, sy, squareSize, squareSize);
          }
          ctx.strokeStyle = borderColor;
          ctx.strokeRect(sx, sy, squareSize, squareSize);
        }
      }
      // radial vignette fading to base at the edges
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.sqrt(w * w + h * h) / 2);
      const rgb = base.replace('#', '');
      const r = parseInt(rgb.slice(0, 2), 16), gg = parseInt(rgb.slice(2, 4), 16), b = parseInt(rgb.slice(4, 6), 16);
      g.addColorStop(0, `rgba(${r},${gg},${b},0)`);
      g.addColorStop(1, base);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const tick = () => {
      const s = Math.max(speed, 0.1);
      if (direction === 'right')   offset.current.x = (offset.current.x - s + squareSize) % squareSize;
      if (direction === 'left')    offset.current.x = (offset.current.x + s + squareSize) % squareSize;
      if (direction === 'up')      offset.current.y = (offset.current.y + s + squareSize) % squareSize;
      if (direction === 'down')    offset.current.y = (offset.current.y - s + squareSize) % squareSize;
      if (direction === 'diagonal') {
        offset.current.x = (offset.current.x - s + squareSize) % squareSize;
        offset.current.y = (offset.current.y - s + squareSize) % squareSize;
      }
      draw();
      reqRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const startX = Math.floor(offset.current.x / squareSize) * squareSize;
      const startY = Math.floor(offset.current.y / squareSize) * squareSize;
      hovered.current = {
        x: Math.floor((mx + offset.current.x - startX) / squareSize),
        y: Math.floor((my + offset.current.y - startY) / squareSize),
      };
    };
    const onLeave = () => { hovered.current = null; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    reqRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize, base]);

  return <canvas ref={canvasRef} className={`tollerud-squares ${className}`} style={style}/>;
}

/* ───────────────────────────────────────────────────────────────
   GrainGradient — CSS fallback for the tollerud-landing GradientBackground.
   It mirrors the same black backplate, yellow color ramp, no-noise default,
   and strongest top-right / bottom-left / top-left corner pools.
   ─────────────────────────────────────────────────────────────── */
function GrainGradient({ colors = ['hsl(54, 85%, 66%)', 'hsl(56, 100%, 80%)', 'hsl(56, 100%, 50%)'], intensity = 0.45, grain = false, animate = true, className = '', style }) {
  const [c1, c2, c3] = colors;
  const a = intensity;
  return (
    <div className={`tollerud-grain-gradient ${animate ? 'is-animated' : ''} ${className}`} style={style} aria-hidden="true">
      <div className="tollerud-grain-gradient__field" style={{
        background:
          `radial-gradient(70% 75% at 100% 0%, ${c2} 0%, transparent 70%),` +
          `radial-gradient(80% 85% at 0% 100%, ${c3} 0%, transparent 72%),` +
          `radial-gradient(60% 65% at 0% 0%, ${c1} 0%, transparent 68%)`,
        opacity: a,
      }}/>
      {grain && <div className="tollerud-grain-gradient__grain"/>}
    </div>
  );
}

/* ── docs page ── */
function BgFrame({ children, h = 260, label }) {
  return (
    <div style={{ position: 'relative', height: h, borderRadius: 'var(--radius-lg,0.5rem)', overflow: 'hidden', border: '1px solid var(--border)', background: '#060606' }}>
      {children}
      {label && <span style={{ position: 'absolute', bottom: 12, left: 14, zIndex: 3, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'rgba(245,245,245,0.6)' }}>{label}</span>}
    </div>
  );
}

function GradientReadabilityDemo({ treatment }) {
  const isShadow = treatment === 'shadow';
  const isEdge = treatment === 'edge';
  const isHeroBlur = treatment === 'heroBlur';
  const label = isEdge ? 'edge-biased shader' : isHeroBlur ? 'full hero blur' : isShadow ? 'left shadow gradient' : 'copy blur scrim';
  return (
    <BgFrame label={label} h={420}>
      {isEdge ? (
        <>
          <NoirGlowBackground intensity="medium" scale={1.55} offsetX={0.38} className="absolute inset-0" />
          <NoirGlowBackground intensity="subtle" speed="slow" scale={1.55} offsetX={-0.38} className="absolute inset-0" />
        </>
      ) : (
        <NoirGlowBackground intensity="medium" className="absolute inset-0" />
      )}
      {isShadow && <div className="ds-hero-readable-shadow"/>}
      {isHeroBlur && <div className="ds-hero-readable-fullblur"/>}
      <div className="tollerud-grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.25, zIndex: 1 }}/>
      <div className="ds-hero-readable-demo">
        <div className={isShadow || isEdge || isHeroBlur ? 'ds-hero-readable-copy' : 'ds-hero-readable-copy ds-hero__copy--scrim'}>
          <div className="ds-row" style={{ gap: 10, marginBottom: 18 }}>
            <span className="tollerud-pill tollerud-pill--outline">v1.0 · noir + yellow</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(245,245,245,0.58)' }}>{'>'}60 components</span>
          </div>
          <h3 style={{ fontSize: 'clamp(30px, 5vw, 46px)', lineHeight: 0.98, letterSpacing: '-0.045em', color: '#F5F5F5', fontWeight: 600 }}>
            Dark. Monochrome.<br/><span className="tollerud-display-shimmer">Yellow where it counts.</span>
          </h3>
          <p style={{ marginTop: 16, maxWidth: 430, color: 'rgba(245,245,245,0.72)', fontSize: 15.5, lineHeight: 1.55 }}>
            {isEdge
              ? 'The shader is scaled down and shifted toward both edges, leaving calmer negative space behind the text.'
              : isHeroBlur
                ? 'The whole hero gets a soft dark glass layer, so the copy reads without creating a separate text panel.'
              : 'The real Paper shader stays visible, while the copy keeps enough contrast to survive bright motion behind it.'}
          </p>
          <div className="ds-row" style={{ gap: 12, marginTop: 22 }}>
            <Button variant="terminal" size="md">explore_system</Button>
            <Button variant="secondary" size="md">Components</Button>
          </div>
        </div>
      </div>
    </BgFrame>
  );
}

const HERO_READABLE_SCRIM = `import { NoirGlowBackground } from '@tollerud/ui'

export function HeroWithCopyScrim({ children }) {
  return (
    <section className="relative min-h-[420px] overflow-hidden">
      <NoirGlowBackground intensity="medium" className="absolute inset-0" />
      <div className="relative z-20 flex min-h-full items-center p-9">
        <div className="hero-copy-scrim max-w-[520px]">{children}</div>
      </div>
    </section>
  )
}`

const HERO_READABLE_SCRIM_CSS = `/* globals.css — local blur scrim behind copy only */
.hero-copy-scrim {
  margin: -24px -26px;
  padding: 24px 26px;
  border-radius: 14px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.54) 58%, rgba(0, 0, 0, 0.18));
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(16px) saturate(0.9);
  -webkit-backdrop-filter: blur(16px) saturate(0.9);
}`

const HERO_READABLE_FULL_BLUR = `import { NoirGlowBackground } from '@tollerud/ui'

export function HeroWithFullBlur({ children }) {
  return (
    <section className="relative min-h-[420px] overflow-hidden">
      <NoirGlowBackground intensity="medium" className="absolute inset-0" />
      <div className="hero-readable-fullblur absolute inset-0 z-10 pointer-events-none" aria-hidden />
      <div className="relative z-20 flex min-h-full items-center p-9">
        <div className="max-w-[520px]">{children}</div>
      </div>
    </section>
  )
}`

const HERO_READABLE_FULL_BLUR_CSS = `/* globals.css — soft glass across the whole hero */
.hero-readable-fullblur {
  background:
    radial-gradient(100% 100% at 50% 48%, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.46) 78%),
    rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(14px) saturate(0.9);
  -webkit-backdrop-filter: blur(14px) saturate(0.9);
}`

const HERO_READABLE_SHADOW = `import { NoirGlowBackground } from '@tollerud/ui'

export function HeroWithLeftShadow({ children }) {
  return (
    <section className="relative min-h-[420px] overflow-hidden">
      <NoirGlowBackground intensity="medium" className="absolute inset-0" />
      <div className="hero-readable-shadow absolute inset-0 z-10 pointer-events-none" aria-hidden />
      <div className="relative z-20 flex min-h-full items-center p-9">
        <div className="max-w-[520px]">{children}</div>
      </div>
    </section>
  )
}`

const HERO_READABLE_SHADOW_CSS = `/* globals.css — broad left-side shadow, shader stays visible on the right */
.hero-readable-shadow {
  background:
    radial-gradient(90% 120% at 0% 50%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.68) 38%, rgba(0, 0, 0, 0.28) 64%, transparent 82%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.68), rgba(0, 0, 0, 0.18) 58%, transparent);
}`

const HERO_READABLE_EDGE = `import { NoirGlowBackground } from '@tollerud/ui'

export function HeroWithEdgeShader({ children }) {
  return (
    <section className="relative min-h-[420px] overflow-hidden">
      <NoirGlowBackground intensity="medium" scale={1.55} offsetX={0.38} className="absolute inset-0" />
      <NoirGlowBackground intensity="subtle" speed="slow" scale={1.55} offsetX={-0.38} className="absolute inset-0" />
      <div className="relative z-20 flex min-h-full items-center p-9">
        <div className="max-w-[520px]">{children}</div>
      </div>
    </section>
  )
}`

function PageBackgrounds() {
  return (
    <div>
      <PageHeader icon="layers" eyebrow="Backgrounds · ported from tollerud.no" title="Backgrounds"
        lede="The two atmospheres that power the live site, lifted into the system as drop-in components. Move your cursor over the grid — it lights the cell beneath it."/>

      <Section title="Noir glow · live shader" desc="NoirGlowBackground from @tollerud/ui — the packaged @paper-design/shaders-react grain atmosphere (corners shape, yellow ramp, animated). Requires @paper-design/shaders-react in the host app.">
        <BgFrame label="NoirGlowBackground · live WebGL" h={300}>
          <div style={{ position: 'relative', height: '100%', minHeight: 260 }}>
            <NoirGlowBackground intensity="medium" speed="medium" className="absolute inset-0" />
          </div>
        </BgFrame>
        <CodeSnippet name="noir-glow-live.jsx" code={`<div className="relative min-h-[280px]">
  <NoirGlowBackground intensity="medium" speed="medium" className="absolute inset-0" />
  <div className="relative z-20">{children}</div>
</div>`}/>
      </Section>

      <Section title="Noir glow · CSS fallback" desc="Pass forceCssFallback for static export, reduced-motion, or when WebGL is unavailable.">
        <BgFrame label="NoirGlowBackground · forceCssFallback" h={280}>
          <div style={{ position: 'relative', height: '100%', minHeight: 240 }}>
            <NoirGlowBackground forceCssFallback intensity="medium" preserveCenter className="absolute inset-0" />
            <div style={{ position: 'relative', zIndex: 20, padding: '32px 28px' }}>
              <span className="tollerud-pill tollerud-pill--outline">@tollerud/ui</span>
              <h3 className="tollerud-display--secondary" style={{ marginTop: 12, fontSize: 28, color: '#F5F5F5' }}>Noir glow</h3>
              <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 360 }}>Drop-in background for heroes and empty states. Pass forceCssFallback when WebGL is unavailable.</p>
            </div>
          </div>
        </BgFrame>
        <CodeSnippet name="noir-glow.jsx" code={`<NoirGlowBackground
  intensity="medium"
  preserveCenter
  forceCssFallback={false}
  className="absolute inset-0"
/>`}/>
      </Section>

      <Section title="Grain gradient · CSS only" desc="A pure-CSS approximation using the same yellow ramp and corner composition — zero WebGL cost. NoirGlowBackground uses a similar fallback when forceCssFallback is set.">
        <BgFrame label="GrainGradient · CSS only">
          <GrainGradient/>
        </BgFrame>
      </Section>

      <Section title="Hero readability treatments" desc="Four ways to keep copy readable over the live grain gradient: a local blur scrim, a full-hero blur, a broad left-side shadow, or a scaled/offset shader that keeps motion toward the edges.">
        <SubHead>Copy blur scrim</SubHead>
        <GradientReadabilityDemo treatment="scrim"/>
        <CodeSnippet name="hero-readable-scrim.jsx" code={HERO_READABLE_SCRIM}/>
        <CodeSnippet name="hero-readable-scrim.css" code={HERO_READABLE_SCRIM_CSS}/>

        <SubHead>Full hero blur</SubHead>
        <GradientReadabilityDemo treatment="heroBlur"/>
        <CodeSnippet name="hero-readable-fullblur.jsx" code={HERO_READABLE_FULL_BLUR}/>
        <CodeSnippet name="hero-readable-fullblur.css" code={HERO_READABLE_FULL_BLUR_CSS}/>

        <SubHead>Left shadow gradient</SubHead>
        <GradientReadabilityDemo treatment="shadow"/>
        <CodeSnippet name="hero-readable-shadow.jsx" code={HERO_READABLE_SHADOW}/>
        <CodeSnippet name="hero-readable-shadow.css" code={HERO_READABLE_SHADOW_CSS}/>

        <SubHead>Edge-biased shader</SubHead>
        <GradientReadabilityDemo treatment="edge"/>
        <CodeSnippet name="hero-readable-edge.jsx" code={HERO_READABLE_EDGE}/>
      </Section>

      <Section title="Animated grid" desc="A scrolling canvas grid that fades to #060606 at the edges and fills the square under the cursor. Direction, speed, cell size and colors are all props.">
        <div className="ds-grid-2">
          <BgFrame label="direction: diagonal · #333 borders">
            <Squares direction="diagonal" speed={0.5} borderColor="#333" hoverFillColor="#222"/>
          </BgFrame>
          <BgFrame label="accent: yellow borders + glow fill">
            <Squares direction="up" speed={0.4} borderColor="rgba(232,213,0,0.22)" hoverFillColor="rgba(232,213,0,0.14)"/>
          </BgFrame>
        </div>
        <CodeSnippet name="squares.jsx" code={`<Squares
  direction="diagonal"   // right | left | up | down | diagonal
  speed={0.5}
  squareSize={40}
  borderColor="#333"
  hoverFillColor="#222"
  base="#060606"
/>`}/>
      </Section>

      <Section title="In use" desc="The grain gradient backs the Overview hero; the grid suits full-bleed section dividers and empty states. Both sit behind content at a lower z-index — keep foreground on z-20+.">
        <div className="tollerud-card ds-themed" style={{ position: 'relative', overflow: 'hidden', background: '#000', padding: 0 }}>
          <GrainGradient intensity={0.4}/>
          <div style={{ position: 'relative', zIndex: 20, padding: '40px 36px' }}>
            <span className="tollerud-pill tollerud-pill--outline">live atmosphere</span>
            <h3 className="tollerud-display" style={{ fontSize: 30, marginTop: 14, color: '#F5F5F5' }}>Run your stack like production.</h3>
            <div className="ds-row" style={{ gap: 12, marginTop: 20 }}>
              <Button variant="terminal" size="md">deploy --free</Button>
              <Button variant="secondary" size="md">Read the docs</Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export { Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo };
export default PageBackgrounds;
