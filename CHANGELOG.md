# Changelog

<!-- FORMAT RULES — the docs site parses this file at runtime.
     • Entry heading:  ## version — YYYY-MM-DD — Title
     • Blank line between EVERY block (paragraph, heading, list, code fence)
     • Section headings: ### Heading  OR  **Bold line** on its own line after a blank line
     • Never write bold mid-paragraph as a heading substitute — it merges into surrounding text
-->

## 4.8.33 — 2026-07-02 — Fix Card density, GlowCard glow, remove duplicate PasswordStrength doc

### Fixed

- `Card` — `density="compact"` now reduces padding to `p-3`. The `[[data-density=compact]_&]:p-3` Tailwind selector also makes all `Card`s inside a `data-density="compact"` wrapper compact without needing the prop on each card.
- `GlowCard` — `intensity` now controls the **opacity** of the glow overlay (default 0.15) rather than a gradient color stop position. The previous implementation produced a small hard-edged circle of full-brightness yellow instead of a soft bloom. The gradient now always fades from full color at the cursor to transparent at 70% of the 600px radius, with `intensity` modulating how bright the entire overlay appears.

### Changed (docs only)

- `PasswordStrength` section removed from the Components page — it is documented on the Forms page only.

## 4.8.32 — 2026-07-02 — Translate all docs demos to English

### Changed (docs only)

- All demo content in `docs-app/` is now in English. Affected sections: `PromoSection` (title, description, buttons, eyebrow), `PriceDisplay` (store names, currency changed to `$`), `ListCard` (beer names changed to English brands, prices in `$`), `Segmented` sort options (labels and values in English), `TimeSeriesChart` value suffix demos (`kr/l` → `$/gal`, `nb-NO` locale changed to `en-US`).

## 4.8.31 — 2026-07-02 — Multi-word shimmer for PromoSection and PageHeader

### Changed

- `PromoSection` — `shimmer` now accepts `string | string[]`. Pass an array to accent multiple words or phrases independently. Single-string behaviour is unchanged.
- `PageHeader` — `shimmer` / `titleAccent` now accept `string | string[]`. Same multi-accent behaviour. Overlapping matches are silently skipped; non-matching entries are ignored. No migration needed for existing single-string consumers.

## 4.8.30 — 2026-07-02 — PromoSection shimmer and PageHeader-style eyebrow

### Changed

- `PromoSection` — eyebrow now renders as `font-mono text-xs uppercase tracking-[0.22em] text-tollerud-yellow`, matching `PageHeader`. The previous `Pill` rendering is removed.

### Added

- `PromoSection` — `shimmer?: string` wraps the first matching substring of `title` in `.tollerud-display-shimmer`. Behaves identically to `PageHeader`'s `shimmer` prop. Only applies when `title` is a plain string.

## 4.8.29 — 2026-07-02 — Fix PromoSection mobile layout; add contentWidth prop

### Fixed

- `PromoSection` — two-column grid now collapses to single-column on mobile (`grid-cols-1` below `sm:`). Text block is always first on mobile regardless of `visualPlacement`; the visual slot renders below it via CSS `order`.
- `PromoSection` — visual slot now has `overflow-hidden` to prevent horizontal overflow on small viewports.
- `PromoSection` — `background="raised"` now uses `border-y` instead of `border` so the block can go full-bleed edge-to-edge without visible corner borders.

### Added

- `PromoSection` — `contentWidth?: "sm" | "md" | "lg" | "xl" | "full"` (default `"xl"`) caps the inner content at a max-width while the outer wrapper can span the full viewport. Pair with `className="w-screen -mx-6"` or similar on the host page for a true full-bleed section.

## 4.8.28 — 2026-07-02 — Add PromoSection marketing block

### Added

- `PromoSection` — two-column marketing block with a text column and a consumer-controlled visual slot. Props: `eyebrow`, `title`, `description`, `actions`, `visual`, `visualPlacement?: "right" | "left"` (default `"right"`), `background?: "default" | "raised"` (default `"default"`), `textWidth?: "narrow" | "balanced" | "wide"` (default `"wide"`). Collapses to single-column on small viewports.

## 4.8.27 — 2026-07-02 — Add PriceDisplay and ListCard; extend Card accent; fix Sparkline clipping

### Added

- `PriceDisplay` — compact price display with a primary value and an optional secondary `Badge`. `highlight="cheapest"` switches to success coloring. `align?: "left" | "right"` (default `"right"`) for list row and table cell use.
- `ListCard` — hover card shell for list and grid items. Renders as `<a>` when `href` is provided. `highlight="cheapest"` applies a yellow border tint. Children are consumer-controlled.

### Changed

- `Card` — `accent` now accepts `true | "filled" | false`. `accent="filled"` adds `bg-tollerud-yellow/5` in addition to the yellow border tint, for callout boxes and cheapest-item highlights. Existing `accent={true}` behaviour is unchanged.

### Fixed

- `Sparkline` — added `viewBox` and `overflow="hidden"` to the SVG so stroke bleed from `strokeLinecap="round"` no longer escapes the element bounds at small sizes (e.g. `84×26` with `curve="step"` and `fill`).

## 4.8.26 — 2026-06-23 — Fix mobile scroll lag on portalled dropdowns

### Fixed

- `FloatingDropdownPortal` — on touch devices (`pointer: coarse`), outside scroll now closes the dropdown instead of repositioning it. Repositioning via React state updates caused a visible one-frame lag on every scroll tick on mobile. Affects `Combobox`, `Select`, `DatePicker`, and `Segmented` (collapsed mobile mode).

## 4.8.25 — 2026-06-22 — Add searchPlacement prop to Combobox

### Added

- `Combobox` — `searchPlacement?: 'trigger' | 'dropdown'` (default `'trigger'`). In `'dropdown'` mode the trigger becomes a button showing the selected value (like `Select`), and the search input moves inside the popover with a search icon. Useful when a cleaner trigger is preferred or when the combobox sits next to other Select fields.

## 4.8.24 — 2026-06-18 — Add mobileMenuExtra slot to TopNav

### Added

- `TopNav` — `mobileMenuExtra?: ReactNode` renders at the bottom of the mobile nav sheet, below nav items and actions, separated by a divider. Consumer controls all markup — `TopNav` just provides the slot.

## 4.8.23 — 2026-06-18 — Fix PageShell inner wrapper flex chain

### Fixed

- `PageShell` — inner content wrapper (`relative z-10`) now always applies `flex flex-col flex-1` so a `flex flex-col min-h-screen` outer shell correctly stretches content to fill the viewport. Added `contentClassName?: string` to customise the inner wrapper when needed.

## 4.8.22 — 2026-06-18 — Add showMobileLogo prop to DashboardTopBar and DashboardShell

### Added

- `DashboardTopBar` — `showMobileLogo?: boolean` (default `true`) gates the mobile monogram link. Pass `false` when the consumer renders its own logo in the top bar.
- `DashboardShell` — threads `showMobileLogo` through to `DashboardTopBar`.

## 4.8.21 — 2026-06-18 — Add PasswordStrength component

### Added

- `PasswordStrength` — strength bar + rule checklist for signup and change-password flows. Accepts `value: string` and optional `rules?: PasswordRule[]` to override the defaults. Default rules: min 8 chars, uppercase, lowercase, number, special character. Strength level (weak / fair / good / strong) is derived from the fraction of rules passed and uses the existing error/warning/info/success tokens. Also exports `passwordRules` (the default rule array) for composing custom rule sets.

## 4.8.20 — 2026-06-18 — Add StatCard icon prop

### Added

- `StatCard` — `icon?: ReactNode` renders an icon alongside the label in the top row. Pass any icon element (e.g. a Lucide icon).

## 4.8.19 — 2026-06-18 — Fix StatCard arrow direction

### Fixed

- `StatCard` — `direction: 'up'` now shows an up arrow and `direction: 'down'` shows a down arrow. The `rotate-180` transform was applied to the wrong condition — the SVG path draws a down arrow by default, so the rotation was inverted.

## 4.8.18 — 2026-06-18 — Use text-base across all form field inputs

### Fixed

- `Input`, `PasswordInput`, `Combobox`, `DatePicker`, `Textarea`, `Select` — all form field triggers now use `text-base` (16px). Previous releases mixed `text-sm` and `text-base`; 4.8.17 incorrectly standardised on `text-sm`. `text-base` is correct for form inputs (readability, prevents iOS auto-zoom on focus).

## 4.8.17 — 2026-06-18 — Align form input height across all field components

### Fixed

- `Input`, `PasswordInput`, `Combobox`, `DatePicker`, `Textarea` — all form fields now use `text-sm` (14px) and `py-2.5` padding, matching `Select`. Previously `Input`, `PasswordInput`, `DatePicker`, and `Textarea` used `text-base` (16px) with `py-2`, and `Combobox` used `py-2` with `text-sm`, causing inconsistent heights when mixing field types in the same form.

