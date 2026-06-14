# Tollerud User Interface — Roadmap

Last updated: 2026-06-11

## Current state — what's done

### Tokens
- ✅ Brand tokens (yellow, amber, noir scale)
- ✅ Semantic tokens (background, foreground, card, primary, secondary, muted, accent, destructive, success, warning, info, border, input, ring)
- ✅ Surface tokens (surface, surface-raised, surface-overlay, surface-hover)
- ✅ Text tokens (text-primary, text-secondary, text-muted, text-inverse)
- ✅ Chart tokens (chart-1 through chart-5, chart-grid, chart-axis)
- ✅ Motion tokens (duration-fast/normal/slow, ease-out/in/in-out)
- ✅ Elevation / z-index tokens
- ✅ Shadow scale
- ✅ Typography tokens (font-sans, font-mono, font-display)
- ✅ Light mode — full contrast-checked palette with deep gold accent text (#8A7A00)
- ✅ Dark mode default
- ✅ `prefers-reduced-motion` respected globally

### Components (docs site — docs-app via @tollerud/ui + docs-adapters)
- ✅ Button — 5 variants, 3 sizes, icon, loading, disabled, icon-only
- ✅ Card — accent, density prop
- ✅ Badge — 6 variants
- ✅ Pill — 4 variants
- ✅ StatusDot — online/warning/offline/idle
- ✅ Kbd — shortcut chips
- ✅ Input — default, filled, error, disabled, readonly
- ✅ Textarea
- ✅ Select
- ✅ Checkbox
- ✅ Switch — with pointer cursor
- ✅ RadioGroup / Radio
- ✅ Slider
- ✅ StatCard
- ✅ Progress
- ✅ Skeleton
- ✅ Avatar + AvatarGroup — in same section
- ✅ Divider — default + accent
- ✅ Tabs — pill + underline variants
- ✅ Accordion
- ✅ Tooltip — fade in/out animation
- ✅ Alert — 5 tones (default, accent, info, success, error), custom icon prop
- ✅ Breadcrumb
- ✅ Pagination
- ✅ Dropdown menu — portalled to body, closes on scroll
- ✅ Dialog — portalled to body
- ✅ Drawer / Sheet — portalled to body
- ✅ Combobox — portalled to body, closes on scroll
- ✅ DatePicker — portalled to body, closes on scroll
- ✅ EmptyState — standard + compact + accent
- ✅ LogViewer (static) + StreamingLogViewer (console page)
- ✅ Spinner
- ✅ Panel — title, description, action toolbar
- ✅ Meter — with hot threshold
- ✅ Stepper — array of strings, 0-based current index
- ✅ PasswordInput
- ✅ FormRow
- ✅ PricingCard
- ✅ Toast / useToast
- ✅ DataTable — stable height on search, sort, select, bulk, pagination
- ✅ Density — `<Card density="compact">` + `data-density` container wrapper

### npm package (components/*.tsx) — v4.4.0
- ✅ Button — defaults to secondary, `asChild` (Radix Slot) + exported `buttonVariants` since 1.0.7
- ✅ Bundle correctly marked `'use client'` for RSC/SSR safety since 1.0.8
- ✅ Card — density prop
- ✅ Badge — all 6 variants
- ✅ Alert — all 5 tones, icon prop
- ✅ Input, Textarea, Select, Checkbox, Switch, RadioGroup
- ✅ StatusDot, Kbd, StatCard, Progress, Skeleton
- ✅ Dialog, Tooltip, Tabs, DropdownMenu, Sheet, Drawer, DataTable
- ✅ LogViewer, Timeline, Empty, EmptyState, Toaster, ToastProvider / useToast
- ✅ Spinner
- ✅ Infrastructure: HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, ApprovalCard, BackupStatusPanel, AlertInbox, RollbackPlan, ActionDiff
- ✅ CommandMenu, ActionRow, CodeBlock, GlowCard, BentoDashboard, Footer, Monogram
- ✅ Container, NoirGlowBackground
- ✅ Divider, Pill, Avatar, AvatarGroup, Breadcrumb, Pagination, Segmented, Stepper
- ✅ Panel, Meter, FormRow, PricingCard
- ✅ Accordion, Slider, PasswordInput
- ✅ Combobox, DatePicker, FileUpload, TagInput
- ✅ Charts — BarChart, AreaChart, Donut, Sparkline
- ✅ Marketing blocks — HeroBlock, FeatureCard, CTABand
- ✅ Layout primitives — PageShell, Section, Stack, Cluster, Grid, CardGrid, Split, MainContent
- ✅ Screen patterns — PageHeader, TopNav, SidebarNav, DashboardTopBar, DashboardShell, SettingsLayout, FormPanel, ResourceList, DetailPage, EmptyPage, FeatureSection, StatsSection
- ✅ Tailwind preset exposes package utilities under `tollerud.*`

### Docs site
- ✅ Light/dark theme toggle (⌘L)
- ✅ Live background switcher — 5 dark / 4 light presets
- ✅ Command palette (⌘K) with cross-page section search
- ✅ Table of contents per page
- ✅ All demos copy-pasteable
- ✅ No duplicate sections across pages
- ✅ Mobile responsive

### Other
- ✅ Scroll-reveal disableable via `window.TOLLERUD_NO_REVEAL = true` or `<html data-no-reveal>`
- ✅ Text selection — yellow highlight, dark text on both themes
- ✅ Docs icons use lucide-react (custom GitHub mark retained)

---

## Forward-looking (post v3.0.0)

### npm package
- [x] Rich `DataTable` — search, selection, bulk actions, row menus, pagination in npm (v3.0.0)
- [x] Generated prop tables — `PROPS.generated.md` + `test:props` (v3.0.0)
- [x] Changesets — `npm run changeset` / `version:release` (v3.0.0)
- [x] ESM-only package (v3.0.0)
- [x] Replace docs `kit/icons.jsx` with Lucide in demos

### Docs site
- [x] Light-mode gallery parity for npm components (package stays dark-only; docs may preview tokens)
- [x] More Playwright coverage (forms page, command palette, theme toggle)

### Ecosystem
- [x] `@tollerud/footer` version lockstep automation with `@tollerud/ui` Footer export
- [x] npm-only install path — removed copy-via-shadcn registry CLI (v4.0.1); `registry.json` kept for drift checks

### npm package hardening (planned — 2026-06-11)

> **Audit prompt:** Can you review the whole code and project and tell me whats missing to make this a fully usable UI based on best practises?

Full task breakdown: **[NPM_PACKAGE_PLAN.md](./NPM_PACKAGE_PLAN.md)**

**Priority 1 — trust / ship parity** ✅ (2026-06-09)
- [x] Add `test:consumer` + `verify:footer-sync` to `prepublishOnly` and `publish-npm.yml`
- [x] Auto-publish `@tollerud/footer` in CI
- [x] Rename `tollerud-preset.js` → `tollerud-preset.cjs` (fix publint ESM/CJS warning)
- [x] Selective `'use client'` on dist entries (`utils.js` excluded; interactive subpaths unchanged)
- [x] Remove `engines.node` from consumer-facing `package.json`
- [x] npm provenance via Trusted Publishers (OIDC) — `@tollerud/ui` + `@tollerud/footer`

**Priority 2 — export reliability** ✅ (2026-06-10)
- [x] Expand `test:subpath` to cover all `entries/manifest.json` keys + attw on all subpaths
- [x] Ship `@tollerud/ui/source.css` + monorepo `@source` docs in `GETTING_STARTED.md`
- [x] Footer-only minimal install documented

**Priority 3 — DX** ✅ (2026-06-10)
- [x] Footer: keep `@tollerud/footer` separate; bundled `clsx` / `tailwind-merge` documented as self-contained by design (no deprecation for now)
- [x] Align `packages/footer` TypeScript to 6.x
- [x] Human-facing starter template — `examples/next-starter/`
- [x] “Migrating from copied components” section in `GETTING_STARTED.md`

**Priority 4 — quality (longer term)**
- [ ] Broader unit + a11y test coverage on interactive components

---

## Completed hardening

- ✅ NPM remediation plan phases 1–7 complete (2026-06-09)
- ✅ Peer dependency model (v2.0.0)
- ✅ Rich DataTable, ESM-only, Changesets, generated props (v3.0.0)
- ✅ publint + attw + size-limit in CI validate
- ✅ Publish gate: drift, package quality, E2E, registry version sync
- ✅ `globals-v4.css` alias removed — use `globals.css` (v4.0.0)
