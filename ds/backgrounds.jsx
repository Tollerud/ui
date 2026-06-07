/* Tollerud DS — Background treatments ported from tollerud.no.
   → window.Squares, window.GrainGradient, window.PageBackgrounds */

/* ───────────────────────────────────────────────────────────────
   Squares — faithful port of the animated canvas grid on tollerud.no.
   Scrolls in a direction, fills the hovered cell, and fades to the
   base color at the edges with a radial vignette.
   ─────────────────────────────────────────────────────────────── */
function Squares({ direction = 'diagonal', speed = 0.5, borderColor = '#333', squareSize = 40, hoverFillColor = '#222', base = '#060606', className = '', style }) {
  const canvasRef = useRef(null);
  const reqRef = useRef();
  const offset = useRef({ x: 0, y: 0 });
  const hovered = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.style.background = base;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width; canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const startX = Math.floor(offset.current.x / squareSize) * squareSize;
      const startY = Math.floor(offset.current.y / squareSize) * squareSize;
      ctx.lineWidth = 0.5;
      for (let x = startX; x < w + squareSize; x += squareSize) {
        for (let y = startY; y < h + squareSize; y += squareSize) {
          const sx = x - (offset.current.x % squareSize);
          const sy = y - (offset.current.y % squareSize);
          if (hovered.current &&
              Math.floor((x - startX) / squareSize) === hovered.current.x &&
              Math.floor((y - startY) / squareSize) === hovered.current.y) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(sx, sy, squareSize, squareSize);
          }
          ctx.strokeStyle = borderColor;
          ctx.strokeRect(sx, sy, squareSize, squareSize);
        }
      }
      // radial vignette fading to base at the edges
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.sqrt(w * w + h * h) / 2);
      const rgb = base.replace('#', '');
      const r = parseInt(rgb.slice(0, 2), 16), gg = parseInt(rgb.slice(2, 4), 16), b = parseInt(rgb.slice(4, 6), 16);
      g.addColorStop(0, `rgba(${r},${gg},${b},0)`);
      g.addColorStop(1, base);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const tick = () => {
      const s = Math.max(speed, 0.1);
      if (direction === 'right')   offset.current.x = (offset.current.x - s + squareSize) % squareSize;
      if (direction === 'left')    offset.current.x = (offset.current.x + s + squareSize) % squareSize;
      if (direction === 'up')      offset.current.y = (offset.current.y + s + squareSize) % squareSize;
      if (direction === 'down')    offset.current.y = (offset.current.y - s + squareSize) % squareSize;
      if (direction === 'diagonal') {
        offset.current.x = (offset.current.x - s + squareSize) % squareSize;
        offset.current.y = (offset.current.y - s + squareSize) % squareSize;
      }
      draw();
      reqRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const startX = Math.floor(offset.current.x / squareSize) * squareSize;
      const startY = Math.floor(offset.current.y / squareSize) * squareSize;
      hovered.current = {
        x: Math.floor((mx + offset.current.x - startX) / squareSize),
        y: Math.floor((my + offset.current.y - startY) / squareSize),
      };
    };
    const onLeave = () => { hovered.current = null; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    reqRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize, base]);

  return <canvas ref={canvasRef} className={`tollerud-squares ${className}`} style={style}/>;
}

/* ───────────────────────────────────────────────────────────────
   GrainGradient — CSS fallback for the tollerud-landing GradientBackground.
   It mirrors the same black backplate, yellow color ramp, no-noise default,
   and strongest top-right / bottom-left / top-left corner pools.
   ─────────────────────────────────────────────────────────────── */