## 4.8.16 — 2026-06-18 — Fix SidebarNav scroll when nav items overflow

### Fixed

- `SidebarNav` — nav content area now scrolls independently when items overflow the viewport height. Added `min-h-0` alongside the existing `flex-1 overflow-y-auto` so the flex child actually creates a scroll context (classic flex `min-height: auto` bug).

## 4.8.15 — 2026-06-18 — StatCard change tone override

### Added

- `StatCard` — `change.tone?: 'success' | 'error' | 'warning' | 'info' | 'accent'` decouples the badge color from arrow direction. Useful when the semantic meaning of a change differs from its direction (e.g. a price drop is good). Omitting `tone` preserves the default: `up` = success (green), `down` = error (red).

## 4.8.14 — 2026-06-18 — Fix Combobox input font size

### Fixed

- `Combobox` — input now uses `text-sm` (14px) to match dropdown items (was `text-base` / 16px)

## 4.8.13 — 2026-06-16 — Drawer dropdown scroll and click fix

Replace competing RemoveScroll shards with native scroll-lock bypass on portalled menus.

### Fixed

- `FloatingDropdownPortal` / `DropdownMenu` — native `wheel` / `touchmove` listeners (`stopImmediatePropagation` in capture + `stopPropagation` in bubble) so react-remove-scroll on Radix Dialog/Sheet does not block list scroll
- Portalled menus — `pointer-events-auto` so items stay clickable when `body` is scroll-locked
- `Sheet` / `Dialog` — restore Radix `Dialog.Overlay` only (removes second `RemoveScroll` from `ModalScrollLockProvider` that broke clicks in 4.8.12)

### Removed

- `ModalScrollLockProvider` and context shard registry — superseded by native bypass (4.8.10–4.8.12 approach)

## 4.8.12 — 2026-06-16 — Drawer dropdown scroll via context shards

Wire portalled Select/Combobox lists into the active Sheet/Dialog RemoveScroll instance.

### Fixed

- `ModalScrollLockProvider` — React context bridge: wraps sheet/dialog content, owns `RemoveScroll` shards state, renders scrim
- `FloatingDropdownPortal` / `DropdownMenu` — register portalled DOM nodes with the nearest provider on mount (React portals preserve context)
- Replaces module-level shard registry that could not reach `RemoveScroll` when the overlay was only a sibling of content

## 4.8.11 — 2026-06-16 — Fix stale sheet overlay on navigation

Prevent `tollerud-sheet-overlay` from staying in the DOM and blocking clicks after closing a drawer or switching routes.

### Fixed

- `Sheet` — wrap overlay and content in `DialogPrimitive.Portal` so Radix `Presence` unmounts `ModalScrollLockOverlay` when the sheet closes
- `ModalScrollLockOverlay` — disable `RemoveScroll` when dialog content is not `data-state=open`
- Closed sheet overlay — `pointer-events: none` during exit animation

## 4.8.10 — 2026-06-16 — Drawer dropdown scroll (RemoveScroll shards)

Fix portalled Select/Combobox lists that still could not scroll inside Drawer/Sheet after v4.8.9.

### Fixed

- Register portalled menu DOM nodes as `react-remove-scroll` shards (native document listeners ignore React `stopPropagation`)
- `Sheet` / `Dialog` — replace Radix `Dialog.Overlay` scroll-lock with `ModalScrollLockOverlay` that shards dialog content plus open portalled menus
- `FloatingDropdownPortal` / `DropdownMenu` — auto-register while open

## 4.8.9 — 2026-06-16 — Scrollable portalled menus inside Drawer/Sheet

Fix Select, Combobox, and DropdownMenu lists that could not scroll when opened inside a modal drawer.

### Fixed

- `FloatingDropdownPortal` — stop wheel/touch propagation so react-remove-scroll (Radix Dialog/Sheet) does not block list scroll on portalled panels
- `DropdownMenu` — same scroll-lock compatibility for Radix-portalled menus inside `Drawer` / `Sheet` / `Dialog`

## 4.8.8 — 2026-06-16 — Portalled dropdown shadow consistency

Standard elevation for floating menus so portalled panels read clearly over tables and cards.

### Changed

- `FloatingDropdownPortal` — default `shadow-lg` (`--shadow-lg`) on all portalled panels
- `Select`, `Combobox`, `DatePicker`, `Segmented` — removed one-off shadow utilities; inherit portal default
- `DropdownMenu` — `shadow-lg` (was `shadow-md`) to match other popovers

## 4.8.7 — 2026-06-16 — FileUpload i18n labels

Configurable drop-zone CTA copy for custom text and translations.

### Added

- `FileUpload` — `clickLabel?` and `dragLabel?` override the default “Click to upload” / “or drag and drop” prompt (`dragLabel=""` hides the drag hint)

## 4.8.6 — 2026-06-16 — Toast visibility and settings nav spacing

Larger toast chrome, longer default duration, and clearer spacing in settings section nav.

### Changed

- `Toast` / `useToast` — larger padding, type, and icons; default duration 4.5s (was 3.8s)
- `Toaster` (Sonner) — matching larger text/padding; default duration 4.5s
- `SettingsLayout` — `gap-xs` between sidebar nav items
- `Stack` — `as="nav"` for semantic nav stacks

## 4.8.5 — 2026-06-16 — ButtonGroup fusion and TopNav lockup

Fix fused button chrome in groups and slightly enlarge the TopNav project title.

### Fixed

- `ButtonGroup` — child buttons no longer keep standalone border-radius/border from `.tollerud-btn` layer CSS; dividers use inset shadow so middle segments fuse cleanly with text labels

### Changed

- `TopNav` — project name uses `text-base`; desktop nav links get a little extra left margin after the monogram lockup

## 4.8.4 — 2026-06-16 — Button ghost semantic variants

Ghost buttons that tint on hover for success, warning, and info — same pattern as `ghost-destructive`.

### Added

- `Button` — `variant="ghost-success"`, `ghost-warning`, `ghost-info` (ghost at rest; semantic text, background tint, and border on hover/focus)
- `DataTable` bulk actions accept the new ghost semantic variants

## 4.8.3 — 2026-06-16 — Button ghost-destructive variant

Softer destructive button for dense toolbars — ghost at rest, red tint on hover.

### Added

- `Button` — `variant="ghost-destructive"` for archive/deactivate actions in `ButtonGroup` and table toolbars where permanent red chrome is too heavy

## 4.8.2 — 2026-06-16 — Portalled form dropdowns

Select, Combobox, DatePicker, and Segmented mobile menus render in a fixed portal so they are not clipped inside scroll or overflow containers (for example `DataTable`).

### Fixed

- `Select` — options list portals to `document.body` with viewport positioning
- `Combobox` — suggestion list portals to `document.body`
- `DatePicker` — calendar panel portals to `document.body`
- `Segmented` — `collapseMobile` dropdown portals to `document.body`

### Added

- `FloatingDropdownPortal` / `useFloatingDropdownCoords` — shared portalled menu helper (`lib/floating-dropdown.tsx`)
- `getFloatingDropdownCoords` — fixed-position placement helper on `lib/dropdown-placement.ts`

## 4.8.1 — 2026-06-16 — Segmented mobile dropdown

`collapseMobile` now opens options in a floating dropdown instead of expanding inline.

### Changed

- `Segmented` — mobile `collapseMobile` uses an absolute dropdown overlay (matches Select/Combobox), not inline expansion

## 4.8.0 — 2026-06-16 — Segmented collapseMobile

Mobile-friendly segmented control that collapses to the selected option on narrow viewports and opens a dropdown overlay.

### Added

- `Segmented` — `collapseMobile?` shows only the active option below `md`; tap to open dropdown overlay, select to collapse
- `useIsMobile` — internal hook for the `md` breakpoint (`lib/use-mobile.ts`, not exported)

## 4.7.4 — 2026-06-16 — Form field border radius

Align `Select` and `FileUpload` field radii with `Input`, `Combobox`, and `DatePicker`.

### Fixed

- `Select` — trigger uses `rounded` (was `rounded-lg`); dropdown panel unchanged
- `FileUpload` — drop zone and file rows use `rounded` (was `rounded-lg` / `rounded-md`)

## 4.7.3 — 2026-06-16 — Chart value prefix and suffix

Optional `valuePrefix` / `valueSuffix` on `TimeSeriesChart` for tooltip, axis, and badge formatting without a custom callback.

### Added

- `TimeSeriesChart` — `valuePrefix?` and `valueSuffix?` wrap locale-formatted numbers (ignored when `formatValue` is set)

## 4.7.2 — 2026-06-16 — Chart value formatting

