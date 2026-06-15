# Contributing

## Dev environment

- **Node 24** — use `nvm use` (`.nvmrc` at repo root) or install Node 24 locally
- **npm 11.16.0** — pinned via `packageManager` in `package.json`; CI runs `npm ci` with this version

When you change dependencies or bump the package version, regenerate the lockfile with the pinned npm (see [AGENTS.md §1b](AGENTS.md)):

```bash
npx npm@11.16.0 install
rm -rf node_modules && npx npm@11.16.0 ci
```

Commit `package.json` and `package-lock.json` together.

## Before you open a PR

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Or run the full gate in one step:

```bash
npm run validate
```

Docs site E2E (requires `npx playwright install chromium` once):

```bash
npm run test:e2e
```

Draft a CHANGELOG entry from git commits:

```bash
npm run changelog:draft
```

## Adding or changing components

Follow the checklist in [AGENTS.md](AGENTS.md):

1. Component source in `components/`
2. Export from `components/index.ts`
3. Registry entry in `registry.json`
4. Live demo in `docs-app/components/pages/page-*.jsx` (Next.js static export → `_site/`)
5. Register routes in `docs-app/lib/docs-routes.js` (`NAV`, `PAGE_TITLES`) and `docs-app/components/docs-shell.jsx` (`CANONICAL_PAGES`)
6. Add command-palette deep links in `docs-app/lib/component-catalog.js` when the page has permalink sections

In the same commit, update [AGENTS.md](AGENTS.md) §4: `CHANGELOG.md`, `COMPLETENESS_ROADMAP.md`, `SKILL.md`, and component import blocks where exports changed.

## Consumer styling, recipes, and guardrails

Consumer apps should treat `@tollerud/ui` components and layout primitives as the design language. Tailwind stays available for small local glue — not as the primary way to build branded UI. Full policy: [SKILL.md](SKILL.md) and [AGENTS.md](AGENTS.md) → Consumer styling policy.

When you change consumer-facing styling policy, layout primitives, screen patterns, recipes, or the audit script, keep these files aligned in the **same commit**:

| Change type | Update |
|-------------|--------|
| New/changed layout or screen pattern export | `SKILL.md`, `AGENTS.md` import blocks, `GETTING_STARTED.md`, docs `page-layout.jsx` / `page-screens.jsx`, `component-catalog.js` deep links |
| New recipe or guardrail guidance | `GETTING_STARTED.md`, `SKILL.md`, `docs-app/components/pages/page-recipes.jsx` and/or `page-resources.jsx`, `docs-routes.js` if new route |
| Consumer checklist or anti-pattern | `GETTING_STARTED.md`, `SKILL.md`, `AGENTS.md`, matching docs page (`page-getting-started.jsx`, `page-resources.jsx`) |
| `scripts/audit-consumer-styling.mjs` or `tollerud-ui-audit` bin | `GETTING_STARTED.md`, `SKILL.md`, `AGENTS.md`, `COMPONENTS.md`, `README.md`, `page-getting-started.jsx`, `page-resources.jsx`, `page-overview.jsx`, `component-catalog.js`, `CHANGELOG.md`; `test:consumer-styling` fixtures must still pass |

Run the consumer audit locally:

```bash
npm run test:consumer-styling
# or from a consumer app after install:
npx tollerud-ui-audit
```

Mark roadmap items complete in [COMPLETENESS_ROADMAP.md](COMPLETENESS_ROADMAP.md) only when acceptance criteria are met — not when a single file changes.

## Docs-only changes

Docs site source lives under `docs-app/`. After editing `docs-app/components/pages/*.jsx` or routes:

```bash
npm run build:docs
```

`CHANGELOG.md` is copied to `docs-app/public/CHANGELOG.md` during that build — edit the root `CHANGELOG.md` only.

Human/agent reference markdown shipped in the npm tarball (`GETTING_STARTED.md`, `SKILL.md`, `AGENTS.md`, `COMPONENTS.md`) must stay consistent with the live docs site when both cover the same topic.

## Releases

Preferred flow (Changesets):

```bash
npm run changeset          # after merging feature PRs
npm run version:release    # bumps package.json + CHANGELOG + registry.json
npm run validate
```

`version:release` runs `changeset version` then `sync:registry`. Push to `main`; the publish workflow runs gates and `npm publish` when the version is new.

Fallback: manual version bump in `package.json`, `npm run changelog:draft`, and `npm run sync:registry`.

Prop reference drift: `npm run docs:props` regenerates `PROPS.generated.md`; `npm run test:props` runs in `validate`.

See [AGENTS.md](AGENTS.md) for version bump rules and CHANGELOG format.
