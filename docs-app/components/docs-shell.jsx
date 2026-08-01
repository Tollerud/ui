'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
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
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  DashboardTopBar,
  useSidebar,
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
import PageEmail from './pages/page-email'

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
  email: PageEmail,
  changelog: PageChangelog,
}

const PAGES = { ...CANONICAL_PAGES }
for (const [legacy, canonical] of Object.entries(ROUTE_ALIASES)) {
  PAGES[legacy] = CANONICAL_PAGES[canonical]
}

const PAGES_WITH_GO = new Set(['overview', 'getting-started', 'recipes', 'screens', 'components', 'resources'])

function navHref(id) {
  return id === 'overview' ? '/' : `/${id}/`
}

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
    // Deliberately effect-based, not a lazy useState initializer: localStorage
    // isn't available during SSR, so the initial render (server and client's
    // first pass) must both use the 'dark' default to avoid a hydration
    // mismatch. The real persisted value is applied once mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(localStorage.getItem('tollerud-theme') || 'dark')
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('tollerud-theme', theme)
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

/** Sidebar nav content — a child of SidebarProvider so it can close the
 *  mobile sheet on item select via useSidebar(). */
function DocsSidebarNav({ page, sidebarContentRef }) {
  const { setOpenMobile } = useSidebar()
  const close = () => setOpenMobile(false)

  return (
    <SidebarContent ref={sidebarContentRef}>
      {NAV.map((g) => (
        <SidebarGroup key={g.group || 'meta'}>
          {g.group && <SidebarGroupLabel>{g.group}</SidebarGroupLabel>}
          <SidebarGroupContent>
            {g.items?.length ? (
              <SidebarMenu>
                {g.items.map((it) => {
                  const I = Icons[it.icon]
                  return (
                    <SidebarMenuItem key={it.id}>
                      <SidebarMenuButton asChild isActive={it.id === page} icon={<I size={15} />} onClick={close}>
                        <Link href={navHref(it.id)}>{it.label}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            ) : null}
            {g.subgroups?.map((sub, subIndex) => (
              <div key={sub.label || sub.items[0]?.id || subIndex}>
                {sub.label && <SidebarGroupLabel className="mt-3">{sub.label}</SidebarGroupLabel>}
                <SidebarMenuSub className="ml-0 border-l-0 pl-0">
                  {sub.items.map((it) => {
                    const I = Icons[it.icon]
                    return (
                      <SidebarMenuSubItem key={it.id}>
                        <SidebarMenuSubButton asChild isActive={it.id === page} onClick={close}>
                          <Link href={navHref(it.id)}>
                            <span className="mr-2 inline-flex h-[15px] w-[15px] items-center justify-center text-current">
                              <I size={15} />
                            </span>
                            {it.label}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  )
}

function DocsShellInner({ slug: slugProp }) {
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
  useEffect(() => {
    toggleThemeRef.current = toggleTheme
  })
  const [cmdOpen, setCmdOpen] = useState(false)
  const sidebarContentRef = useRef(null)
  const { setOpenMobile } = useSidebar()

  // Close the mobile nav sheet when navigation changes. This crosses into
  // SidebarProvider's state (an ancestor), so it can't use the render-time
  // adjustment pattern (safe only for a component's own state) — an effect
  // is the correct, safe way to react to a route change here.
  useEffect(() => {
    setOpenMobile(false)
  }, [page, sectionSlug, setOpenMobile])

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
    const nav = sidebarContentRef.current
    if (!nav) return
    const id = requestAnimationFrame(() => {
      nav.querySelector('[data-active]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    })
    return () => cancelAnimationFrame(id)
  }, [page, sectionSlug])
  useEffect(() => {
    initMotion()
  }, [])

  useEffect(() => {
    const h = (e) => {
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
        <Sidebar mobileTitle="Navigation menu" className="ds-themed">
          <SidebarHeader>
            <Monogram className="ds-sidebar__logo" alt="" />
            <div>
              <div className="ds-sidebar__title">Tollerud</div>
              <div className="ds-sidebar__ver">user interface · v{PACKAGE_VERSION}</div>
            </div>
          </SidebarHeader>
          <DocsSidebarNav page={page} sidebarContentRef={sidebarContentRef} />
        </Sidebar>

        <SidebarInset>
          <DashboardTopBar
            projectName="Tollerud"
            homeHref="/"
            className="ds-themed"
            menuTrigger={<SidebarTrigger className="lg:hidden" aria-label="Menu" />}
            breadcrumb="Tollerud UI"
            pageTitle={crumbTitle}
            actions={
              <>
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
              </>
            }
          />
          <main className="ds-content">
            <div className="ds-page" key={pageKey}>
              {PAGES_WITH_GO.has(page) ? <Page go={go} /> : <Page />}
            </div>
            <PageTOC route={page} />
          </main>
        </SidebarInset>
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

export function DocsShell({ slug }) {
  return (
    <SidebarProvider>
      <DocsShellInner slug={slug} />
    </SidebarProvider>
  )
}
