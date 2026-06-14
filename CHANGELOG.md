# Changelog

<!-- FORMAT RULES — the docs site parses this file at runtime.
     • Entry heading:  ## version — YYYY-MM-DD — Title
     • Blank line between EVERY block (paragraph, heading, list, code fence)
     • Section headings: ### Heading  OR  **Bold line** on its own line after a blank line
     • Never write bold mid-paragraph as a heading substitute — it merges into surrounding text
-->

## 4.4.0 — 2026-06-15 — Align DashboardShell with docs app shell

`DashboardShell` now defaults to the same sidebar-first layout used on the docs site: brand lockup in the left rail, structured sidebar navigation, and a context top bar instead of duplicating the lockup horizontally.

### New components

- `SidebarNav` — sidebar brand lockup with grouped nav links, icons, and active states
- `DashboardTopBar` — context top bar with breadcrumb, page title, mobile menu toggle, and actions

### Changed

- `DashboardShell` — default `variant="sidebar"` matches the docs shell; `variant="topnav"` keeps the previous horizontal TopNav layout
- New props: `sidebarGroups`, `sidebarItems`, `projectSubtitle`, `breadcrumb`, `pageTitle`
- `navItems` still works and maps into the sidebar when using the default variant
- `SettingsLayout` — `onNavSelect` for client-side section switching; `tone="danger"` on nav items
- Settings recipe uses package primitives; Settings example keeps its polished docs shell (`ds-settings`)
- Docs Screen patterns and Recipes demos updated to the aligned shell

### Migration

Existing apps using horizontal top navigation should pass `variant="topnav"` to preserve the previous layout. Apps that already pass `navItems` get sidebar navigation automatically with the new default.

## 4.3.0 — 2026-06-14 — Add screen patterns for component-first pages

Minor release: adds common page and section compositions so agents can build full Tollerud screens without recreating branded layout, navigation, form, list, detail, or empty-state structure with raw Tailwind.

### New components

- `PageHeader` — title block with eyebrow, description, metadata, and actions
- `TopNav` — branded monogram/project lockup with nav links and actions
- `DashboardShell` — app shell with top nav, optional sidebar, header, and main content
- `SettingsLayout` — settings page with section navigation and content panel
- `FormPanel` — titled form surface with body, action, and footer slots
- `ResourceList` — list/table page wrapper with header, filters, count, actions, and empty state
- `DetailPage` — detail page with header, primary content, and optional aside
- `EmptyPage` — full-page empty state on a Tollerud shell
- `FeatureSection` — feature grid section built from `PageHeader`, `CardGrid`, and `FeatureCard`
- `StatsSection` — metric section built from `PageHeader`, `Grid`, and `StatCard`

### Changed

- Docs app adds a Screen patterns page and search/deep links for the new exports.
- Docs app adds a **Recipes** page (`/recipes/`) with component-first copy-paste screen compositions for agents; each recipe links to an existing interactive example where one exists.
- Ships `tollerud-ui-audit` (`npx tollerud-ui-audit`) — lightweight consumer styling drift checker (missing `source.css`, copied `components/ui`, hardcoded brand hex, Button/Link nesting). Documented with full error-code reference, `--warn-only` flag, and alternative script invocation in `GETTING_STARTED.md`, `README.md`, `COMPONENTS.md`, and docs Guides.
- Docs and `GETTING_STARTED.md` add a consumer project checklist, anti-pattern table, and semantic feature-component example.
- `examples/next-starter` and `fixtures/consumer` use layout primitives (`PageShell`, `Section`, `Stack`, `PageHeader`, `CardGrid`) as the component-first reference implementation.
- `layout-patterns.test.ts` smoke-tests all layout and screen-pattern exports from the package barrel.
- Component demos and roadmap metadata now reference the actual screen-pattern APIs.
- Removed obsolete low-level `.tollerud-glass` and `.tollerud-section` utilities now covered by `TopNav` and `Section`.

### Migration

Replace `.tollerud-glass` nav usage with `TopNav`, and `.tollerud-section` wrappers with `Section`. No public projects are using these utilities yet.

## 4.2.0 — 2026-06-14 — Add layout primitives for component-first consumer apps

