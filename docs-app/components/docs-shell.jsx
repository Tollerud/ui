'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ToastProvider, Kbd, Icons, CommandMenu, buildSectionCommands, initMotion, PageTOC } from '@/lib/provide-pages'
import { adaptCommandGroups, docsCommandFilter } from '@/lib/adapt-command-groups'
import PageOverview from './pages/page-overview'
import PageFoundations from './pages/page-foundations'
import PageComponents from './pages/page-components'
import PageInfra from './pages/page-infra'
import PageForms from './pages/page-forms'
import PageNavOverlays from './pages/page-nav-overlays'
import PageCharts from './pages/page-charts'
import PageBlocks from './pages/page-blocks'
import PageBackgrounds from './pages/page-backgrounds'
import PagePatterns from './pages/page-patterns'
import PageOnboarding from './pages/page-onboarding'
import PageServers from './pages/page-servers'
import PageConsole from './pages/page-console'
import PageSettings from './pages/page-settings'
import PageBilling from './pages/page-billing'
import PageAuth from './pages/page-auth'
import PageChangelog from './pages/page-changelog'

const NAV = [
  { group: 'Start', items: [{ id: 'overview', label: 'Overview', icon: 'home' }] },
  { group: 'Design', items: [
    { id: 'foundations', label: 'Foundations', icon: 'palette' },
    { id: 'components', label: 'Components', icon: 'grid' },
    { id: 'infra', label: 'Infrastructure', icon: 'server' },
    { id: 'forms', label: 'Forms', icon: 'forms' },
    { id: 'navoverlays', label: 'Navigation & Overlays', icon: 'compass' },
    { id: 'datablocks', label: 'Charts', icon: 'chart' },
    { id: 'blocks', label: 'Blocks', icon: 'blocks' },
    { id: 'backgrounds', label: 'Backgrounds', icon: 'layers' },
  ]},
  { group: 'Build', items: [
    { id: 'onboarding', label: 'Onboarding', icon: 'rocket' },
    { id: 'patterns', label: 'Mission Control', icon: 'app' },
    { id: 'servers', label: 'Data Table', icon: 'server' },
    { id: 'console', label: 'Logs & Console', icon: 'code' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'billing', label: 'Billing', icon: 'card' },
    { id: 'auth', label: 'Sign in', icon: 'shield' },
  ]},
  { group: '', items: [{ id: 'changelog', label: 'Changelog', icon: 'clock' }] },
]

const PAGE_TITLES = {
  overview: 'Overview',
  foundations: 'Foundations',
  components: 'Components',
  forms: 'Forms',
  navoverlays: 'Navigation & Overlays',
  datablocks: 'Charts',
  blocks: 'Blocks',
  backgrounds: 'Backgrounds',
  patterns: 'Mission Control',
  servers: 'Data Table',
  console: 'Logs & Console',
  settings: 'Settings',
  auth: 'Sign in',
  onboarding: 'Onboarding',
  billing: 'Billing',
  infra: 'Infrastructure',
  changelog: 'Changelog',
}

const PAGES = {
  overview: PageOverview,
  foundations: PageFoundations,
  components: PageComponents,
  infra: PageInfra,
  forms: PageForms,
  navoverlays: PageNavOverlays,
  datablocks: PageCharts,
  blocks: PageBlocks,
  backgrounds: PageBackgrounds,
  patterns: PagePatterns,
  onboarding: PageOnboarding,
  servers: PageServers,
  console: PageConsole,
  settings: PageSettings,
  billing: PageBilling,
  auth: PageAuth,
  changelog: PageChangelog,
}

