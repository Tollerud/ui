# Consumer styling roadmap

**Purpose:** make `@tollerud/ui` easier for agents and consumer apps to use consistently without recreating branded UI with ad hoc Tailwind classes or inline styles.

`@tollerud/ui` ships Tailwind support intentionally. Tailwind should remain the styling engine for the design system and a safe escape hatch in consumer apps. The goal is not to ban Tailwind; the goal is to make the component API the primary design language so projects look like the docs by default.

---

## Styling policy

### Inside `@tollerud/ui`

Tailwind utilities, token classes, CSS variables, and component-layer classes are allowed and expected.

Use them to implement:

- component variants
- spacing and layout primitives
- responsive behavior
- focus and interaction states
- noir surfaces and yellow accent states
- docs-only composition examples

### Inside consumer projects

Consumer apps may use Tailwind, but it should be constrained.

Allowed:

- small local layout glue, such as one-off margin, flex alignment, or responsive visibility
- app-specific wrappers that do not recreate design-system components
- Tollerud token utilities when a primitive does not yet cover the need

Discouraged:

- rebuilding buttons, cards, panels, navs, dashboards, forms, and marketing sections with raw utilities
- hardcoded colors such as `#ffff00`, `#0a0a0a`, or generic palette colors for branded UI
- inline styles for static design decisions
- local copied design-system primitives in `components/ui`

Preferred rule for agents:

> Use `@tollerud/ui` components first. Use exported layout primitives second. Use Tailwind only for small local glue. If a pattern repeats or defines branded structure, add it to `@tollerud/ui` instead of rebuilding it in the consumer app.

---

## Target outcome

Agents should be able to build common screens with little or no consumer-side Tailwind:

```tsx
<PageShell background="grid">
  <Section size="hero">
    <HeroSection
      eyebrow="Tollerud Cloud"
      title="Deploy dark infrastructure"
      description="Noir surfaces, yellow where it matters."
      actions={<Button variant="primary">Deploy</Button>}
    />
  </Section>

  <Section>
    <CardGrid columns={3}>
      <FeatureCard title="Observe" description="Track services and hosts." />
      <FeatureCard title="Approve" description="Review risky actions first." />
      <FeatureCard title="Recover" description="Roll back with confidence." />
    </CardGrid>
  </Section>
</PageShell>
```

The consumer app still imports the required CSS:

```css
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";
```

---

## Phase 1 — document and enforce the mental model

**Goal:** make the expected consumer behavior explicit before adding new APIs.

- [x] Add the styling policy to `SKILL.md`.
- [x] Add the styling policy to `AGENTS.md`.
- [x] Add a short "consumer styling" section to `GETTING_STARTED.md`.
- [x] Add examples of allowed vs discouraged Tailwind usage.
- [x] Clarify that `globals.css` plus `source.css` is required for Tailwind v4 consumer styling.
- [x] Clarify that `cn` is exported from `@tollerud/ui` and should not be reimplemented in consumer apps.

**Acceptance criteria:**

- Agents have a clear rule to follow.
- The docs explain that Tailwind is allowed, but not as the primary design language in consumer apps.
- Setup docs still mention Tailwind v3 and v4 paths accurately.

---

## Phase 2 — add low-level layout primitives

**Goal:** reduce the need for raw Tailwind wrappers in consumer projects.

Candidate components:

- [x] `PageShell` — page background, min-height, optional grid/noir background, main landmark.
- [x] `Section` — consistent vertical rhythm and width constraints.
- [x] `Stack` — vertical spacing with density/size options.
- [x] `Cluster` — horizontal wrapping layout for actions, badges, and toolbars.
- [x] `Grid` — responsive grid primitive with constrained column presets.
- [x] `CardGrid` — common card layout with Tollerud spacing defaults.
- [x] `Split` — two-column content/media or content/aside layout.
- [x] `MainContent` — page content wrapper for app layouts.

**Implementation notes:**

- Keep props semantic and finite. Prefer `size="hero"` over arbitrary class passthrough.
- Continue accepting `className` for escape hatches, merged last with `cn`.
- Avoid inline styles for static layout decisions.
- Use Tollerud tokens and component-layer classes internally.

