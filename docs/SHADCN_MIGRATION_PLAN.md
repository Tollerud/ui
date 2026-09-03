# Tollerud UI v6 — shadcn rebase

**Status:** proposal, awaiting sign-off — Phase 0 design-file blocker resolved, see §7
**Author:** drafted 2026-09-03, updated 2026-09-03 with design-bundle findings
**Target:** `@tollerud/ui` v6.0.0 (lockstep with `@tollerud/footer`, `@tollerud/email`)

Goal: keep the Tollerud look, drop the Tollerud *machinery*. Base the system on
shadcn/ui conventions so the base library shrinks to a skin plus a small set of
primitives, and every project keeps its own custom components locally instead of
pushing them up into the shared package.

---

## 1. Review of v5.6.0

### 1.1 Size

| Group | Files | Lines (non-test) |
|---|---|---|
| Charts (`BarChart`…`Gauge`, `lib/chart-*`) | 11 | 2,508 |
| Custom form widgets (`Select`, `Combobox`, `DatePicker`, `CommandMenu`, `Slider`, `Checkbox`, `Switch`, `RadioGroup`, `Accordion`, `Progress`, `TagInput`, `FileUpload`, `PasswordInput`, `PasswordStrength`, `lib/floating-dropdown`) | 15 | 2,468 |
| Domain cards (`HostCard`, `DockerStackCard`, `IncidentCard`, `BackupStatusPanel`, `RollbackPlan`, `ActionDiff`, `AlertInbox`, `ServiceHealthCard`, `ApprovalCard`, `LogViewer`, `Timeline`) | 11 | 1,097 |
| `Table` + `DataTable` | 2 | 928 |
| Marketing blocks (`HeroBlock`, `CTABand`, `PromoSection`, `FeatureCard`, `FeatureSection`, `PricingCard`, `StatsSection`, `PriceDisplay`, `BentoDashboard`, `GlowCard`) | 10 | 746 |
| Page templates (`DetailPage`, `EmptyPage`, `ResourceList`, `SettingsLayout`, `FormPanel`, `DashboardShell`, `AuthSplitLayout`, `DashboardTopBar`, `MainContent`) | 9 | 695 |
| **Subtotal in scope** | **58** | **8,442 (64%)** |
| Everything else | ~50 | 4,690 |
| **Total** | **108** | **13,132** |

Plus `globals-layers.css` at 1,312 lines and `tokens.css` at 630. 105 registry
entries, ~121 named exports from `components/index.ts`.

### 1.2 What is actually wrong

Four compounding problems. Ranked by leverage.

**(a) The Tailwind theme bridge is missing — this is the big one.**

`globals-layers.css` already declares the *complete* shadcn v4 token contract:

```
--background --foreground --card --card-foreground --popover --popover-foreground
--primary --primary-foreground --secondary --secondary-foreground
--muted --muted-foreground --accent --accent-foreground
--destructive --destructive-foreground --border --input --ring --radius
--chart-1 … --chart-5
```

But `globals.css`'s `@theme` block registers **only** `--color-tollerud-*` keys.
It never registers `--color-background`, `--color-primary`, `--color-border`,
`--color-card`, `--color-muted`, `--color-ring`, `--color-destructive`. The v3
path (`tollerud-preset.cjs`) nests everything under a `tollerud` colour namespace
and has the same gap.

Consequence: `bg-primary`, `border-border`, `text-muted-foreground` — the classes
every shadcn component and every shadcn block emits — **generate no CSS in a
Tollerud app**. `npx shadcn@latest add button` today produces an unstyled button.
The values are all sitting right there, one `@theme` block away from working.

**(b) Two parallel styling systems for the same component.**

`Button.tsx` composes *both* a Tailwind utility string (`variants[variant]`) and
a hand-written CSS class from `globals-layers.css` (`variantLayers[variant]` →
`.tollerud-btn--primary`). 73 `.tollerud-*` component classes exist across
1,312 lines. Every visual change has to be made twice, in two languages, and the
cascade decides which one wins. This is the main reason the design feels
expensive to change.

**(c) Hand-rolled implementations where a standard exists.**

Only 10 Radix packages are imported across 145 files. Everything else is bespoke:

| Hand-rolled today | Lines | Standard replacement |
|---|---|---|
| 6 SVG chart components + interaction core | 2,508 | Recharts (shadcn `chart`) |
| `DataTable` (prop-driven, 774 lines) | 928 | TanStack Table (shadcn `data-table` recipe) |
| `Combobox` | 501 | Radix Popover + cmdk |
| `CommandMenu` | 328 | cmdk (shadcn `command`) |
| `Select` + `lib/floating-dropdown` | 237 + 133 | `@radix-ui/react-select` |
| `DatePicker` | 195 | react-day-picker (shadcn `calendar`) |
| `Checkbox` / `Switch` / `RadioGroup` / `Slider` / `Accordion` / `Progress` | ~600 | Radix equivalents |
| `Toast` + `useToast` | ~120 | sonner (already a peer dep) |
| `FormRow` / `FormPanel` prop APIs | ~180 | react-hook-form + zod (shadcn `form`) |

Every one of these carries its own a11y, keyboard, focus-trap and
floating-position bugs that the ecosystem has already fixed.

**(d) The distribution model fights the goal.**

`@tollerud/ui` ships as a compiled `dist/`. When a project needs a variation,
the only lever is a new prop or a new component in the shared package — so the
surface grows monotonically. shadcn's copy-in model exists precisely to absorb
that pressure locally. `registry.json` *looks* like a shadcn registry but is a
bespoke `{ name, version, description, components: {…} }` map, not the
`{ $schema, items: [] }` schema the shadcn CLI consumes. Nothing can install
from it.

The release ritual compounds this: `CLAUDE.md` requires 8 files updated in
lockstep per version bump, enforced by a pre-commit hook. Adding a component is
expensive; *deleting* one is equally expensive, so nothing gets deleted.

**(e) Scope creep in the base library.**

`HostCard`, `DockerStackCard`, `IncidentCard`, `BackupStatusPanel`,
`RollbackPlan`, `ActionDiff`, `AlertInbox`, `ServiceHealthCard`, `LogViewer` are
homelab-domain vocabulary. They belong to a consuming app, not to a base design
system. This is exactly the "insane large and complicated UI" the rebase is
meant to prevent.

### 1.3 What is already good — keep it

- The token *values* (noir scale, yellow accent, motion, z-index, chart palette) are well-organised and already exist under both namespaces.
- `lib/tokens.ts` generation + `@tollerud/email` sharing tokens rather than components. Right call, keep it.
- `cn`, the `asChild`/Slot pattern, `class-variance-authority` — already shadcn-idiomatic.
- Test discipline: unit + a11y (`vitest-axe`) + Playwright + consumer fixture + subpath export tests + size budget. This is the safety net that makes a rebase of this size viable.
- `scripts/audit-consumer-styling.mjs` (`npx tollerud-ui-audit`) — keep and re-point at the new contract.

---

## 2. Target architecture

### 2.1 Five tiers, with a hard rule about which tier a thing goes in

| Tier | What | Ships as | Count |
|---|---|---|---|
| **0 — Foundation** | `tokens.css` (shadcn contract, Tollerud values), Tailwind `@theme` bridge, `cn` | npm | 1 CSS + 1 util |
| **1 — Primitives** | Radix-backed, shadcn-identical API, Tollerud skin | npm **and** registry | ~35 |
| **2 — Tollerud signature** | The handful shadcn does not have and that *is* the brand | npm **and** registry | ~8 |
| **3 — Blocks / patterns** | Composed screens and recipes | **registry only** (copy-in) | ~12 |
| **4 — Domain** | Anything with app vocabulary | **out of this repo** | 0 |

**Inclusion rule** — a component may enter Tier 1 or 2 only if all three hold:

1. At least three Tollerud projects use it,
2. shadcn/ui has no equivalent, **or** the Tollerud version differs in *skin only* (then it is the shadcn one, restyled),
3. Its name contains no domain vocabulary (`Host`, `Docker`, `Incident`, `Backup`, `Rollback`, `Alert`, `Service`…).

Anything else is Tier 3 (copy-in) or Tier 4 (not ours).

### 2.2 Tier contents

