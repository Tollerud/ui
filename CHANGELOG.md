# Changelog

<!-- FORMAT RULES — the docs site parses this file at runtime.
     • Entry heading:  ## version — YYYY-MM-DD — Title
     • Blank line between EVERY block (paragraph, heading, list, code fence)
     • Section headings: ### Heading  OR  **Bold line** on its own line after a blank line
     • Never write bold mid-paragraph as a heading substitute — it merges into surrounding text
-->

## 1.3.0 — 2026-06-09 — Tailwind v4 as default CSS entry

`@tollerud/ui/globals.css` is now the Tailwind v4 bundle (tokens + component layers + `@import "tailwindcss"`). v3 projects move to `@tollerud/ui/globals-v3.css`.

### Breaking change

If you were on Tailwind v3 and importing `@tollerud/ui/globals.css`, switch to `@tollerud/ui/globals-v3.css` and keep your v3 `tailwind.config.ts` preset setup.

### Migration (v4 — recommended)

```css
@import "@tollerud/ui/globals.css";
@source "../node_modules/@tollerud/ui/dist";
```

`@tollerud/ui/globals-v4.css` remains as an alias for `globals.css`.

### Docs

Install instructions, README, GETTING_STARTED, AGENTS.md, and SKILL.md now lead with Tailwind v4.

## 1.2.0 — 2026-06-09 — Subpath exports, Tailwind v4 CSS, Playwright E2E

Per-component subpath imports, a dedicated Tailwind v4 stylesheet, expanded unit tests, and docs-site E2E smoke tests.

### New features

- Subpath exports — `@tollerud/ui/button`, `@tollerud/ui/dialog`, `@tollerud/ui/utils`, and one entry per component (61 total)
- `@tollerud/ui/globals-v4.css` — single import for Tailwind v4 + tokens + component layers
- `@tollerud/ui/globals-layers.css` — shared component CSS layers (also imported by v3 `globals.css`)
- `npm run changelog:draft` — draft a CHANGELOG entry from commits since the latest version

### Tests & CI

- Vitest coverage for `Dialog`, `DataTable`, and `CommandMenu`
- Playwright E2E smoke tests for the docs site (`npm run test:e2e`)
- CI verifies subpath bundles and `globals-v4.css` in the npm tarball

### Migration

Nothing breaking. Existing `@tollerud/ui` barrel imports continue to work. For tree-shaking, switch to subpath imports. Tailwind v4 projects should prefer `@import "@tollerud/ui/globals-v4.css"`.

## 1.1.5 — 2026-06-09 — Fix Tailwind preset color namespace

### Bug fix

The Tailwind preset now exposes design-system colors under `tollerud.*`, matching the shipped component classes and documentation (`text-tollerud-yellow`, `bg-tollerud-noir-900`, `border-tollerud-border`, etc.).

Previously the preset exposed the same palette under `tia.*`, so consumer projects following the docs could miss generated `tollerud-*` utilities.

### Details

- Renamed the preset color namespace from `tia` to `tollerud`
- Renamed the default package shadow token from `shadow-tia` to `shadow-tollerud`
- Added missing documented/component color aliases: `tollerud.accent`, `tollerud.foreground`, `tollerud.black`, `tollerud.white`, `tollerud.noir-950`, and `tollerud.noir-850`

### Migration

Replace any `text-tia-*`, `bg-tia-*`, `border-tia-*`, or `shadow-tia` utilities with their `tollerud` equivalents.

## 1.1.4 — 2026-06-09 — Fix: Alert tone colors missing in Tailwind v4

### Bug fix

Alert `tone` prop colors (`danger`, `info`, `success`) were invisible in Tailwind v4 consumer projects when the `@source` path in `globals.css` pointed to the wrong `node_modules` location.

