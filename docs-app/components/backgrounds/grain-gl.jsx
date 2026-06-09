'use client'
import { useState, useEffect, useRef } from 'react'

/* Tollerud DS — GrainGradientGL
   Mounts the real @paper-design/shaders GrainGradient used by
   MathiasOki/tollerud-landing's app/components/ui/gradient-background.tsx.
   The static Pages docs are not bundled, so this component loads the vanilla
   shader package at runtime and falls back to CSS only if the import/WebGL path
   fails. → window.GrainGradientGL */

const PAPER_SHADERS_URL = '/docs/paper-shaders/index.js';
let paperShadersPromise = null;

function loadPaperShaders() {
  if (window.PaperShaders) {
    return Promise.resolve(window.PaperShaders);
  }
  if (!paperShadersPromise) {
    paperShadersPromise = Function('url', 'return import(url)')(PAPER_SHADERS_URL);
  }
  return paperShadersPromise;
}

function waitForImage(img) {
  if (!img || img.complete) return Promise.resolve(img);
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

function GrainGradientFallback({
  colors = ['hsl(54, 85%, 66%)', 'hsl(56, 100%, 80%)', 'hsl(56, 100%, 50%)'],
  intensity = 0.45,
  grain = false,
  className = '',
  style,
}) {
  const [c1, c2, c3] = colors;
  return (
    <div className={`tollerud-grain-gradient is-animated ${className}`} style={style} aria-hidden="true">
      <div className="tollerud-grain-gradient__field" style={{
        background:
          `radial-gradient(70% 75% at 100% 0%, ${c2} 0%, transparent 70%),` +
          `radial-gradient(80% 85% at 0% 100%, ${c3} 0%, transparent 72%),` +
          `radial-gradient(60% 65% at 0% 0%, ${c1} 0%, transparent 68%)`,
        opacity: Math.min(1, intensity + 0.3),
      }}/>
      {grain > 0 && <div className="tollerud-grain-gradient__grain"/>}
    </div>
  );
}

function GrainGradientGL({
  colors = ['hsl(54, 85%, 66%)', 'hsl(56, 100%, 80%)', 'hsl(56, 100%, 50%)'],
  colorBack = 'hsl(0, 0%, 0%)',
  softness = 0.76,
  intensity = 0.45,
  grain = 0,
  speed = 1,
  shape = 'corners',
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  rotation = 0,
  className = '',
  style,
}) {
  const ref = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let mount = null;
    let cancelled = false;

    async function init() {
      try {
        const paper = await loadPaperShaders();
        const noiseTexture = paper.getShaderNoiseTexture();
        await waitForImage(noiseTexture);
        if (cancelled || !ref.current) return;

        const uniforms = {
          u_colorBack: paper.getShaderColorFromString(colorBack),
          u_colors: colors.map(paper.getShaderColorFromString),
          u_colorsCount: colors.length,
          u_softness: softness,
          u_intensity: intensity,
          u_noise: grain,
          u_shape: paper.GrainGradientShapes[shape],
          u_noiseTexture: noiseTexture,
          u_fit: paper.ShaderFitOptions.contain,
          u_scale: scale,
          u_rotation: rotation,
          u_offsetX: offsetX,
          u_offsetY: offsetY,
          u_originX: 0.5,
          u_originY: 0.5,
          u_worldWidth: 0,
          u_worldHeight: 0,
        };

        mount = new paper.ShaderMount(
          ref.current,
          paper.grainGradientFragmentShader,
          uniforms,
          undefined,
          speed,
          0
        );
      } catch (error) {
        console.warn('Falling back from Paper GrainGradient shader', error);
        if (!cancelled) setFallback(true);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (mount) mount.dispose();
    };
  }, [colors.join('|'), colorBack, softness, intensity, grain, speed, shape, offsetX, offsetY, scale, rotation]);

  if (fallback) {
    return <GrainGradientFallback colors={colors} intensity={intensity} grain={grain} className={className} style={style}/>;
  }

  return (
    <div
      ref={ref}
      className={`tollerud-paper-grain ${className}`}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
    />
  );
}
export { GrainGradientGL };
