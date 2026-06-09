# Tollerud User Interface

A complete, browsable UI library built around **monochrome + yellow accent**. Noir aesthetic meets modern utility.

**[Live docs →](https://tollerud.github.io/design-system/)** — browse every token, component, and pattern live with copy-paste code.

**Requirements:** React ≥ 18 · TypeScript supported (types included) · Tailwind CSS v4 (v3 supported via `globals-v3.css`)

→ **[Component reference →](COMPONENTS.md)** · **[Setup guide →](GETTING_STARTED.md)** · **[Brand guidelines →](BRAND.md)** · **[Changelog →](CHANGELOG.md)** · **[AI agent skill →](SKILL.md)**

## Packages

| Package | Install | Use when |
|---------|---------|----------|
| [`@tollerud/ui`](https://www.npmjs.com/package/@tollerud/ui) | `npm install @tollerud/ui` | You want the full design system — components, tokens, Tailwind preset |
| [`@tollerud/footer`](https://www.npmjs.com/package/@tollerud/footer) | `npm install @tollerud/footer` | You only need the branded footer, with no other design system dependency |

`@tollerud/ui` already re-exports `Footer` internally — install `@tollerud/footer` separately only when you want the footer in a project that doesn't use the full design system.

## Philosophy

> Clean lines. Sharp contrast. Yellow where it counts.

Tollerud DS is minimal but not cold. It uses a near-black foundation with warm yellow accents for interaction points. Every element has purpose — nothing decorative for its own sake. The cross-hatching spirit lives in the sharp borders, the thin lines, the deliberate whitespace.

## Quick Start

### npm package (recommended)

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss@4
```

`@paper-design/shaders-react` is an **optional** peer dependency — the package installs and works without it. Install it only if you use `NoirGlowBackground`; all other components fall back to CSS automatically.

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

The design system includes `tollerud-avatar.svg` — a full cel-shaded monochrome illustration of Tia in her black gakuran, available in `design-system/` for use in headers, landing pages, branding, or anywhere the Tia identity appears.

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

## shadcn Registry

```bash
# Add via shadcn CLI — registry ships with the npm package
npx shadcn@latest add button --registry https://unpkg.com/@tollerud/ui/registry.json

# Or copy source manually
cp -r components/ src/components/ui
cp globals.css src/app/
cp tollerud-preset.js .
```

See [GETTING_STARTED.md](GETTING_STARTED.md) for the full setup guide.

## File Structure

```
design-system/
├── package.json              # NPM package metadata
├── README.md                 # This file
├── CHANGELOG.md              # Version history
├── ACCESSIBILITY.md          # Contrast, focus, reduced motion
├── BACKGROUNDS.md            # NoirGlowBackground usage + fallback docs
├── COMPONENTS.md             # Full component reference + state matrix
├── KEYBOARD.md               # Keyboard contract and shortcut reference
├── VOICE.md                  # Copy guidelines and tone
├── COMPLETENESS_ROADMAP.md   # Research and future plans
├── SKILL.md                  # Verified component catalog & gotchas for AI agents
├── tollerud-preset.js             # 🏆 Drop-in Tailwind preset
├── tailwind.config.js        # (backward compat standalone config)
├── globals.css               # 🏆 Tailwind v4 entry (tokens + component layers)
├── globals-v3.css            # Tailwind v3 legacy (@tailwind + layers)
├── globals-layers.css        # Shared component CSS layers
├── globals-v4.css            # Alias → globals.css
├── tokens.css                # (backward compat CSS vars only)
├── preview.html              # Visual reference
├── tollerud-avatar.svg            # Brand mascot
├── components/
│   ├── index.ts              # Barrel exports
│   ├── Button.tsx            # 5 variants, 3 sizes
│   ├── Card.tsx              # Surface cards with optional accent
│   ├── Badge.tsx             # 6 variants
│   ├── StatusDot.tsx         # Online/offline/warning/idle
│   ├── Input.tsx             # With label + error state
│   ├── CodeBlock.tsx         # Terminal/code display
│   ├── StatCard.tsx          # Dashboard stat card
│   ├── NoirGlowBackground.tsx # Tollerud.no shader background primitive
│   ├── Kbd.tsx               # Keyboard shortcut chip (⌘K style)
│   ├── ActionRow.tsx         # Command/action item row
│   ├── CommandMenu.tsx       # Raycast-style command palette
│   ├── ServiceHealthCard.tsx  # Service status card
│   ├── HostCard.tsx           # Server/VM card
│   ├── DockerStackCard.tsx    # Docker Compose stack card
│   ├── IncidentCard.tsx       # Severity-graded incident card
│   ├── ApprovalCard.tsx       # Approve/reject card
│   ├── ActionDiff.tsx         # Unified diff viewer
│   ├── RollbackPlan.tsx       # Rollback step list
│   ├── LogViewer.tsx          # Terminal-style log viewer
│   ├── AlertInbox.tsx         # Alert feed with acknowledge
│   ├── Timeline.tsx           # Vertical activity timeline
│   ├── BackupStatusPanel.tsx  # Backup job overview
│   └── Container.tsx         # Layout width constraint
├── docs-app/                 # Next.js docs site (static export → _site/ for GitHub Pages)
│   ├── app/                  # App Router entry
│   ├── components/           # Page demos (primitives, charts, marketing)
│   └── lib/                  # ui-merged.js + docs-adapters.jsx (npm-backed)
└── docs/
    └── docs.css              # Shared docs chrome styles (imported by docs-app)
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
| Section Container | `.tollerud-section` | `max-w-[1100px] mx-auto px-6` | Content width constraint |