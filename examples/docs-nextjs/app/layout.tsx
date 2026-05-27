'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider, useTheme } from 'next-themes'
import { TooltipProvider } from '../../../components/Tooltip'
import { Toaster } from '../../../components/Toaster'
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
          ? 'bg-tollerud-yellow/10 text-tollerud-yellow font-medium'
          : 'text-tollerud-text-secondary hover:text-tollerud-foreground hover:bg-tollerud-noir-800'
      }`}
    >
      {label}
    </Link>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-8 h-8 flex items-center justify-center rounded hover:bg-tollerud-noir-800 transition-colors text-tollerud-text-secondary hover:text-tollerud-yellow"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

function Sidebar({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  return (
    <nav className="space-y-6">
      {nav.map((section) => (
        <div key={section.label}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-tollerud-text-muted mb-2 px-2">
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

function RootLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <TooltipProvider delayDuration={0}>
        <div className="flex min-h-screen">
          {/* Desktop sidebar */}
          <aside className="w-64 flex-shrink-0 border-r border-tollerud-border/30 bg-tollerud-noir-950 hidden md:flex flex-col overflow-y-auto">
            <div className="p-5 border-b border-tollerud-border/20">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <svg width="20" height="22" viewBox="0 0 130 143" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="flex-shrink-0">
                    <g fill="#FFF200" fillRule="evenodd">
                      <g transform="translate(-86.000000, -109.000000)">
                        <g transform="translate(32.000000, 55.000000)">
                          <g transform="translate(54.000000, 54.000000)">
                            <path d="M82.4839273,140.272626 L95.1738252,140.272626 L95.1738252,143 L34.8114657,143 L34.8114657,140.272626 L47.5013636,140.272626 L47.5013636,28.2924381 C40.1277806,26.4177752 32.9252955,25.2241422 26.4088393,25.2241422 C12.1757856,25.2241422 4.11617359,34.5982703 4.11617359,39.8821508 C4.11617359,40.9049161 4.63028596,41.5867596 5.65932936,41.5867596 C7.20248513,41.5867596 7.37440169,40.3931266 8.06043062,38.8593855 C10.4615319,33.575505 15.6059302,31.5307881 20.4073141,31.5307881 C29.152955,31.5307881 35.1552988,38.5184637 35.1552988,47.2107482 C35.1552988,56.2447681 28.8107592,62.8907084 18.0070315,62.8907084 C7.5454996,62.891522 0,53.6882617 0,43.8023442 C0,30.8497582 11.3178401,21.986606 26.5799372,21.986606 C51.1026062,21.986606 84.1989996,39.2011209 104.948509,39.2011209 C118.495534,39.2011209 126.384048,31.7016558 126.384048,19.4300996 C126.384048,10.3968933 118.667451,4.60203698 115.580321,4.60203698 C114.552096,4.60203698 113.69415,5.1130128 113.69415,6.13577809 C113.69415,7.49946515 114.552096,7.6695192 115.409223,8.01044097 C115.752237,8.18049502 122.268693,10.5669474 122.268693,19.2592319 C122.268693,28.2924381 115.238125,34.0872945 107.177694,34.0872945 C97.7460244,34.0872945 91.0584702,26.4177752 91.0584702,17.8955448 C91.0584702,6.64675391 99.9760277,0 109.749893,0 C122.268693,0 129.642276,9.88510384 129.642276,19.6001536 C129.642276,34.2581622 119.181563,42.4386572 104.947691,42.4386572 C98.0890388,42.4386572 90.5443579,40.9049161 82.4839273,38.6901451 L82.4839273,140.272626 Z" />
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                  <div>
                    <span className="text-sm font-bold text-tollerud-foreground tracking-tight">
                      Tollerud
                    </span>
                    <span className="block text-[11px] text-tollerud-text-muted mt-0.5">
                      Design System
                    </span>
                  </div>
                </Link>
                {mounted && <ThemeToggle />}
              </div>
            </div>
            <div className="p-4 flex-1">
              <Sidebar pathname={pathname} />
            </div>
          </aside>

          {/* Mobile header bar */}
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 bg-tollerud-noir-950 border-b border-tollerud-border/30 flex items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <svg width="16" height="18" viewBox="0 0 130 143" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="flex-shrink-0">
                <g fill="#FFF200" fillRule="evenodd">
                  <g transform="translate(-86.000000, -109.000000)">
                    <g transform="translate(32.000000, 55.000000)">
                      <g transform="translate(54.000000, 54.000000)">
                        <path d="M82.4839273,140.272626 L95.1738252,140.272626 L95.1738252,143 L34.8114657,143 L34.8114657,140.272626 L47.5013636,140.272626 L47.5013636,28.2924381 C40.1277806,26.4177752 32.9252955,25.2241422 26.4088393,25.2241422 C12.1757856,25.2241422 4.11617359,34.5982703 4.11617359,39.8821508 C4.11617359,40.9049161 4.63028596,41.5867596 5.65932936,41.5867596 C7.20248513,41.5867596 7.37440169,40.3931266 8.06043062,38.8593855 C10.4615319,33.575505 15.6059302,31.5307881 20.4073141,31.5307881 C29.152955,31.5307881 35.1552988,38.5184637 35.1552988,47.2107482 C35.1552988,56.2447681 28.8107592,62.8907084 18.0070315,62.8907084 C7.5454996,62.891522 0,53.6882617 0,43.8023442 C0,30.8497582 11.3178401,21.986606 26.5799372,21.986606 C51.1026062,21.986606 84.1989996,39.2011209 104.948509,39.2011209 C118.495534,39.2011209 126.384048,31.7016558 126.384048,19.4300996 C126.384048,10.3968933 118.667451,4.60203698 115.580321,4.60203698 C114.552096,4.60203698 113.69415,5.1130128 113.69415,6.13577809 C113.69415,7.49946515 114.552096,7.6695192 115.409223,8.01044097 C115.752237,8.18049502 122.268693,10.5669474 122.268693,19.2592319 C122.268693,28.2924381 115.238125,34.0872945 107.177694,34.0872945 C97.7460244,34.0872945 91.0584702,26.4177752 91.0584702,17.8955448 C91.0584702,6.64675391 99.9760277,0 109.749893,0 C122.268693,0 129.642276,9.88510384 129.642276,19.6001536 C129.642276,34.2581622 119.181563,42.4386572 104.947691,42.4386572 C98.0890388,42.4386572 90.5443579,40.9049161 82.4839273,38.6901451 L82.4839273,140.272626 Z" />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <span className="text-sm font-bold text-tollerud-foreground tracking-tight">Tollerud</span>
              <span className="text-[11px] text-tollerud-text-muted">Design</span>
            </Link>
            <div className="flex items-center gap-2">
              {mounted && <ThemeToggle />}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-tollerud-noir-800 transition-colors text-tollerud-text-secondary"
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
            className={`md:hidden fixed top-12 left-0 bottom-0 z-50 w-72 bg-tollerud-noir-950 border-r border-tollerud-border/30 overflow-y-auto transition-transform duration-200 ${
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
        <Toaster />
      </TooltipProvider>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <title>Tollerud Design System</title>
        <meta name="description" content="Dark, cinematic, keyboard-first infrastructure design system" />
      </head>
      <body className="bg-tollerud-surface text-tollerud-foreground antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" storageKey="tollerud-theme">
          <RootLayoutInner>{children}</RootLayoutInner>
        </ThemeProvider>
      </body>
    </html>
  )
}
