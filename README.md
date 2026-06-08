# Tollerud User Interface

A complete, browsable UI library built around **monochrome + yellow accent**. Noir aesthetic meets modern utility.

**[Live docs →](https://tollerud.github.io/design-system/)** — browse every token, component, and pattern live with copy-paste code.

**Requirements:** React ≥ 18 · TypeScript supported (types included) · Tailwind CSS v3 or v4

→ **[Component reference →](COMPONENTS.md)** · **[Setup guide →](GETTING_STARTED.md)** · **[Brand guidelines →](BRAND.md)** · **[Changelog →](CHANGELOG.md)**

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
npm install @tollerud/ui clsx tailwind-merge tailwindcss
```

`@paper-design/shaders-react` is an **optional** peer dependency — the package installs and works without it. Install it only if you use `NoirGlowBackground`; all other components fall back to CSS automatically.

```bash
npm install @paper-design/shaders-react
```

**Tailwind v3** — add the preset in `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'
import tollerudPreset from '@tollerud/ui/preset'

const config: Config = {
  presets: [tollerudPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@tollerud/ui/dist/**/*.{js,mjs}',
  ],
}
export default config
```

**Tailwind v4** — use `@config` and `@source` in your CSS instead of a config file:

```css
/* app/globals.css */
@import 'tailwindcss';
@import '@tollerud/ui/globals.css';

/* Pull in the preset tokens as a v4 plugin */
@config './tailwind.config.ts';

/* Scan the package dist so utility classes aren't purged */
@source '../node_modules/@tollerud/ui/dist';
```

If you're not using a `tailwind.config.ts` in v4, copy the contents of `tollerud-preset.js` into a `@theme {}` block manually, or keep a minimal config just for the preset:

```ts
// tailwind.config.ts (v4 shim)
import tollerudPreset from '@tollerud/ui/preset'
export default { presets: [tollerudPreset] }
```

**CSS** — import tokens and component classes in `app/globals.css`:

```css
@import '@tollerud/ui/globals.css';
```

**Components:**

```tsx
import { Button, Card, Badge, StatusDot, CodeBlock, Kbd, CommandMenu, NoirGlowBackground } from '@tollerud/ui'
```

TypeScript types are included — no `@types/*` package needed. See **[COMPONENTS.md](COMPONENTS.md)** for the full prop reference for every component.

Publish a new version by creating a GitHub Release; CI runs `npm publish` when `NPM_TOKEN` is configured.

### Copy from repo (alternative)

```bash
npm install clsx tailwind-merge
cp tollerud-preset.js globals.css components/ -r <your-next-project>/
```

Then use local paths instead of `@tollerud/ui` in the snippets above.

### Next.js example

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
| `--tollerud-yellow` | `#E8D500` | Primary actions, highlights, links |
| `--tollerud-acid` / `--tollerud-yellow` | `#FFFF00` | Primary yellow, CTAs, focus, key data |
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
# Install via shadcn CLI (future):
npx shadcn@latest add https://tollerud-noir.dev/registry

# Or copy manually (today):
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
├── ULTIMATE_TIA_NOIR_RESEARCH.md # Deep research: Tollerud glow + Linear/Raycast/Geist inspiration
├── tollerud-preset.js             # 🏆 Drop-in Tailwind preset
├── tailwind.config.js        # (backward compat standalone config)
├── globals.css               # 🏆 Semantic tokens + all component classes
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
└── examples/
    └── nextjs/
        ├── README.md         # Setup instructions
        ├── tailwind.config.ts # Example config using preset
        └── app/
            ├── globals.css   # @import for globals.css
            ├── layout.tsx    # Root layout with fonts
            └── page.tsx      # Full dashboard landing page
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