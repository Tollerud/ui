# 🎴 Tia Noir — Design System

A dark, high-contrast design system built around **monochrome + yellow accent**. Noir aesthetic meets modern utility. Made for TIA — the Tollerud Infrastructure Assistant.

Inspired by [Graphify Labs](https://graphifylabs.ai/) — terminal aesthetics, frosted glass nav, background grid patterns, and tight display typography.

## Philosophy

> Clean lines. Sharp contrast. Yellow where it counts.

Tia Noir is minimal but not cold. It uses a near-black foundation with warm yellow accents for interaction points. Every element has purpose — nothing decorative for its own sake. The cross-hatching spirit lives in the sharp borders, the thin lines, the deliberate whitespace.

## Quick Start

### Next.js (Recommended)

**1. Install the preset + globals in your project:**

```bash
npm install clsx tailwind-merge
# Optional — for NoirGlowBackground:
npm install @paper-design/shaders-react
cp tia-preset.js globals.css components/ -r  <your-next-project>/
```

**2. Add the preset to `tailwind.config.ts`:**

```ts
import tiaPreset from './tia-preset'

const config: Config = {
  presets: [tiaPreset],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
}
export default config
```

**3. Import globals in `app/globals.css`:**

```css
@import './globals.css';
```

That's it. You now have all Tailwind colors (`bg-tia-yellow`, `text-tia-noir-200`), semantic CSS variables (`--primary`, `--background`, `--ring`), component utilities (`.tia-card`, `.tia-btn--terminal`), and React components ready to import:

```tsx
import { Button, Card, Badge, StatusDot, CodeBlock, Kbd, CommandMenu, NoirGlowBackground } from '@/components/ui'

<section className="relative overflow-hidden bg-black">
  <NoirGlowBackground intensity="medium" speed="slow" grain="soft" shape="corners" preserveCenter />
  <div className="relative z-10">
    <Button variant="terminal" size="lg">open_dashboard</Button>
  </div>
</section>
<Card accent>
  <StatusDot status="online" label="Emma — ready" />
</Card>
<CodeBlock>{`❯ systemctl status tia-agent`}</CodeBlock>
```

### Plain CSS

Include `tokens.css` or `globals.css` for CSS custom properties and utility classes:

```html
<link rel="stylesheet" href="globals.css">
<div class="tia-card">
  <h2 style="color: var(--tia-yellow)">Tia Noir</h2>
  <button class="tia-btn tia-btn--primary tia-btn--md">Get Started</button>
</div>
```

### Brand Mascot

The design system includes `tia-avatar.svg` — a full cel-shaded monochrome illustration of Tia in her black gakuran, available in `design-system/` for use in headers, landing pages, branding, or anywhere the Tia identity appears.

## Palette Summary

| Token | Hex | Usage |
|-------|-----|-------|
| `--tia-yellow` | `#E8D500` | Primary actions, highlights, links |
| `--tia-acid` / `--tia-yellow-bright` | `#FFFF00` | Tollerud voltage, shader glow, hover peaks |
| `--tia-amber` | `#FFB800` | Warmth accents, secondary highlights |
| `--tia-black` | `#0A0A0A` | Default background |
| `--tia-noir-900` | `#121212` | Card / raised surface |
| `--tia-noir-800` | `#1A1A1A` | Overlay / modal surface |
| `--tia-noir-700` | `#252525` | Hover state surface |
| `--tia-noir-600` | `#333333` | Borders |
| `--tia-noir-400` | `#666666` | Muted text, disabled |
| `--tia-noir-200` | `#AAAAAA` | Secondary text |
| `--tia-noir-50` | `#E5E5E5` | Subtle dividers (light) |
| `--tia-white` | `#F5F5F5` | Primary text |

## Typography

- **Display / Body:** Inter — clean, highly readable, Swiss-inspired
- **Monospace:** JetBrains Mono — for code, metrics, and terminal aesthetics
- **Scale:** 2xs (0.625rem) → 9xl (8rem)
- **Weights:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 900 (black)

## Usage Patterns

### Buttons
```html
<button class="tia-btn tia-btn--primary tia-btn--md">Action</button>
<button class="tia-btn tia-btn--secondary tia-btn--md">Cancel</button>
<button class="tia-btn tia-btn--ghost tia-btn--md">More</button>
```

### Cards
```html
<div class="tia-card">
  <h3 class="font-semibold mb-1">Title</h3>
  <p class="text-tia-text-secondary text-sm">Content</p>
</div>
```

### Badges
```html
<span class="tia-badge tia-badge--accent">New</span>
<span class="tia-badge tia-badge--success">Online</span>
<span class="tia-badge tia-badge--error">Offline</span>
```

### Code
```html
<code class="font-mono text-sm text-tia-text-secondary">const x = 42;</code>
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
npx shadcn@latest add https://tia-noir.dev/registry

# Or copy manually (today):
cp -r components/ src/components/ui
cp globals.css src/app/
cp tia-preset.js .
```

See `GETTING_STARTED.md` for full setup guide.

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
├── tia-preset.js             # 🏆 Drop-in Tailwind preset
├── tailwind.config.js        # (backward compat standalone config)
├── globals.css               # 🏆 Semantic tokens + all component classes
├── tokens.css                # (backward compat CSS vars only)
├── preview.html              # Visual reference
├── tia-avatar.svg            # Brand mascot
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
| Noir Glow Background | `.tia-noir-glow-*` | `bg-tia-noir-glow` | Tollerud.no-inspired acid-yellow glow fallback |
| Grid Background | `.tia-grid-bg` | `bg-tia-grid bg-[length:40px_40px]` | Subtle yellow grid pattern |
| Glass Nav | `.tia-glass` | `backdrop-blur-glass bg-opacity-88` | Frosted glass navigation bar |
| Terminal Button | `.tia-btn--terminal` | — | Monospace CTA with `❯` prefix |
| Pill Tag | `.tia-pill--outline` / `--muted` | — | Tiny label/tag components |
| Accent Bar | `.tia-accent-bar` | `bg-tia-gradient-bar h-[1px]` | Gradient divider bar |
| Gradient Text | `.tia-gradient-text` | `bg-tia-gradient-soft bg-clip-text text-transparent` | Yellow → amber gradient text |
| Display Heading | `.tia-display` | `tracking-tightest leading-[0.95] font-semibold text-white` | Tight, impactful display heads |
| Section Container | `.tia-section` | `max-w-[1100px] mx-auto px-6` | Content width constraint |