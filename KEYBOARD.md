# Tia Noir — Keyboard Contract

Command-first interaction is a core Tia Noir principle. This document defines the keyboard contracts across all Tia components and interfaces.

## Global shortcuts

These work **everywhere** in a Tia-powered app.

| Shortcut | Action | Component |
|----------|--------|-----------|
| `⌘K` / `Ctrl+K` | Open/close command palette | `CommandMenu` |
| `/` | Focus search / log filter | `CommandInput`, `LogSearch` |
| `?` | Show keyboard shortcuts | `ShortcutSheet` |
| `Esc` | Close overlay / cancel | `CommandMenu`, `Dialog`, `Sheet` |
| `Enter` | Confirm / select | `CommandMenu`, `ActionRow` |
| `⌘Enter` / `Ctrl+Enter` | Secondary action / open details | `CommandMenu`, `ActionRow` |

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

## Implementation rules

1. **Every overlay must close on `Esc`.** If it doesn't, it's a bug.
2. **Do not override browser defaults without reason.** Tab and Shift+Tab are sacred.
3. **Focus management matters.** When a modal opens, focus moves to primary action. When it closes, focus returns to the trigger.
4. **Shortcut badges** should appear on command items, sidebars, and action rows to teach users over time.
5. **Don't hide critical actions behind keyboard shortcuts.** Always offer a visible trigger too.

## Accessibility

- All keyboard-triggerable components have visible (not just `:focus-visible`) focus rings using `--ring` (#E8D500).
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