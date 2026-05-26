'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const nav: Array<{ label: string; links: Array<{ href: string; label: string }> }> = [
  {
    label: 'Getting Started',
    links: [
      { href: '/getting-started', label: 'Guide' },
    ],
  },
  {
    label: 'Foundations',
    links: [
      { href: '/foundations', label: 'Overview' },
      { href: '/foundations/color', label: 'Color' },
      { href: '/foundations/typography', label: 'Typography' },
      { href: '/foundations/motion', label: 'Motion' },
      { href: '/foundations/accessibility', label: 'Accessibility' },
    ],
  },
  {
    label: 'Components',
    links: [
      { href: '/components', label: 'Catalog' },
    ],
  },
  {
    label: 'Patterns',
    links: [
      { href: '/patterns', label: 'Overview' },
      { href: '/patterns/dashboard', label: 'Dashboard' },
      { href: '/patterns/approval-flow', label: 'Approval Flow' },
    ],
  },
  {
    label: 'Brand',
    links: [
      { href: '/brand', label: 'Guide' },
    ],
  },
  {
    label: 'Changelog',
    links: [
      { href: '/changelog', label: 'History' },
    ],
  },
]

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`block px-2 py-1.5 text-xs rounded transition-colors ${
        active
          ? 'bg-tia-yellow/10 text-tia-yellow font-medium'
          : 'text-tia-text-secondary hover:text-tia-foreground hover:bg-tia-noir-800'
      }`}
    >
      {label}
    </Link>
  )
}

function Sidebar({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  return (
    <nav className="space-y-6">
      {nav.map((section) => (
        <div key={section.label}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-tia-text-muted mb-2 px-2">
            {section.label}
          </h3>
          <ul className="space-y-0.5">
            {section.links.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={pathname === link.href}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <title>Tia Noir — Design System</title>
        <meta name="description" content="Dark, cinematic, keyboard-first infrastructure design system" />
      </head>
      <body className="bg-tia-black text-tia-foreground antialiased min-h-screen">
        <div className="flex min-h-screen">
          {/* Desktop sidebar */}
          <aside className="w-64 flex-shrink-0 border-r border-tia-border/30 bg-tia-noir-950 hidden md:flex flex-col overflow-y-auto">
            <div className="p-5 border-b border-tia-border/20">
              <Link href="/" className="block">
                <span className="text-sm font-bold text-tia-foreground tracking-tight">
                  Tia Noir
                </span>
                <span className="block text-[11px] text-tia-text-muted mt-0.5">
                  Design System
                </span>
              </Link>
            </div>
            <div className="p-4 flex-1">
              <Sidebar pathname={pathname} />
            </div>
          </aside>

          {/* Mobile header bar */}
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 bg-tia-noir-950 border-b border-tia-border/30 flex items-center justify-between px-4">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-tia-foreground tracking-tight">
                Tia Noir
              </span>
              <span className="text-[11px] text-tia-text-muted">Docs</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-tia-noir-800 transition-colors text-tia-text-secondary"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Mobile menu drawer */}
          <aside
            className={`md:hidden fixed top-12 left-0 bottom-0 z-50 w-72 bg-tia-noir-950 border-r border-tia-border/30 overflow-y-auto transition-transform duration-200 ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-4">
              <Sidebar pathname={pathname} />
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 pt-12 md:pt-0">
            <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}