`formatValue` docs, `formatChartDecimal` helper, Segmented key fix, and `renderTooltip` formatted-value arg.

### Added

- `formatChartDecimal` — decimal formatter with optional suffix (e.g. `57,0 kr/l` via `formatValue` + `locale="nb-NO"`)
- `TimeSeriesChart` — `renderTooltip` third argument `formattedValue` (from `formatValue` or locale default)

### Fixed

- `Segmented` — stable React keys when mapping options (fixes warning in `TimeSeriesChart` range toolbar)

### Docs

- Charts page — `formatValue` live demo, tooltip snippet uses `formattedValue`

## 4.7.1 — 2026-06-16 — English chart presets

`TIME_SERIES_PRESETS` and default `locale` now ship in English.

### Changed

- `TIME_SERIES_PRESETS` — labels: 3 mo · 6 mo · 1 yr · 2 yr · All (was nb-NO)
- `TimeSeriesChart` — default `locale` is `en-US`; chart formatters default to `en-US` (`nb-NO` still appends ` ,-` to values)

### Migration

Norwegian apps: pass custom `ranges` (e.g. `3 mnd`, `Alt`) and `locale="nb-NO"` on `TimeSeriesChart`.

## 4.7.0 — 2026-06-16 — Interactive time series charts

Stepped area charts with hover, range selection, and enhanced sparklines — pure SVG, no Recharts.

### Added

- `TimeSeriesChart` — wide vector chart with `curve="step"`, crosshair hover, tooltip, Y-axis labels, and optional `ranges` + `Segmented` toolbar
- `TIME_SERIES_PRESETS` — English range labels: 3 mo · 6 mo · 1 yr · 2 yr · All (`durationMs` filters from latest point). Norwegian UI: pass custom `ranges` with `locale="nb-NO"`.
- `lib/chart-series` — shared path, scale, and format helpers (used by charts)

### Changed

- `Sparkline` — `curve`, `fill`, and `interactive` props for stepped micro charts with hover dot

### Migration

Nothing breaking. Use `TimeSeriesChart` for price history; keep `AreaChart` for simple static series.

## 4.6.16 — 2026-06-16 — Magnetic button glow

Ship pointer-following glow for primary and terminal buttons as a first-class package export.

### Added

- `initButtonGlow()` — mount once at the app root; tracks pointer position on `.tollerud-btn--primary`, `.tollerud-btn--terminal`, and opt-in `.tollerud-btn-glow`
- `BUTTON_GLOW_SELECTORS` and `ButtonGlowOptions` — configure selector scope and event root
- `@tollerud/ui/button-glow` subpath export for tree-shaking
- Magnetic glow CSS in `globals-layers.css` (`is-glowing`, `--glow-x` / `--glow-y`); disabled under `prefers-reduced-motion`
- `examples/next-starter` — `ButtonGlowRoot` client helper wired in root layout

### Docs

- Foundations → Motion and Components → Button document `initButtonGlow()` usage
- Docs site delegates glow init to the package export (removed duplicate CSS in `docs.css`)

### Migration

Nothing breaking. Call `initButtonGlow()` once if you want the docs-style cursor glow; static hover glow on terminal still works without it.

## 4.6.15 — 2026-06-16 — PageHeader shimmer alias

`shimmer` prop alias for mid-sentence accent words in page titles.

### Added

- `PageHeader` — `shimmer` alias for `titleAccent` (same behavior: first matching substring in a string `title`)

### Migration

Nothing breaking. Prefer `shimmer="honest"` with `title="Keep beer prices honest."` for one highlighted word mid-sentence.

## 4.6.14 — 2026-06-16 — PageHeader shimmer accents

Selective display shimmer on page titles.

### Added

- `PageHeader` — `titleAccent` wraps the first matching substring in `.tollerud-display-shimmer` when `title` is a string
- `PageHeader` — `titleShimmer` renders an optional second title line with display secondary + shimmer styles
- `PageHeaderShimmer` — inline shimmer span for manual `title` composition

### Migration

Nothing breaking. `title` still accepts `ReactNode` for custom markup.

## 4.6.13 — 2026-06-16 — DataTable full-row hover

Row hover now applies to every cell, not only pinned columns.

### Fixed

- `DataTable` — opaque `group-hover/tr:bg-tollerud-noir-800` on all body cells so the entire row lightens on hover while pinned columns stay scroll-safe

### Migration

Nothing breaking.

## 4.6.12 — 2026-06-16 — DataTable mobile toolbar layout

Search stacks above filter and toolbar actions on narrow viewports.

### Fixed

- `DataTable` — toolbar uses a column layout on mobile: search on top, filter and `toolbarRight` stay paired on one row below (no wrap orphaning the action button)

### Migration

Nothing breaking. Drop-in layout fix for rich-mode tables with `searchable`, `filter`, and `toolbarRight`.

## 4.6.11 — 2026-06-16 — TopNav a11y, DataTable keys, Sheet title

Radix dialog warnings, DataTable React keys, pinned-column scroll bleed, and TopNav mobile menu polish.

### Fixed

- `TopNav` — mobile menu uses `DialogTitle` / `DialogDescription` with shipped `tollerud-sr-only`; `DialogTrigger` wraps the hamburger (no duplicate toggle state)
- `TopNav` — mobile menu scrim starts below the header (`tollerud-topnav-menu-overlay`) so the bar stays at full brightness when open
- `DataTable` — column list items use stable `column.key` + index React keys (no object-key warnings)
- `DataTable` — pinned columns use opaque row/hover backgrounds so horizontal scroll does not show bleed-through on hovered rows
- `Sheet` / `Drawer` — `SheetContent` injects a visually hidden `SheetTitle` when children omit one (Radix dialog a11y requirement)
- `tollerud-sr-only` utility in `globals-layers.css` — works without Tailwind `sr-only` in consumer apps
- Docs `CopyButton` — clipboard failures no longer log unhandled rejections

### Migration

Nothing breaking. `SheetContent` accepts optional `title` for the screen reader label when no visible `SheetTitle` is present (default: `Panel`). `TopNav` accepts optional `mobileMenuTitle` (default: `Navigation menu`).

## 4.6.10 — 2026-06-16 — TopNav overlay mobile menu

Mobile navigation now uses a modal overlay with backdrop, focus trap, and selective inline actions.

### Added

- `TopNavAction` — wrap `actions` children with `mobile?: 'inline' | 'menu' | 'hidden'` (default `menu`) to keep a primary CTA in the header bar while other actions collapse into the menu
- `TopNav` — mobile menu is a Radix Dialog overlay with scrim, Esc / backdrop dismiss, and body scroll lock; nav links and menu actions render in the panel below the bar

### Changed

- Unwrapped `actions` children now default to the mobile menu (previously stayed inline in the header). Wrap in `<TopNavAction mobile="inline">` to restore inline placement.

### Migration

Nothing breaking for the `actions` prop API. If you relied on all actions staying visible in the mobile header, wrap them in `TopNavAction mobile="inline"`.

## 4.6.9 — 2026-06-16 — TopNav responsive menu and max width

Top navigation now collapses links on narrow viewports and can align with Container width.

### Added

- `TopNav` — mobile menu toggle below `lg` when `navItems` are set; `maxWidth` prop (`default` | `wide` | `full` | `false`) constrains inner content to match `Container` / `MainContent` widths

### Migration

Nothing breaking. `maxWidth` defaults to `false` (full-bleed). Pass `maxWidth="default"` to cap at 1100px.

## 4.6.8 — 2026-06-16 — Sheet and Drawer slide animation

Slide-over panels now animate with shipped CSS keyframes instead of undefined Tailwind animate utilities.

### Fixed

- `Sheet` / `Drawer` — backdrop fade and panel slide in/out (250ms); `tollerud-sheet-*` classes in `globals-layers.css`
- Respects `prefers-reduced-motion: reduce` (instant open/close)

### Migration

Nothing breaking. Ensure consumer apps import `@tollerud/ui/globals.css` (and `source.css` for Tailwind v4).

## 4.6.7 — 2026-06-16 — DataTable height matches actual rows

Partial pages no longer pad with empty spacer rows below the last data row.

### Fixed

- `DataTable` — removed spacer rows that filled unused `pageSize` capacity; footer sits flush under the last row when fewer items than `pageSize` (e.g. 11 items with `pageSize={25}`)

### Migration

Nothing breaking. Table body height now reflects rendered row count.

## 4.6.6 — 2026-06-16 — Flip dropdowns upward near viewport edge

Select, Combobox, and DatePicker open above the trigger when there is not enough space below.

### Added

- `lib/dropdown-placement` — shared viewport-aware placement hook (`useDropdownPlacement`, `getDropdownPlacement`)

### Fixed

