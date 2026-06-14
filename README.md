# Tollerud User Interface

A complete, browsable UI library built around **monochrome + yellow accent**. Noir aesthetic meets modern utility.

**[Live docs →](https://design.tollerud.dev/)** — browse every token, component, and pattern live with copy-paste code.

**Requirements:** React ≥ 18 · TypeScript supported (types included) · Tailwind CSS v4 (v3 supported via `globals-v3.css`)

→ **[Components →](COMPONENTS.md)** · **[Props (generated) →](PROPS.generated.md)** · **[Setup guide →](GETTING_STARTED.md)** · **[Brand guidelines →](BRAND.md)** · **[Changelog →](CHANGELOG.md)** · **[AI agent skill →](SKILL.md)**

## Packages

| Package | Install | Use when |
|---------|---------|----------|
| [`@tollerud/ui`](https://www.npmjs.com/package/@tollerud/ui) | `npm install @tollerud/ui` | You want the full design system — components, tokens, Tailwind preset |
| [`@tollerud/footer`](https://www.npmjs.com/package/@tollerud/footer) | `npm install @tollerud/footer` | You only need the branded footer, with no other design system dependency |

**Footer maintenance:** `@tollerud/ui` exports `Footer` from the same source as `@tollerud/footer` (`npm run sync:footer` keeps them lockstep). Use the standalone package when you want the branded footer without Radix, Lucide, Framer Motion, Sonner, or other `@tollerud/ui` peers — `@tollerud/footer` bundles `clsx` and `tailwind-merge` as dependencies **on purpose** for that path. You still need Tailwind + Tollerud tokens for footer styles. Deprecation of `@tollerud/footer` is not planned for now.

## Philosophy

> Clean lines. Sharp contrast. Yellow where it counts.

Tollerud UI is minimal but not cold. It uses a near-black foundation with warm yellow accents for interaction points. Every element has purpose — nothing decorative for its own sake. The cross-hatching spirit lives in the sharp borders, the thin lines, the deliberate whitespace.

## Quick Start

**Starter template:** [`examples/next-starter/`](examples/next-starter/) — copy into a new project, `npm install`, `npm run dev`. See [GETTING_STARTED.md](GETTING_STARTED.md) for the full guide, [copy-paste AI agent prompts](GETTING_STARTED.md#start-with-an-ai-agent) for Cursor/Claude Code setup, and migration from copied components.

### npm package (recommended)

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss@4 \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress \
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip \
  lucide-react framer-motion sonner
```

As of **v2.0.0**, Radix primitives, Lucide, Framer Motion, and Sonner are **peer dependencies** — your app must install them (one line above). The design system bundles only `class-variance-authority`.

`@paper-design/shaders-react` is an **optional** peer — install only if you use `NoirGlowBackground`:

```bash
npm install @paper-design/shaders-react
```

**CSS** — two imports in `app/globals.css` (Tailwind v4 + tokens + component class scanning):

```css
@import '@tollerud/ui/globals.css';
@import '@tollerud/ui/source.css';
```

`source.css` resolves `@source` inside the installed package — works with npm, pnpm, Yarn workspaces, and Bun. See [GETTING_STARTED.md](GETTING_STARTED.md) for manual `@source` paths in monorepos.

**Optional preset shim** — if you need utilities from `@tollerud/ui/preset` beyond what `tokens.css` provides:

```ts
// tailwind.config.ts
import tollerudPreset from '@tollerud/ui/preset'
export default { presets: [tollerudPreset] }
```

```css
@import 'tailwindcss';
@config './tailwind.config.ts';
@import '@tollerud/ui/tokens.css';
@import '@tollerud/ui/globals-layers.css';
@import '@tollerud/ui/source.css';
```

**Tailwind v3 (legacy)** — preset in `tailwind.config.ts` plus `@tollerud/ui/globals-v3.css`:

```ts
import type { Config } from 'tailwindcss'
import tollerudPreset from '@tollerud/ui/preset'

export default {
  presets: [tollerudPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@tollerud/ui/dist/**/*.{js,mjs}',
  ],
} satisfies Config
```

```css
@import 'tailwindcss/preflight';
@import 'tailwindcss/utilities';
@import '@tollerud/ui/globals-v3.css';
```

**Components:**

```tsx
import { Button, Card, Badge, StatusDot, CodeBlock, Kbd, CommandMenu, HeroBlock, ResourceList } from '@tollerud/ui'
```

TypeScript types are included — no `@types/*` package needed. **[SKILL.md](SKILL.md)** lists every export; **[PROPS.generated.md](PROPS.generated.md)** has machine-checked prop tables; **[COMPONENTS.md](COMPONENTS.md)** has usage examples and patterns.

Publish a new version by bumping `version` in `package.json` and pushing to `main` — the `publish-npm` GitHub Action detects the version change, runs `npm publish --provenance` via npm Trusted Publishers (OIDC), and then creates a matching GitHub Release automatically.

### Do not copy package internals

Use the npm package in consumer apps. Do not vendor `components/`, `lib/utils.ts`, or a local `components/ui` clone from this repo — copied files drift from the published API and make agents rebuild Tollerud UI by hand. If you already copied components, follow the migration checklist in [GETTING_STARTED.md](GETTING_STARTED.md).

### Usage example

That's it. You now have all Tailwind colors (`bg-tollerud-yellow`, `text-tollerud-noir-200`), semantic CSS variables (`--primary`, `--background`, `--ring`), component utilities (`.tollerud-card`, `.tollerud-btn--terminal`), and React components ready to import. Prefer component-first composition in apps:

```tsx
import { Button, Card, CodeBlock, HeroBlock, StatusDot } from '@tollerud/ui'

<HeroBlock
  eyebrow="homelab control plane"
  title="Run your stack like production."
  description="Deploy, monitor, and roll back from one keyboard-first console."
  actions={<Button variant="terminal" size="lg">open_dashboard</Button>}
/>
<Card accent>
  <StatusDot status="online" label="Emma — ready" />
</Card>
<CodeBlock>{`❯ systemctl status tollerud-agent`}</CodeBlock>
```

### Consumer styling policy

Tailwind is allowed inside `@tollerud/ui` and as small app-level glue. In consumer apps, prefer exported components and layout primitives first; do not rebuild buttons, cards, panels, navs, dashboards, or branded page structure with raw utilities. See [GETTING_STARTED.md](GETTING_STARTED.md#consumer-styling-policy) for allowed and discouraged examples.

### Plain CSS

Include `tokens.css` or `globals.css` for CSS custom properties and utility classes. This path is for static HTML/prototyping; React apps should prefer the package components above.

```html
<link rel="stylesheet" href="globals.css">
<div class="tollerud-card">
  <h2 class="tollerud-display--secondary">Tollerud User Interface</h2>
  <button class="tollerud-btn tollerud-btn--primary tollerud-btn--md">Get Started</button>
</div>
```

### Brand Mascot

The design system ships brand assets under `brand/` — import via `@tollerud/ui/brand/tollerud-avatar.svg` (and `.png` / full-figure variants) for headers, landing pages, and agent identity moments. Prefer `<Monogram />` for nav lockups.

## Palette Summary

| Token | Hex | Usage |
|-------|-----|-------|
| `--tollerud-yellow` / `--tollerud-acid` | `#FFFF00` | Primary actions, highlights, links, focus, key data |
| `--tollerud-yellow-warm` | `#E8D500` | Secondary yellow, gradients, warm states |
| `--tollerud-amber` | `#FFB800` | Warmth accents, secondary highlights |
| `--tollerud-black` | `#0A0A0A` | Default background |
| `--tollerud-noir-900` | `#121212` | Card / raised surface |
| `--tollerud-noir-800` | `#1A1A1A` | Overlay / modal surface |
| `--tollerud-noir-700` | `#252525` | Hover state surface |
| `--tollerud-noir-600` | `#333333` | Borders |
| `--tollerud-noir-400` | `#666666` | Muted text, disabled |
| `--tollerud-noir-200` | `#AAAAAA` | Secondary text |
| `--tollerud-noir-50` | `#E5E5E5` | Subtle dividers (light) |
| `--tollerud-white` | `#F5F5F5` | Primary text |

## Typography

- **Display / Body:** Inter — clean, highly readable, Swiss-inspired
- **Monospace:** JetBrains Mono — for code, metrics, and terminal aesthetics
- **Scale:** 2xs (0.625rem) → 9xl (8rem)
- **Weights:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 900 (black)

## CSS class reference

These classes are available for package internals, docs examples, and static HTML/prototyping. React consumers should prefer the exported components and use Tailwind only as small local glue.

### Buttons
```html
<button class="tollerud-btn tollerud-btn--primary tollerud-btn--md">Action</button>
<button class="tollerud-btn tollerud-btn--secondary tollerud-btn--md">Cancel</button>
<button class="tollerud-btn tollerud-btn--ghost tollerud-btn--md">More</button>
```

### Cards
```html
<div class="tollerud-card">
  <h3 class="font-semibold mb-1">Title</h3>
  <p class="text-tollerud-text-secondary text-sm">Content</p>
</div>
```

### Badges
```html
<span class="tollerud-badge tollerud-badge--accent">New</span>
<span class="tollerud-badge tollerud-badge--success">Online</span>
<span class="tollerud-badge tollerud-badge--error">Offline</span>
```

### Code
```html
<code class="font-mono text-sm text-tollerud-text-secondary">const x = 42;</code>
```

## Principles

1. **Dark-first** — Light mode is secondary. Design starts in the dark.
2. **Yellow is the signal** — Yellow is for interaction. If it's yellow, you can click it.
3. **One color pop** — No rainbows. Yellow carries the weight. State colors (green, red, blue) are muted to avoid noise.
4. **Sharp when it counts** — Radius is subtle. Full round only for pills. Sharp corners for the noir feel.
5. **Glow with purpose** — Yellow glow only on hover/active states. Never decorative.

## Install

See [GETTING_STARTED.md](GETTING_STARTED.md) for the current peer install command, Tailwind setup, subpath imports, and consumer styling policy.

After setup, self-audit consumer apps with:

```bash
npx tollerud-ui-audit
```

The command ships with `@tollerud/ui` and flags missing `source.css`, copied `components/ui` clones, hardcoded brand colors, and invalid Button/Link nesting. See GETTING_STARTED.md → Consumer project checklist for the full error-code reference and `--warn-only` flag.

## File Structure

```
design-system/
├── .nvmrc                    # Node 24 for local dev / CI parity
├── package.json              # @tollerud/ui — version, exports, scripts
├── registry.json             # Repo-only drift manifest (`test:drift`; not in npm tarball)
├── CHANGELOG.md              # Version history (synced to docs on build)
├── SKILL.md                  # AI agent catalog — source of truth for exports
├── COMPONENTS.md             # Usage guide + export index (props: PROPS.generated.md)
├── PROPS.generated.md        # Auto-generated prop tables (`npm run test:props`)
├── AGENTS.md                 # Contributor / release guide
├── brand/                    # Logo + Tia avatars (npm: @tollerud/ui/brand/*)
├── components/               # React components (*.tsx) + index.ts barrel
├── globals.css               # Tailwind v4 entry (tokens + component layers)
├── globals-v3.css            # Tailwind v3 legacy
├── globals-layers.css        # Shared component CSS layers
├── tokens.css                # Design tokens
├── tollerud-preset.cjs       # Tailwind preset (CJS)
├── scripts/                  # Build, validate, docs, and release helpers
├── docs-app/                 # Next.js docs site (static export → _site/)
│   ├── app/                  # App Router + globals.css
│   ├── components/           # Page demos + docs shell
│   ├── styles/docs.css       # Docs chrome + light theme
│   └── public/CNAME          # design.tollerud.dev
└── fixtures/consumer/        # npm tarball install smoke test (CI)
```

## CSS utilities and generated classes

These lower-level classes and Tailwind utilities are available for package internals, docs demos, static HTML, and custom escape hatches. React consumers should still prefer exported components and use utilities only as small local glue.

| Area | CSS Class | Implementation utility | Description |
|-----------|-----------|---------------------|-------------|
| Noir Glow Background | `.tollerud-noir-glow-*` | `bg-tollerud-noir-glow` | Tollerud.no-inspired acid-yellow glow fallback |
| Grid Background | `.tollerud-grid-bg` | `bg-tollerud-grid bg-[length:40px_40px]` | Subtle yellow grid pattern |
| Terminal Button | `.tollerud-btn--terminal` | — | Monospace CTA with `❯` prefix |
| Pill Tag | `.tollerud-pill--outline` / `--muted` | — | Tiny label/tag components |
| Accent Bar | `.tollerud-accent-bar` | `bg-tollerud-gradient-bar h-[1px]` | Gradient divider bar |
| Gradient Text | `.tollerud-gradient-text` | `bg-tollerud-gradient-soft bg-clip-text text-transparent` | Yellow → amber gradient text |
| Display Heading | `.tollerud-display` | `tracking-tightest leading-[0.95] font-semibold text-white` | Tight, impactful display heads |
| Display Shimmer | `.tollerud-display-shimmer` | — | Animated yellow gradient sweep clipped to hero accent text (dark surfaces) |