# Tollerud User Interface — Keyboard Contract

Command-first interaction is a core Tollerud UI principle. This document defines the keyboard contracts across all Tia components and interfaces.

## Global shortcuts

These work **everywhere** in an app built with `@tollerud/ui`.

| Shortcut | Action | Component |
|----------|--------|-----------|
| `⌘K` / `Ctrl+K` | Open/close command palette | `CommandMenu` |
| `/` | Focus search / log filter | `LogViewer` (search), app-level search inputs |
| `?` | Show keyboard shortcuts | App-level shortcut overlay (build with `Dialog`/`Sheet` + `Kbd`) |
| `Esc` | Close overlay / cancel | `CommandMenu`, `Dialog`, `Sheet` |
| `Enter` | Confirm / select | `CommandMenu`, `ActionRow` |
| `⌘Enter` / `Ctrl+Enter` | Secondary action / open details | `CommandMenu`, `ActionRow` |

> Note: `CommandInput`, `LogSearch`, and `ShortcutSheet` are conceptual roles, not exported `@tollerud/ui` component names — `CommandMenu` and `LogViewer` ship with this behavior built in; build a shortcut-help overlay yourself from `Dialog`/`Sheet` + `Kbd`. See [SKILL.md](SKILL.md) for the verified export list.

## Command menu navigation

When `CommandMenu` is open:

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate between items |
| `Enter` | Execute selected item |
| `Esc` | Close menu |
| Type | Filter items by label/description |
| `Backspace` (on empty) | Clear filter |

## Component keyboard contracts

### Kbd

The `Kbd` component displays a keyboard shortcut chip. It accepts any string or string array:

```tsx
<Kbd keys="⌘K" />
<Kbd keys={["⌘", "⇧", "S"]} />
<Kbd keys="Esc" size="sm" />
```

### ActionRow

`ActionRow` is a button with keyboard-triggered selection. It accepts `onSelect` and is compatible with `CommandMenu`'s keyboard navigation cycle.

### CommandMenu

- Built-in global `⌘K` / `Ctrl+K` listener
- Arrow key navigation with visual highlight
- `Enter` executes, `Esc` closes
- Search filters across all groups
- Auto-focus on open
- Body scroll lock while open
- Click outside to close
- Hover follows keyboard selection

### Charts (TimeSeriesChart ≥ 4.8.42; AreaChart & Sparkline ≥ 4.8.43; BarChart & Donut ≥ 4.8.44 — all with `interactive`)

Interactive charts share one keyboard contract. Single-SVG charts (TimeSeriesChart, AreaChart, Sparkline) keep focus on the SVG and announce via a live region (`lib/chart-interaction.tsx`); BarChart bars and Donut legend rows are individually focusable with a roving tabindex, so their aria-labels are announced natively on focus. Donut also accepts ↑/↓ (vertical list):

- `Tab` focuses the chart — the latest point becomes active (crosshair + tooltip shown, yellow focus ring)
- `←` / `→` step one point back/forward
- `Home` / `End` jump to the first/last point
- `Esc` clears the active point — consumed only while a point is active, so a surrounding Dialog stays open
- Keyboard-selected points are announced via a visually-hidden `aria-live="polite"` region ("1 Mar 2026: 42")
- Clicking the chart does not steal a keyboard selection: focus gained from a pointer press skips the focus-selects-latest behavior
- Line/area charts also render a visually-hidden data table (`srTable`, ≥ 4.8.45) so screen-reader users can browse every point's value, not just hear the live-region announcements
- Multi-series `TimeSeriesChart` (`series` prop, ≥ 4.8.46): the same crosshair spans all series; the stacked tooltip, live-region announcement, and SR table cover every series at the active point

## Implementation rules

1. **Every overlay must close on `Esc`.** If it doesn't, it's a bug.
2. **Do not override browser defaults without reason.** Tab and Shift+Tab are sacred.
3. **Focus management matters.** When a modal opens, focus moves to primary action. When it closes, focus returns to the trigger.
4. **Shortcut badges** should appear on command items, sidebars, and action rows to teach users over time.
5. **Don't hide critical actions behind keyboard shortcuts.** Always offer a visible trigger too.

## Accessibility

- All keyboard-triggerable components have visible (not just `:focus-visible`) focus rings using `--ring` (`#FFFF00` / `tollerud-yellow`).
- `prefers-reduced-motion` disables the command menu entrance animation.
- Screen readers receive `aria-selected` and `aria-label` on command items.
- The overlay uses `aria-hidden="true"` to hide background content.
- The menu uses `role="listbox"` with `aria-label="Command palette"`.

## Inspiration

This model is inspired by:

- **Raycast** — command palette + shortcut badges + search-first navigation
- **Linear** — distraction-free keyboard-first issue tracking
- **VSCode** — command palette with fuzzy search
- **shadcn/ui Command** — accessible command menu primitives