- `Select` — menu flips to `bottom-full` when the footer or bottom of the viewport is tight (DataTable rows selector)
- `Combobox` — listbox opens upward when needed; no longer closes on window resize
- `DatePicker` — calendar panel opens upward when needed; no longer closes on window resize
- `DropdownMenu` — `collisionPadding={8}` for Radix flip behavior at screen edges

### Migration

Nothing breaking. Placement is automatic.

## 4.6.5 — 2026-06-16 — Compact DataTable footer and js-yaml security fix

Tighter rows-per-page control in the table footer; dependency override clears Dependabot alert #10.

### Fixed

- `DataTable` — footer **Rows** selector uses inline `Select` (`layout="inline"`, `size="sm"`) so the footer stays one row tall
- `DataTable` — rows-per-page dropdown no longer clips behind the table (`overflow-hidden` removed from shell; footer stacking raised)
- `Select` — `layout` and `size` props for dense toolbar/footer use; menu `z-50`

### Security

- Override `@manypkg/get-packages` to `>=3.1.0` — drops vulnerable transitive `js-yaml@3.14.2` from `@changesets/cli` (CVE-2026-53550)

### Migration

Nothing breaking. `Select` defaults unchanged (`layout="stacked"`, `size="md"`).

## 4.6.3 — 2026-06-16 — DataTable rows-per-page selector

Users can change how many rows appear per page when `pageSizeOptions` is set.

### Added

- `DataTable` — `pageSizeOptions?: number[]` renders a footer **Rows** `Select`; changing size resets to page 1. Initial value from `pageSize` or the first option.

### Docs

- Data Table docs — pagination section covers fixed `pageSize` and `pageSizeOptions`; Servers canonical snippet updated
- `COMPONENTS.md` — fixed props table layout; documents `pageSizeOptions`

### Migration

Nothing breaking. Add `pageSizeOptions={[10, 25, 50]}` alongside `pageSize` to enable the selector.

## 4.6.2 — 2026-06-16 — Fix DataTable full width and document pagination

Tables in rich mode now stretch to the container width on desktop while keeping horizontal scroll when columns need more space.

### Fixed

- `DataTable` — `<table>` uses `w-full` instead of `w-max` so the table fills its container (e.g. inside a capped `Section`) instead of shrinking to content width

### Docs

- Data Table docs — new **Pagination** section (`pageSize`, internal page state, footer copy, cross-page selection)
- `COMPONENTS.md` and `SKILL.md` — pagination contract documented

### Migration

Nothing breaking. Drop-in width fix for tables inside max-width layouts.

## 4.6.1 — 2026-06-16 — Fuse DataTable bulk actions in ButtonGroup

Multiple `bulkActions` on `DataTable` now render as a fused `ButtonGroup` instead of separate spaced buttons.

### Changed

- `DataTable` — two or more bulk actions wrap in `ButtonGroup` (`size="sm"`); single action unchanged

### Migration

Nothing breaking. Bulk action bars look tighter with shared borders when multiple actions are defined.

## 4.6.0 — 2026-06-16 — Add ButtonGroup and first-class DataTable

New fused action button row and a production-ready data table with the full Servers example feature set built into `@tollerud/ui`.

### New components

- `ButtonGroup` — wraps `<Button>` children with shared borders, internal dividers, default `size`, and `orientation?: 'horizontal' | 'vertical'`

### DataTable

Rich mode ships search, segmented filter, row selection, bulk-action bar, sortable headers (`aria-sort`), row menus, pagination footer, loading skeletons, custom empty states, and a focusable horizontal scroll region with pinned anchor columns on narrow viewports (`pinColumns`, default on in rich mode).

- Column `header` is an alias for `label`
- `render` accepts `(row) => …` or `(value, row) => …`
- `striped` — alternating row backgrounds in rich mode
- `pinColumns` — pin first column and row ⋮ menu during horizontal scroll (default on in rich mode)
- `footer` — extra slot in the table footer bar
- `filter.variant` — `segmented` (default) or `combobox` for the rich-mode column filter
- Row hover in rich mode; bulk-action icons spaced correctly; `aria-sort` on sortable headers; focusable horizontal scroll region on mobile

### When to use

- `ButtonGroup` — adjacent actions (Deploy, Cancel, ⋯)
- `Segmented` — single selected option (sort mode, list/grid view)
- `DataTable` — config-driven tables with optional search, filters, selection, and pagination

### Migration

Nothing breaking. `header` and row-only `render` work on the npm component directly — the docs adapter shim is no longer required for column config.

## 4.5.2 — 2026-06-16 — Fix Button height for icon-only labels

Button sizes now use fixed heights so text and icon-only buttons align when placed in the same toolbar row.

### Fixed

- `Button` — `tollerud-btn--sm` / `--md` / `--lg` use fixed heights with centered flex layout; icon-only buttons no longer render shorter than labeled buttons
- CSS layer + token button sizes updated to match the React component

### Migration

Nothing breaking. Drop-in fix for mixed text/icon button rows.

## 4.5.1 — 2026-06-16 — Fix Segmented height for icon labels

Segment buttons now use a fixed height so text and icon labels align when multiple controls sit side by side.

### Fixed

- `Segmented` — `h-8` / `h-7` segment heights with centered flex layout; icon-only segments no longer render shorter than text segments

### Migration

Nothing breaking. Drop-in fix for mixed text/icon `Segmented` rows.

## 4.5.0 — 2026-06-16 — Grouped Combobox sections

`Combobox` now supports searchable dropdowns with section titles via an optional `groups` prop.

### Changed

- `Combobox` — optional `groups: { label, options }[]` for titled sections inside the list; flat `options` still works unchanged
- Exported `ComboboxGroup` type

### Migration

Nothing breaking. Existing flat `options` usage is unchanged. Pass `groups` when you need section headers in the dropdown.

## 4.4.1 — 2026-06-15 — Trademark notice and brand asset license

Clarifies that MIT applies to source code only. Tollerud trademarks, the monogram, avatars, and files under `brand/` remain proprietary.

### Added

- Trademark and brand asset notice appended to root `LICENSE`
- `brand/LICENSE` — terms for logo, monogram, and avatar assets
- `packages/footer/LICENSE` — MIT for footer code with pointer to full trademark terms
- README license section at the top (also visible on the npm package page)

### Changed

- Copyright holder on `LICENSE` — Mathias Tollerud
- `LICENSE` included in npm tarball `files` for `@tollerud/ui` and `@tollerud/footer`

## 4.4.0 — 2026-06-15 — Align DashboardShell with docs app shell

`DashboardShell` now defaults to the same sidebar-first layout used on the docs site: brand lockup in the left rail, structured sidebar navigation, and a context top bar instead of duplicating the lockup horizontally.

### New components

- `SidebarNav` — sidebar brand lockup with grouped nav links, icons, and active states
- `DashboardTopBar` — context top bar with breadcrumb, page title, mobile menu toggle, and actions

### Changed

- `DashboardShell` — default `variant="sidebar"` matches the docs shell; `variant="topnav"` keeps the previous horizontal TopNav layout
- New props: `sidebarGroups`, `sidebarItems`, `projectSubtitle`, `breadcrumb`, `pageTitle`
- `navItems` still works and maps into the sidebar when using the default variant
- `SettingsLayout` — `onNavSelect` for client-side section switching; `tone="danger"` on nav items
- Settings recipe uses package primitives; Settings example keeps its polished docs shell (`ds-settings`)
- Docs Screen patterns and Recipes demos updated to the aligned shell

### Migration

Existing apps using horizontal top navigation should pass `variant="topnav"` to preserve the previous layout. Apps that already pass `navItems` get sidebar navigation automatically with the new default.

## 4.3.0 — 2026-06-14 — Add screen patterns for component-first pages

Minor release: adds common page and section compositions so agents can build full Tollerud screens without recreating branded layout, navigation, form, list, detail, or empty-state structure with raw Tailwind.

### New components

- `PageHeader` — title block with eyebrow, description, metadata, and actions
- `TopNav` — branded monogram/project lockup with nav links and actions
- `DashboardShell` — app shell with top nav, optional sidebar, header, and main content
- `SettingsLayout` — settings page with section navigation and content panel
- `FormPanel` — titled form surface with body, action, and footer slots
- `ResourceList` — list/table page wrapper with header, filters, count, actions, and empty state
- `DetailPage` — detail page with header, primary content, and optional aside
- `EmptyPage` — full-page empty state on a Tollerud shell
- `FeatureSection` — feature grid section built from `PageHeader`, `CardGrid`, and `FeatureCard`
- `StatsSection` — metric section built from `PageHeader`, `Grid`, and `StatCard`

### Changed