**Tier 1 — primitives (~35), all shadcn API-compatible:**
`accordion, alert, alert-dialog, avatar, badge, breadcrumb, button, calendar,
card, checkbox, collapsible, command, dialog, drawer, dropdown-menu, form,
input, label, pagination, popover, progress, radio-group, scroll-area, select,
separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs,
textarea, tooltip`

**Tier 2 — Tollerud signature (~8):**
`monogram, kbd, terminal-button (a Button variant, not a component),
noir-glow-background, glow-card, stat-card, status-dot, page-header`

Everything else in today's export list is Tier 3 or Tier 4.

**Tier 3 — registry-only blocks (~12):**
`dashboard-shell, settings-layout, auth-split-layout, data-table, chart-*,
empty-state, hero, cta-band, pricing-card, feature-section, promo-section,
resource-list`

Copy-in means a project that wants a fourth column, a different empty state, or
a bespoke row action edits its own copy. Nothing comes back upstream.

**Tier 4 — evicted:** the 11 domain cards (1,097 lines). Either archived, or
moved to a separate `tollerud/blocks` registry if they are still in active use.
Decision needed — see §6.

### 2.3 Distribution: hybrid, not registry-only

Recommendation: **keep the npm package for Tiers 0–2, serve the registry for
Tiers 1–3.**

- Primitives stay on npm so a dozen projects do not drift on Button semantics, and so security/a11y fixes land by `npm update`.
- The same primitives are *also* in the registry, for the project that genuinely needs to fork one.
- Tier 3 is registry-only. There is no npm export for a block — copying is the supported path.

Registry served from `design.tollerud.dev/r/[name].json`, installable as
`npx shadcn@latest add https://design.tollerud.dev/r/dashboard-shell.json`.

### 2.4 Theming

Adopt the shadcn light/dark convention: `:root` = light, `.dark` = dark, with
`.dark` as the Tollerud default applied at the app shell. Today the system is
dark-only (`:root, .dark` share one block).

**This is the one open design question with real cost** — see §6.2. If v6 stays
dark-only, say so explicitly and keep the shared block; a half-migrated
light mode is worse than none.

---

## 3. Phases

Phases 1–2 are non-breaking and ship on v5.x. The break is confined to Phase 5.

### Phase 0 — Extract the design, prove the thesis (no shipping)

**Blocked on design-file access — see §6.1.**

1. Pull colour, type scale, spacing, radius and elevation values out of
   `Tollerud Docs - Upgraded.dc.html` and `Tollerud UI - Upgraded Landing.dc.html`.
2. Write `tokens-v6.css` mapping the shadcn variable names to the new bolder values.
3. Build three reference screens — docs page, dashboard, landing — using **stock,
   unmodified `npx shadcn add` components** plus only that token file.

**Gate:** if the three screens read as unmistakably Tollerud with zero custom
components, the thesis holds and the rest of the plan is mostly deletion. If they
do not, the gap is the real Tier 2 list, and it should be *that* list — not the
current 121 exports.

### Phase 1 — Theme bridge (v5.7.0, non-breaking, ~1 day)

The highest-leverage change in this document.

1. Add a `@theme inline` block to `globals.css` registering the shadcn colour
   keys against the vars that already exist:
   ```css
   @theme inline {
     --color-background: var(--background);
     --color-foreground: var(--foreground);
     --color-primary: var(--primary);
     --color-primary-foreground: var(--primary-foreground);
     /* …card, popover, secondary, muted, accent, destructive, border, input, ring */
     --radius-lg: var(--radius);
   }
   ```
2. Add the missing `--sidebar*` group (8 vars) that shadcn's sidebar block expects.
3. Mirror the same keys into `tollerud-preset.cjs` for the v3 path.
4. Move the token declarations out of `globals-layers.css` into `tokens.css`, so
   the contract lives in one file and `globals-layers.css` is purely the
   (soon-to-be-deleted) component layer.
5. Add a test asserting every shadcn contract var resolves to a non-empty value.

**Payoff:** from this release on, any shadcn component or block dropped into a
Tollerud app is on-brand with no edits. That alone lets projects stop asking for
new components upstream, which stops the growth while the rest of the work runs.

### Phase 2 — Real registry (v5.8.0, non-breaking)