function GrainGradient({ colors = ['hsl(54, 85%, 66%)', 'hsl(56, 100%, 80%)', 'hsl(56, 100%, 50%)'], intensity = 0.45, grain = false, animate = true, className = '', style }) {
  const [c1, c2, c3] = colors;
  const a = intensity;
  return (
    <div className={`tollerud-grain-gradient ${animate ? 'is-animated' : ''} ${className}`} style={style} aria-hidden="true">
      <div className="tollerud-grain-gradient__field" style={{
        background:
          `radial-gradient(70% 75% at 100% 0%, ${c2} 0%, transparent 70%),` +
          `radial-gradient(80% 85% at 0% 100%, ${c3} 0%, transparent 72%),` +
          `radial-gradient(60% 65% at 0% 0%, ${c1} 0%, transparent 68%)`,
        opacity: a,
      }}/>
      {grain && <div className="tollerud-grain-gradient__grain"/>}
    </div>
  );
}

/* ── docs page ── */
function BgFrame({ children, h = 260, label }) {
  return (
    <div style={{ position: 'relative', height: h, borderRadius: 'var(--radius-lg,0.5rem)', overflow: 'hidden', border: '1px solid var(--border)', background: '#060606' }}>
      {children}
      {label && <span style={{ position: 'absolute', bottom: 12, left: 14, zIndex: 3, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'rgba(245,245,245,0.6)' }}>{label}</span>}
    </div>
  );
}

function GradientReadabilityDemo({ treatment }) {
  const isShadow = treatment === 'shadow';
  const isEdge = treatment === 'edge';
  const isHeroBlur = treatment === 'heroBlur';
  const label = isEdge ? 'edge-biased shader' : isHeroBlur ? 'full hero blur' : isShadow ? 'left shadow gradient' : 'copy blur scrim';
  return (
    <BgFrame label={label} h={420}>
      {isEdge ? (
        <>
          <GrainGradientGL scale={0.58} offsetX={0.34} intensity={0.36}/>
          <GrainGradientGL scale={0.58} offsetX={-0.34} intensity={0.26} speed={0.7}/>
        </>
      ) : (
        <GrainGradientGL/>
      )}
      {isShadow && <div className="ds-hero-readable-shadow"/>}
      {isHeroBlur && <div className="ds-hero-readable-fullblur"/>}
      <div className="tollerud-grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.25, zIndex: 1 }}/>
      <div className="ds-hero-readable-demo">
        <div className={isShadow || isEdge || isHeroBlur ? 'ds-hero-readable-copy' : 'ds-hero-readable-copy ds-hero__copy--scrim'}>
          <div className="ds-row" style={{ gap: 10, marginBottom: 18 }}>
            <span className="tollerud-pill tollerud-pill--outline">v1.0 · noir + yellow</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(245,245,245,0.58)' }}>>60 components</span>
          </div>
          <h3 style={{ fontSize: 'clamp(30px, 5vw, 46px)', lineHeight: 0.98, letterSpacing: '-0.045em', color: '#F5F5F5', fontWeight: 600 }}>
            Dark. Monochrome.<br/><span className="ds-shimmer">Yellow where it counts.</span>
          </h3>
          <p style={{ marginTop: 16, maxWidth: 430, color: 'rgba(245,245,245,0.72)', fontSize: 15.5, lineHeight: 1.55 }}>
            {isEdge
              ? 'The shader is scaled down and shifted toward both edges, leaving calmer negative space behind the text.'
              : isHeroBlur
                ? 'The whole hero gets a soft dark glass layer, so the copy reads without creating a separate text panel.'
              : 'The real Paper shader stays visible, while the copy keeps enough contrast to survive bright motion behind it.'}
          </p>
          <div className="ds-row" style={{ gap: 12, marginTop: 22 }}>
            <button className="tollerud-btn tollerud-btn--terminal tollerud-btn--md">explore_system</button>
            <button className="tollerud-btn tollerud-btn--secondary tollerud-btn--md" style={{ color: '#F5F5F5', borderColor: 'rgba(245,245,245,0.2)' }}>Components</button>
          </div>
        </div>
      </div>
    </BgFrame>
  );
}