- Docs app adds a Screen patterns page and search/deep links for the new exports.
- Docs app adds a **Recipes** page (`/recipes/`) with component-first copy-paste screen compositions for agents; each recipe links to an existing interactive example where one exists.
- Ships `tollerud-ui-audit` (`npx tollerud-ui-audit`) — lightweight consumer styling drift checker (missing `source.css`, copied `components/ui`, hardcoded brand hex, Button/Link nesting). Documented with full error-code reference, `--warn-only` flag, and alternative script invocation in `GETTING_STARTED.md`, `README.md`, `COMPONENTS.md`, and docs Guides.
- Docs and `GETTING_STARTED.md` add a consumer project checklist, anti-pattern table, and semantic feature-component example.
- `examples/next-starter` and `fixtures/consumer` use layout primitives (`PageShell`, `Section`, `Stack`, `PageHeader`, `CardGrid`) as the component-first reference implementation.
- `layout-patterns.test.ts` smoke-tests all layout and screen-pattern exports from the package barrel.
- Component demos and roadmap metadata now reference the actual screen-pattern APIs.
- Removed obsolete low-level `.tollerud-glass` and `.tollerud-section` utilities now covered by `TopNav` and `Section`.

### Migration

Replace `.tollerud-glass` nav usage with `TopNav`, and `.tollerud-section` wrappers with `Section`. No public projects are using these utilities yet.

## 4.2.0 — 2026-06-14 — Add layout primitives for component-first consumer apps

Minor release: adds semantic layout primitives so consumer apps and agents can build Tollerud-shaped pages without recreating branded structure with raw Tailwind utilities.

### New components

- `PageShell` — full-page shell with noir, grid, or glow background options
- `Section` — semantic page section with consistent spacing and width presets
- `Stack` — vertical layout primitive with finite gap and alignment options
- `Cluster` — wrapping horizontal layout for actions, badges, and toolbars
- `Grid` — responsive grid primitive with constrained column presets
- `CardGrid` — card collection grid with Tollerud spacing defaults
- `Split` — responsive two-column content/aside layout
- `MainContent` — main content wrapper with width, spacing, and density presets

### Changed

- Docs app adds a dedicated Layout page and deep links for each new primitive.
- `SKILL.md`, `AGENTS.md`, `GETTING_STARTED.md`, `README.md`, `COMPONENTS.md`, and `BACKGROUNDS.md` now reinforce component-first consumer styling.

### Migration

Nothing breaking. Existing Tailwind glue still works; prefer these primitives for repeated branded page structure.

## 4.1.1 — 2026-06-10 — Fix: missing `@theme` registration broke all `tollerud-*` color utilities

Critical fix. `globals.css` imported `tokens.css` (plain `--tollerud-*` CSS custom properties) but never registered them with Tailwind v4 via `@theme`. Tailwind v4 only generates color utilities for colors declared as `--color-*` theme variables, so every `bg-tollerud-*`, `text-tollerud-*`, and `border-tollerud-*` class used across the 52 component dist files resolved to nothing — breaking the entire visual identity (yellow accents, noir surfaces, borders, state colors) in any consumer app.

### Fix

Added a `@theme` block to `globals.css` mapping the full `tollerud-*` palette (brand yellows, noir scale, surfaces, text, borders, state colors) to `--color-tollerud-*` theme variables, referencing the existing `--tollerud-*` tokens. No change to token values — `bg-tollerud-yellow`, `text-tollerud-noir-400`, etc. now generate correctly with no extra config.

No API changes. Consumers should pick this up automatically on `npm update @tollerud/ui` — no code changes needed.

## 4.1.0 — 2026-06-11 — Ship Spinner, Drawer, EmptyState, and useToast

Minor release: four docs-site-only components move into `@tollerud/ui` with matching CSS in `globals-layers.css`.

### New components

- `Spinner` — inline loading indicator with reduced-motion support
- `Drawer` — controlled slide-over API (`open`, `onClose`, `footer`) built on `Sheet`
- `EmptyState` — prop-driven empty state with built-in Lucide icon names
- `ToastProvider` / `useToast` — context-based toast stack (alternative to Sonner `Toaster`)

### Changed

- Docs app imports the four components from `@tollerud/ui` instead of local adapters
- `COMPONENTS.md`, `SKILL.md`, `AGENTS.md` — export catalog and usage docs updated
- `registry.json` — four new entries; subpath exports: `@tollerud/ui/spinner`, `/drawer`, `/empty-state`, `/toast`

### Migration

Nothing breaking. `Empty` compound component and Sonner `Toaster` remain available.

---

## 4.0.5 — 2026-06-10 — Starter template and DX docs

Patch release: human-facing Next.js starter, migration guide, and footer package tooling alignment. No breaking API changes.

### Added

- `examples/next-starter/` — copy-paste Next.js 16 + Tailwind v4 reference app (`source.css`, `Toaster`, sample page)
- `GETTING_STARTED.md` — “Migrating from copied components” section (grep recipe, prop drift checklist, link to `SKILL.md`)

### Changed

- `@tollerud/footer` — TypeScript 6.x in devDependencies; `sync-footer-package.mjs` preserves `tsup.config.ts` build and `publishConfig`
- `GETTING_STARTED.md` / `README.md` — footer self-contained dependency model documented; starter template linked
- `packages/footer/tsconfig.json` — `ignoreDeprecations: "6.0"` for DTS emit under TS 6

### Migration

Nothing breaking. New apps can copy `examples/next-starter/` instead of wiring from scratch.

---

## 4.0.4 — 2026-06-10 — Export verification and source.css

Patch release: verifies all subpath exports in CI, adds package-owned Tailwind scanning, and expands install docs.

### Added

- `@tollerud/ui/source.css` — package-owned `@source` for `dist` scanning (npm, pnpm, workspaces, Bun)
- `test:subpath` now checks all 70 manifest entries (`dist/{name}.js` + `.d.ts`)
- `test:package` runs attw against every public subpath export

### Changed

- Recommended Tailwind v4 setup: `@import "@tollerud/ui/source.css"` after `globals.css`
- `GETTING_STARTED.md` — monorepo `@source` path table, footer-only minimal install
- `tailwind.css` re-exports `source.css` for one-import convenience
- Docs site getting-started page updated for `source.css`

### Migration

Replace manual `@source "../node_modules/@tollerud/ui/dist"` with:

```css
@import "@tollerud/ui/globals.css";
@import "@tollerud/ui/source.css";
```

---

## 4.0.3 — 2026-06-09 — Publish pipeline hardening

Patch release: aligns npm publish with `validate`, fixes preset export shape, enables provenance via OIDC, and fixes `@tollerud/footer` CI build.

### Changed

- `prepublishOnly` and `publish-npm.yml` now run `verify:footer-sync` and `test:consumer` before publish
- `publish-npm.yml` auto-builds and publishes `@tollerud/footer` alongside `@tollerud/ui`
- `tollerud-preset.js` renamed to `tollerud-preset.cjs` — fixes publint CJS-in-ESM warning; import via `@tollerud/ui/preset`
- `@tollerud/ui/utils` subpath no longer ships `'use client'` — `cn` is safe to import from Server Components
- Removed `engines.node` from `package.json` (contributor Node/npm guidance stays in `CONTRIBUTING.md`)
- Publish uses npm Trusted Publishers (OIDC) with `--provenance` instead of `NPM_TOKEN`
- `@tollerud/footer` ships its own `tsup.config.ts` — stops inheriting root TS 6 `tsconfig.build.json` during DTS emit

### Docs

- `README.md`, `GETTING_STARTED.md`, `SKILL.md`, `AGENTS.md` — preset import path updated
- Added `NPM_PACKAGE_PLAN.md` — npm hardening audit and task list

### Migration

Nothing breaking. If you copied `tollerud-preset.js` locally, rename to `tollerud-preset.cjs` or switch to `import preset from '@tollerud/ui/preset'`.

---

## 4.0.2 — 2026-06-10 — Repo layout and publish surface cleanup

Patch release: consolidates docs and CI fixtures, stops shipping internal manifests, and clarifies docs copy after the npm-only pivot.

### Changed

- Tarball smoke test moved to `fixtures/consumer/` (was `examples/consumer/`)
- Docs chrome consolidated under `docs-app/styles/docs.css` (removed top-level `docs/`)
- `registry.json` kept in the repo for `npm run test:drift` — no longer published in the npm tarball
- Docs copy: semantic tokens described without shadcn install-path framing

### Removed

- `components.json` — unused after copy-via-shadcn removal

---

## 4.0.1 — 2026-06-10 — npm-only install path

Patch release: drops copy-via-shadcn registry tooling. Install from the package — barrel or subpath imports.

### Removed

- `npm run test:registry-cli`, `npm run build:registry`, and `examples/registry-consumer/`
- `registry-dist/` build output (never shipped to npm in v4.0.0)
- Public shadcn `npx shadcn add` install docs — no consumers use copy-into-repo flow

### Docs