1. Rewrite `registry.json` to the shadcn schema (`$schema`, `items[]`, `files[]`,
   `registryDependencies`, `cssVars`).
2. Add a `registry:build` step emitting `public/r/*.json`; publish under
   `design.tollerud.dev/r/`.
3. Replace `verify-registry-drift.mjs` with a build-then-diff check.
4. Verify with a real `npx shadcn add` against a scratch Next app in CI.

### Phase 3 — Primitive rebase (v6.0.0-alpha, new `ui/` tree)

New directory `ui/`, shadcn file layout and naming (`ui/button.tsx` exporting
`Button`, `buttonVariants`). `components/` stays untouched and still ships, so
nothing breaks yet.

Order — cheapest and most-depended-on first:

1. `button, badge, card, input, label, textarea, separator, skeleton, avatar, kbd`
2. `dialog, sheet, drawer, popover, tooltip, dropdown-menu, alert-dialog`
3. `select, checkbox, switch, radio-group, slider, accordion, progress, collapsible, scroll-area, toggle`
4. `tabs, breadcrumb, pagination, sidebar, command, calendar, form, table, sonner`

Each component: delete its `.tollerud-*` classes from `globals-layers.css` as it
lands. When the file reaches zero component classes, delete it. Styling exists in
exactly one place from then on.

`components/index.ts` re-exports from `ui/` wherever the signature is
compatible, and keeps a deprecated wrapper where it is not.

### Phase 4 — Third-party swaps (v6.0.0-beta)

The deletion phase. Each swap is independently shippable.

| Swap | Deletes | Adds |
|---|---|---|
| Recharts + shadcn `chart` | 2,508 | `recharts` |
| TanStack Table, as a Tier 3 recipe not a component | 928 | `@tanstack/react-table` |
| cmdk → `command`, `combobox` | 829 | `cmdk` |
| Radix Select → `select` | 370 | `@radix-ui/react-select` |
| react-day-picker → `calendar` | 195 | `react-day-picker` |
| Radix form controls | ~600 | 6 Radix packages |
| react-hook-form + zod → `form` | ~180 | `react-hook-form`, `zod`, `@hookform/resolvers` |
| sonner-only toast | ~120 | — |

Net: roughly **5,700 lines deleted** in exchange for well-maintained
dependencies, at a bundle cost that needs measuring against the 220 KB budget
(Recharts is the one to watch — it may justify chart components being
registry-only rather than npm).

**Note on `DataTable`:** it goes from a 774-line prop-driven component to a
copy-in recipe. This is a deliberate downgrade in convenience and the single
most disruptive change for consumers. Prop-driven tables are exactly the kind of
component that grows a prop per project. Codemod cannot cover this — it needs a
written migration guide with a worked example.

### Phase 5 — Eviction and the break (v6.0.0)

1. Tier 3 blocks move to registry-only; their npm exports are removed.
2. Tier 4 domain cards leave the repo (destination per §6.3).
3. `components/` is deleted. `ui/` becomes the package.
4. Ship `@tollerud/ui/v5` as a frozen compat entrypoint for **one** major, or
   hard-break — decision needed (§6.4).
5. Ship a codemod (`npx tollerud-ui-codemod v6`) covering import rewrites and the
   mechanical prop renames. Document by hand what it cannot cover.
6. Rebuild `docs-app` off registry data instead of `component-catalog.js`.
7. `@tollerud/footer` and `@tollerud/email` bump to 6.0.0 in lockstep per `CLAUDE.md`.

### Phase 6 — Keep it small

1. **Surface budget in CI:** assert `components/index.ts` exports ≤ 60 symbols. Adding one means removing one, or an explicit budget bump in the PR.
2. **Shrink the release ritual.** The 8-file lockstep is what makes deletion expensive. Generate `COMPONENTS.md`, `PROPS.generated.md` and the SKILL/AGENTS prop tables from registry + source, so the manual ritual is `CHANGELOG.md` + a version bump. Update `scripts/pre-commit-release-check.mjs` to match.
3. Write the inclusion rule from §2.1 into `CONTRIBUTING.md` and `CLAUDE.md`.

---

## 4. Sequencing and risk

