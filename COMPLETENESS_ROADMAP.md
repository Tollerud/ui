# Tollerud User Interface — Roadmap

Last updated: 2026-06-16

Living roadmap for `@tollerud/ui`. Completed planning docs: [docs/archive/](docs/archive/).

## npm package (components/*.tsx) — v4.8.21

Shipped exports are documented in [SKILL.md](SKILL.md) and [COMPONENTS.md](COMPONENTS.md). Live demos: [design.tollerud.dev](https://design.tollerud.dev/).

### Open items

- [ ] Broader unit + a11y test coverage on interactive components (Combobox, DatePicker, CommandMenu)
- [ ] Extend Playwright for subpath-import smoke page in docs or fixture

### Recently completed

**Consumer styling** — layout primitives, screen patterns, component-first docs, agent-safe recipes, and `npx tollerud-ui-audit`. All phases done. See [docs/archive/CONSUMER_STYLING_ROADMAP.md](docs/archive/CONSUMER_STYLING_ROADMAP.md).

**npm package hardening** — publish pipeline parity, preset CJS, selective `'use client'`, full subpath export tests, OIDC provenance, starter template. Priorities 1–3 done. See [docs/archive/NPM_PACKAGE_PLAN.md](docs/archive/NPM_PACKAGE_PLAN.md).

---

## Release ritual

On every version bump:

1. Update the `### npm package (components/*.tsx) — vX.X.X` header above to match `package.json`.
2. Check off completed open items or add new ones.
3. Note shipped work in `CHANGELOG.md`.

See [AGENTS.md](AGENTS.md) §3–4 for the full release checklist.