Minor release: adds semantic layout primitives so consumer apps and agents can build Tollerud-shaped pages without recreating branded structure with raw Tailwind utilities.

### New components

- `PageShell` — full-page shell with noir, grid, or glow background options
- `Section` — semantic page section with consistent spacing and width presets
- `Stack` — vertical layout primitive with finite gap and alignment options
- `Cluster` — wrapping horizontal layout for actions, badges, and toolbars
- `Grid` — responsive grid primitive with constrained column presets
- `CardGrid` — card collection grid with Tollerud spacing defaults
- `Split` — responsive two-column content/aside layout
- `MainContent` — main content wrapper with width, spacing, and density presets

### Changed

- Docs app adds a dedicated Layout page and deep links for each new primitive.
- `SKILL.md`, `AGENTS.md`, `GETTING_STARTED.md`, `README.md`, `COMPONENTS.md`, and `BACKGROUNDS.md` now reinforce component-first consumer styling.

### Migration

Nothing breaking. Existing Tailwind glue still works; prefer these primitives for repeated branded page structure.

## 4.1.1 — 2026-06-10 — Fix: missing `@theme` registration broke all `tollerud-*` color utilities

Critical fix. `globals.css` imported `tokens.css` (plain `--tollerud-*` CSS custom properties) but never registered them with Tailwind v4 via `@theme`. Tailwind v4 only generates color utilities for colors declared as `--color-*` theme variables, so every `bg-tollerud-*`, `text-tollerud-*`, and `border-tollerud-*` class used across the 52 component dist files resolved to nothing — breaking the entire visual identity (yellow accents, noir surfaces, borders, state colors) in any consumer app.

### Fix

Added a `@theme` block to `globals.css` mapping the full `tollerud-*` palette (brand yellows, noir scale, surfaces, text, borders, state colors) to `--color-tollerud-*` theme variables, referencing the existing `--tollerud-*` tokens. No change to token values — `bg-tollerud-yellow`, `text-tollerud-noir-400`, etc. now generate correctly with no extra config.

No API changes. Consumers should pick this up automatically on `npm update @tollerud/ui` — no code changes needed.

## 4.1.0 — 2026-06-11 — Ship Spinner, Drawer, EmptyState, and useToast

Minor release: four docs-site-only components move into `@tollerud/ui` with matching CSS in `globals-layers.css`.

### New components

- `Spinner` — inline loading indicator with reduced-motion support
- `Drawer` — controlled slide-over API (`open`, `onClose`, `footer`) built on `Sheet`
- `EmptyState` — prop-driven empty state with built-in Lucide icon names
- `ToastProvider` / `useToast` — context-based toast stack (alternative to Sonner `Toaster`)

### Changed

- Docs app imports the four components from `@tollerud/ui` instead of local adapters
- `COMPONENTS.md`, `SKILL.md`, `AGENTS.md` — export catalog and usage docs updated
- `registry.json` — four new entries; subpath exports: `@tollerud/ui/spinner`, `/drawer`, `/empty-state`, `/toast`

### Migration

Nothing breaking. `Empty` compound component and Sonner `Toaster` remain available.

---

## 4.0.5 — 2026-06-10 — Starter template and DX docs

Patch release: human-facing Next.js starter, migration guide, and footer package tooling alignment. No breaking API changes.

### Added

- `examples/next-starter/` — copy-paste Next.js 16 + Tailwind v4 reference app (`source.css`, `Toaster`, sample page)
- `GETTING_STARTED.md` — “Migrating from copied components” section (grep recipe, prop drift checklist, link to `SKILL.md`)

### Changed

- `@tollerud/footer` — TypeScript 6.x in devDependencies; `sync-footer-package.mjs` preserves `tsup.config.ts` build and `publishConfig`
- `GETTING_STARTED.md` / `README.md` — footer self-contained dependency model documented; starter template linked
- `packages/footer/tsconfig.json` — `ignoreDeprecations: "6.0"` for DTS emit under TS 6

### Migration

Nothing breaking. New apps can copy `examples/next-starter/` instead of wiring from scratch.

---

## 4.0.4 — 2026-06-10 — Export verification and source.css

