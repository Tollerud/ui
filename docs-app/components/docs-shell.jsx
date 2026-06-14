'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  ToastProvider,
  Kbd,
  Icons,
  CommandMenu,
  buildSectionCommands,
  initMotion,
  PageTOC,
  jumpToSection,
} from '@/lib/provide-pages'
import { Monogram } from '@/components/brand'
import { adaptCommandGroups, docsCommandFilter } from '@/lib/adapt-command-groups'
import { PACKAGE_VERSION } from '@/lib/package-version'
import { NAV, PAGE_TITLES, ROUTE_ALIASES, resolveRoute, flattenNavItems, isLegacyRoute } from '@/lib/docs-routes'
import { DEEP_LINKS, deepLinkPath, findDeepLink } from '@/lib/component-catalog'
import PageOverview from './pages/page-overview'
import PageGettingStarted from './pages/page-getting-started'
import PageRecipes from './pages/page-recipes'
import PageFoundations from './pages/page-foundations'
import PageLayout from './pages/page-layout'
import PageScreens from './pages/page-screens'
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
import PageResources from './pages/page-resources'

const CANONICAL_PAGES = {
  overview: PageOverview,
  'getting-started': PageGettingStarted,
  recipes: PageRecipes,
  foundations: PageFoundations,
  layout: PageLayout,
  screens: PageScreens,
  components: PageComponents,
  infra: PageInfra,
  forms: PageForms,
  navigation: PageNavOverlays,
  charts: PageCharts,
  blocks: PageBlocks,
  backgrounds: PageBackgrounds,
  'mission-control': PagePatterns,
  onboarding: PageOnboarding,
  'data-table': PageServers,
  console: PageConsole,
  settings: PageSettings,
  billing: PageBilling,
  auth: PageAuth,
  resources: PageResources,
  changelog: PageChangelog,
}

const PAGES = { ...CANONICAL_PAGES }
for (const [legacy, canonical] of Object.entries(ROUTE_ALIASES)) {
  PAGES[legacy] = CANONICAL_PAGES[canonical]
}

const PAGES_WITH_GO = new Set(['overview', 'getting-started', 'recipes', 'screens', 'components', 'resources'])

function slugFromPathname(pathname) {
  const parts = pathname.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean)
  return parts.length ? parts : null
}

function resolveSlug(slugProp, pathname) {
  const parts = slugProp === undefined ? slugFromPathname(pathname) : slugProp?.length ? slugProp : null
  if (!parts) return { page: 'overview', section: null, parts: [] }
  return {
    page: parts[0],
    section: parts.length > 1 ? parts[1] : null,
    parts,
  }
}

