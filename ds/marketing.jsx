/* Tollerud DS — Marketing blocks. → window
   { HeroBlock, FeatureCard, CTABand } */

/* ── HeroBlock — landing hero on the noir glow background ── */
function HeroBlock({ eyebrow, title, description, actions, media, minHeight = 280, intense = false }) {
  const hasMedia = !!media;
  return (
    <div className="ds-mktcard ds-themed" style={{ position: 'relative', overflow: 'hidden', background: '#000', minHeight }}>
      {intense && typeof GrainGradientGL !== 'undefined'
        ? <GrainGradientGL/>
        : <div className="tollerud-noir-glow-bg" style={{ opacity: 0.5 }}/>}
      <div className="tollerud-grid-bg" style={{ position: 'absolute', inset: 0, opacity: intense ? 0.25 : 0.5 }}/>
      <div className="ds-hero__grid" style={{ position: 'relative', display: hasMedia ? 'grid' : 'block',
        gridTemplateColumns: hasMedia ? '1.4fr 1fr' : undefined, gap: 24, padding: '48px 44px', alignItems: 'center' }}>
        <div style={{ maxWidth: hasMedia ? undefined : 560 }}>
          {eyebrow && <span className="tollerud-pill tollerud-pill--outline">{eyebrow}</span>}
          <h2 className="tollerud-display" style={{ fontSize: 40, marginTop: eyebrow ? 18 : 0, color: '#F5F5F5' }}>{title}</h2>
          {description && <p style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.6, color: 'rgba(245,245,245,0.7)' }}>{description}</p>}
          {actions && <div className="ds-row" style={{ gap: 12, marginTop: 24 }}>{actions}</div>}
        </div>
        {hasMedia && <div className="ds-hero__media" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{media}</div>}
      </div>
    </div>
  );
}

/* ── FeatureCard — icon chip + title + copy ── */
function FeatureCard({ icon, title, description }) {
  const I = icon ? Icons[icon] : null;
  return (
    <div className="tollerud-card ds-themed">
      {I && <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 9, background: 'rgba(232,213,0,0.12)', color: 'var(--tollerud-yellow)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}><I size={20}/></span>}
      <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--foreground)', marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-secondary)', margin: 0 }}>{description}</p>
    </div>
  );
}

/* ── CTABand — closing call-to-action with accent bar ── */
function CTABand({ title, description, actions, accentBar = true }) {
  return (
    <div className="ds-mktcard ds-themed" style={{ textAlign: 'center', padding: '44px 32px', background: 'var(--card)' }}>
      <h2 className="tollerud-display" style={{ fontSize: 30 }}>{title}</h2>
      {description && <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 440, margin: '12px auto 0' }}>{description}</p>}
      {actions && <div className="ds-row" style={{ justifyContent: 'center', gap: 12, marginTop: 22 }}>{actions}</div>}
      {accentBar && <hr className="tollerud-accent-bar" style={{ margin: '32px auto 0', maxWidth: 320 }}/>}
    </div>
  );
}

Object.assign(window, { HeroBlock, FeatureCard, CTABand });