function useTheme() {
  const [theme, setTheme] = useState('dark')
  useEffect(() => {
    setTheme(localStorage.getItem('tollerud-theme') || 'dark')
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('tollerud-theme', theme)
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

export function DocsShell({ route: routeProp }) {
  const pathname = usePathname()
  const router = useRouter()
  const route = routeProp || pathname.replace(/^\//, '').replace(/\/$/, '') || 'overview'
  const [theme, toggleTheme] = useTheme()
  const toggleThemeRef = useRef(toggleTheme)
  toggleThemeRef.current = toggleTheme
  const [navOpen, setNavOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)

  const go = useCallback((id) => {
    router.push(`/${id}`)
    window.scrollTo({ top: 0 })
  }, [router])

  useEffect(() => { setNavOpen(false) }, [route])
  useEffect(() => { initMotion() }, [])

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') setNavOpen(false)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        toggleThemeRef.current()
      }
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [])

  const Page = PAGES[route] || PAGES.overview
  const cmdGroups = [
    {
      label: 'Navigate',
      items: NAV.flatMap((g) => g.items).map((it) => ({
        id: 'nav-' + it.id,
        label: it.label,
        description: 'Go to ' + it.label,
        icon: it.icon,
        searchText: it.label + ' ' + it.id,
        onSelect: () => go(it.id),
      })),
    },
    { label: 'Sections', items: buildSectionCommands(go) },
    {
      label: 'Actions',
      items: [
        {
          id: 'theme',
          label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
          icon: theme === 'dark' ? 'sun' : 'moon',
          shortcut: '⌘L',
          onSelect: toggleTheme,
        },
        {
          id: 'repo',
          label: 'Open repository',
          description: 'github.com/Tollerud',
          icon: 'github',
          onSelect: () => window.open('https://github.com/Tollerud/ui', '_blank'),
        },
      ],
    },
  ]

  return (
    <ToastProvider>
      <div className="ds-shell">
        <div className={`ds-nav-scrim ${navOpen ? 'is-open' : ''}`} onClick={() => setNavOpen(false)} />
        <aside className={`ds-sidebar ds-themed ${navOpen ? 'ds-sidebar--open' : ''}`}>
          <div className="ds-sidebar__brand">
            <img className="ds-sidebar__logo" src="/tollerud-logo.svg" alt="" />
            <div>
              <div className="ds-sidebar__title">Tollerud</div>
              <div className="ds-sidebar__ver">user interface · v1.3.0</div>
            </div>
          </div>
          <nav className="ds-sidebar__nav">
            {NAV.map((g) => (
              <div className="ds-navgroup" key={g.group || 'meta'}>
                <div className="ds-navgroup__label">{g.group}</div>
                {g.items.map((it) => {
                  const I = Icons[it.icon]
                  return (
                    <button
                      key={it.id}
                      className={`ds-navlink ${route === it.id ? 'ds-navlink--active' : ''}`}
                      onClick={() => go(it.id)}
                    >
                      <span className="ds-navlink__icon"><I size={15} /></span>
                      {it.label}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>
        </aside>

        <div className="ds-main">
          <header className="ds-topbar ds-themed">
            <button
              className="ds-iconbtn ds-topbar__menu"
              onClick={() => setNavOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={navOpen}
            >
              {navOpen ? <Icons.x /> : <Icons.menu />}
            </button>
            <img
              className="ds-topbar__logo"
              src="/tollerud-logo.svg"
              alt="Tollerud"
              onClick={() => go('overview')}
            />
            <span className="ds-topbar__crumb">
              <span className="ds-topbar__crumb-prefix">
                Tollerud UI <span style={{ opacity: 0.4, margin: '0 6px' }}>/</span>{' '}
              </span>
              <b>{PAGE_TITLES[route] || 'Overview'}</b>
            </span>
            <span className="ds-topbar__spacer" />
            <button className="ds-topbar__cmd" onClick={() => setCmdOpen(true)} title="Command palette">
              <Icons.search size={14} />
              <span className="ds-topbar__cmd-text">Search</span>
              <Kbd keys="⌘+K" size="sm" />
            </button>
            <a
              className="ds-iconbtn"
              href="https://github.com/Tollerud/ui"
              target="_blank"
              rel="noreferrer"
              title="Repository"
            >
              <Icons.github />
            </a>
            <button
              className="ds-iconbtn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            >
              <span className="ds-theme-icon" key={theme}>
                {theme === 'dark' ? <Icons.sun /> : <Icons.moon />}
              </span>
            </button>
          </header>
          <main className="ds-content">
            <div className="ds-page" key={route}>
              {route === 'overview' ? <PageOverview go={go} /> : <Page />}
            </div>
            <PageTOC route={route} />
          </main>
        </div>
      </div>
      <CommandMenu
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        groups={adaptCommandGroups(cmdGroups)}
        filter={docsCommandFilter}
        placeholder="Search pages, sections, components…"
      />
    </ToastProvider>
  )
}