```
Phase 0  ██ gate                          ← blocked on design files
Phase 1    ███ v5.7.0    non-breaking, high leverage
Phase 2      ███ v5.8.0  non-breaking
Phase 3         ████████████ v6.0.0-alpha
Phase 4                  ████████ v6.0.0-beta
Phase 5                          █████ v6.0.0  ← the break
Phase 6                               ███ ongoing
```

| Risk | Mitigation |
|---|---|
| Rebase stalls half-done, leaving two systems | Phases 1–2 are valuable standalone; Phase 3 is per-component and always shippable |
| Recharts blows the 220 KB budget | Measure in Phase 4 first; fall back to registry-only charts |
| `DataTable` migration is painful for consumers | Worked example + keep v5 `DataTable` available for one major |
| Visual regressions across a 100-component rebase | Playwright screenshot baselines captured *before* Phase 3 starts — add this to Phase 0 |
| Design does not survive stock shadcn | That is what the Phase 0 gate is for |

---

## 5. What success looks like

- `npx shadcn@latest add <anything>` in a Tollerud app is on-brand with no edits.
- Base library: ~43 exports (35 primitives + 8 signature), down from ~121.
- Component source: ~4,500 lines, down from 13,132.
- Zero `.tollerud-*` component classes; `globals-layers.css` deleted.
- Zero domain vocabulary in the base library.
- A project adding a bespoke component does it in its own repo, by copying a block.

---

## 6. Open decisions

**6.1 — Design files.** ✅ Resolved 2026-09-03 — received as a Claude Design
handoff bundle (`chats/chat1.md` + the three `.dc.html` prototypes). See §7 for
the extracted values and the Phase 0 gate read.

**6.2 — Light mode?** shadcn assumes `:root` light + `.dark`. Tollerud is
dark-only today. Options: (a) stay dark-only and document it, (b) full light
theme, (c) light tokens defined but unsupported. Recommendation: **(a)** unless
a project actually needs light — it halves the Phase 1 and 3 work and a
half-done light mode is worse than none.

**6.3 — Where do the 11 domain cards go?** A `tollerud/blocks` registry, or
archived and re-copied into whichever app still uses them? Recommendation:
**archive**; if one turns out to be needed in two apps, it earns a Tier 3 slot.

**6.4 — v5 deprecation window.** Ship `@tollerud/ui/v5` frozen for one major,
or hard-break at v6? Recommendation: **one major**, given the `DataTable` and
chart migrations are non-mechanical.

**6.5 — Tailwind v3 support.** `tollerud-preset.cjs` and `globals-v3.css` exist
for v3.4. Current shadcn is v4-first. Recommendation: **drop v3 at v6** and cut
the preset, unless a consumer is pinned.

---

## 7. Phase 0 findings — design bundle, 2026-09-03

Source: `chats/chat1.md` (the design conversation) plus
`Tollerud Docs - Current.dc.html`, `Tollerud Docs - Upgraded.dc.html`,
`Tollerud UI - Upgraded Landing.dc.html`. The Claude Design session that built
these worked directly from this repo's `tokens.css`, `docs.css`, `Sidebar.tsx`
and `DashboardTopBar.tsx` (not from memory), which is confirmed below — the hex
values in the prototypes are a 1:1 match to what's already in the repo.

### 7.1 The headline finding: there is no new palette

Tallied every `#RRGGBB` literal across both upgraded files (Landing: 31 distinct
values across 250+ occurrences; Docs Upgraded: 22 distinct values across 400+
occurrences) and diffed against `tokens.css` / `globals-layers.css`. Every
single one resolves to an existing `--tollerud-*` value — noir 50–900, the
yellow family, the four state colors. Shadows and animation easing match
`--tollerud-shadow-*` / `--tollerud-shadow-glow` exactly (e.g.
`0 4px 6px -1px rgba(0,0,0,.5), 0 2px 4px -2px rgba(0,0,0,.3)`, the glow band's
`0 0 15px rgba(255,255,0,.3), 0 0 30px rgba(255,255,0,.1)`). The Foundations
page's spacing specimen literally renders the existing `--tollerud-space-1…8`
scale (0.25rem → 2rem) as its worked example.