- Getting started leads with `npm install @tollerud/ui` and subpath imports (`@tollerud/ui/button`)
- `registry.json` remains for internal drift checks (`npm run test:drift`) only

### Migration

Use the package directly:

```tsx
import { Button } from '@tollerud/ui'
// or tree-shake:
import { Button } from '@tollerud/ui/button'
```

Do not copy component source via shadcn CLI — that path is unsupported.

---

## 4.0.0 — 2026-06-10 — Ecosystem hardening and globals-v4 removal

Major release: completes the post-v3 roadmap (light gallery, registry CLI, footer lockstep), reorganizes brand assets, and drops deprecated CSS entrypoints.

### Breaking changes

- Removed `@tollerud/ui/globals-v4.css` — it was an alias for `globals.css`. Tailwind v4 projects should import `@tollerud/ui/globals.css` only.
- Brand assets moved under `@tollerud/ui/brand/*` — e.g. `@tollerud/ui/brand/tollerud-logo.svg` (not package-root paths).

### Ecosystem

- `@tollerud/footer` — `packages/footer/` synced from `components/Footer.tsx` via `npm run sync:footer`; `npm run verify:footer-sync` in `validate`
- Changesets linked `@tollerud/ui` and `@tollerud/footer` for joint version bumps
- Registry drift checks via `registry.json` (`npm run test:drift`) — internal manifest, not a public shadcn install path

### Docs site

- Light-mode gallery parity — docs-only Tailwind preset maps `tollerud-*` utilities to CSS variables so npm previews flip in `data-theme="light"`
- Docs icons migrated to `lucide-react` (custom GitHub mark retained)
- Playwright coverage — forms page, command palette, theme toggle, light-mode card surfaces
- Brand assets canonical in `brand/`; synced to docs via `scripts/sync-brand-assets.mjs`
- Homepage and live docs URL → `https://design.tollerud.dev/`

### Tooling

- CI and dev tooling on Node 24 + npm 11.16.0 (`.nvmrc`, lockfile guardrails)
- Dependabot for `docs-app/` and `fixtures/consumer/` (moved from `examples/consumer/` in v4.0.2)
- Removed legacy `preview.html`, completed planning docs, and stale docs artifacts
- Consumer smoke test auto-syncs tarball version in `fixtures/consumer/package.json` (path at release: `examples/consumer/`)

### Migration

**globals-v4.css** — replace:

```css
@import "@tollerud/ui/globals-v4.css";
```

with:

```css
@import "@tollerud/ui/globals.css";
@source "../node_modules/@tollerud/ui/dist";
```

**Brand assets** — replace root imports:

```ts
import logo from '@tollerud/ui/tollerud-logo.svg'
```

with:

```ts
import logo from '@tollerud/ui/brand/tollerud-logo.svg'
```

No component API changes. `@tollerud/ui` barrel and subpath imports unchanged.

---

## 3.1.1 — 2026-06-09 — Display shimmer, form indicators, and button fixes

Patch release: ships hero text shimmer for consumer apps, fixes secondary/checkbox/radio styling, and polishes docs layout components.

### New utilities

- `.tollerud-display-shimmer` — animated yellow gradient clipped to text; respects `prefers-reduced-motion` (static `var(--primary)` fallback)

### Fixes

- `Button` — secondary variant restores raised surface and border (theme-aware CSS vars); all variants apply layer classes again
- `Checkbox` — checkmark visible on `defaultChecked` and click via `peer-checked` on the custom indicator
- `RadioGroup` — wires `value`, `onChange`, and `name` to children; inner dot shows when selected
- `CTABand` — title and description centered in the band
- `BentoDashboard` — section spacing and label alignment
- Docs `PageTOC` — restores `jumpToSection` import for in-page scroll

### Registry

- Top-level `name` → `Tollerud User Interface`; updated description and component metadata for blocks

### Docs

- Overview, Backgrounds, and Foundations Typography use `.tollerud-display-shimmer` (replaces docs-only `.ds-shimmer`)
- Light theme shimmer and secondary-button token overrides

### Migration

Drop-in. Replace any copied `.ds-shimmer` with `.tollerud-display-shimmer` from `@tollerud/ui/globals.css`.

---

## 3.1.0 — 2026-06-09 — Monogram component and docs fixes

Restores component styling in the docs site, ships the monogram as an npm component, and renames brand avatar assets.

### New components

- `Monogram` — inline SVG with `color`: `yellow` | `black` | `white`, optional `size` and `title`

### Fixes

- `Button` — `terminal` variant uses layer classes again
- `Pill`, `Avatar`, `Skeleton`, `Timeline`, `Switch`, `Slider`, `FormRow` — layer-class / prop adapter fixes
- `DatePicker` — calendar popover `z-50`
- `DataTable` — explicit `text-left` on column headers
- `CTABand` — inline accent bar margin
- `BentoDashboard` — real infra cards instead of placeholders
- `Footer` — uses `<Monogram color="yellow" />`
- `NoirGlowBackground` — `scale` and `offsetX` for edge-biased shader placement

### Brand assets

- `tia-full-figure.svg` renamed to `tollerud-avatar-full.svg` (plus PNG export)
- npm exports: `@tollerud/ui/tollerud-avatar-full.svg` and `@tollerud/ui/tollerud-avatar-full.png`

### Docs

- Docs-only brand layer: `Monogram`, `TiaPortrait`, `TollerudAvatarFull`, `NavLockup` under `@/components/brand`
- Tailwind `@source` fix, light-mode monogram via `currentColor`, onboarding/auth/foundations page updates

### Migration

Drop-in. Replace any copied `tia-full-figure` paths with `tollerud-avatar-full`. Use `<Monogram />` instead of inline SVG or `<img src={logo}>` where you need theme-aware fill.

---

## 3.0.0 — 2026-06-09 — ESM-only and rich DataTable

Ships the full table pattern in npm, drops CommonJS builds, and adds release/props tooling.

### Breaking change

- Package is **ESM-only** — `require('@tollerud/ui')` and `.cjs` subpath bundles are removed. Use `import` in apps and bundlers that support ES modules.

### New features

- `DataTable` — search, segmented filter, row selection, bulk actions, per-row menus, pagination, loading skeletons, and custom empty states (optional; simple sort/filter mode unchanged)
- `npm run docs:props` — generates `PROPS.generated.md` from component `*Props` interfaces
- `npm run test:props` — drift check in `validate` / `prepublishOnly`
- Changesets — `npm run changeset` and `npm run version:release` (runs `sync:registry`)

### Docs

- Retired docs-only `rich-datatable.jsx`; docs `DataTable` is an adapter over npm `DataTable`
- `PackageDataTable` remains the direct npm import alias on the components page

### Migration

Replace `require('@tollerud/ui')` with ESM imports. For rich tables, pass the new optional props on `DataTable` instead of copying docs-only table code.

---

## 2.0.0 — 2026-06-09 — Peer dependency model

Radix, Lucide, Framer Motion, and Sonner move to peer dependencies so consumer apps do not bundle duplicate copies.

### Breaking change

Install peers explicitly alongside `@tollerud/ui`:

```bash
npm install @tollerud/ui clsx tailwind-merge tailwindcss@4 \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress \
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-tooltip \
  lucide-react framer-motion sonner
```

### New features

- `@tollerud/ui/tailwind.css` — convenience import with documented `@source` hint
- `npm run test:package` — publint + `@arethetypeswrong/cli` on the package
- `npm run test:size` — size-limit budget on `dist/button.js` and `dist/index.js`
- `npm run sync:registry` — align `registry.json` version with `package.json` before publish

### Docs

- Retired docs-only `grain-gl.jsx`; backgrounds and overview use npm `NoirGlowBackground`
- Publish workflow runs drift, package quality, size budget, docs build, and Playwright E2E

### Migration

If you already had Radix/Lucide/Motion/Sonner in your app, add them to `package.json` if npm no longer hoists them from `@tollerud/ui`. No component API changes.

## 1.4.0 — 2026-06-09 — Charts and marketing blocks

Palette-aware charts and landing-page blocks ship in the npm package. Docs site reorganized into `pages/`, `kit/`, `blocks/`, and `backgrounds/`.

### New components

- `BarChart` — vertical bars with optional yellow accent series
- `AreaChart` — gradient area/line chart with grid lines
- `Donut` — donut chart with segment legend
- `Sparkline` — compact inline trend line
- `HeroBlock` — landing hero on noir glow (`intense` uses `NoirGlowBackground`)
- `FeatureCard` — icon chip + title + description
- `CTABand` — closing CTA with optional accent bar

### Docs

- Charts and marketing import from `@tollerud/ui` (no duplicate `charts.jsx` / `marketing.jsx`)
- `docs-app/components/` taxonomy: routable `pages/page-*.jsx`, `kit/`, `blocks/rich-datatable.jsx`, `backgrounds/grain-gl.jsx`

