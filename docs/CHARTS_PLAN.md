# First-Class Charts Plan

Status: **proposed** (move to `docs/archive/` when complete)
Created: 2026-07-05 · Baseline: v4.8.41

Goal: bring every chart in `@tollerud/ui` up to the interaction/accessibility bar that `TimeSeriesChart` already sets — hover tooltips, crosshair, **keyboard navigation**, screen-reader access, token-driven theming, and one consistent API — with **no charting-library dependency**.

Each phase is self-contained and executable in a fresh session. Each phase that ships consumer-visible changes ends with the release checklist from `CLAUDE.md` (version bump, CHANGELOG, SKILL/AGENTS/COMPONENTS, docs-app demo, `sync:registry` + `docs:props` + `validate`). Phases 1–2 can ship together as one minor-feeling patch; 3–5 individually.

---

## Phase 0 — Discovery findings (done; read before any phase)

### What exists today (verified against source, v4.8.41)

| Component | Rendering | Interactivity | A11y today |
|---|---|---|---|
| `TimeSeriesChart` | SVG, ResizeObserver width, `'use client'` | Hover + touch: crosshair, hover dot, tooltip (`renderTooltip`), range switcher (`range`/`onRangeChange` controlled/uncontrolled) | `role="img"` + `ariaLabel` prop; **no keyboard** |
| `Sparkline` | SVG, `'use client'` | `interactive` prop → hover dot only | `aria-hidden={!interactive}` |
| `AreaChart` | SVG viewBox 520×h, `preserveAspectRatio="none"`, server-safe | none | `aria-hidden="true"` |
| `BarChart` | **DOM divs** (not SVG), server-safe | none | none (visible labels only) |
| `Donut` | SVG stroke-dash segments, server-safe | none | `aria-hidden="true"`, visible legend |
| `Meter` | DOM divs, server-safe | none | `role="meter"` + aria-valuenow/min/max (already good) |

### Allowed APIs (the only building blocks — do not invent others)

- **`lib/chart-series.ts`** (all already exported, unit-tested in `lib/chart-series.test.ts`):
  `parseChartDate`, `sortPointsByDate`, `filterPointsByDuration`, `computeYDomain`, `yScale`, `xScaleIndex`, `buildLinearPath`, `buildStepPath`, `buildStepAreaPath`, `buildLinearAreaPath`, `indexFromPointer` (L127–139), `niceTicks`, `formatChartNumber`, `formatChartDecimal`, `formatChartDateShort`, `formatChartDateLong`, `ChartPadding`/`DEFAULT_CHART_PADDING`.
- **Copy-ready interaction patterns** (source of truth is TimeSeriesChart):
  - Pointer→index: `components/TimeSeriesChart.tsx` L236–240 (handler) + L288–294 (mouse/touch wiring)
  - Crosshair/hover-dot overlays: L362–394
  - Tooltip markup + clamped positioning: L89–111 (default tooltip) + L397–406 (absolute, `pointer-events: none`, clamped `tooltipLeft`)
  - Controlled/uncontrolled state: L146–147 + L242–245 (`range ?? internalRange`)
- **Tokens**: `--chart-1`…`--chart-5`, `--chart-grid`, `--chart-axis` (`globals-layers.css` L65–72, currently **unused** by components); `--tollerud-yellow-warm`; focus ring utility `.tollerud-focus-ring` (`tokens.css` L174–177); motion tokens + `prefers-reduced-motion` block (`tokens.css` L130–132, L395–405).
- **Conventions**: `forwardRef<HTMLDivElement, Props>` on every chart; `'use client'` only where hooks/events are used (currently correct — adding interactivity to AreaChart/BarChart/Donut means adding `'use client'` to them); `cn()` from `lib/utils`; size gate 220 KB gzip main barrel (`scripts/test-size.mjs`).

### Anti-patterns (global, all phases)

- ❌ No charting/positioning dependency (no visx/recharts/d3/floating-ui). The tooltip clamping in TimeSeriesChart L261–262 is the sanctioned approach.
- ❌ No `role="application"` on chart SVGs; no `aria-activedescendant` into SVG children (inconsistent AT support). Use the roving `tabIndex={0}` SVG + arrow-key + visually-hidden live region pattern defined in Phase 1.
- ❌ Don't convert BarChart's DOM rendering to SVG — its div bars are fine; interactivity attaches per-bar.
- ❌ Don't break existing props. `data: number[]` on AreaChart/Sparkline, `segments` on Donut, `render`-style callbacks — all stay valid. New capability arrives via new optional props.
- ❌ Don't hand-roll new date/number formatting — use the `formatChart*` helpers.
- ❌ Breaking changes are acceptable in this repo **only** with a `### Breaking` CHANGELOG section + migration notes (single consumer policy) — but none are anticipated in this plan.

