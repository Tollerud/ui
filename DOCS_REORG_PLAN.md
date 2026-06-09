# Docs site reorganization plan

Target: [design.tollerud.dev](https://design.tollerud.dev) — improve information architecture without a full rewrite.

## Current state

| Group | Pages | Issue |
|-------|-------|-------|
| **Start** | Overview | Install buried here; hero stats stale |
| **Design** | Foundations, Components, Infra, Forms, Nav, Charts, Blocks, Backgrounds | `Components` is a 30-section junk drawer; slug/label mismatches |
| **Build** | Onboarding, Mission Control, Data Table, Logs, Settings, Billing, Auth | Name sounds like contributor docs; route IDs don't match labels |

## Target IA

```
Start
  Overview
  Getting started        ← new (install, peers, Tailwind, gotchas)
  Changelog

Design
  Foundations
  Components             ← core primitives + hub links
  Forms
  Navigation & Overlays
  Infrastructure
  Charts
  Blocks
  Backgrounds

Examples                 ← renamed from Build
  Onboarding
  Mission Control
  Data Table
  Logs & Console
  Settings
  Billing
  Sign in
```

## Phase 1 — Clarity (done)

Low risk, high ROI. No URL breakage for bookmarks.

| Task | Detail |
|------|--------|
| **Getting started** | New page from `GETTING_STARTED.md` + `SKILL.md` gotchas |
| **Slim Components** | Remove sections duplicated on Forms, Nav, Console, Servers, Blocks; add hub with cross-links |
| **Route IDs** | Canonical slugs: `charts`, `navigation`, `mission-control`, `data-table`; old slugs redirect client-side |
| **Rename group** | `Build` → `Examples` |
| **Central routes** | `docs-app/lib/docs-routes.js` — single source for nav, titles, aliases, static params |

### Components page — keep (core primitives)

Button, Card, Divider, Badge & Pill, Status & Kbd, Stat card, Progress/Skeleton/Avatar, Tooltip, Alert, Tabs & Accordion, Timeline, Panel, Meter, Stepper, Density, Empty state, Code block, Container, Action row, Glow card.

### Components page — move or remove

| Section | Destination |
|---------|-------------|
| Password input & spinner | Forms |
| Form row | Forms |
| Combobox | Forms |
| Toast, Toaster | Navigation & Overlays (extend Toasts) |
| Drawer / Sheet | Navigation & Overlays |
| Log viewer | Logs & Console |
| Data table (npm + rich) | Data Table example |
| Pricing card | Blocks (grid already covers; drop standalone duplicate) |

## Phase 2 — Depth

| Task | Detail |
|------|--------|
| **Nested nav** | Optional sub-groups under Design (Core · Forms · Navigation · Data · Infra · Marketing) |
| **Overview cleanup** | Dynamic version + component counts from `package.json` / registry |
| **Prop tables** | Surface `PROPS.generated.md` per section (or link to GitHub) |
| **Resources group** | Migration notes, `SKILL.md` sync hint, contributing link |

## Phase 3 — Scale (only if needed)

| Task | Detail |
|------|--------|
| **Per-component routes** | `/components/button` — better SEO and deep links |
| **MDX / content layer** | If prop tables and versioning outgrow inject-script model |
| **Playwright** | Cover getting-started links, redirects, command palette after reorg |

## Redirect map (Phase 1)

| Old slug | New slug |
|----------|----------|
| `datablocks` | `charts` |
| `navoverlays` | `navigation` |
| `patterns` | `mission-control` |
| `servers` | `data-table` |

Old slugs remain in `generateStaticParams` and redirect via `router.replace` on mount.

## Files touched in Phase 1

- `docs-app/lib/docs-routes.js` (new)
- `docs-app/components/docs-shell.jsx`
- `docs-app/app/[[...slug]]/page.tsx`
- `docs-app/components/pages/page-getting-started.jsx` (new)
- `docs-app/components/pages/page-components.jsx`
- `docs-app/components/pages/page-forms.jsx`
- `docs-app/components/pages/page-nav-overlays.jsx`
- `docs-app/components/pages/page-console.jsx`
- `docs-app/components/pages/page-servers.jsx`
- `docs-app/components/pages/page-overview.jsx`
- `docs-app/components/kit/cmd-registry.jsx`
