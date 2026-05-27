export default function AccessibilityPage() {
  const rules = [
    { rule: 'Normal text contrast', standard: '4.5:1', status: '✅ Yellow on black passes' },
    { rule: 'Large text contrast', standard: '3:1', status: '✅ Yellow on black passes' },
    { rule: 'Visible focus ring', standard: '2px+', status: '✅ Yellow ring on interactive' },
    { rule: 'Color-only meaning', standard: 'Never', status: '✅ Status dots have labels' },
    { rule: 'Keyboard navigation', standard: 'All interactive', status: '✅ CommandMenu, Arrow key' },
    { rule: 'Touch targets', standard: '44px+', status: '✅ Button and Input ≥44px' },
    { rule: 'Reduced motion', standard: 'Respect', status: '✅ CSS media query' },
    { rule: 'Form errors', standard: 'role=alert', status: '⚠️ Add aria on error states' },
    { rule: 'Icon-only buttons', standard: 'aria-label', status: '⚠️ Document in components' },
  ]

  return (
    <div className="docs-content">
      <h1>Accessibility</h1>
      <p>Tollerud Design System is built with accessibility as a non-negotiable requirement. All interactive components must meet WCAG 2.1 AA at minimum.</p>

      <h2>Contract</h2>
      <table>
        <thead>
          <tr><th>Rule</th><th>Standard</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rules.map((r) => (
            <tr key={r.rule}>
              <td>{r.rule}</td>
              <td>{r.standard}</td>
              <td className={r.status.startsWith('✅') ? 'text-tollerud-success' : 'text-tollerud-amber'}>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Implementation Rules</h2>
      <ul>
        <li>All interactive elements get a visible yellow focus ring via <code>focus-visible:ring-2 focus-visible:ring-tollerud-yellow</code>.</li>
        <li>Icon-only buttons must have <code>aria-label</code> or <code>aria-labelledby</code>.</li>
        <li>Dialogs and overlays need keyboard trap + <code>Escape</code> to close (built into CommandMenu).</li>
        <li>Status is never conveyed by color alone — each status has a text label or <code>aria-label</code>.</li>
        <li>Dangerous/destructive actions require explicit confirmation copy (handled by ApprovalCard).</li>
        <li>Logs and tables maintain readable font sizes — never below 11px.</li>
        <li>Animation respects <code>prefers-reduced-motion: reduce</code> — static backgrounds, no pulsing.</li>
        <li>Form errors use <code>role=&quot;alert&quot;</code> and <code>aria-describedby</code> linking to inputs.</li>
      </ul>

      <h2>Focus Ring Class</h2>
      <pre><code>{`/* Tailwind — apply to all interactive elements */
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-tollerud-yellow
focus-visible:ring-offset-2
focus-visible:ring-offset-tollerud-ink`}</code></pre>

      <h2>Reduced Motion Setup</h2>
      <pre><code>{`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`}</code></pre>
    </div>
  )
}