function buildDeepLinkCommands(go) {
  return DEEP_LINKS.map((link) => ({
    id: `deep-${link.page}-${link.section}`,
    label: link.title,
    description: `${PAGE_TITLES[link.page] || link.page} → ${link.title}`,
    icon: link.page === 'components' ? 'grid' : link.page === 'forms' ? 'forms' : 'server',
    searchText: [link.title, link.component, link.page, link.section, ...(link.keywords || [])]
      .filter(Boolean)
      .join(' '),
    onSelect: () => go(deepLinkPath(link)),
  }))
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

export function DocsShell({ slug: slugProp }) {
  const pathname = usePathname()
  const router = useRouter()
  const { page: rawPage, section: sectionSlug, parts } = useMemo(
    () => resolveSlug(slugProp, pathname),
    [slugProp, pathname],
  )
  const page = resolveRoute(rawPage)
  const deepLink = sectionSlug ? findDeepLink(page, sectionSlug) : null
  const [theme, toggleTheme] = useTheme()
  const toggleThemeRef = useRef(toggleTheme)
  toggleThemeRef.current = toggleTheme
  const [navOpen, setNavOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)

  const go = useCallback(
    (id) => {
      const path = id.split('/').filter(Boolean).join('/')
      router.push(path ? `/${path}/` : '/')
      if (!id.includes('/')) window.scrollTo({ top: 0 })
    },
    [router],
  )

  useEffect(() => {
    if (parts.length === 1 && isLegacyRoute(rawPage) && rawPage !== page) {
      router.replace(`/${page}/`)
    }
  }, [rawPage, page, parts.length, router])

  useEffect(() => {
    if (!sectionSlug) return
    const tryJump = (attempts = 0) => {
      if (jumpToSection(sectionSlug)) return
      if (attempts < 30) setTimeout(() => tryJump(attempts + 1), 50)
    }
    const t = setTimeout(() => tryJump(), 100)
    return () => clearTimeout(t)
  }, [page, sectionSlug])

  useEffect(() => {
    setNavOpen(false)
  }, [page, sectionSlug])
  useEffect(() => {
    initMotion()
  }, [])

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

  const Page = CANONICAL_PAGES[page] || PAGES[rawPage] || CANONICAL_PAGES.overview
  const pageKey = sectionSlug ? `${page}--${sectionSlug}` : page

  const cmdGroups = [
    {
      label: 'Navigate',
      items: flattenNavItems().map((it) => ({
        id: 'nav-' + it.id,
        label: it.label,
        description: 'Go to ' + it.label,
        icon: it.icon,
        searchText: it.label + ' ' + it.id,
        onSelect: () => go(it.id),
      })),
    },
    { label: 'Component docs', items: buildDeepLinkCommands(go) },
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

  const crumbTitle = deepLink
    ? `${PAGE_TITLES[page] || page} / ${deepLink.title}`
    : PAGE_TITLES[page] || 'Overview'

  return (
    <ToastProvider>
      <div className="ds-shell">
        <div className={`ds-nav-scrim ${navOpen ? 'is-open' : ''}`} onClick={() => setNavOpen(false)} />
        <aside className={`ds-sidebar ds-themed ${navOpen ? 'ds-sidebar--open' : ''}`}>
          <div className="ds-sidebar__brand">
            <Monogram className="ds-sidebar__logo" alt="" />
            <div>
              <div className="ds-sidebar__title">Tollerud</div>
              <div className="ds-sidebar__ver">user interface · v{PACKAGE_VERSION}</div>
            </div>
          </div>
          <nav className="ds-sidebar__nav">
            {NAV.map((g) => (
              <div className="ds-navgroup" key={g.group || 'meta'}>
                {g.group && <div className="ds-navgroup__label">{g.group}</div>}
                {g.items?.map((it) => {
                  const I = Icons[it.icon]
                  return (
                    <button
                      key={it.id}
                      className={`ds-navlink ${page === it.id && !sectionSlug ? 'ds-navlink--active' : ''}`}
                      onClick={() => go(it.id)}
                    >
                      <span className="ds-navlink__icon"><I size={15} /></span>
                      {it.label}
                    </button>
                  )
                })}
                {g.subgroups?.map((sub, subIndex) => (
                  <div className="ds-navsubgroup" key={sub.label || sub.items[0]?.id || subIndex}>
                    {sub.label && <div className="ds-navsubgroup__label">{sub.label}</div>}
                    {sub.items.map((it) => {
                      const I = Icons[it.icon]
                      return (
                        <button
                          key={it.id}
                          className={`ds-navlink ${page === it.id && !sectionSlug ? 'ds-navlink--active' : ''}`}
                          onClick={() => go(it.id)}
                        >
                          <span className="ds-navlink__icon"><I size={15} /></span>
                          {it.label}
                        </button>
                      )
                    })}
                  </div>
                ))}
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
            <Monogram className="ds-topbar__logo" alt="Tollerud" onClick={() => go('overview')} />
            <span className="ds-topbar__crumb">
              <span className="ds-topbar__crumb-prefix">
                Tollerud UI <span style={{ opacity: 0.4, margin: '0 6px' }}>/</span>{' '}
              </span>
              <b>{crumbTitle}</b>
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
            <div className="ds-page" key={pageKey}>
              {PAGES_WITH_GO.has(page) ? <Page go={go} /> : <Page />}
            </div>
            <PageTOC route={page} />
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