Patch release: verifies all subpath exports in CI, adds package-owned Tailwind scanning, and expands install docs.

### Added

- `@tollerud/ui/source.css` — package-owned `@source` for `dist` scanning (npm, pnpm, workspaces, Bun)
- `test:subpath` now checks all 70 manifest entries (`dist/{name}.js` + `.d.ts`)
- `test:package` runs attw against every public subpath export

### Changed

- Recommended Tailwind v4 setup: `@import "@tollerud/ui/source.css"` after `globals.css`
- `GETTING_STARTED.md` — monorepo `@source` path table, footer-only minimal install
- `tailwind.css` re-exports `source.css` for one-import convenience
- Docs site getting-started page updated for `source.css`

### Migration

Replace manual `@source "../node_modules/@tollerud/ui/dist"` with:

```css
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";
```

---

## 4.0.3 — 2026-06-09 — Publish pipeline hardening

Patch release: aligns npm publish with `validate`, fixes preset export shape, enables provenance via OIDC, and fixes `@tollerud/footer` CI build.

### Changed

- `prepublishOnly` and `publish-npm.yml` now run `verify:footer-sync` and `test:consumer` before publish
- `publish-npm.yml` auto-builds and publishes `@tollerud/footer` alongside `@tollerud/ui`
- `tollerud-preset.js` renamed to `tollerud-preset.cjs` — fixes publint CJS-in-ESM warning; import via `@tollerud/ui/preset`
- `@tollerud/ui/utils` subpath no longer ships `'use client'` — `cn` is safe to import from Server Components
- Removed `engines.node` from `package.json` (contributor Node/npm guidance stays in `CONTRIBUTING.md`)
- Publish uses npm Trusted Publishers (OIDC) with `--provenance` instead of `NPM_TOKEN`
- `@tollerud/footer` ships its own `tsup.config.ts` — stops inheriting root TS 6 `tsconfig.build.json` during DTS emit

### Docs

- `README.md`, `GETTING_STARTED.md`, `SKILL.md`, `AGENTS.md` — preset import path updated
- Added `NPM_PACKAGE_PLAN.md` — npm hardening audit and task list

### Migration

Nothing breaking. If you copied `tollerud-preset.js` locally, rename to `tollerud-preset.cjs` or switch to `import preset from '@tollerud/ui/preset'`.

---

## 4.0.2 — 2026-06-10 — Repo layout and publish surface cleanup

Patch release: consolidates docs and CI fixtures, stops shipping internal manifests, and clarifies docs copy after the npm-only pivot.

### Changed

- Tarball smoke test moved to `fixtures/consumer/` (was `examples/consumer/`)
- Docs chrome consolidated under `docs-app/styles/docs.css` (removed top-level `docs/`)
- `registry.json` kept in the repo for `npm run test:drift` — no longer published in the npm tarball
- Docs copy: semantic tokens described without shadcn install-path framing

### Removed

- `components.json` — unused after copy-via-shadcn removal

---

## 4.0.1 — 2026-06-10 — npm-only install path

Patch release: drops copy-via-shadcn registry tooling. Install from the package — barrel or subpath imports.

### Removed

- `npm run test:registry-cli`, `npm run build:registry`, and `examples/registry-consumer/`
- `registry-dist/` build output (never shipped to npm in v4.0.0)
- Public shadcn `npx shadcn add` install docs — no consumers use copy-into-repo flow

### Docs

- Getting started leads with `npm install @tollerud/ui` and subpath imports (`@tollerud/ui/button`)
- `registry.json` remains for internal drift checks (`npm run test:drift`) only

### Migration

Use the package directly:

```tsx
import { Button } from '@tollerud/ui'
// or tree-shake:
import { Button } from '@tollerud/ui/button'
```

Do not copy component source via shadcn CLI — that path is unsupported.

---

## 4.0.0 — 2026-06-10 — Ecosystem hardening and globals-v4 removal

Major release: completes the post-v3 roadmap (light gallery, registry CLI, footer lockstep), reorganizes brand assets, and drops deprecated CSS entrypoints.

### Breaking changes