**Consequence for the plan:** Phase 1 (theme bridge) needs zero new color,
shadow, or spacing values. `globals-layers.css` already declares the full
shadcn contract block (`--background` … `--chart-5`) with values that match the
upgraded design, including **`--radius: 0.25rem`** — see §7.2. The remaining
gap between "stock shadcn + our tokens" and "the upgraded design" is almost
entirely at the pattern/composition level (§7.3), not the token level. That
lowers the risk on Phase 1 specifically: it's close to pure plumbing.

### 7.2 Radius: the design already went flatter, and the contract already has it

Border-radius tally, by file:

| File | Dominant value | Distribution |
|---|---|---|
| Docs — Current (today's app) | 6–8px | 29× 8px, 24× 6px, 14× 4px |
| Docs — Upgraded | **4px** | 11× 4px, 3× 999px (pills), 3× 50% (avatars), 1× 8px |
| Landing — Upgraded | **4px** | 11× 4px, 4× 999px, 1× 8px |

The upgrade drops the house radius from 6–8px to the smallest existing step
(4px = `--tollerud-radius-sm`/`0.25rem`), reserving 999px for pills/dots and
50% for circular avatars only — everything else reads as hairline-square. This
*is already* `globals-layers.css`'s `--radius: 0.25rem` contract value, so no
change needed there; it's confirmation the existing shadcn-contract block was
set correctly, not a new decision.

### 7.3 What's actually new: type scale, one layout constant, motion patterns

Not tokens — additive patterns for Tier 2/3, to design in Phase 0.3 /
Phase 3, not Phase 1:

- **Display type scale.** New oversized Archivo steps, all weight 900,
  uppercase, tight-to-negative tracking, using `clamp()` for fluid sizing:
  `clamp(52px,10.4vw,168px)` (hero H1), `clamp(40px,6vw,92px)` (section H2),
  `clamp(36px,5.4vw,76px)` and `clamp(34–36px,5vw,68px)` (subsection), plus a
  fixed `76px` for stat-band numbers. Tracking tightens with size: `-.045em`
  at the largest step down to `-.02em` at body-adjacent sizes. Today's
  `--tollerud-text-*` scale tops out at `text-7xl` (4.5rem/72px) with no
  weight-900/uppercase/negative-tracking display convention — this scale
  should be added as `--tollerud-display-*` steps in Phase 1 alongside the
  theme bridge, since it's additive and non-breaking.
- **One layout constant changed:** sidebar width 272px in the upgraded docs
  shell vs. 264px today (`Sidebar.tsx`). Topbar height (56px→64px on the
  marketing header only) and the 1248px docs content grid are otherwise
  unchanged; the marketing page uses a separate 1400px max-width, which is new
  because the current app has no marketing-page pattern to compare against.
- **New motion patterns, not new durations.** `tglow` (32s, shader hero
  ambient drift), `tnoise` (1.6s steps, film-grain texture), `tmarquee` (34s
  linear, ticker band), `tsh` (5s, text shimmer on the "rebuilds." headline),
  `tblink` (1.05s steps, terminal cursor). These are self-contained keyframe
  animations for specific Tier 2 components (`noir-glow-background`, a
  marquee block, the typed-text hero line) — they don't imply changes to
  `--tollerud-motion-*` durations used elsewhere.
- **Active nav treatment:** the upgraded docs sidebar renders the active item
  as a solid yellow block (yellow background, black text) rather than today's
  accent-border-plus-tint. Confirmed against `Sidebar.tsx` in the chat's tool
  trace; carries no new token, just a different application of `--primary`.

### 7.4 Gate read

The Phase 0 gate asks: *do three reference screens built from stock
`npx shadcn add` components plus only a token file read as unmistakably
Tollerud?* Given §7.1–7.2, the token layer clearly carries the brand
(near-black + one yellow + hairline borders + flat radius is distinctive
enough on its own). What stock shadcn components will *not* give you for free
is the display-type scale, the shader hero, the marquee, and the stat band —
those are exactly the Tier 2/3 items already scoped in §2.2. **Reading: the
thesis holds.** The gap is bounded and already accounted for in the plan; it
does not surface a hidden Tier 2 item outside what §2.2 already lists.

Actually building the three reference screens (Phase 0 step 3) is the first
implementation step and hasn't been done yet — pending sign-off below.