---

## Phase 1 — Shared interaction core (`lib/chart-interaction.tsx`)

> **Status: shipped in v4.8.42.** Implementation note for later phases: the two
> planned hooks were merged into a single `useChartInteraction({ svgRef, count,
> paddingLeft, paddingRight, onEscape })` returning `{ activeIndex,
> setActiveIndex, isKeyboard, svgProps }` — one state serves pointer, touch, and
> keyboard, which avoids split-brain announcement logic. `svgProps` includes an
> `onPointerDown` guard so click-focus doesn't jump the crosshair to the latest
> point. Phases 2–4 should consume this API, not the two-hook shape below.

**What to implement**

1. New file `lib/chart-interaction.tsx` (client-only, `'use client'`) exporting:
   - `useChartPointer({ svgRef, count, paddingLeft, paddingRight })` — extracts TimeSeriesChart's pointer→index logic (**copy** L236–240 + the mouse/touch handlers L288–294; it already delegates to `indexFromPointer` from `lib/chart-series.ts`). Returns `{ hoverIndex, setHoverIndex, pointerProps }` where `pointerProps` spreads onto the SVG.
   - `useChartKeyboard({ count, activeIndex, setActiveIndex, onEscape })` — new: ArrowLeft/ArrowRight step ±1, Home/End jump, Escape clears (calls `setActiveIndex(null)` and `onEscape?.()`); returns `keyboardProps` (`tabIndex: 0`, `onKeyDown`, `onFocus` → select last point, `onBlur` → clear). Follow the Escape-consumes-only-when-active rule from `components/Combobox.tssx` Escape handling (stopPropagation only while a point is active).
   - `ChartTooltip` — the default tooltip factory **copied** from TimeSeriesChart L89–111, generalized to `{ title, value, lines }`, plus the clamped absolute positioning wrapper from L397–406.
   - `ChartLiveRegion` — visually-hidden `aria-live="polite"` div that announces the active point ("14 Mar 2026: 58,0 kr") when the active index changes via keyboard. Visually-hidden CSS: reuse the `sr-only` utility (already used by Checkbox's input).
2. Refactor **TimeSeriesChart** to consume all four. Behavior must be pixel/DOM-identical for mouse/touch; keyboard + live region are additive. The SVG gains `tabIndex={0}` + `.tollerud-focus-ring` + `aria-label` (existing).
3. Unit tests: `lib/chart-interaction.test.tsx` (hook behavior via a probe component) + new `components/TimeSeriesChart.test.tsx` (arrow keys move crosshair, Escape clears and doesn't propagate when active, tooltip renders on hover, axe pass while tooltip open).

**Documentation references**: everything under "Copy-ready interaction patterns" in Phase 0; `KEYBOARD.md` for the documented keyboard contract style (add a Charts section there too).

**Verification checklist**
- [ ] `npx vitest run lib/chart-interaction.test.tsx components/TimeSeriesChart.test.tsx` green
- [ ] `grep -n 'indexFromPointer' components/TimeSeriesChart.tsx` → only via the hook (no duplicated pointer math)
- [ ] Existing docs `/charts` page demos unchanged visually (preview `_site` after `build:docs`, hover + Tab + arrows on the TimeSeriesChart demo)
- [ ] `npm run validate` green (size gate: shared code should *reduce* net bytes once Phase 2–4 reuse it)

**Anti-pattern guards**: no new deps; don't move `indexFromPointer` out of `chart-series.ts` (it's the tested source of truth); don't announce on every mousemove (live region is keyboard/focus-driven only — hover announcement is noise).

---

## Phase 2 — AreaChart & Sparkline to full parity

> **Status: shipped in v4.8.43.** Deviations from the sketch below: AreaChart is
> simply marked `'use client'` (like Sparkline/TimeSeriesChart) instead of a
> static/interactive component split — client components still SSR and import
> fine from RSC files, and the split wasn't worth the surface. The stretched
> 520-unit viewBox is handled by a `viewBoxWidth` option on
> `useChartInteraction` (scales padding to client px) plus percentage-based
> `ChartTooltipLayer` positions.

**What to implement**

1. **AreaChart**: accept `data: number[] | AreaChartPoint[]` where `AreaChartPoint = { value: number; label?: string }` (plain numbers keep working). New optional props, mirroring TimeSeriesChart's names exactly: `interactive?: boolean` (default false), `formatValue?`, `renderTooltip?`, `ariaLabel?`. When `interactive`: add `'use client'`, wire `useChartPointer` + `useChartKeyboard` + `ChartTooltip` + `ChartLiveRegion`, render crosshair + hover dot (**copy** overlay JSX from TimeSeriesChart L374–394, coordinates from its own `x()`/`y()`). When not interactive: keep today's `aria-hidden` static output and server-safety — split the interactive layer into a child component so the static path stays server-renderable (pattern precedent: `Card` static vs `GlowCard` client).
2. **Sparkline**: `interactive` exists (hover dot only). Add the tooltip + keyboard layer behind the same `interactive` flag using the shared core; add `formatValue?` and `ariaLabel?`. Deprecated `w`/`h` props stay.
3. Tests: `components/AreaChart.test.tsx`, extend for Sparkline — static render (numbers), interactive render (points with labels), keyboard nav, axe.

**Documentation references**: AreaChart SVG geometry `components/AreaChart.tsx` L13–29 (viewBox 520×h, `preserveAspectRatio="none"` — note: crosshair X must be computed in viewBox units, not client px; convert with `svg.getBoundingClientRect().width / 520` the way `indexFromPointer` already normalizes by rect).

**Verification checklist**
- [ ] Old call sites compile untouched: `grep -rn '<AreaChart' docs-app examples fixtures` — no edits needed
- [ ] `npm run validate` green; docs `/charts` page gains one interactive AreaChart demo + snippet
- [ ] SKILL/AGENTS/COMPONENTS prop tables updated; version notes bullet

**Anti-pattern guards**: don't change the 520-unit viewBox or default sizes; don't make `interactive` default true (breaks server-safety of existing usage); don't fork tooltip markup — must come from `ChartTooltip`.

---

## Phase 3 — BarChart: per-bar focus, tooltips, reduced motion

> **Status: shipped in v4.8.44** (together with Phase 4). Bars are focusable
> `role="img"` divs with roving tabindex — no live region needed since real
> focus moves and aria-labels announce natively.

**What to implement**

1. Each bar wrapper becomes focusable when new `interactive?: boolean` is set: `tabIndex={0}`, `.tollerud-focus-ring`, `aria-label` per bar ("Oslo: 42"), hover/focus shows `ChartTooltip` anchored to the bar (absolute positioning within the already-`relative` container; clamp like TimeSeriesChart L261–262). ArrowLeft/Right move focus between bars (roving tabindex — **copy** the roving pattern from `components/Segmented.tsx`, which already implements it for its radiogroup).
2. `formatValue?` prop for the value labels (use `formatChartNumber`).
3. Reduced motion: bar-height transition (BarChart L35) and Meter width transition (Meter L43) get `motion-reduce:transition-none` (Tailwind variant — precedent exists in tokens.css's `prefers-reduced-motion` block; the utility variant keeps it per-component).
4. Tests: `components/BarChart.test.tsx` — static default, interactive roving focus, aria-labels, axe.

**Verification checklist**
- [ ] Keyboard-only walkthrough on docs `/charts` BarChart demo (Tab into chart, arrows between bars, tooltip follows focus)
- [ ] `grep -n 'motion-reduce' components/BarChart.tsx components/Meter.tsx` → present
- [ ] `npm run validate` green; release checklist done

**Anti-pattern guards**: bars are not `<button>`s (no action to invoke — they're focusable info targets with `role="img"`-style labels, matching the Meter precedent of semantic-first); don't add `onClick` API speculatively.

---

## Phase 4 — Donut: palette defaults, legend interactivity, a11y

> **Status: shipped in v4.8.44** (together with Phase 3). Legend interactivity
> is behind an `interactive` prop (not always-on) so static Donuts gain no tab
> stops; `CHART_SERIES_COLORS` lives in `lib/chart-series.ts` and is exported
> from the barrel.

**What to implement**

1. `segment.color` becomes optional: default cycles `var(--chart-1)`…`var(--chart-5)` (globals-layers.css L65–70 — finally used). Export a `CHART_SERIES_COLORS` array from `lib/chart-series.ts` so DataTable/StatCard/consumers can reuse the cycle.
2. Legend rows get hover/focus: hovering or focusing a legend row highlights its arc (others drop to 35% opacity — same opacity move as TimeSeriesChart's `strokeOpacity="0.35"` L369) and shows value + percentage. Legend rows use the roving-tabindex pattern (same Segmented reference as Phase 3). This keeps the SVG itself `aria-hidden` — the legend is already the accessible surface, now it's also the interactive one.
3. Replace `aria-hidden` on the wrapper stats with a proper structure: legend as `<ul>` with per-row `aria-label` ("Diesel: 420, 38%").
4. Tests: `components/Donut.test.tsx` — palette cycling, explicit colors still win, legend keyboard highlight, axe.

**Verification checklist**
- [ ] Donut with no colors renders 5-color cycle; with explicit colors unchanged
- [ ] `grep -rn 'chart-1' components/` → used by Donut (tokens no longer dead)
- [ ] `npm run validate` green; release checklist done; docs demo for colorless segments

**Anti-pattern guards**: don't make the SVG arcs themselves focusable (tiny stroke targets, poor AT support) — the legend is the interaction surface; don't remove the `color` prop.

---

## Phase 5 — Screen-reader data access + keyboard contract docs

> **Status: shipped in v4.8.45.** Scoping deviation from the sketch below,
> made to honor this phase's own "no duplication" guard: `ChartSrTable` is
> wired only into `TimeSeriesChart` (default on) and `AreaChart` (default =
> `interactive`) — the charts whose data lives solely in SVG path geometry.
> `BarChart` (per-bar `aria-label`s) and `Donut` (semantic legend list)
> already expose their data as accessible text, so adding a table there would
> duplicate what AT reads; `Sparkline` is excluded as a micro-chart. The a11y
> suite gained no-violation entries for all five interactive charts.

**What to implement**

1. `ChartSrTable` in `lib/chart-interaction.tsx`: a visually-hidden (`sr-only`) `<table>` rendering the chart's data (caption = ariaLabel, columns = label/date + value via `formatChart*`). Wire into TimeSeriesChart, AreaChart, BarChart, Donut behind `srTable?: boolean` (default **true** when `interactive`, opt-out available). This is the "data table fallback" — SR users get the actual numbers, not just "Time series chart".
2. `KEYBOARD.md`: add a **Charts** section documenting the contract (Tab focuses chart → last point active; ←/→ step; Home/End jump; Esc clears; announcement format). `ACCESSIBILITY.md`: add charts row.
3. Extend `components/a11y.test.tsx` with chart entries (interactive TimeSeriesChart/AreaChart/BarChart/Donut, axe with tooltip open and sr-table present).

**Verification checklist**
- [ ] VoiceOver spot-check on docs site (rotor → table reachable per chart)
- [ ] `npx vitest run components/a11y.test.tsx` green
- [ ] `npm run validate` green; release checklist done

**Anti-pattern guards**: sr-table must not duplicate announcements with the live region (live region announces *changes*; table is the static browse surface — both coexist per WAI chart guidance); don't render the table when `srTable={false}` or data is empty.

---

## Phase 6 (stretch, separate decision) — Multi-series TimeSeriesChart

Held out of scope deliberately: `series?: { label, points, color? }[]` on TimeSeriesChart with palette cycling, shared crosshair across series, stacked tooltip. It builds cleanly on Phases 1+4 (`CHART_SERIES_COLORS`, shared tooltip accepts `lines`). Do not start until 1–5 shipped and the consumer (Butikkpils) actually needs it — it roughly doubles TimeSeriesChart's geometry surface.

---

## Final phase — Verification sweep

1. `npm run validate` on the final state (covers typecheck/lint/tests/build/subpath/drift/package/**size**/props/docs/consumer).
2. Anti-pattern greps:
   - `grep -rn 'role="application"\|aria-activedescendant' components/*Chart* components/Donut.tsx components/Sparkline.tsx` → empty
   - `grep -rn 'd3\|visx\|recharts\|floating-ui' package.json` → empty
   - `grep -rn '#E8D500\|#FFFF00' components/*Chart* components/Donut.tsx components/Sparkline.tsx | grep -v 'var('` → empty (tokens only)
   - `grep -c 'use client' components/AreaChart.tsx components/BarChart.tsx components/Donut.tsx` → present **only** if the file ended up using hooks
3. Size gate: main barrel still < 220 KB gzip; note the delta in the CHANGELOG entry.
4. Manual pass on docs `/charts` with keyboard only, then with `prefers-reduced-motion: reduce` emulated (preview_resize colorScheme/media emulation or DevTools).
5. Archive this file to `docs/archive/CHARTS_PLAN.md` and update `COMPLETENESS_ROADMAP.md` (charts open item → Recently completed).
