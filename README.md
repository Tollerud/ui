# Tollerud User Interface

A complete, browsable UI library built around **monochrome + yellow accent**. Noir aesthetic meets modern utility.

**[Live docs →](https://design.tollerud.dev/)** — browse every token, component, and pattern live with copy-paste code.

**Requirements:** React ≥ 18 · TypeScript supported (types included) · Tailwind CSS v4 (v3 supported via `globals-v3.css`)

→ **[Component reference →](COMPONENTS.md)** · **[Setup guide →](GETTING_STARTED.md)** · **[Brand guidelines →](BRAND.md)** · **[Changelog →](CHANGELOG.md)** · **[AI agent skill →](SKILL.md)**

## Packages

| Package | Install | Use when |
|---------|---------|----------|
| [`@tollerud/ui`](https://www.npmjs.com/package/@tollerud/ui) | `npm install @tollerud/ui` | You want the full design system — components, tokens, Tailwind preset |
| [`@tollerud/footer`](https://www.npmjs.com/package/@tollerud/footer) | `npm install @tollerud/footer` | You only need the branded footer, with no other design system dependency |

**Footer maintenance:** `@tollerud/ui` re-exports `Footer` from the same source as `@tollerud/footer`. Use the standalone `@tollerud/footer` package only when you want the footer without pulling in the full design system (and its peer deps). Both packages are maintained in this monorepo; version them together when the footer changes.

## Philosophy

> Clean lines. Sharp contrast. Yellow where it counts.

Tollerud UI is minimal but not cold. It uses a near-black foundation with warm yellow accents for interaction points. Every element has purpose — nothing decorative for its own sake. The cross-hatching spirit lives in the sharp borders, the thin lines, the deliberate whitespace.

## Quick Start

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

**CSS** — one import in `app/globals.css` (Tailwind v4 + tokens + component classes):

```css
@import '@tollerud/ui/globals.css';
@source '../node_modules/@tollerud/ui/dist';
```

Adjust the `@source` path relative to your CSS file so it resolves to `node_modules/@tollerud/ui/dist`.

**Optional preset shim** — if you need utilities from `tollerud-preset.js` beyond what `tokens.css` provides:

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
@source '../node_modules/@tollerud/ui/dist';
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
import { Button, Card, Badge, StatusDot, CodeBlock, Kbd, CommandMenu, NoirGlowBackground } from '@tollerud/ui'
```

TypeScript types are included — no `@types/*` package needed. See **[COMPONENTS.md](COMPONENTS.md)** for the full prop reference for every component.

Publish a new version by bumping `version` in `package.json` and pushing to `main` — the `publish-npm` GitHub Action detects the version change, runs `npm publish` (using the `NPM_TOKEN` secret), and then creates a matching GitHub Release automatically.

### Copy from repo (alternative)

```bash
npm install clsx tailwind-merge
cp tollerud-preset.js globals.css components/ -r <your-next-project>/
```

Then use local paths instead of `@tollerud/ui` in the snippets above.

### Usage example

That's it. You now have all Tailwind colors (`bg-tollerud-yellow`, `text-tollerud-noir-200`), semantic CSS variables (`--primary`, `--background`, `--ring`), component utilities (`.tollerud-card`, `.tollerud-btn--terminal`), and React components ready to import:

```tsx
import { Button, Card, Badge, StatusDot, CodeBlock, Kbd, CommandMenu, NoirGlowBackground } from '@tollerud/ui'

<section className="relative overflow-hidden bg-black">
  <NoirGlowBackground intensity="medium" speed="slow" grain="soft" shape="corners" preserveCenter />
  <div className="relative z-10">
    <Button variant="terminal" size="lg">open_dashboard</Button>
  </div>
</section>
<Card accent>
  <StatusDot status="online" label="Emma — ready" />
</Card>
<CodeBlock>{`❯ systemctl status tollerud-agent`}</CodeBlock>
```

### Plain CSS

Include `tokens.css` or `globals.css` for CSS custom properties and utility classes:

```html
<link rel="stylesheet" href="globals.css">
<div class="tollerud-card">
  <h2 style="color: var(--tollerud-yellow)">Tollerud User Interface</h2>
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

## Usage Patterns

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

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss
```

```tsx
import { Button, Card } from '@tollerud/ui'
// or tree-shake:
import { Button } from '@tollerud/ui/button'
```

See [GETTING_STARTED.md](GETTING_STARTED.md) for Tailwind setup and peer dependencies.

## File Structure

```
design-system/
├── .nvmrc                    # Node 24 for local dev / CI parity
├── package.json              # @tollerud/ui — version, exports, scripts
├── registry.json             # Repo-only drift manifest (`test:drift`; not in npm tarball)
├── CHANGELOG.md              # Version history (synced to docs on build)
├── SKILL.md                  # AI agent catalog — source of truth for exports
├── COMPONENTS.md             # Human prop reference
├── AGENTS.md                 # Contributor / release guide
├── brand/                    # Logo + Tia avatars (npm: @tollerud/ui/brand/*)
├── components/               # React components (*.tsx) + index.ts barrel
├── globals.css               # Tailwind v4 entry (tokens + component layers)
├── globals-v3.css            # Tailwind v3 legacy
├── globals-layers.css        # Shared component CSS layers
├── tokens.css                # Design tokens
├── tollerud-preset.js        # Tailwind preset
├── scripts/                  # Build, validate, docs, and release helpers
├── docs-app/                 # Next.js docs site (static export → _site/)
│   ├── app/                  # App Router + globals.css
│   ├── components/           # Page demos + docs shell
│   ├── styles/docs.css       # Docs chrome + light theme
│   └── public/CNAME          # design.tollerud.dev
└── fixtures/consumer/        # npm tarball install smoke test (CI)
```

## Graphify-inspired Components

New additions inspired by [Graphify Labs](https://graphifylabs.ai/):

| Component | CSS Class | Tailwind Alternative | Description |
|-----------|-----------|---------------------|-------------|
| Noir Glow Background | `.tollerud-noir-glow-*` | `bg-tollerud-noir-glow` | Tollerud.no-inspired acid-yellow glow fallback |
| Grid Background | `.tollerud-grid-bg` | `bg-tollerud-grid bg-[length:40px_40px]` | Subtle yellow grid pattern |
| Glass Nav | `.tollerud-glass` | `backdrop-blur-glass bg-opacity-88` | Frosted glass navigation bar |
| Terminal Button | `.tollerud-btn--terminal` | — | Monospace CTA with `❯` prefix |
| Pill Tag | `.tollerud-pill--outline` / `--muted` | — | Tiny label/tag components |
| Accent Bar | `.tollerud-accent-bar` | `bg-tollerud-gradient-bar h-[1px]` | Gradient divider bar |
| Gradient Text | `.tollerud-gradient-text` | `bg-tollerud-gradient-soft bg-clip-text text-transparent` | Yellow → amber gradient text |
| Display Heading | `.tollerud-display` | `tracking-tightest leading-[0.95] font-semibold text-white` | Tight, impactful display heads |
| Display Shimmer | `.tollerud-display-shimmer` | — | Animated yellow gradient sweep clipped to hero accent text (dark surfaces) |
| Section Container | `.tollerud-section` | `max-w-[1100px] mx-auto px-6` | Content width constraint |