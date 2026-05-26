# Ultimate Tia Noir — Research & Direction

Research pass: 2026-05-26  
Scope: make `/home/mathias/tia/design-system/` feel like a complete, modern, production-grade Next.js design system while keeping the Tia/Tollerud identity: noir, monochrome, yellow, technical, warm, and not corporate sludge.

## Sources inspected

### Direct visual/source inspection

- [Tollerud.no](https://www.tollerud.no/) — favorite reference from Mathias; inspected with browser vision + DOM/CSS/JS extraction.
- [Graphify Labs](https://graphifylabs.ai/) — previous inspiration: grid, frosted glass, terminal CTAs, tight typography.
- [Linear](https://linear.app/) — dark product-led marketing, dense agent/product UI, restraint, premium borders.
- [Raycast](https://www.raycast.com/) — keyboard-first command palette, shortcut affordances, compact action surfaces.
- [Vercel Geist](https://vercel.com/geist/introduction) — design-system IA, component catalog structure, grid/type/icon foundations.
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming) — semantic CSS variable approach and component catalog coverage.

### Reference principles

- [Radix Themes](https://www.radix-ui.com/themes/docs/theme/overview) — semantic scaling and accessible primitives.
- [Material 3 Design Tokens](https://m3.material.io/foundations/design-tokens/overview) — token hierarchy and role-based tokens.
- [Atlassian Design Tokens](https://atlassian.design/foundations/design-tokens/) — naming and token governance.
- [Carbon Design System](https://carbondesignsystem.com/elements/color/overview/) — accessibility and enterprise component completeness.
- [Tailwind theme docs](https://tailwindcss.com/docs/theme) — implementation path for theme variables/utilities.
- [Motion for React](https://motion.dev/docs/react-quick-start) — modern animation primitives.

> Note: Hermes web extraction through the gateway still reported a subscription entitlement error in this running session even after the Firecrawl key was stored. Browser inspection and direct source extraction worked, so the research was not blocked. The gateway likely needs restart/reload to pick up the new env cleanly.

---

## Executive direction

Tia Noir should become:

> **A dark, cinematic, keyboard-first infrastructure design system with acid-yellow signal color, granular animated light, dense operational surfaces, and Next.js/shadcn compatibility.**

The core identity should not be “generic dark Tailwind.” It should be:

- **Noir base** — black/charcoal layered surfaces.
- **Yellow as signal** — action, focus, intelligence, warning, selected state.
- **Granular light** — Tollerud.no-style animated yellow noise/glow as a signature material.
- **Command-first** — Raycast-like global command/search is a core primitive.
- **Agentic workflow UI** — Linear-like task timeline, approvals, diffs, logs, and activity feed.
- **Docs as product** — Geist-like documentation IA with live previews, tokens, and component examples.
- **Operational clarity** — not too subtle during incidents. Beauty is useless if Emma is on fire and the UI whispers.

---

## Biggest finding: Tollerud.no background should become the signature primitive

Tollerud.no uses a full-viewport canvas/WebGL background. Source inspection found:

- A `<canvas>` filling the viewport, positioned absolute with `z-index: -1`.
- WebGL shader code under `Paper Shaders`.
- Shader uniforms for:
  - `u_colorBack`
  - `u_colors[]`
  - `u_softness`
  - `u_intensity`
  - `u_noise`
  - `u_shape`
  - `u_time`
  - `u_resolution`
- Shape modes including:
  - `wave`
  - `dots`
  - `truchet`
  - `corners`
  - `ripple`
  - `blob`
  - `sphere`
- Noise implementation using value noise / simplex noise / FBM-like grain.
- Tollerud UI colors include exact acid yellow `#ffff00`, black `#000000`, white text.
- Heading: Inter, `96px`, `700`, `line-height: 96px`, letter-spacing `-2.4px`.
- Buttons: transparent/black `rgba(0,0,0,0.3)`, `1px solid #ffff00`, text `#ffff00`, radius `8px`, `14px`, `500`, horizontal padding `32px`.

### What to extract

Create a production component:

```tsx
<NoirGlowBackground
  variant="tollerud"
  intensity="medium"
  speed="slow"
  grain="high"
  shape="corners"
  preserveCenter
/>
```

### Why this matters

The background animation is not decoration. It is **the Tollerud/Tia atmospheric signature**:

- black field
- acid-yellow luminous blooms
- noisy/dithered falloff
- slow cinematic motion
- center kept readable
- edge-weighted light

This should become the thing people recognize before they even read a heading.

### Implementation options

#### Option A — Use Paper Shaders-style WebGL

Best visual match.

Pros:
- Closest to Tollerud.no.
- Can expose `shape`, `noise`, `speed`, colors, intensity.
- GPU-rendered, high quality.

Cons:
- WebGL complexity.
- Need SSR-safe Next.js dynamic import.
- Need reduced-motion/static fallback.
- Need performance budget.

#### Option B — CSS-only fallback

Use radial gradients + pseudo-element noise texture.

Pros:
- Simple.
- Works everywhere.
- Good fallback for reduced motion/mobile/low-power.

Cons:
- Not as magical.
- Can feel like “generic gradient blob” unless grain is excellent.

#### Recommended

Ship both:

1. `NoirGlowBackground.tsx` — WebGL/canvas primary.
2. `.tia-noir-glow-bg` — CSS fallback.
3. Static PNG/WebP fallback for reduced motion.

---

## Inspiration synthesis

## 1. Tollerud.no — signature atmosphere

Borrow:

- Acid yellow `#ffff00` as the high-voltage signal token.
- Grainy animated yellow light, not smooth gradients.
- Black-first full-viewport hero composition.
- Oversized white heading, tight tracking.
- Yellow outline buttons with black fill.
- Sparse page rhythm.

Do not overuse:

- Fullscreen poster layout inside dense dashboard views.
- Continuous heavy WebGL everywhere.

Tia adaptation:

- Use the background for landing, empty states, command palette backdrop, and “agent running” hero moments.
- Use a toned-down static/noise version for dashboards.

---

## 2. Linear — restraint, density, agent workflows

Borrow:

- Near-black surfaces with 1px subtle borders.
- Dense product UI inside spacious layouts.
- Agent/activity panel pattern.
- Metadata-heavy rows that still scan cleanly.
- Product screenshot/app-frame framing.
- Soft vignettes and edge fades.

Tia adaptation:

- Build `AssistantTimeline`, `ApprovalCard`, `ActionDiff`, `LogPanel`, `RunStatus`, `ServiceDetailLayout`.
- Yellow means active intelligence / approval / warning — not generic decoration.
- Keep dashboard dense but readable.

Do not copy:

- Excessive low contrast for operational states.
- Too-tiny text for real incident response.

---

## 3. Raycast — keyboard-first command surface

Borrow:

- Command palette as primary interaction model.
- Shortcut badges / keycaps.
- Search-first layout.
- Compact action rows with detail preview.
- Keyboard-native mental model.

Tia adaptation:

Create:

```tsx
<TiaCommandMenu />
<TiaCommandInput />
<Kbd>⌘K</Kbd>
<ActionRow />
<ActionPreview />
```

Command groups should include:

- Hosts
- Services
- Docker stacks
- Backups
- Logs
- Automations
- Docs
- Tia actions
- Recent tasks
- Approval-needed actions

Keyboard contract:

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + K` | Open command menu |
| `/` | Focus search/log filter |
| `?` | Open shortcuts |
| `Esc` | Close overlay |
| `Enter` | Run/open selected item |
| `Cmd/Ctrl + Enter` | Secondary action / open details |

---

## 4. Vercel Geist — documentation and system completeness

Borrow:

- Foundations before components.
- Component catalog with visual previews.
- Dedicated pages for colors, typography, materials, grid, icons.
- Search command in docs.
- Feedback widget / changelog / resource IA.
- Grid/card overview page.

Tia adaptation:

Build a real docs app eventually:

```txt
Foundations
  Introduction
  Color
  Typography
  Spacing
  Grid
  Motion
  Materials
  Accessibility
  Iconography

Components
  Button
  Input
  Dialog
  Command Menu
  Sidebar
  Table
  Toast
  Badge
  Card
  Timeline
  Log Viewer
  Diff Viewer

Patterns
  Dashboard
  Incident Review
  Approval Flow
  Backup Status
  Service Detail
  Settings
  Empty States

Brand
  Tia Avatar
  Voice
  Mascot Usage
  Tollerud Glow
```

---

## 5. shadcn/ui — Next.js-native implementation model

Borrow:

- Semantic CSS variables.
- Copyable React components.
- Tailwind classes in components.
- `components.json` style registry potential.
- Broad component catalog: Accordion, Alert Dialog, Command, Data Table, Dialog, Drawer, Dropdown, Empty, Kbd, Sheet, Sidebar, Skeleton, Sonner, Table, Tabs, Tooltip, etc.

Tia adaptation:

We already started correctly with `globals.css`, `tia-preset.js`, and TSX components. Next steps:

- Add `components.json` for shadcn-style installs.
- Add component registry metadata.
- Use semantic classes in React components more consistently (`bg-primary`, `text-primary-foreground`, etc.) while keeping raw `tia-*` utilities available.
- Add Radix-based accessible primitives for overlays/menus/dialogs.

---

## Ultimate component roadmap

## Tier 0 — Brand primitives

These make Tia Noir *Tia Noir*, not just a component kit.

1. `NoirGlowBackground` — WebGL/canvas + CSS fallback.
2. `TiaAvatar` — mascot wrapper with sizing and background rules.
3. `TiaMonogram` — small yellow mark/logo slot.
4. `DisplayTitle` — poster-scale heading.
5. `AcidOutlineButton` — Tollerud.no button style.
6. `Kbd` — keyboard shortcut chip.
7. `SignalDot` — status dot with yellow/success/error variants.
8. `GlowFrame` — art-directed screenshot/product frame.

## Tier 1 — Core UI components

Already have some; expand to shadcn parity.

- Button
- IconButton
- ButtonGroup
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Slider
- Badge
- Pill
- Card
- StatCard
- Tooltip
- Popover
- Dialog
- Drawer/Sheet
- Tabs
- Table
- DataTable
- Skeleton
- Spinner
- Toast/Sonner wrapper
- EmptyState
- Alert/Banner
- Progress
- Breadcrumb
- Sidebar
- Topbar
- Pagination

## Tier 2 — Tia/homelab-specific components

These are the real gold.

- `CommandMenu`
- `AssistantComposer`
- `AssistantTimeline`
- `ApprovalCard`
- `CommandPreview`
- `ActionDiff`
- `RollbackPlan`
- `LogViewer`
- `ServiceHealthCard`
- `HostCard`
- `DockerStackCard`
- `BackupStatusPanel`
- `IncidentCard`
- `AlertInbox`
- `RunHistory`
- `NetworkTopologyPanel`
- `MetricSparkline`
- `SecretRedactionNotice`
- `DangerZone`

## Tier 3 — Page templates

- Landing / poster page
- Dashboard shell
- Homelab mission-control dashboard
- Service detail page
- Host detail page
- Logs page
- Settings page
- Command palette demo
- Incident review page
- Backup/recovery page
- Design-system docs page

---

## Token expansion plan

Current tokens are good, but ultimate Tia Noir needs richer token groups.

### 1. Raw palette

```css
--tia-acid: #ffff00;           /* Tollerud high-voltage yellow */
--tia-yellow: #e8d500;         /* existing signal yellow */
--tia-amber: #ffb800;
--tia-bone: #f5f2dc;           /* warm text option */
--tia-smoke: #8f8878;
--tia-black: #000000;
--tia-void: #050505;
--tia-ink: #0a0a0a;
--tia-panel: #11110f;
--tia-raised: #181713;
```

### 2. Semantic roles

```css
--background
--foreground
--card
--card-foreground
--popover
--popover-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--destructive
--destructive-foreground
--border
--input
--ring
```

Already present — keep.

### 3. Material tokens

```css
--material-matte-noir
--material-smoked-glass
--material-brass-edge
--material-neon-sodium
--material-paper-evidence
```

### 4. Motion tokens

```css
--motion-duration-instant: 80ms;
--motion-duration-fast: 150ms;
--motion-duration-normal: 240ms;
--motion-duration-slow: 420ms;
--motion-ease-standard: cubic-bezier(.2,0,0,1);
--motion-ease-emphasized: cubic-bezier(.16,1,.3,1);
--motion-ease-linear: linear;
```

### 5. Operational state tokens

```css
--state-online
--state-offline
--state-warning
--state-critical
--state-running
--state-pending
--state-muted
```

### 6. Data-viz tokens

Need ramps, not just 5 chart colors:

- categorical palette
- sequential yellow/amber ramp
- diverging red/yellow/green ramp
- grid/axis/tick/tooltip colors
- dark-mode chart backgrounds

---

## Motion language

Tia motion should feel like **instrumentation**, not TikTok confetti.

### Principles

1. Fast UI transitions: 120–180ms.
2. Panels/modals: 180–260ms.
3. Background ambient motion: slow, 20–60s loops.
4. Active agent/running task: gentle pulse, not blinking panic.
5. Reduced motion: static background + no shimmer.
6. Use transform/opacity for performance.
7. Animation must never block input.

### Signature motions

- `tia-glow-drift` — slow ambient background.
- `tia-signal-pulse` — active command/agent.
- `tia-scanline` — optional subtle log/terminal effect.
- `tia-reveal-up` — panels and cards.
- `tia-command-open` — command menu scale/fade.
- `tia-status-change` — state transition pulse.

---

## Accessibility rules for ultimate version

Non-negotiable:

- Yellow on black passes contrast; yellow on white does not.
- Every interactive element gets a visible yellow focus ring.
- Icon-only buttons require labels.
- Dialogs/menus need keyboard trap/escape handled by Radix primitives.
- Reduced-motion fallback for background animation and skeletons.
- No status conveyed by color alone.
- Danger/destructive actions require explicit copy and confirmation.
- Touch targets ≥44px.
- Logs/tables need readable font size and line-height.

---

## Recommended next build sequence

## Phase 1 — Signature atmosphere

Build first, because this gives the system identity:

1. `components/NoirGlowBackground.tsx`
2. CSS fallback in `globals.css`
3. Update `preview.html` and `examples/nextjs/app/page.tsx`
4. Add docs: `MOTION.md` and `BACKGROUNDS.md`

## Phase 2 — Command-first shell

1. `Kbd.tsx`
2. `CommandMenu.tsx`
3. `CommandInput.tsx`
4. `ActionRow.tsx`
5. Docs with keyboard contract.

## Phase 3 — Operational components

1. `AssistantTimeline.tsx`
2. `ApprovalCard.tsx`
3. `LogViewer.tsx`
4. `ActionDiff.tsx`
5. `ServiceHealthCard.tsx`

## Phase 4 — shadcn registry compatibility

1. Add `components.json`.
2. Add registry JSON for components.
3. Add install docs.
4. Make import paths portable.

## Phase 5 — Docs app

Create `docs/` or `examples/docs-nextjs/` with Geist-inspired IA:

- Foundations
- Components
- Patterns
- Brand
- Changelog

---

## Opinionated recommendations

### Keep

- Inter + JetBrains Mono for now. They fit the existing system and Tollerud.no uses Inter.
- Black/white/yellow as the core identity.
- Yellow = action/focus/intelligence/warning.
- Next.js from the start.
- shadcn-compatible CSS variables.

### Add

- Acid yellow `#ffff00` as the “Tollerud voltage” token, separate from the calmer `#E8D500` Tia signal yellow.
- WebGL/noise background primitive.
- Command menu as a flagship component.
- Tia/homelab-specific operational components.
- Component docs with keyboard and accessibility behavior.
- Motion docs.

### Avoid

- Making every card yellow-bordered.
- Smooth generic gradient blobs.
- Over-polished SaaS purple/blue glow nonsense.
- Tiny low-contrast text in incident-critical screens.
- Full WebGL on every page.
- Treating mascot art as the whole brand; the background/interaction language matters just as much.

---

## Final vision

The ultimate Tia Noir system should feel like:

- Tollerud.no’s black/yellow animated atmosphere,
- Linear’s product discipline,
- Raycast’s command-first speed,
- Geist’s documentation/system rigor,
- shadcn’s practical Next.js component model,
- and Tia’s own warm, slightly nerdy infrastructure personality.

In short:

> **Cinematic homelab command center. Yellow where things think, move, or need attention.**
