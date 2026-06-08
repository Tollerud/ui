# Changelog

## 1.0.6 — 2026-06-08 — Fix brand color docs

- Fixed brand color swatches in `ds/page-foundations.jsx` — "Yellow" now correctly shows `#FFFF00` / `--tollerud-yellow`, "Yellow warm" shows `#E8D500` / `--tollerud-yellow-warm`
- Updated `BRAND.md` — monogram color corrected to `#FFFF00`

## 1.0.5 — 2026-06-08 — Yellow token rename + AGENTS.md

**Breaking token changes:**
- `--tollerud-yellow` is now `#FFFF00` (was `#E8D500`) — the brighter, high-voltage yellow is now the primary accent
- `--tollerud-yellow-bright` removed — replaced by `--tollerud-yellow-warm: #E8D500` for the warmer secondary yellow
- Tailwind: `tia.yellow` → `#FFFF00`, `tia.yellow-bright` → renamed to `tia.yellow-warm: #E8D500`
- All glow `rgba` values updated from `rgba(232,213,0,...)` to `rgba(255,255,0,...)`
- Semantic tokens `--primary`, `--ring`, `--chart-1`, `--border-accent` updated to `#FFFF00`

**Migration:** replace `tollerud-yellow-bright` → `tollerud-yellow`, and `tollerud-yellow` → `tollerud-yellow-warm` wherever you relied on the old warm `#E8D500` value.

**New files:**
- Added `AGENTS.md` — cross-tool AI agent guide (Claude Code, Cursor, Copilot, Codex)
- Added `.github/copilot-instructions.md` — GitHub Copilot native instructions

## 2026-05-26 — Form Primitives + Footer

- Added **Textarea** — multiline input with label/error support, same pattern as Input
- Added **Select** — styled native `<select>` with placeholder, label/error, custom chevron
- Added **Checkbox** — custom-styled checkbox with checkmark SVG, label, focus-visible ring
- Added **Switch** — toggle switch with role="switch", animated thumb, label
- Added **RadioGroup / Radio** — fieldset-based radio group with custom dot indicator, label/error
- Added **Footer** — ported from `@tollerud/footer` (v1.1.2), uses Tollerud Design System design tokens, supports `accent` variant, responsive/row layouts, unstyled mode
- 6 new components → total **29 components** now

## 2026-05-26 — Phase 5: Docs App

- Created `examples/docs-nextjs/` — a full Geist-inspired documentation site:
  - Foundations: Color, Typography, Motion, Accessibility
  - Components: Catalog with all 23 components organized by category
  - Patterns: Dashboard and Approval Flow templates
  - Brand: Tia avatar, voice, and Tollerud glow guide
  - Changelog: Version history timeline
- Docs use the same design system components for consistent preview
- Dark theme with sidebar navigation, responsive layout

## 2026-05-26 — Phase 4: shadcn Registry Compatibility

- Added `components.json` — shadcn UI registry format for tooling compatibility
- Added `registry.json` — component registry with all 23 components, dependencies, and metadata
- Added `GETTING_STARTED.md` — one-command install guide with Tailwind setup and component import examples
- Portable import paths documented: `@/components/ui` and `@/lib/utils`

## 2026-05-26 — Phase 3: Homelab Operational Components

11 new homelab-specific components for infrastructure management:

**Health & Monitoring**
- `ServiceHealthCard` — service status card with uptime, response time, version
- `HostCard` — server/VM card with CPU, RAM, disk, containers, IP
- `DockerStackCard` — Docker Compose stack overview with per-service health
- `IncidentCard` — severity-graded incident/alert card (critical→info)

**Actions & Approval**
- `ApprovalCard` — approve/reject card for pending operations
- `ActionDiff` — unified diff viewer with line numbers, add/remove/context
- `RollbackPlan` — ordered rollback steps with execution status

**Logs & Alerts**
- `LogViewer` — terminal-style scrollable log viewer with search, live follow, level coloring
- `AlertInbox` — alert feed with count badges, severity filter, acknowledge action

**Feed & History**
- `Timeline` — vertical timeline with status dots, connecting lines, metadata badges
- `BackupStatusPanel` — backup job overview with per-job status and schedule

## 2026-05-26 — Phase 2: Command-First Shell

- **Kbd** — Raycast-style keyboard shortcut chip (`⌘K`, `⌘⇧S`, etc.), 2 sizes.
- **ActionRow** — Command/action item row with icon, label, description, shortcut, keyboard navigation (`highlighted` prop).
- **CommandMenu** — Full command palette: search, groups, arrow key nav, `Enter`/`Esc`, auto-focus, body scroll lock, footer hints, custom filter support.
- **CSS classes**: `.tollerud-kbd`, `.tollerud-action-row`, `.tollerud-cmd`, `.tollerud-cmd-overlay`, `.tollerud-cmd__*` — in both `globals.css` and `tokens.css`.
- **KEYBOARD.md** — Keyboard contract document: global shortcuts, component contracts, accessibility requirements, implementation rules.

## 2026-05-26 — NoirGlowBackground

- Ported the real Tollerud.no background source from `MathiasOki/tollerud-landing`.
- Added `components/NoirGlowBackground.tsx` using `@paper-design/shaders-react` / `GrainGradient`.
- Added CSS fallback classes: `.tollerud-noir-glow-root`, `.tollerud-noir-glow-bg`, `.tollerud-noir-glow-vignette`, `.tollerud-noir-noise`.
- Added acid-yellow token `--tollerud-acid` / `tollerud-acid` for Tollerud voltage.
- Updated `preview.html` and the Next.js example hero to use the glow background.
- Added `BACKGROUNDS.md` documentation.

## 2026-05-25 — v1.0 Next.js Release

- **Tailwind preset** (`tollerud-preset.js`) — drop into any Next.js project
- **Globals.css** with shadcn-compatible semantic tokens (`--background`, `--primary`, `--ring`, etc.)
- **React components** — Button, Card, Badge, StatusDot, Input, CodeBlock, StatCard, Container
- **ACCESSIBILITY.md** — contrast ratios, focus rings, touch targets, reduced motion
- **COMPONENTS.md** — usage matrix for all component variants
- **VOICE.md** — copy guidelines, terminal-style CTAs, tone rules
- **CHANGELOG.md** — this file
- **Graphify-inspired additions**: grid backgrounds, glass nav, terminal CTAs, gradient accents, pills, tight display typography
- **Motion tokens**: duration, easing, reduced-motion support
- **Chart tokens**: accessible color palette for data viz

### What shipped

```
design-system/
├── package.json
├── README.md
├── CHANGELOG.md
├── ACCESSIBILITY.md
├── COMPONENTS.md
├── VOICE.md
├── COMPLETENESS_ROADMAP.md
├── tollerud-preset.js           # ← drop-in Tailwind preset
├── tailwind.config.js      # (backward compat)
├── tokens.css              # (backward compat)
├── globals.css             # ← full semantic tokens + components
├── preview.html
├── tollerud-avatar.svg
├── components/
│   ├── index.ts
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── StatusDot.tsx
│   ├── Input.tsx
│   ├── CodeBlock.tsx
│   ├── StatCard.tsx
│   └── Container.tsx
├── examples/
│   └── nextjs/
│       └── tailwind.config.ts
└── components.css
```