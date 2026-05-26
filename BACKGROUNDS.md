# Tia Noir — Backgrounds

The background system is now a first-class Tia Noir primitive, not just decoration.

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

Tia version:

```tsx
import { NoirGlowBackground } from '@/components/ui'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      <NoirGlowBackground
        intensity="medium"
        speed="slow"
        grain="soft"
        shape="corners"
        preserveCenter
      />

      <div className="relative z-10">
        {/* page content */}
      </div>
    </section>
  )
}
```

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

- `.tia-noir-glow-root`
- `.tia-noir-glow-bg`
- `.tia-noir-glow-vignette`
- `.tia-noir-noise`

Static HTML usage:

```html
<div class="tia-noir-glow-root" style="position:absolute;inset:0">
  <div class="tia-noir-glow-bg"></div>
  <div class="tia-noir-glow-vignette"></div>
  <div class="tia-noir-noise"></div>
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
