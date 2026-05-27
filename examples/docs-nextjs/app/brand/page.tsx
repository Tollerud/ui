export default function BrandPage() {
  return (
    <div className="docs-content">
      <h1>Brand Guide</h1>
      <p>Tollerud Design System has a distinct visual identity rooted in noir aesthetics, acid-yellow signal, and infrastructure-native design.</p>

      <h2>Tia Avatar</h2>
      <div className="flex gap-6 items-start my-6">
        <div className="w-24 h-24 rounded-lg bg-tollerud-noir-900 border border-tollerud-border/30 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src="/tollerud-avatar.svg" alt="Tia mascot" className="w-full h-full object-contain" />
        </div>
        <div>
          <p className="font-semibold text-tollerud-foreground">Brand Mascot</p>
          <p className="text-sm mt-1">Tia in a full cel-shaded monochrome gakuran with gold buttons, amber eyes, and a confident wave. The avatar should be used as a brand signature on landing pages, about sections, and loading states.</p>
          <p className="text-xs text-tollerud-text-muted mt-2">File: <code>tollerud-avatar.svg</code></p>
        </div>
      </div>

      <h2>Tollerud Monogram</h2>
      <div className="flex gap-6 items-start my-6">
        <div className="w-24 h-24 rounded-lg bg-tollerud-noir-900 border border-tollerud-border/30 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src="/tollerud-logo.svg" alt="Tollerud monogram" className="w-3/5 h-3/5 object-contain" />
        </div>
        <div>
          <p className="font-semibold text-tollerud-foreground">Tollerud Monogram</p>
          <p className="text-sm mt-1">The stylised <strong>T</strong> — a single, continuous path forming the Tollerud identity mark. Built for dark backgrounds with acid yellow (<code>#FFF200</code>) fill. No outlines, no gradients — pure signal.</p>
          <p className="text-xs text-tollerud-text-muted mt-2">Color: <code style={{ color: '#FFF200' }}>#FFF200</code> &middot; File: <code>tollerud-logo.svg</code> &middot; Aspect ratio: ~1:1.1</p>
        </div>
      </div>
      <div className="rounded-lg border border-tollerud-border/30 bg-tollerud-surface-raised p-4 mb-6">
        <h4 className="text-xs font-semibold text-tollerud-text-muted uppercase tracking-wider mb-3">Usage Guidelines</h4>
        <ul className="space-y-1.5">
          <li><strong>Minimum size</strong> — 20px width. Below that the stroke detail loses legibility.</li>
          <li><strong>Clear space</strong> — preserve at least one &quot;T&quot; width of padding on all sides.</li>
          <li><strong>Always on dark</strong> — the monogram is designed for black/noir surfaces. Never place on white or light backgrounds.</li>
          <li><strong>Single color</strong> — do not recolor the fill. Acid yellow is the only approved colour.</li>
          <li><strong>No modifications</strong> — do not stretch, rotate, outline, or add effects to the path.</li>
        </ul>
      </div>

      <h2>Voice</h2>
      <ul>
        <li><strong>Short, direct</strong> — Tia&apos;s commands are precise. No fluff.</li>
        <li><strong>Terminal CTAs</strong> — <code>❯ deploy</code>, <code>❯ open_dashboard</code>.</li>
        <li><strong>No corporate nonsense</strong> — Speak like an engineer, not a marketer.</li>
        <li><strong>Friendly but specific</strong> — Error messages say <em>what</em> and <em>where</em>.</li>
        <li><strong>Confirm destructive actions</strong> — Rollback plans, approval cards for critical actions.</li>
      </ul>

      <h2>Tollerud Glow</h2>
      <p>The signature Tollerud atmosphere uses a slow WebGL grain gradient with acid-yellow blooms on a black field. Use <code>NoirGlowBackground</code> for:</p>
      <ul>
        <li>Landing / hero pages</li>
        <li>Command palette backdrop</li>
        <li>Agent-running / processing moments</li>
      </ul>
      <p>Use the static CSS fallback (<code>.tollerud-noir-glow-bg</code>) for dashboards and performance-sensitive contexts.</p>

      <h2>Usage Rules</h2>
      <ul>
        <li>Yellow is for interaction — do not use it purely decoratively.</li>
        <li>Yellow on black only — yellow on white does not meet contrast.</li>
        <li>Acid yellow (<code>#FFFF00</code>) is reserved for Tollerud glow + peak interaction voltage.</li>
        <li>Single color pop — avoid multi-color palettes on a single page.</li>
        <li>The Tia avatar is a brand element, not a UI icon. Use sparingly.</li>
      </ul>
    </div>
  )
}