import Link from 'next/link'

export default function FoundationsPage() {
  return (
    <div className="docs-content">
      <h1 className="text-2xl font-bold text-tia-foreground mb-6">Foundations</h1>
      <p>
        Tia Noir is built on a set of visual foundations that define its character: noir base, acid-yellow signal, 
        and a restrained, technical aesthetic.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        <Link href="/foundations/color" className="block p-4 rounded-lg border border-tia-border/40 bg-tia-surface-raised hover:border-tia-yellow/30 transition-colors">
          <span className="block text-sm font-semibold text-tia-foreground">Color</span>
          <span className="block text-xs text-tia-text-muted mt-1">Tokens, palette, and semantic roles</span>
        </Link>
        <Link href="/foundations/typography" className="block p-4 rounded-lg border border-tia-border/40 bg-tia-surface-raised hover:border-tia-yellow/30 transition-colors">
          <span className="block text-sm font-semibold text-tia-foreground">Typography</span>
          <span className="block text-xs text-tia-text-muted mt-1">Fonts, sizes, and hierarchy</span>
        </Link>
        <Link href="/foundations/motion" className="block p-4 rounded-lg border border-tia-border/40 bg-tia-surface-raised hover:border-tia-yellow/30 transition-colors">
          <span className="block text-sm font-semibold text-tia-foreground">Motion</span>
          <span className="block text-xs text-tia-text-muted mt-1">Animation tokens, durations, and easing</span>
        </Link>
        <Link href="/foundations/accessibility" className="block p-4 rounded-lg border border-tia-border/40 bg-tia-surface-raised hover:border-tia-yellow/30 transition-colors">
          <span className="block text-sm font-semibold text-tia-foreground">Accessibility</span>
          <span className="block text-xs text-tia-text-muted mt-1">Contrast, focus, and reduced motion</span>
        </Link>
      </div>
    </div>
  )
}