### Migration

Nothing breaking. Import charts and blocks from `@tollerud/ui` as named exports.

## 1.3.0 — 2026-06-09 — Tailwind v4 as default CSS entry

`@tollerud/ui/globals.css` is now the Tailwind v4 bundle (tokens + component layers + `@import "tailwindcss"`). v3 projects move to `@tollerud/ui/globals-v3.css`.

### Breaking change

If you were on Tailwind v3 and importing `@tollerud/ui/globals.css`, switch to `@tollerud/ui/globals-v3.css` and keep your v3 `tailwind.config.ts` preset setup.

### Migration (v4 — recommended)

```css
@import "@tollerud/ui/globals.css";
@source "../node_modules/@tollerud/ui/dist";
```

`@tollerud/ui/globals-v4.css` remains as an alias for `globals.css`.

### Docs

Install instructions, README, GETTING_STARTED, AGENTS.md, and SKILL.md now lead with Tailwind v4.

## 1.2.0 — 2026-06-09 — Subpath exports, Tailwind v4 CSS, Playwright E2E

Per-component subpath imports, a dedicated Tailwind v4 stylesheet, expanded unit tests, and docs-site E2E smoke tests.

### New features

- Subpath exports — `@tollerud/ui/button`, `@tollerud/ui/dialog`, `@tollerud/ui/utils`, and one entry per component (61 total)
- `@tollerud/ui/globals-v4.css` — single import for Tailwind v4 + tokens + component layers
- `@tollerud/ui/globals-layers.css` — shared component CSS layers (also imported by v3 `globals.css`)
- `npm run changelog:draft` — draft a CHANGELOG entry from commits since the latest version

### Tests & CI

- Vitest coverage for `Dialog`, `DataTable`, and `CommandMenu`
- Playwright E2E smoke tests for the docs site (`npm run test:e2e`)
- CI verifies subpath bundles and `globals-v4.css` in the npm tarball

### Migration

Nothing breaking. Existing `@tollerud/ui` barrel imports continue to work. For tree-shaking, switch to subpath imports. Tailwind v4 projects should prefer `@import "@tollerud/ui/globals-v4.css"`.

## 1.1.5 — 2026-06-09 — Fix Tailwind preset color namespace

### Bug fix

The Tailwind preset now exposes design-system colors under `tollerud.*`, matching the shipped component classes and documentation (`text-tollerud-yellow`, `bg-tollerud-noir-900`, `border-tollerud-border`, etc.).

Previously the preset exposed the same palette under `tia.*`, so consumer projects following the docs could miss generated `tollerud-*` utilities.

### Details

- Renamed the preset color namespace from `tia` to `tollerud`
- Renamed the default package shadow token from `shadow-tia` to `shadow-tollerud`
- Added missing documented/component color aliases: `tollerud.accent`, `tollerud.foreground`, `tollerud.black`, `tollerud.white`, `tollerud.noir-950`, and `tollerud.noir-850`

### Migration

Replace any `text-tia-*`, `bg-tia-*`, `border-tia-*`, or `shadow-tia` utilities with their `tollerud` equivalents.

## 1.1.4 — 2026-06-09 — Fix: Alert tone colors missing in Tailwind v4

### Bug fix

Alert `tone` prop colors (`danger`, `info`, `success`) were invisible in Tailwind v4 consumer projects when the `@source` path in `globals.css` pointed to the wrong `node_modules` location.

