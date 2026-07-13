# Tollerud User Interface — Roadmap

Last updated: 2026-07-12

Living roadmap for `@tollerud/ui`. Completed planning docs: [docs/archive/](docs/archive/).

## npm package (components/*.tsx) — v4.13.0

Shipped exports are documented in [SKILL.md](SKILL.md) and [COMPONENTS.md](COMPONENTS.md). Live demos: [design.tollerud.dev](https://design.tollerud.dev/).

### Open items

- [ ] Broader unit + a11y test coverage on interactive components (Combobox, DatePicker, CommandMenu)
- [ ] Extend Playwright for subpath-import smoke page in docs or fixture
- [ ] `@tollerud/email` — expand template set (magic-link, invoice, digest) and add cross-client snapshot checks

### Recently completed

**@tollerud/email** (v4.10.0) — new sibling package for on-brand HTML email built on React Email: email-safe primitives + ready templates, sharing tokens (not components) with `@tollerud/ui` via the generated `lib/tokens.ts`. See [CHANGELOG.md](CHANGELOG.md).

**First-class charts** — all six phases (v4.8.42–46): shared interaction core, keyboard navigation + tooltips across TimeSeriesChart / AreaChart / Sparkline / BarChart / Donut, tokenized theming (`--chart-1…5` palette), screen-reader data tables, and multi-series TimeSeriesChart. See [docs/archive/CHARTS_PLAN.md](docs/archive/CHARTS_PLAN.md).

**Consumer styling** — layout primitives, screen patterns, component-first docs, agent-safe recipes, and `npx tollerud-ui-audit`. All phases done. See [docs/archive/CONSUMER_STYLING_ROADMAP.md](docs/archive/CONSUMER_STYLING_ROADMAP.md).

**npm package hardening** — publish pipeline parity, preset CJS, selective `'use client'`, full subpath export tests, OIDC provenance, starter template. Priorities 1–3 done. See [docs/archive/NPM_PACKAGE_PLAN.md](docs/archive/NPM_PACKAGE_PLAN.md).

---

## Release ritual

On every version bump:

1. Update the `### npm package (components/*.tsx) — vX.X.X` header above to match `package.json`.
2. Check off completed open items or add new ones.
3. Note shipped work in `CHANGELOG.md`.

See [AGENTS.md](AGENTS.md) §3–4 for the full release checklist.