- Removed `@tollerud/ui/globals-v4.css` — it was an alias for `globals.css`. Tailwind v4 projects should import `@tollerud/ui/globals.css` only.
- Brand assets moved under `@tollerud/ui/brand/*` — e.g. `@tollerud/ui/brand/tollerud-logo.svg` (not package-root paths).

### Ecosystem

- `@tollerud/footer` — `packages/footer/` synced from `components/Footer.tsx` via `npm run sync:footer`; `npm run verify:footer-sync` in `validate`
- Changesets linked `@tollerud/ui` and `@tollerud/footer` for joint version bumps
- Registry drift checks via `registry.json` (`npm run test:drift`) — internal manifest, not a public shadcn install path

### Docs site

- Light-mode gallery parity — docs-only Tailwind preset maps `tollerud-*` utilities to CSS variables so npm previews flip in `data-theme="light"`
- Docs icons migrated to `lucide-react` (custom GitHub mark retained)
- Playwright coverage — forms page, command palette, theme toggle, light-mode card surfaces
- Brand assets canonical in `brand/`; synced to docs via `scripts/sync-brand-assets.mjs`
- Homepage and live docs URL → `https://design.tollerud.dev/`

### Tooling

- CI and dev tooling on Node 24 + npm 11.16.0 (`.nvmrc`, lockfile guardrails)
- Dependabot for `docs-app/` and `fixtures/consumer/` (moved from `examples/consumer/` in v4.0.2)
- Removed legacy `preview.html`, completed planning docs, and stale docs artifacts
- Consumer smoke test auto-syncs tarball version in `fixtures/consumer/package.json` (path at release: `examples/consumer/`)

### Migration

**globals-v4.css** — replace:

```css
@import "@tollerud/ui/globals-v4.css";
```

with:

```css
@import "@tollerud/ui/globals.css";
@source "../node_modules/@tollerud/ui/dist";
```

**Brand assets** — replace root imports:

```ts
import logo from '@tollerud/ui/tollerud-logo.svg'
```

with:

```ts
import logo from '@tollerud/ui/brand/tollerud-logo.svg'
```

No component API changes. `@tollerud/ui` barrel and subpath imports unchanged.

---

## 3.1.1 — 2026-06-09 — Display shimmer, form indicators, and button fixes

Patch release: ships hero text shimmer for consumer apps, fixes secondary/checkbox/radio styling, and polishes docs layout components.

### New utilities

- `.tollerud-display-shimmer` — animated yellow gradient clipped to text; respects `prefers-reduced-motion` (static `var(--primary)` fallback)

### Fixes

- `Button` — secondary variant restores raised surface and border (theme-aware CSS vars); all variants apply layer classes again
- `Checkbox` — checkmark visible on `defaultChecked` and click via `peer-checked` on the custom indicator
- `RadioGroup` — wires `value`, `onChange`, and `name` to children; inner dot shows when selected
- `CTABand` — title and description centered in the band
- `BentoDashboard` — section spacing and label alignment
- Docs `PageTOC` — restores `jumpToSection` import for in-page scroll

### Registry

- Top-level `name` → `Tollerud User Interface`; updated description and component metadata for blocks

### Docs

- Overview, Backgrounds, and Foundations Typography use `.tollerud-display-shimmer` (replaces docs-only `.ds-shimmer`)
- Light theme shimmer and secondary-button token overrides

### Migration

Drop-in. Replace any copied `.ds-shimmer` with `.tollerud-display-shimmer` from `@tollerud/ui/globals.css`.

---

## 3.1.0 — 2026-06-09 — Monogram component and docs fixes

Restores component styling in the docs site, ships the monogram as an npm component, and renames brand avatar assets.

### New components

- `Monogram` — inline SVG with `color`: `yellow` | `black` | `white`, optional `size` and `title`

### Fixes

- `Button` — `terminal` variant uses layer classes again
- `Pill`, `Avatar`, `Skeleton`, `Timeline`, `Switch`, `Slider`, `FormRow` — layer-class / prop adapter fixes
- `DatePicker` — calendar popover `z-50`
- `DataTable` — explicit `text-left` on column headers
- `CTABand` — inline accent bar margin
- `BentoDashboard` — real infra cards instead of placeholders
- `Footer` — uses `<Monogram color="yellow" />`
- `NoirGlowBackground` — `scale` and `offsetX` for edge-biased shader placement

