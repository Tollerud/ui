import Link from 'next/link'

const sections = [
  { href: '/getting-started', label: 'Getting Started', desc: 'Install, font setup, conventions, and a basic example' },
  { href: '/foundations', label: 'Foundations', desc: 'Color, typography, motion, and accessibility rules' },
  { href: '/components', label: 'Components', desc: '29 React components for infrastructure UI' },
  { href: '/patterns', label: 'Patterns', desc: 'Dashboard, approval flow, and more' },
  { href: '/brand', label: 'Brand', desc: 'Tia avatar, voice, and Tollerud glow' },
  { href: '/changelog', label: 'Changelog', desc: 'What changed and when' },
]

export default function DocsHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-tia-foreground mb-2">Tollerud Design System</h1>
      <p className="text-sm text-tia-text-secondary mb-8 max-w-xl">
        A dark, cinematic, keyboard-first infrastructure design system with acid-yellow signal color.
        Tia Noir is the internal codename — built for Tia, the Tollerud Infrastructure Assistant.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block p-4 rounded-lg border border-tia-border/40 bg-tia-surface-raised hover:border-tia-yellow/30 transition-colors group"
          >
            <span className="block text-sm font-semibold text-tia-foreground group-hover:text-tia-yellow transition-colors">{s.label}</span>
            <span className="block text-xs text-tia-text-muted mt-1">{s.desc}</span>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-tia-foreground mb-4">Quick Start</h2>
      <p className="text-sm text-tia-text-secondary mb-4">
        Head over to the <Link href="/getting-started" className="text-tia-yellow hover:underline">Getting Started</Link> guide for install
        instructions, font setup, conventions, and a basic example.
      </p>

      <h2 className="text-lg font-semibold text-tia-foreground mb-4 mt-10">Design Principles</h2>
      <ul className="docs-content space-y-2">
        <li><strong className="text-tia-foreground">Dark-first</strong> — Design starts in the dark. Light mode is secondary.</li>
        <li><strong className="text-tia-foreground">Yellow is the signal</strong> — If it&apos;s yellow, you can click it.</li>
        <li><strong className="text-tia-foreground">One color pop</strong> — Yellow carries the weight. State colors are muted.</li>
        <li><strong className="text-tia-foreground">Sharp when it counts</strong> — Subtle radius, sharp corners for noir feel.</li>
        <li><strong className="text-tia-foreground">Glow with purpose</strong> — Yellow glow on hover/active only. Never decorative.</li>
        <li><strong className="text-tia-foreground">Terminal aesthetic</strong> — Monospace CTAs with `❯` prefix, code-like UI patterns.</li>
      </ul>
    </div>
  )
}