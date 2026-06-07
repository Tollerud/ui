/* Tollerud DS — Blocks page: full-width composed page sections. → window.PageBlocks
   Block components (HeroBlock, FeatureCard, CTABand, PricingCard) live in
   ds/marketing.jsx and ds/components.jsx. */

function PageBlocks() {
  return (
    <div>
      <PageHeader icon="blocks" eyebrow="Blocks" title="Blocks"
        lede="Prebuilt, full-width page sections assembled from the primitives — a landing hero, feature grid, pricing table and closing CTA. Drop them in whole, or fork them as a starting point."/>

      <Section title="Hero block" desc="A drop-in landing hero on the noir glow background, built with the reusable <HeroBlock>. Terminal CTA, supporting copy, optional media slot. Pass `intense` for the live WebGL grain atmosphere.">
        <HeroBlock eyebrow="homelab control plane" title="Run your stack like production."
          description="Deploy, monitor and roll back from one keyboard-first console. No dashboards you have to babysit."
          actions={<>
            <button className="tollerud-btn tollerud-btn--terminal tollerud-btn--md">deploy --free</button>
            <button className="tollerud-btn tollerud-btn--secondary tollerud-btn--md" style={{ color: '#F5F5F5', borderColor: 'rgba(245,245,245,0.2)' }}>Read the docs</button>
          </>}/>
      </Section>

      <Section title="Feature grid" desc="Three-up <FeatureCard>s with iconography. Yellow icon chips, terse technical copy.">
        <div className="ds-grid-3">
          {[
            { icon: 'zap', t: 'Instant deploys', d: 'Push a compose file and watch it roll out with health checks and automatic rollback.' },
            { icon: 'shield', t: 'Secrets, sealed', d: 'Encrypted at rest, injected at runtime. Nothing sensitive ever lands in a log.' },
            { icon: 'activity', t: 'Live telemetry', d: 'CPU, memory and network streamed in real time with sane, quiet alerting.' },
          ].map((f, i) => <FeatureCard key={i} icon={f.icon} title={f.t} description={f.d}/>)}
        </div>
      </Section>

      <Section title="Pricing" desc="Three tiers built with the reusable <PricingCard>; the middle plan is marked with an accent border and ribbon.">
        <div className="ds-price-grid">
          {[
            { name: 'Hobby', price: '$0', note: 'For a single host', feats: ['1 server', 'Community support', 'Manual deploys'], cta: 'Choose Hobby', variant: 'secondary' },
            { name: 'Homelab', price: '$12', note: 'Per month', feats: ['Unlimited servers', 'Live telemetry', 'Auto rollback', 'Command palette'], cta: 'Start free trial', featured: true },
            { name: 'Fleet', price: '$49', note: 'Per month', feats: ['Everything in Homelab', 'Multi-site', 'Audit log', 'Priority support'], cta: 'Choose Fleet', variant: 'secondary' },
          ].map((p, i) => (
            <PricingCard key={i} name={p.name} price={p.price} period={p.price === '$0' ? '' : '/mo'}
              priceNote={p.note} features={p.feats} recommended={p.featured} ribbon="Popular"
              cta={p.cta} ctaVariant={p.featured ? 'primary' : p.variant}/>
          ))}
        </div>
      </Section>

      <Section title="CTA band" desc="A closing call-to-action with the accent gradient bar, built with the reusable <CTABand>.">
        <CTABand title="Ship your homelab like it matters."
          description="Free for one host. No card, no telemetry, no nonsense."
          actions={<>
            <Button variant="primary" size="lg">Get started</Button>
            <Button variant="terminal" size="lg">view_source</Button>
          </>}/>
      </Section>
    </div>
  );
}
window.PageBlocks = PageBlocks;
