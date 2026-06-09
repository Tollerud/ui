# @tollerud/ui — NPM package remediation plan

Last updated: 2026-06-09 · Target: production-grade npm package

Status key: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Phase 1 — Single source of truth (docs = npm)

**Problem:** Live docs use `docs/components.jsx`, `docs/datatable.jsx`, and `docs/infra.jsx` — parallel implementations that drift from `components/*.tsx`.

### 1a — Next.js docs site + npm bridge `[x]`

- [x] Add `docs-app/` Next.js App Router static export importing `@tollerud/ui` from `dist/`
- [x] Dogfood `@tollerud/ui/globals.css` (Tailwind v4) instead of CDN v3
- [x] `docs-app/lib/ui-merged.js` — re-exports `@tollerud/ui` + `docs-adapters.jsx` for demo prop shapes
- [x] Update GitHub Pages workflow to `npm run build && npm run build:docs` → `_site/`
- [x] Retire Babel-in-browser `index.html` entry (Next.js `_site/` is the only deploy)
- [x] Playwright E2E serves static `_site/` preview

### 1b — Eliminate duplicate component files `[x]`

- [x] Delete legacy `docs/*.jsx` duplicates (`components.jsx`, `infra.jsx`, `datatable.jsx`, etc.); keep `docs/docs.css` only
- [x] Replace `docs-app/components/infra.jsx` with `@tollerud/ui` infra components (+ string props for HostCard cpu/memory/disk)
- [x] Rename docs DataTable to `rich-datatable.jsx` (docs-only; npm `DataTable` stays the package export)
- [x] Align docs `CommandMenu` with npm API (`onOpenChange` + `adaptCommandGroups` helper)
- [x] Add **drift test** (`npm run test:drift`): registry keys ↔ `components/index.ts` exports ↔ source files
- [x] Docs bridge uses `docs-app/lib/docs-adapters.jsx` (npm-backed); `legacy-ui.jsx` removed

### 1c — Docs site layout taxonomy `[x]`

Routable gallery pages vs support modules — only routes use the `page-` prefix.

```
docs-app/components/
  docs-shell.jsx              # App shell: sidebar, routing, theme, CommandMenu
  pages/
    page-*.jsx                # 17 routable doc pages (URLs in docs-shell NAV/PAGES)
  kit/                        # Docs chrome — never shipped in npm
    primitives.jsx            # Demo, Section, PageHeader, CodeSnippet, toast shim
    icons.jsx                 # Stroke icon set for demos (package uses lucide-react)
    cmd-registry.jsx          # ⌘K section index + slugify helpers
    motion.jsx                # Scroll reveal, CountUp, Typewriter, PageTOC
  blocks/
    rich-datatable.jsx        # Docs-only DataTable (bulk/row menus/pagination)
  backgrounds/
    grain-gl.jsx              # Legacy WebGL loader; prefer NoirGlowBackground in npm
```

| Module | In `@tollerud/ui`? | Notes |
|--------|-------------------|-------|
| `pages/page-*.jsx` | N/A | Routable doc pages |
| `docs-shell.jsx` | Never | Docs app infrastructure |
| `kit/primitives.jsx` | Never | Demo chrome |
| `kit/icons.jsx` | Never | Duplicates lucide for static demos |
| `kit/cmd-registry.jsx` | Never | Docs routing / ⌘K |
| `kit/motion.jsx` | Never | Docs-site UX (reveal, TOC) |
| `blocks/rich-datatable.jsx` | No | Incremental merge into npm `DataTable` |
| `backgrounds/grain-gl.jsx` | Partial | npm ships `NoirGlowBackground` |

Bridge entry points: `docs-app/lib/ui-merged.js` (npm re-exports), `docs-app/lib/docs-adapters.jsx` (legacy demo prop shapes), `docs-app/lib/provide-pages.js` (barrel for injected page imports).

### 1d — Ship charts & marketing blocks `[x]`

- [x] `BarChart`, `AreaChart`, `Donut`, `Sparkline` → `components/*.tsx` + registry
- [x] `HeroBlock`, `FeatureCard`, `CTABand` → `components/*.tsx` + registry
- [x] Docs import charts/marketing from `@tollerud/ui` via `ui-merged.js`
- [x] `FeatureCard` icon string keys in docs → adapter maps `Icons[name]` to npm `icon` slot
- [ ] Retire `backgrounds/grain-gl.jsx` once all demos use `NoirGlowBackground` (`intense` on `HeroBlock` uses npm shader)

---

## Phase 2 — Consumer integration test `[x]`

**Problem:** Tests import source; nothing verifies the published tarball.

- [x] Add `examples/consumer/` — minimal Next.js + React + Tailwind v4
- [x] CI: `npm run test:consumer` packs tarball → installs in example → builds
- [x] Assert `@tollerud/ui/button`, `globals.css` resolve

---

## Phase 3 — Publish pipeline parity `[~]`

**Problem:** `prepublishOnly` and publish workflow skip `test:subpath` and E2E.

- [x] Add `test:subpath` to `prepublishOnly` and publish workflow
- [ ] Add E2E to publish gate (E2E runs in CI validate job separately)
- [ ] Sync `registry.json` version in publish workflow automatically

---

## Phase 4 — Clean installs `[x]`

**Problem:** `npm ci --legacy-peer-deps` required everywhere.

- [x] Run `npm ci` without flag (no peer conflicts on Node 22)
- [x] Remove `--legacy-peer-deps` from CI, scripts, and CONTRIBUTING

---

## Phase 5 — Peer dependency model

**Problem:** Radix, Lucide, Framer Motion, Sonner bundled as dependencies → duplicate copies in consumer apps.

- [ ] Move to `peerDependencies`: `@radix-ui/*`, `lucide-react`, `framer-motion`, `sonner`
- [ ] Keep `class-variance-authority` as dependency (small) or peer
- [ ] Document required peers in README with install one-liner
- [ ] Major bump (`2.0.0`) when peers change

---

## Phase 6 — Quality gates

- [ ] Expand Vitest coverage (forms, portals, Combobox, Select, Sheet, Tabs, FileUpload)
- [ ] Add `axe-core` assertions for key components
- [ ] Add `publint` + `@arethetypeswrong/cli` to CI
- [ ] Add `size-limit` on `dist/button.js` and `dist/index.js`
- [ ] Optional: `@tollerud/ui/tailwind.css` helper with baked `@source` hint

---

## Phase 7 — Documentation & release hygiene

- [ ] Typedoc or generated props from TS (reduce COMPONENTS.md drift)
- [ ] Changesets or release-please for version + changelog
- [ ] `CODE_OF_CONDUCT.md`
- [ ] Clarify `@tollerud/footer` maintenance vs `@tollerud/ui` Footer export
- [ ] Forward-looking section in COMPLETENESS_ROADMAP.md

---

## Execution order

| Order | Phase | Impact |
|-------|-------|--------|
| 1 | 1a | Trust — docs use real package |
| 2 | 2 | CI proves install works |
| 3 | 3 | Safe publishes |
| 4 | 1b | Remove duplicate code |
| 5 | 1c–1d | Taxonomy + charts/marketing in npm |
| 6 | 4 | Contributor UX |
| 7 | 5 | Consumer bundle health |
| 8 | 6–7 | Maturity |

---

## Out of scope (for now)

- Storybook (Playwright + unit tests sufficient for now)
- ESM-only drop of CJS
- Light mode in npm components (dark-only by design)
- Full DataTable feature parity in one release (may ship incrementally)
