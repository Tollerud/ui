# Tollerud User Interface — Backgrounds

The background system is now a first-class Tollerud UI primitive, not just decoration.

## NoirGlowBackground

`NoirGlowBackground` ports the real Tollerud.no animated background from [`MathiasOki/tollerud-landing`](https://github.com/MathiasOki/tollerud-landing).

Source reference:

```tsx
<GrainGradient
  colorBack="hsl(0, 0%, 0%)"
  softness={0.76}
  intensity={0.45}
  noise={0}
  shape="corners"
  offsetX={0}
  offsetY={0}
  scale={1}
  rotation={0}
  speed={1}
  colors={["hsl(54, 85%, 66%)", "hsl(56, 100%, 80%)", "hsl(56, 100%, 50%)"]}
/>
```

Recommended `@tollerud/ui` usage:

```tsx
import { HeroBlock } from '@tollerud/ui'

export default function Hero() {
  return (
    <HeroBlock
      eyebrow="homelab control plane"
      title="Run your stack like production."
      description="Deploy, monitor, and roll back from one keyboard-first console."
      intense
    />
  )
}
```

Use `NoirGlowBackground` directly only for custom background composition that cannot be represented by an exported block yet. Prefer adding repeated branded layout to `@tollerud/ui` rather than rebuilding it in every consumer app.

## Install dependency

The WebGL version uses Paper Design shaders:

```bash
npm install @paper-design/shaders-react
```

The component lazy-loads the shader and uses the CSS fallback while loading.

## Props

| Prop | Default | Notes |
|------|---------|-------|
| `shape` | `"corners"` | Matches Tollerud.no. Also supports `wave`, `dots`, `truchet`, `ripple`, `blob`, `sphere`. |
| `intensity` | `"medium"` | `subtle`, `medium`, `loud`. |
| `speed` | `"medium"` | `still`, `slow`, `medium`, `fast`. Use `slow` for hero sections. |
| `grain` | `"none"` | Shader noise amount: `none`, `soft`, `high`. CSS noise overlay is separate. |
| `softness` | `0.76` | Glow falloff. Lower = sharper. |
| `colors` | Tollerud yellow ramp | `hsl(54,85%,66%)`, `hsl(56,100%,80%)`, `hsl(56,100%,50%)`. |
| `preserveCenter` | `true` | Adds a vignette to keep content readable. |
| `noiseOverlay` | `true` | Adds SVG fractal-noise grain overlay. |
| `forceCssFallback` | `false` | Use for static previews/docs or when avoiding WebGL. |

## CSS fallback

`globals.css` and `tokens.css` both include these classes:

- `.tollerud-noir-glow-root`
- `.tollerud-noir-glow-bg`
- `.tollerud-noir-glow-vignette`
- `.tollerud-noir-noise`

Static HTML usage:

```css
.custom-noir-layer {
  position: absolute;
  inset: 0;
}
```

```html
<div class="tollerud-noir-glow-root custom-noir-layer">
  <div class="tollerud-noir-glow-bg"></div>
  <div class="tollerud-noir-glow-vignette"></div>
  <div class="tollerud-noir-noise"></div>
</div>
```

## Usage rules

Use it for:

- Landing-page heroes
- Empty states
- Command-menu backdrops
- “Agent running” or “Tia is thinking” moments
- Tollerud-branded campaign/intro screens

Do **not** use it behind dense tables/logs. For operational dashboards, use a toned-down static fallback or a grid background. The whole point is atmosphere without destroying readability. Fancy shader while debugging a failing backup? Cute, but no.

## Accessibility/performance

- Content must sit above it with `relative z-10`.
- Keep `preserveCenter` enabled for text-heavy heroes.
- Reduced-motion users get non-animated CSS via `prefers-reduced-motion`.
- The WebGL dependency is optional, but required for the real Tollerud.no look.
- Use `speed="slow"` for most branded pages. Fast background motion feels like a GPU benchmark screen saver, and we are better than that.
