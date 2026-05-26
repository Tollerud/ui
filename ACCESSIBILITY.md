# Tia Noir — Accessibility Guidelines

## Color Contrast

| Token Pair | Ratio | Pass |
|-----------|-------|------|
| `#E8D500` (yellow) on `#0A0A0A` (bg) | ~12.5:1 | ✅ AAA |
| `#F5F5F5` (text) on `#0A0A0A` (bg) | ~20:1 | ✅ AAA |
| `#AAAAAA` (secondary) on `#0A0A0A` | ~12:1 | ✅ AAA |
| `#666666` (muted) on `#0A0A0A` | ~6.5:1 | ✅ AA |
| `#333333` (border) on `#0A0A0A` | ~2.5:1 | ❌ (decorative only) |
| `#E8D500` on `#F5F5F5` (inverse) | ~1.7:1 | ❌ never use yellow on white |

Border colors are decorative and exempt from contrast requirements. Never put yellow text on white backgrounds.

## Focus & Keyboard

- Every interactive element must have a visible focus ring
- Focus ring: 2px solid `#E8D500` offset 2px
- Tab order must match visual order
- No keyboard traps
- Skiplink pattern for layouts with navigation

## Touch Targets

- Interactive targets ≥ 44×44px on touch devices
- Minimum 8px gap between touch targets
- `touch-action: manipulation` on tap targets

## Screen Readers

- Icon-only buttons must have `aria-label`
- Form inputs must have `<label>` with `for` attribute
- Error messages must use `role="alert"` or `aria-live="polite"`
- Don't convey info by color alone (use icons/labels/text)
- Headings must follow a logical h1→h6 hierarchy
- Alt text on meaningful images, `alt=""` on decorative

## Reduced Motion

- Respect `prefers-reduced-motion: reduce`
- All animations should be disabled or replaced with instant transitions
- Skeleton shimmer should be replaced with static placeholder
- Glow should be interactive feedback, not persistent decoration

## Implementation

```tsx
// Focus ring — use the utility class
<button className="tia-focus-ring">Action</button>

// Tailwind
<button className="focus-visible:outline-2 focus-visible:outline-tia-yellow focus-visible:outline-offset-2">
  Action
</button>
```