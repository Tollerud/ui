export default function ColorPage() {
  const swatches = [
    { name: 'Acid Yellow', hex: '#FFFF00', token: '--tollerud-acid', role: 'High-voltage signal, Tollerud glow' },
    { name: 'Signal Yellow', hex: '#E8D500', token: '--tollerud-yellow', role: 'Primary actions, links' },
    { name: 'Amber', hex: '#FFB800', token: '--tollerud-amber', role: 'Warmth, secondary highlights' },
    { name: 'Black', hex: '#0A0A0A', token: '--tollerud-ink', role: 'Default background' },
    { name: 'Void', hex: '#050505', token: '--tollerud-void', role: 'Deepest background' },
    { name: 'White', hex: '#F5F5F5', token: '--tollerud-bone', role: 'Primary text on dark' },
  ]

  const semantic = [
    { name: 'Background', token: '--background', value: 'var(--tollerud-ink)' },
    { name: 'Foreground', token: '--foreground', value: 'var(--tollerud-bone)' },
    { name: 'Card', token: '--card', value: 'var(--tollerud-panel)' },
    { name: 'Border', token: '--border', value: 'rgba(245,245,245,0.10)' },
    { name: 'Ring', token: '--ring', value: 'var(--tollerud-yellow)' },
    { name: 'Destructive', token: '--destructive', value: '#EF4444' },
  ]

  return (
    <div className="docs-content">
      <h1>Color</h1>
      <p>Tollerud Design System uses a restrained palette: black, white, yellow, and amber. The signature acid yellow (`#FFFF00`) is reserved for high-voltage interactions and Tollerud glow.</p>

      <h2>Brand Palette</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        {swatches.map((s) => (
          <div key={s.name} className="p-4 rounded-lg border border-tollerud-border/40 bg-tollerud-surface-raised">
            <div className="h-12 rounded-md mb-3" style={{ backgroundColor: s.hex }} />
            <span className="block text-sm font-semibold text-tollerud-foreground">{s.name}</span>
            <span className="block text-xs text-tollerud-text-muted font-mono">{s.hex} / {s.token}</span>
            <span className="block text-[11px] text-tollerud-text-secondary mt-1">{s.role}</span>
          </div>
        ))}
      </div>

      <h2>Semantic Tokens</h2>
      <table>
        <thead>
          <tr><th>Token</th><th>Role</th><th>Value</th></tr>
        </thead>
        <tbody>
          {semantic.map((s) => (
            <tr key={s.name}>
              <td><code>{s.token}</code></td>
              <td>{s.name}</td>
              <td><code>{s.value}</code></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Usage</h2>
      <pre><code>{`/* Tailwind utility classes */
bg-tollerud-surface-raised
text-tollerud-foreground
border-tollerud-border
hover:border-tollerud-yellow

/* CSS custom properties directly */
background: var(--tollerud-noir-900);
color: var(--tollerud-yellow);`}</code></pre>
    </div>
  )
}