**Root cause:** Tailwind v4 resolves `@source` relative to the CSS file. When `globals.css` lives in `app/`, the path `../../node_modules/@tollerud/ui/dist/**` resolves to `app/node_modules/...` (which doesn't exist) instead of the root `node_modules`. The 9 tone utility classes were never scanned and therefore never generated.

**Fix:** Added an explicit `@layer utilities` block to `globals.css` that defines all 9 Alert tone classes unconditionally, bypassing scanning entirely. Classes are always emitted regardless of `@source` path configuration.

Classes added to safelist: `bg-red-500/5`, `bg-blue-500/5`, `bg-green-500/5`, `border-red-500/30`, `border-blue-500/30`, `border-green-500/30`, `text-red-400`, `text-blue-400`, `text-green-400`

No API changes.

## 1.1.3 — 2026-06-09 — Fix: registry deps, source 'use client', React 19 devdep, docs drift

No component API changes. Six quality fixes from a review audit:

**1. registry.json — missing runtime dependencies**
All icon-using components now list `lucide-react` in their registry entry; `button` lists `@radix-ui/react-slot`; `status-dot` lists `framer-motion`; `dialog` lists `lucide-react`. Affects manual/registry-copy installs only — the npm bundle was already correct.

Entries updated: `button`, `status-dot`, `accordion`, `breadcrumb`, `combobox`, `date-picker`, `dialog`, `file-upload`, `pagination`, `password-input`, `pricing-card`, `stepper`, `tag-input`

**2. Source components — added `'use client'` directive**
12 hook-using source files were missing the directive. The bundled package was protected by the tsup post-build injection, but copied source files (registry/manual flow) would fail in Next.js App Router.

Added `'use client'` to: `Accordion`, `Avatar`, `Checkbox`, `Combobox`, `DatePicker`, `FileUpload`, `FormRow`, `PasswordInput`, `RadioGroup`, `Slider`, `Switch`, `TagInput`

**3. package.json — aligned React 19 devDependencies**
`react-dom` dev dep bumped from `^18.3.1` → `^19.2.7` to match `react: ^19.2.7`, eliminating the `ELSPROBLEMS` peer conflict in local dev.

**4. docs Getting Started page — rewritten to npm-package-first**
Was: manual file-copy instructions, wrong token value (`--tollerud-yellow` = `#E8D500`), old component list (29 components).
Now: `npm install @tollerud/ui`, Tailwind v3 + v4 snippets, full 61-component import block, correct yellow token docs, RSC safety note.

**5. docs Brand page — corrected monogram color**
`#FFF200` → `#FFFF00` (two references: description text and inline style). This now matches `BRAND.md`, `SKILL.md`, and the package tokens.

**6. .gitignore — added `*.tsbuildinfo`**
`examples/docs-nextjs/tsconfig.json` has `"incremental": true`, generating a `.tsbuildinfo` file that was untracked. Suppressed globally.

## 1.1.2 — 2026-06-09 — Ship AGENTS.md + SKILL.md inside the npm package

`AGENTS.md` and `SKILL.md` are now included in the published package (`files` in `package.json`). After `npm install @tollerud/ui`, both files are available at:

- `node_modules/@tollerud/ui/AGENTS.md`
- `node_modules/@tollerud/ui/SKILL.md`

This lets Claude Code (and other agents) read them directly without needing a separate `curl` or a GitHub URL.

## 1.1.1 — 2026-06-09 — Docs: AGENTS.md package update + migration instructions

No component or API changes. Documentation only.

- `AGENTS.md` — added "Updating the npm package" checklist (component checklist, version bump rules, required file updates, build/push steps) and "Fixing copy/paste component patterns" guide (detection, migration, prop drift checks, common patterns table) for agents working in consumer projects

## 1.1.0 — 2026-06-09 — Fix: Combobox + DatePicker close on window resize

`Combobox` and `DatePicker` rendered their popover as `position: absolute` with no awareness of window resize — if the viewport changed while a popover was open it would stay in place, misaligned from its trigger. Both now close on `window resize`, consistent with the existing close-on-scroll behaviour.

`DropdownMenu` was unaffected (Radix handles this internally).

**Migration:** no API changes — behaviour only.

## 1.0.9 — 2026-06-08 — Ship the 19 components that only existed in the docs site

Closes the long-standing gap between the marketing/docs site and the installable
`@tollerud/ui` package — every component previously listed under "still missing"
in `COMPLETENESS_ROADMAP.md` now ships from `components/index.ts`:

- **New primitives:** `Divider`, `Pill`, `Avatar` / `AvatarGroup`, `Breadcrumb`, `Pagination`, `Segmented`, `Stepper`
- **New layout/display:** `Panel`, `Meter`, `FormRow`, `PricingCard`
- **New form controls:** `Accordion` (+ `AccordionItem`/`AccordionTrigger`/`AccordionContent`), `Slider`, `PasswordInput`, `Combobox`, `DatePicker`, `FileUpload`, `TagInput`

All built from scratch as accessible, theme-aware components following existing
conventions (`forwardRef`, `cn`, `tollerud-*` design tokens) — no new runtime
dependencies were added.

## 1.0.8 — 2026-06-08 — Fix: mark package as Client Components for RSC/SSR

**Fixes a breaking issue introduced in earlier versions:** importing *anything* from `@tollerud/ui` — even a plain helper like `buttonVariants` — into a Next.js Server Component crashed at build/runtime. The package is bundled into a single `dist/index.js`/`.cjs` file, and esbuild silently drops module-level `"use client"` directives during bundling, so the bundle was never marked as client code even though it's full of components using hooks (`useState`, `useEffect`, etc.).

- `dist/index.js` and `dist/index.cjs` now start with `'use client'` (injected via a post-build step in `tsup.config.ts`, since esbuild rejects it as a bundling banner) — this correctly tells Next.js's RSC bundler that the whole package is client code
- Added missing `'use client'` directives to `ActionDiff`, `AlertInbox`, `Select`, and `LogViewer` source files (they used hooks without declaring the boundary — harmless pre-bundling, but good hygiene and required if these are ever built unbundled)

**Migration:** just update to `1.0.8` — no code changes required. Server Components can now safely import from `@tollerud/ui` (you'll just be importing client-bundled code, which is fine for things like `buttonVariants` that are plain functions).

## 1.0.7 — 2026-06-08 — Button `asChild` + `buttonVariants`

- `Button` now supports an `asChild` prop (via `@radix-ui/react-slot`) — renders its single child element instead of a `<button>`, merging Button's classes/props onto it. Lets you style a `<Link>` (or any other element) as a button without invalid `<a>`-in-`<button>` nesting: `<Button asChild variant="primary"><Link href="/foo">Go</Link></Button>`
- Exported `buttonVariants({ variant, size, className })` — returns the Button class string directly, for cases where wrapping with `asChild` is awkward
- Exported `ButtonVariantProps` type
- Added `@radix-ui/react-slot` as a direct dependency

## 1.0.6 — 2026-06-08 — Fix brand color docs

- Fixed brand color swatches in `ds/page-foundations.jsx` — "Yellow" now correctly shows `#FFFF00` / `--tollerud-yellow`, "Yellow warm" shows `#E8D500` / `--tollerud-yellow-warm`
- Updated `BRAND.md` — monogram color corrected to `#FFFF00`

## 1.0.5 — 2026-06-08 — Yellow token rename + AGENTS.md

**Breaking token changes:**
- `--tollerud-yellow` is now `#FFFF00` (was `#E8D500`) — the brighter, high-voltage yellow is now the primary accent
- `--tollerud-yellow-bright` removed — replaced by `--tollerud-yellow-warm: #E8D500` for the warmer secondary yellow
- Tailwind: `tollerud.yellow` → `#FFFF00`, `tollerud.yellow-bright` → renamed to `tollerud.yellow-warm: #E8D500`
- All glow `rgba` values updated from `rgba(232,213,0,...)` to `rgba(255,255,0,...)`
- Semantic tokens `--primary`, `--ring`, `--chart-1`, `--border-accent` updated to `#FFFF00`

**Migration:** replace `tollerud-yellow-bright` → `tollerud-yellow`, and `tollerud-yellow` → `tollerud-yellow-warm` wherever you relied on the old warm `#E8D500` value.

**New files:**
- Added `AGENTS.md` — cross-tool AI agent guide (Claude Code, Cursor, Copilot, Codex)
- Added `.github/copilot-instructions.md` — GitHub Copilot native instructions

## 2026-05-26 — Form Primitives + Footer

- Added **Textarea** — multiline input with label/error support, same pattern as Input
- Added **Select** — styled native `<select>` with placeholder, label/error, custom chevron
- Added **Checkbox** — custom-styled checkbox with checkmark SVG, label, focus-visible ring
- Added **Switch** — toggle switch with role="switch", animated thumb, label
- Added **RadioGroup / Radio** — fieldset-based radio group with custom dot indicator, label/error
- Added **Footer** — ported from `@tollerud/footer` (v1.1.2), uses Tollerud UI design tokens, supports `accent` variant, responsive/row layouts, unstyled mode
- 6 new components → total **29 components** now

## 2026-05-26 — Phase 5: Docs App

- Created `examples/docs-nextjs/` — a full Geist-inspired documentation site:
  - Foundations: Color, Typography, Motion, Accessibility
  - Components: Catalog with all 23 components organized by category
  - Patterns: Dashboard and Approval Flow templates
  - Brand: Tia avatar, voice, and Tollerud glow guide
  - Changelog: Version history timeline
- Docs use the same Tollerud UI components for consistent preview
- Dark theme with sidebar navigation, responsive layout

## 2026-05-26 — Phase 4: shadcn Registry Compatibility

- Added `components.json` — shadcn UI registry format for tooling compatibility
- Added `registry.json` — component registry with all 23 components, dependencies, and metadata
- Added `GETTING_STARTED.md` — one-command install guide with Tailwind setup and component import examples
- Portable import paths documented: `@/components/ui` and `@/lib/utils`

## 2026-05-26 — Phase 3: Homelab Operational Components

11 new homelab-specific components for infrastructure management:

**Health & Monitoring**
- `ServiceHealthCard` — service status card with uptime, response time, version
- `HostCard` — server/VM card with CPU, RAM, disk, containers, IP
- `DockerStackCard` — Docker Compose stack overview with per-service health
- `IncidentCard` — severity-graded incident/alert card (critical→info)

**Actions & Approval**
- `ApprovalCard` — approve/reject card for pending operations
- `ActionDiff` — unified diff viewer with line numbers, add/remove/context
- `RollbackPlan` — ordered rollback steps with execution status

**Logs & Alerts**
- `LogViewer` — terminal-style scrollable log viewer with search, live follow, level coloring
- `AlertInbox` — alert feed with count badges, severity filter, acknowledge action

**Feed & History**
- `Timeline` — vertical timeline with status dots, connecting lines, metadata badges
- `BackupStatusPanel` — backup job overview with per-job status and schedule

## 2026-05-26 — Phase 2: Command-First Shell

- **Kbd** — Raycast-style keyboard shortcut chip (`⌘K`, `⌘⇧S`, etc.), 2 sizes.
- **ActionRow** — Command/action item row with icon, label, description, shortcut, keyboard navigation (`highlighted` prop).
- **CommandMenu** — Full command palette: search, groups, arrow key nav, `Enter`/`Esc`, auto-focus, body scroll lock, footer hints, custom filter support.
- **CSS classes**: `.tollerud-kbd`, `.tollerud-action-row`, `.tollerud-cmd`, `.tollerud-cmd-overlay`, `.tollerud-cmd__*` — in both `globals.css` and `tokens.css`.
- **KEYBOARD.md** — Keyboard contract document: global shortcuts, component contracts, accessibility requirements, implementation rules.

## 2026-05-26 — NoirGlowBackground

- Ported the real Tollerud.no background source from `MathiasOki/tollerud-landing`.
- Added `components/NoirGlowBackground.tsx` using `@paper-design/shaders-react` / `GrainGradient`.
- Added CSS fallback classes: `.tollerud-noir-glow-root`, `.tollerud-noir-glow-bg`, `.tollerud-noir-glow-vignette`, `.tollerud-noir-noise`.
- Added acid-yellow token `--tollerud-acid` / `tollerud-acid` for Tollerud voltage.
- Updated `preview.html` and the Next.js example hero to use the glow background.
- Added `BACKGROUNDS.md` documentation.

## 2026-05-25 — v1.0 Next.js Release

- **Tailwind preset** (`tollerud-preset.js`) — drop into any Next.js project
- **Globals.css** with shadcn-compatible semantic tokens (`--background`, `--primary`, `--ring`, etc.)
- **React components** — Button, Card, Badge, StatusDot, Input, CodeBlock, StatCard, Container
- **ACCESSIBILITY.md** — contrast ratios, focus rings, touch targets, reduced motion
- **COMPONENTS.md** — usage matrix for all component variants
- **VOICE.md** — copy guidelines, terminal-style CTAs, tone rules
- **CHANGELOG.md** — this file
- **Graphify-inspired additions**: grid backgrounds, glass nav, terminal CTAs, gradient accents, pills, tight display typography
- **Motion tokens**: duration, easing, reduced-motion support
- **Chart tokens**: accessible color palette for data viz

### What shipped

```
design-system/
├── package.json
├── README.md
├── CHANGELOG.md
├── ACCESSIBILITY.md
├── COMPONENTS.md
├── VOICE.md
├── COMPLETENESS_ROADMAP.md
├── tollerud-preset.js           # ← drop-in Tailwind preset
├── tailwind.config.js      # (backward compat)
├── tokens.css              # (backward compat)
├── globals.css             # ← full semantic tokens + components
├── preview.html
├── tollerud-avatar.svg
├── components/
│   ├── index.ts
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── StatusDot.tsx
│   ├── Input.tsx
│   ├── CodeBlock.tsx
│   ├── StatCard.tsx
│   └── Container.tsx
├── examples/
│   └── nextjs/
│       └── tailwind.config.ts
└── components.css
```
