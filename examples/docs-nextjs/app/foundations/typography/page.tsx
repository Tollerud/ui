export default function TypographyPage() {
  return (
    <div className="docs-content">
      <h1>Typography</h1>
      <p>Tollerud Design System uses Inter for display and body text, and JetBrains Mono for code and terminal elements.</p>

      <h2>Font Stack</h2>
      <pre><code>{`/* Display / Body */
font-family: 'Inter', system-ui, sans-serif;

/* Monospace / Code */
font-family: 'JetBrains Mono', 'Fira Code', monospace;`}</code></pre>

      <h2>Display Headings</h2>
      <div className="space-y-4 my-4">
        <div>
          <span className="block text-xs text-tollerud-text-muted mb-1">Display Primary (70px)</span>
          <span className="tollerud-display text-[70px] leading-[0.95]">Dark. Monochrome.</span>
        </div>
        <div>
          <span className="block text-xs text-tollerud-text-muted mb-1">Display Secondary (40px)</span>
          <span className="tollerud-display--secondary text-[40px]">Yellow where it counts</span>
        </div>
        <div>
          <span className="block text-xs text-tollerud-text-muted mb-1">Display Tertiary (28px)</span>
          <span className="tollerud-display--tertiary text-[28px]">Subtle hierarchy</span>
        </div>
      </div>

      <h2>Body Text Sizes</h2>
      <table>
        <thead>
          <tr><th>Size</th><th>Class</th><th>Usage</th></tr>
        </thead>
        <tbody>
          <tr><td>11px</td><td><code>text-[11px]</code></td><td>Metadata, timestamps, tags</td></tr>
          <tr><td>12px (xs)</td><td><code>text-xs</code></td><td>Secondary info, descriptions</td></tr>
          <tr><td>13px (sm-adj)</td><td><code>text-sm</code></td><td>Body, card titles</td></tr>
          <tr><td>14px (sm)</td><td><code>text-sm</code></td><td>Default body</td></tr>
          <tr><td>16px (base)</td><td><code>text-base</code></td><td>Section headings</td></tr>
        </tbody>
      </table>

      <h2>Gradient Text</h2>
      <pre><code>{`<h2 class="bg-gradient-to-r from-tollerud-yellow via-tollerud-yellow-warm to-tollerud-amber bg-clip-text text-transparent">
  Yellow → Acid → Amber
</h2>`}</code></pre>
      <div className="bg-gradient-to-r from-tollerud-yellow via-tollerud-yellow-warm to-tollerud-amber bg-clip-text text-transparent text-xl font-bold mt-2">
        Yellow → Acid → Amber
      </div>
    </div>
  )
}