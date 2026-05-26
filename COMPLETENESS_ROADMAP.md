# Tia Noir Design System — Completeness Roadmap

Research pass: 2026-05-25  
Deep follow-up: see `ULTIMATE_TIA_NOIR_RESEARCH.md` for the next-level direction: Tollerud.no WebGL/noise background, Linear/Raycast/Geist inspiration, command-first shell, and homelab operational components.

## Current state

Tia Noir already has a strong visual identity:

- Dark/noir palette
- Yellow + amber brand accents
- Tailwind config
- CSS custom properties
- Utility components
- Mascot SVG
- Graphify-inspired grid, glass nav, terminal CTAs, gradient accents
- Preview page
- README

That is a good foundation. To make it feel like a *real reusable design system*, the next layer is structure: richer tokens, component specs, accessibility rules, copy rules, implementation examples, and testing.

## What mature systems do

### Material Design 3
Material treats design tokens as named values for visual roles, not just raw colors. It organizes tokens around color, typography, shape, elevation, motion, and state. Source: https://m3.material.io/foundations/design-tokens/overview

### Radix Themes
Radix exposes theme tokens and component-level building blocks: color, dark mode, typography, spacing, breakpoints, radius, shadows, cursors, layout primitives, and many components. Source: https://www.radix-ui.com/themes/docs/theme/overview

### shadcn/ui
shadcn recommends CSS variables for theming and semantic tokens like `background`, `foreground`, and `primary` that components use by default. Source: https://ui.shadcn.com/docs/theming

### Primer / GitHub
Primer primitives focus on color, spacing, and typography as foundational design tokens. Source: https://primer.style/foundations/primitives/

### UI/UX Pro Max audit
The local design skill emphasizes accessibility, touch targets, loading states, responsive layout, semantic colors, motion consistency, and form feedback as critical/high-priority design system concerns.

## Biggest gaps

### 1. Semantic token layer
Current tokens are mostly brand/raw values:

- `--tia-yellow`
- `--tia-noir-900`
- `--tia-border`

Add semantic aliases that components consume:

```css
--color-background: var(--tia-black);
--color-foreground: var(--tia-white);
--color-card: var(--tia-noir-900);
--color-card-foreground: var(--tia-white);
--color-primary: var(--tia-yellow);
--color-primary-foreground: var(--tia-black);
--color-muted: var(--tia-noir-700);
--color-muted-foreground: var(--tia-noir-200);
--color-border: var(--tia-border);
--color-ring: var(--tia-yellow);
--color-destructive: var(--tia-error);
--color-destructive-foreground: var(--tia-white);
```

Why: this makes the system compatible with shadcn-style components and easier to theme later.

### 2. Component coverage
Current components are good but sparse. Add specs and CSS/Tailwind examples for:

- Button
- Icon button
- Link
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Slider
- Badge
- Pill
- Card
- Alert
- Toast
- Dialog / Modal
- Dropdown
- Tabs
- Table
- Data table
- Sidebar
- Top nav
- Command palette
- Skeleton
- Spinner
- Tooltip
- Empty state
- Error state
- Terminal block
- Code block
- Stat card
- Status indicator

### 3. State matrix
Each interactive component needs all states documented:

- Default
- Hover
- Focus-visible
- Active / pressed
- Disabled
- Loading
- Success
- Error
- Selected / checked

Especially important for buttons, inputs, links, tabs, switches, and destructive actions.

### 4. Accessibility contract
Add a dedicated `ACCESSIBILITY.md`:

- Normal text contrast: at least 4.5:1
- Large text contrast: at least 3:1
- Visible 2px+ focus ring
- No color-only meaning
- Keyboard navigable components
- Touch targets at least 44px
- `prefers-reduced-motion` support
- Form errors use `role="alert"` or `aria-live`
- Icon-only buttons require `aria-label`
- Skip link pattern for layouts

### 5. Motion tokens
Current system has transition durations but not full motion rules.

Add:

```css
--motion-duration-fast: 150ms;
--motion-duration-normal: 250ms;
--motion-duration-slow: 350ms;
--motion-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--motion-ease-in: cubic-bezier(0.7, 0, 0.84, 0);
--motion-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

Rules:

- Use transform + opacity only for performant animation
- Keep micro-interactions 150–250ms
- Respect `prefers-reduced-motion`
- Glow should be interactive feedback, not decorative noise

### 6. Layout primitives
Add reusable layout classes/components:

- `.tia-container`
- `.tia-section`
- `.tia-stack`
- `.tia-cluster`
- `.tia-grid`
- `.tia-sidebar-layout`
- `.tia-dashboard-layout`
- `.tia-split-panel`

This helps reuse the style across TMC, dashboards, docs pages, and little homelab tools.

### 7. Data visualization tokens
Since Mathias builds infra dashboards, this matters.

Add chart colors:

```css
--chart-1: var(--tia-yellow);
--chart-2: var(--tia-amber);
--chart-3: var(--tia-success);
--chart-4: var(--tia-info);
--chart-5: var(--tia-error);
--chart-grid: rgba(245,245,245,0.08);
--chart-axis: rgba(245,245,245,0.35);
```

Rules:

- Never rely on red/green alone
- Provide labels/tooltips
- Tables for exact values
- Yellow = primary signal, not every data series

### 8. Icon system
Pick one icon family and standardize it.

Recommendation: **Lucide** for web projects.

Rules:

- 16px, 20px, 24px sizes
- 1.75px or 2px stroke
- No emoji as UI icons
- Icon-only buttons need accessible labels

### 9. Copy and voice
Add `VOICE.md`:

- Short, direct labels
- Terminal-style CTAs allowed: `❯ deploy`, `❯ open_dashboard`
- Avoid corporate nonsense
- Error messages should be friendly but specific
- Confirm destructive actions clearly

### 10. Implementation package
Make `/home/mathias/tia/design-system/` easier to drop into projects:

```text
design-system/
├── tokens.css
├── tailwind.config.js
├── components.css
├── components/
│   ├── button.html
│   ├── card.html
│   ├── input.html
│   └── terminal.html
├── examples/
│   ├── nextjs-app-router/
│   ├── dashboard.html
│   └── landing.html
├── ACCESSIBILITY.md
├── COMPONENTS.md
├── VOICE.md
├── CHANGELOG.md
└── README.md
```

### 11. Validation tooling
Add a simple validation script:

- Check token naming consistency
- Check README links/files exist
- Optional contrast checks for important color pairs
- Optional HTML validation for preview files

## Recommended next build order

### Phase 1 — Foundation cleanup
1. Add semantic tokens
2. Add chart tokens
3. Add motion tokens + reduced-motion helpers
4. Add z-index/elevation tokens
5. Add layout primitives

### Phase 2 — Components
1. Move component utilities into `components.css`
2. Add `COMPONENTS.md`
3. Add examples for core components
4. Add component state matrix

### Phase 3 — Accessibility + docs
1. Add `ACCESSIBILITY.md`
2. Add `VOICE.md`
3. Add `CHANGELOG.md`
4. Add validation script

### Phase 4 — Real templates
1. Dashboard page template
2. Landing page template
3. Settings page template
4. Command palette example
5. TMC-style infra status page example

## Opinionated recommendation

Do not turn this into a huge enterprise design system monster. That way lies meetings, Jira boards, and sadness.

For Mathias/Tia, the sweet spot is:

- Strong tokens
- 20-ish reusable components
- 3 real templates
- Accessibility checklist
- shadcn-compatible semantic variables
- Tailwind-first usage

That gives enough structure to reuse everywhere without creating a second job maintaining the thing.