**Root cause:** Tailwind v4 resolves `@source` relative to the CSS file. When `globals.css` lives in `app/`, the path `../../node_modules/@tollerud/ui/dist/**` resolves to `app/node_modules/...` (which doesn't exist) instead of the root `node_modules`. The 9 tone utility classes were never scanned and therefore never generated.

**Fix:** Added an explicit `@layer utilities` block to `globals.css` that defines all 9 Alert tone classes unconditionally, bypassing scanning entirely. Classes are always emitted regardless of `@source` path configuration.

Classes added to safelist: `bg-red-500/5`, `bg-blue-500/5`, `bg-green-500/5`, `border-red-500/30`, `border-blue-500/30`, `border-green-500/30`, `text-red-400`, `text-blue-400`, `text-green-400`

No API changes.

## 1.1.3 — 2026-06-09 — Fix: registry deps, source 'use client', React 19 devdep, docs drift

No component API changes. Six quality fixes from a review audit:

**1. registry.json — missing runtime dependencies**
All icon-using components now list `lucide-react` in their registry entry; `button` lists `@radix-ui/react-slot`; `status-dot` lists `framer-motion`; `dialog` lists `lucide-react`. Affects manual/registry-copy installs only — the npm bundle was already correct.

Entries updated: `button`, `status-dot`, `accordion`, `breadcrumb`, `combobox`, `date-picker`, `dialog`, `file-upload`, `pagination`, `password-input`, `pricing-card`, `stepper`, `tag-input`

**2. Source components — added `'use client'` directive**
12 hook-using source files were missing the directive. The bundled package was protected by the tsup post-build injection, but copied source files (registry/manual flow) would fail in Next.js App Router.

Added `'use client'` to: `Accordion`, `Avatar`, `Checkbox`, `Combobox`, `DatePicker`, `FileUpload`, `FormRow`, `PasswordInput`, `RadioGroup`, `Slider`, `Switch`, `TagInput`

**3. package.json — aligned React 19 devDependencies**
`react-dom` dev dep bumped from `^18.3.1` → `^19.2.7` to match `react: ^19.2.7`, eliminating the `ELSPROBLEMS` peer conflict in local dev.

**4. docs Getting Started page — rewritten to npm-package-first**
Was: manual file-copy instructions, wrong token value (`--tollerud-yellow` = `#E8D500`), old component list (29 components).
Now: `npm install @tollerud/ui`, Tailwind v3 + v4 snippets, full 61-component import block, correct yellow token docs, RSC safety note.

**5. docs Brand page — corrected monogram color**
`#FFF200` → `#FFFF00` (two references: description text and inline style). This now matches `BRAND.md`, `SKILL.md`, and the package tokens.

**6. .gitignore — added `*.tsbuildinfo`**
`examples/docs-nextjs/tsconfig.json` has `"incremental": true`, generating a `.tsbuildinfo` file that was untracked. Suppressed globally.

## 1.1.2 — 2026-06-09 — Ship AGENTS.md + SKILL.md inside the npm package

`AGENTS.md` and `SKILL.md` are now included in the published package (`files` in `package.json`). After `npm install @tollerud/ui`, both files are available at:

- `node_modules/@tollerud/ui/AGENTS.md`
- `node_modules/@tollerud/ui/SKILL.md`

This lets Claude Code (and other agents) read them directly without needing a separate `curl` or a GitHub URL.

## 1.1.1 — 2026-06-09 — Docs: AGENTS.md package update + migration instructions

No component or API changes. Documentation only.

- `AGENTS.md` — added "Updating the npm package" checklist (component checklist, version bump rules, required file updates, build/push steps) and "Fixing copy/paste component patterns" guide (detection, migration, prop drift checks, common patterns table) for agents working in consumer projects

## 1.1.0 — 2026-06-09 — Fix: Combobox + DatePicker close on window resize

`Combobox` and `DatePicker` rendered their popover as `position: absolute` with no awareness of window resize — if the viewport changed while a popover was open it would stay in place, misaligned from its trigger. Both now close on `window resize`, consistent with the existing close-on-scroll behaviour.

`DropdownMenu` was unaffected (Radix handles this internally).

**Migration:** no API changes — behaviour only.

## 1.0.9 — 2026-06-08 — Ship the 19 components that only existed in the docs site

Closes the long-standing gap between the marketing/docs site and the installable
`@tollerud/ui` package — every component previously listed under "still missing"
in `COMPLETENESS_ROADMAP.md` now ships from `components/index.ts`:

- **New primitives:** `Divider`, `Pill`, `Avatar` / `AvatarGroup`, `Breadcrumb`, `Pagination`, `Segmented`, `Stepper`
- **New layout/display:** `Panel`, `Meter`, `FormRow`, `PricingCard`
- **New form controls:** `Accordion` (+ `AccordionItem`/`AccordionTrigger`/`AccordionContent`), `Slider`, `PasswordInput`, `Combobox`, `DatePicker`, `FileUpload`, `TagInput`

All built from scratch as accessible, theme-aware components following existing
conventions (`forwardRef`, `cn`, `tollerud-*` design tokens) — no new runtime
dependencies were added.

## 1.0.8 — 2026-06-08 — Fix: mark package as Client Components for RSC/SSR

**Fixes a breaking issue introduced in earlier versions:** importing *anything* from `@tollerud/ui` — even a plain helper like `buttonVariants` — into a Next.js Server Component crashed at build/runtime. The package is bundled into a single `dist/index.js`/`.cjs` file, and esbuild silently drops module-level `"use client"` directives during bundling, so the bundle was never marked as client code even though it's full of components using hooks (`useState`, `useEffect`, etc.).

- `dist/index.js` and `dist/index.cjs` now start with `'use client'` (injected via a post-build step in `tsup.config.ts`, since esbuild rejects it as a bundling banner) — this correctly tells Next.js's RSC bundler that the whole package is client code
- Added missing `'use client'` directives to `ActionDiff`, `AlertInbox`, `Select`, and `LogViewer` source files (they used hooks without declaring the boundary — harmless pre-bundling, but good hygiene and required if these are ever built unbundled)

**Migration:** just update to `1.0.8` — no code changes required. Server Components can now safely import from `@tollerud/ui` (you'll just be importing client-bundled code, which is fine for things like `buttonVariants` that are plain functions).

## 1.0.7 — 2026-06-08 — Button `asChild` + `buttonVariants`

- `Button` now supports an `asChild` prop (via `@radix-ui/react-slot`) — renders its single child element instead of a `<button>`, merging Button's classes/props onto it. Lets you style a `<Link>` (or any other element) as a button without invalid `<a>`-in-`<button>` nesting: `<Button asChild variant="primary"><Link href="/foo">Go</Link></Button>`
- Exported `buttonVariants({ variant, size, className })` — returns the Button class string directly, for cases where wrapping with `asChild` is awkward
- Exported `ButtonVariantProps` type
- Added `@radix-ui/react-slot` as a direct dependency

## 1.0.6 — 2026-06-08 — Fix brand color docs

- Fixed brand color swatches in `ds/page-foundations.jsx` — "Yellow" now correctly shows `#FFFF00` / `--tollerud-yellow`, "Yellow warm" shows `#E8D500` / `--tollerud-yellow-warm`
- Updated `BRAND.md` — monogram color corrected to `#FFFF00`

## 1.0.5 — 2026-06-08 — Yellow token rename + AGENTS.md

**Breaking token changes:**
- `--tollerud-yellow` is now `#FFFF00` (was `#E8D500`) — the brighter, high-voltage yellow is now the primary accent
- `--tollerud-yellow-bright` removed — replaced by `--tollerud-yellow-warm: #E8D500` for the warmer secondary yellow
- Tailwind: `tollerud.yellow` → `#FFFF00`, `tollerud.yellow-bright` → renamed to `tollerud.yellow-warm: #E8D500`
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
