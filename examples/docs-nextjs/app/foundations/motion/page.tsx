export default function MotionPage() {
  const tokens = [
    { name: '--motion-duration-instant', value: '80ms', usage: 'Micro-interactions, button press' },
    { name: '--motion-duration-fast', value: '150ms', usage: 'Hover, focus, state change' },
    { name: '--motion-duration-normal', value: '240ms', usage: 'Panel open, transition' },
    { name: '--motion-duration-slow', value: '420ms', usage: 'Modal, drawer overlay' },
    { name: '--motion-ease-standard', value: 'cubic-bezier(.2,0,0,1)', usage: 'Default easing' },
    { name: '--motion-ease-emphasized', value: 'cubic-bezier(.16,1,.3,1)', usage: 'Entrance, emphasis' },
  ]

  const keyframes = [
    { name: 'tia-timeline-pulse', usage: 'Active timeline dot' },
    { name: 'tia-signal-pulse', usage: 'Active agent/command' },
    { name: 'tia-glow-drift', usage: 'Slow ambient background' },
    { name: 'tia-reveal-up', usage: 'Panel/card entrance' },
  ]

  return (
    <div className="docs-content">
      <h1>Motion</h1>
      <p>Tia motion is designed to feel like instrumentation — fast, purposeful, never decorative. Animations use transform and opacity only.</p>

      <h2>Duration Tokens</h2>
      <table>
        <thead>
          <tr><th>Token</th><th>Value</th><th>Usage</th></tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.name}>
              <td><code>{t.name}</code></td>
              <td>{t.value}</td>
              <td>{t.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Keyframe Animations</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Usage</th></tr>
        </thead>
        <tbody>
          {keyframes.map((k) => (
            <tr key={k.name}>
              <td><code>{k.name}</code></td>
              <td>{k.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Rules</h2>
      <ul>
        <li>Use <code>transform</code> and <code>opacity</code> only — GPU-composited, no layout thrash.</li>
        <li>Keep micro-interactions at 80–150ms.</li>
        <li>Keep panel transitions at 180–260ms.</li>
        <li>Background ambient motion at slow pace (20–60s loops).</li>
        <li>Respect <code>prefers-reduced-motion</code> — static background, no shimmer.</li>
        <li>Animation must never block input.</li>
      </ul>

      <h2>CSS Variables</h2>
      <pre><code>{`:root {
  --motion-duration-instant: 80ms;
  --motion-duration-fast: 150ms;
  --motion-duration-normal: 240ms;
  --motion-duration-slow: 420ms;
  --motion-ease-standard: cubic-bezier(.2,0,0,1);
  --motion-ease-emphasized: cubic-bezier(.16,1,.3,1);
}`}</code></pre>

      <h2>Reduced Motion</h2>
      <pre><code>{`/* In your globals.css */
@media (prefers-reduced-motion: reduce) {
  .tia-timeline__dot--active { animation: none; }
  .tia-cmd__overlay { transition-duration: 0s; }
}`}</code></pre>
    </div>
  )
}