**Acceptance criteria:**

- Common page spacing can be achieved without consumer-side Tailwind.
- Each primitive has prop types, exports, registry entry, docs preview, and props docs.
- Docs examples use primitives as the default composition path.

---

## Phase 3 — add common screen patterns

**Goal:** make the most common app and marketing screens copy-pasteable without Tailwind-heavy composition.

Candidate components:

- [x] `PageHeader` — title, description, eyebrow, actions, metadata.
- [x] `TopNav` — branded monogram lockup, nav links, actions.
- [x] `DashboardShell` — sidebar/topbar/content frame for app surfaces.
- [x] `SettingsLayout` — section navigation plus settings content.
- [x] `FormPanel` — titled form surface with footer actions.
- [x] `ResourceList` — list/table page wrapper with search/action slots.
- [x] `DetailPage` — header, metadata, primary content, aside.
- [x] `EmptyPage` — full-page empty state composition.
- [x] `FeatureSection` — marketing feature grid composition.
- [x] `StatsSection` — metric/stat composition.

**Acceptance criteria:**

- Agents can build dashboard, settings, detail, list, marketing, and empty pages from exported components.
- Brand-sensitive layout decisions live in `@tollerud/ui`, not consumer Tailwind.
- Existing primitives remain usable for custom cases.

---

## Phase 4 — rewrite docs examples to be component-first

**Goal:** make the docs demonstrate the behavior agents should copy.

- [ ] Audit docs for examples that rely on raw Tailwind for branded structure.
- [ ] Replace Tailwind-heavy wrappers with `PageShell`, `Section`, `Stack`, `Grid`, or pattern components.
- [ ] Keep a small "escape hatch" section showing acceptable local Tailwind glue.
- [ ] Add "agent-safe recipes" for common project screens:
  - [ ] marketing landing page
  - [ ] dashboard overview
  - [ ] settings page
  - [ ] auth page
  - [ ] empty state page
  - [ ] detail page
  - [ ] list/table page

**Acceptance criteria:**

- Primary docs examples use exported components.
- Tailwind appears as implementation detail or minor glue, not the main composition strategy.
- Recipes are easy for agents to copy into consumer projects.

---

## Phase 5 — add guardrails for consumer apps

**Goal:** help downstream projects detect styling drift early.

Potential guardrails:

- [ ] Add a "consumer project checklist" to `GETTING_STARTED.md`.
- [ ] Document common anti-patterns:
  - copied design-system files
  - hardcoded Tollerud colors
  - local `components/ui` clones
  - missing `@tollerud/ui/source.css`
  - `Button`/`Link` nesting instead of `asChild` or `buttonVariants`
- [ ] Consider a lightweight lint recipe or script for consumer projects.
- [ ] Consider examples that show how to create local semantic feature components without creating a parallel design system.

**Acceptance criteria:**

- Consumer projects can self-audit styling setup.
- Agents have concrete fallback guidance when a needed pattern does not exist yet.
- The package remains flexible without encouraging unbounded utility-class composition.

---

## Phase 6 — validate and iterate

**Goal:** prove the component-first path works in real consumer projects.

- [ ] Update `examples/next-starter` to use the new layout primitives and screen patterns.
- [ ] Add a fixture or smoke test that imports the new primitives.
- [ ] Run the full package validation suite.
- [ ] Review generated docs and prop tables for drift.
- [ ] Collect missing patterns found while converting examples and add them to this roadmap.

**Acceptance criteria:**

- `npm run validate` passes.
- The starter demonstrates a low-Tailwind consumer implementation.
- The docs, `SKILL.md`, and generated props stay aligned with actual exports.

---

## Non-goals

- Do not remove Tailwind from `@tollerud/ui`.
- Do not ban Tailwind completely in consumer apps.
- Do not introduce arbitrary design tokens outside the Tollerud noir/yellow system.
- Do not create a second consumer-side design system.
- Do not use inline styles for static branded design decisions.

---

## Decision summary

Tailwind remains part of the package. The shift is architectural: consumer apps should treat `@tollerud/ui` components and layout primitives as the design language, while Tailwind stays available for implementation and small local glue.