### Brand assets

- `tia-full-figure.svg` renamed to `tollerud-avatar-full.svg` (plus PNG export)
- npm exports: `@tollerud/ui/tollerud-avatar-full.svg` and `@tollerud/ui/tollerud-avatar-full.png`

### Docs

- Docs-only brand layer: `Monogram`, `TiaPortrait`, `TollerudAvatarFull`, `NavLockup` under `@/components/brand`
- Tailwind `@source` fix, light-mode monogram via `currentColor`, onboarding/auth/foundations page updates

### Migration

Drop-in. Replace any copied `tia-full-figure` paths with `tollerud-avatar-full`. Use `<Monogram />` instead of inline SVG or `<img src={logo}>` where you need theme-aware fill.

---

## 3.0.0 — 2026-06-09 — ESM-only and rich DataTable

Ships the full table pattern in npm, drops CommonJS builds, and adds release/props tooling.

### Breaking change

- Package is **ESM-only** — `require('@tollerud/ui')` and `.cjs` subpath bundles are removed. Use `import` in apps and bundlers that support ES modules.

### New features

- `DataTable` — search, segmented filter, row selection, bulk actions, per-row menus, pagination, loading skeletons, and custom empty states (optional; simple sort/filter mode unchanged)
- `npm run docs:props` — generates `PROPS.generated.md` from component `*Props` interfaces
- `npm run test:props` — drift check in `validate` / `prepublishOnly`
- Changesets — `npm run changeset` and `npm run version:release` (runs `sync:registry`)

### Docs

- Retired docs-only `rich-datatable.jsx`; docs `DataTable` is an adapter over npm `DataTable`
- `PackageDataTable` remains the direct npm import alias on the components page

### Migration

Replace `require('@tollerud/ui')` with ESM imports. For rich tables, pass the new optional props on `DataTable` instead of copying docs-only table code.

---

## 2.0.0 — 2026-06-09 — Peer dependency model

Radix, Lucide, Framer Motion, and Sonner move to peer dependencies so consumer apps do not bundle duplicate copies.

### Breaking change

Install peers explicitly alongside `@tollerud/ui`:

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss@4 \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress \
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip \
  lucide-react framer-motion sonner
```

### New features

- `@tollerud/ui/tailwind.css` — convenience import with documented `@source` hint
- `npm run test:package` — publint + `@arethetypeswrong/cli` on the package
- `npm run test:size` — size-limit budget on `dist/button.js` and `dist/index.js`
- `npm run sync:registry` — align `registry.json` version with `package.json` before publish

### Docs

- Retired docs-only `grain-gl.jsx`; backgrounds and overview use npm `NoirGlowBackground`
- Publish workflow runs drift, package quality, size budget, docs build, and Playwright E2E

### Migration

If you already had Radix/Lucide/Motion/Sonner in your app, add them to `package.json` if npm no longer hoists them from `@tollerud/ui`. No component API changes.

## 1.4.0 — 2026-06-09 — Charts and marketing blocks

Palette-aware charts and landing-page blocks ship in the npm package. Docs site reorganized into `pages/`, `kit/`, `blocks/`, and `backgrounds/`.

### New components

- `BarChart` — vertical bars with optional yellow accent series
- `AreaChart` — gradient area/line chart with grid lines
- `Donut` — donut chart with segment legend
- `Sparkline` — compact inline trend line
- `HeroBlock` — landing hero on noir glow (`intense` uses `NoirGlowBackground`)
- `FeatureCard` — icon chip + title + description
- `CTABand` — closing CTA with optional accent bar

### Docs

- Charts and marketing import from `@tollerud/ui` (no duplicate `charts.jsx` / `marketing.jsx`)
- `docs-app/components/` taxonomy: routable `pages/page-*.jsx`, `kit/`, `blocks/rich-datatable.jsx`, `backgrounds/grain-gl.jsx`

### Migration

Nothing breaking. Import charts and blocks from `@tollerud/ui` as named exports.

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
