"use client"

import { lazy, Suspense, type CSSProperties } from "react"

const GrainGradient = lazy(() =>
  import("@paper-design/shaders-react").then((module) => ({
    default: module.GrainGradient,
  }))
)

type ShaderShape = "corners" | "wave" | "dots" | "truchet" | "ripple" | "blob" | "sphere"
type Intensity = "subtle" | "medium" | "loud"
type Speed = "still" | "slow" | "medium" | "fast"
type Grain = "none" | "soft" | "high"

export interface NoirGlowBackgroundProps {
  /** Extra class names for the outer positioning wrapper. */
  className?: string
  /** Inline style for the outer positioning wrapper. */
  style?: CSSProperties
  /** Canvas/WebGL shape. `corners` matches Tollerud.no. */
  shape?: ShaderShape
  /** Visual strength of the yellow glow. */
  intensity?: Intensity
  /** Ambient animation speed. */
  speed?: Speed
  /** Shader grain/noise amount. */
  grain?: Grain
  /** Softness/falloff of the glow blooms. */
  softness?: number
  /** Background color behind the glow. */
  colorBack?: string
  /** Glow colors. Defaults to the Tollerud/Tia yellow ramp. */
  colors?: string[]
  /** Whether to render a readable center vignette on top of the shader. */
  preserveCenter?: boolean
  /** Add the grain/noise CSS overlay. */
  noiseOverlay?: boolean
  /** Prefer the CSS fallback even if shaders are available. Useful for docs/static contexts. */
  forceCssFallback?: boolean
  /** Disable pointer events so content above remains clickable. */
  inert?: boolean
}

const intensityMap: Record<Intensity, number> = {
  subtle: 0.24,
  medium: 0.45,
  loud: 0.68,
}

const speedMap: Record<Speed, number> = {
  still: 0,
  slow: 0.45,
  medium: 1,
  fast: 1.8,
}

const grainMap: Record<Grain, number> = {
  none: 0,
  soft: 0.12,
  high: 0.28,
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function CssFallback({ preserveCenter = true, noiseOverlay = true }: Pick<NoirGlowBackgroundProps, "preserveCenter" | "noiseOverlay">) {
  return (
    <>
      <div className="tollerud-noir-glow-bg" aria-hidden="true" />
      {preserveCenter && <div className="tollerud-noir-glow-vignette" aria-hidden="true" />}
      {noiseOverlay && <div className="tollerud-noir-noise" aria-hidden="true" />}
    </>
  )
}

/**
 * NoirGlowBackground
 *
 * Tia/Tollerud signature background primitive. The defaults replicate
 * MathiasOki/tollerud-landing's `GradientBackground` component.
 *
 * Install dependency in consuming Next.js apps:
 *   npm install @paper-design/shaders-react
 *
 * The CSS fallback classes live in `globals.css` and are used during Suspense,
 * reduced-motion contexts, or when `forceCssFallback` is true.
 */
export function NoirGlowBackground({
  className,
  style,
  shape = "corners",
  intensity = "medium",
  speed = "medium",
  grain = "none",
  softness = 0.76,
  colorBack = "hsl(0, 0%, 0%)",
  colors = ["hsl(54, 85%, 66%)", "hsl(56, 100%, 80%)", "hsl(56, 100%, 50%)"],
  preserveCenter = false,
  noiseOverlay = false,
  forceCssFallback = false,
  inert = true,
}: NoirGlowBackgroundProps) {
  const wrapperClassName = cx(
    "tollerud-noir-glow-root absolute inset-0 z-0 overflow-hidden",
    inert && "pointer-events-none",
    className
  )

  if (forceCssFallback) {
    return (
      <div className={wrapperClassName} style={style} aria-hidden="true">
        <CssFallback preserveCenter={preserveCenter} noiseOverlay={noiseOverlay} />
      </div>
    )
  }

  return (
    <div className={wrapperClassName} style={style} aria-hidden="true">
      <Suspense fallback={<CssFallback preserveCenter={preserveCenter} noiseOverlay={noiseOverlay} />}>
        <GrainGradient
          style={{ height: "100%", width: "100%" }}
          colorBack={colorBack}
          softness={softness}
          intensity={intensityMap[intensity]}
          noise={grainMap[grain]}
          shape={shape}
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={speedMap[speed]}
          colors={colors}
        />
      </Suspense>
      {preserveCenter && <div className="tollerud-noir-glow-vignette" aria-hidden="true" />}
      {noiseOverlay && <div className="tollerud-noir-noise" aria-hidden="true" />}
    </div>
  )
}