function PageBackgrounds() {
  return (
    <div>
      <PageHeader icon="layers" eyebrow="Backgrounds · ported from tollerud.no" title="Backgrounds"
        lede="The two atmospheres that power the live site, lifted into the system as drop-in components. Move your cursor over the grid — it lights the cell beneath it."/>

      <Section title="Grain gradient · live shader" desc="A WebGL replica of the tollerud-landing GradientBackground: @paper-design 'corners' GrainGradient, black backplate, three yellow blooms, softness 0.76, intensity 0.45, speed 1 and no shader noise.">
        <BgFrame label="GrainGradientGL · shape: corners · animated" h={300}>
          <GrainGradientGL/>
        </BgFrame>
        <div style={{ marginTop: 16 }}>
          <CodeSnippet name="grain-gradient-gl.jsx" code={`<div className="relative">
  <GrainGradientGL
    colors={['hsl(54,85%,66%)', 'hsl(56,100%,80%)', 'hsl(56,100%,50%)']}
    colorBack="hsl(0,0%,0%)"
    softness={0.76}
    intensity={0.45}
    grain={0}
    shape="corners"
    offsetX={0}
    offsetY={0}
    scale={1}
    rotation={0}
    speed={1}
  />
  <div className="relative z-20">{children}</div>
</div>`}/>
        </div>
      </Section>

      <Section title="Grain gradient · CSS fallback" desc="A pure-CSS approximation using the same yellow ramp and corner composition for when WebGL is unavailable or you want a static, zero-cost atmosphere. GrainGradientGL falls back to this automatically.">
        <BgFrame label="GrainGradient · CSS only">
          <GrainGradient/>
        </BgFrame>
      </Section>

      <Section title="Hero readability treatments" desc="Four ways to keep copy readable over the live grain gradient: a local blur scrim, a full-hero blur, a broad left-side shadow, or a scaled/offset shader that keeps motion toward the edges.">
        <div style={{ display: 'grid', gap: 16 }}>
          <GradientReadabilityDemo treatment="scrim"/>
          <GradientReadabilityDemo treatment="heroBlur"/>
          <GradientReadabilityDemo treatment="shadow"/>
          <GradientReadabilityDemo treatment="edge"/>
        </div>
      </Section>

      <Section title="Animated grid" desc="A scrolling canvas grid that fades to #060606 at the edges and fills the square under the cursor. Direction, speed, cell size and colors are all props.">
        <div className="ds-grid-2">
          <BgFrame label="direction: diagonal · #333 borders">
            <Squares direction="diagonal" speed={0.5} borderColor="#333" hoverFillColor="#222"/>
          </BgFrame>
          <BgFrame label="accent: yellow borders + glow fill">
            <Squares direction="up" speed={0.4} borderColor="rgba(232,213,0,0.22)" hoverFillColor="rgba(232,213,0,0.14)"/>
          </BgFrame>
        </div>
        <div style={{ marginTop: 16 }}>
          <CodeSnippet name="squares.jsx" code={`<Squares
  direction="diagonal"   // right | left | up | down | diagonal
  speed={0.5}
  squareSize={40}
  borderColor="#333"
  hoverFillColor="#222"
  base="#060606"
/>`}/>
        </div>
      </Section>

      <Section title="In use" desc="The grain gradient backs the Overview hero; the grid suits full-bleed section dividers and empty states. Both sit behind content at a lower z-index — keep foreground on z-20+.">
        <div className="tollerud-card ds-themed" style={{ position: 'relative', overflow: 'hidden', background: '#000', padding: 0 }}>
          <GrainGradient intensity={0.4}/>
          <div style={{ position: 'relative', zIndex: 20, padding: '40px 36px' }}>
            <span className="tollerud-pill tollerud-pill--outline">live atmosphere</span>
            <h3 className="tollerud-display" style={{ fontSize: 30, marginTop: 14, color: '#F5F5F5' }}>Run your stack like production.</h3>
            <div className="ds-row" style={{ gap: 12, marginTop: 20 }}>
              <button className="tollerud-btn tollerud-btn--terminal tollerud-btn--md">deploy --free</button>
              <button className="tollerud-btn tollerud-btn--secondary tollerud-btn--md" style={{ color: '#F5F5F5', borderColor: 'rgba(245,245,245,0.2)' }}>Read the docs</button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

Object.assign(window, { Squares, GrainGradient, PageBackgrounds });
