const entries = [
  { date: '2026-05-26', phase: 'Phase 4 — shadcn Registry', desc: 'components.json, registry.json, GETTING_STARTED.md' },
  { date: '2026-05-26', phase: 'Phase 5 — Docs App', desc: 'Next.js docs site at examples/docs-nextjs/ with Foundations, Components, Patterns, Brand, Changelog' },
  { date: '2026-05-26', phase: 'Phase 3 — Homelab Components', desc: '11 operational components for infrastructure management' },
  { date: '2026-05-26', phase: 'Phase 2 — Command-First Shell', desc: 'Kbd, ActionRow, CommandMenu, Keyboard contract' },
  { date: '2026-05-26', phase: 'Phase 1 — Signature Atmosphere', desc: 'NoirGlowBackground + CSS fallback' },
  { date: '2026-05-25', phase: 'v1.0 Release', desc: 'Tollerud Design System design system initial release with 8 components, preset, tokens, docs' },
]

export default function ChangelogPage() {
  return (
    <div className="docs-content">
      <h1>Changelog</h1>
      <p>Track changes to the Tollerud Design System design system over time.</p>

      <div className="mt-8">
        {entries.map((entry) => (
          <div key={entry.phase} className="flex gap-4 py-4 border-b border-tollerud-border/20 last:border-0">
            <div className="flex-shrink-0 w-24">
              <span className="text-xs text-tollerud-text-muted font-mono">{entry.date}</span>
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-tollerud-foreground">{entry.phase}</span>
              <p className="text-xs text-tollerud-text-secondary mt-1">{entry.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}