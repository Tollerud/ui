/**
 * Deep-link catalog for per-section URLs: /{page}/{section-slug}/
 * Section slugs must match Section title slugification in primitives.jsx.
 */

export function sectionSlug(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** @typedef {{ page: string, section: string, title: string, component?: string, keywords?: string[] }} DeepLink */

/** @type {DeepLink[]} */
export const DEEP_LINKS = [
  // Components — core primitives
  { page: 'components', section: 'button', title: 'Button', component: 'Button', keywords: ['cta', 'terminal'] },
  { page: 'components', section: 'card', title: 'Card', component: 'Card', keywords: ['surface'] },
  { page: 'components', section: 'divider', title: 'Divider' },
  { page: 'components', section: 'badge-and-pill', title: 'Badge & Pill', component: 'Badge', keywords: ['tag'] },
  { page: 'components', section: 'status-and-kbd', title: 'Status & Kbd', component: 'StatusDot', keywords: ['keyboard'] },
  { page: 'components', section: 'stat-card', title: 'Stat card', component: 'StatCard', keywords: ['metric'] },
  { page: 'components', section: 'progress-skeleton-and-avatar', title: 'Progress, Skeleton & Avatar', component: 'Progress', keywords: ['loading'] },
  { page: 'components', section: 'tooltip', title: 'Tooltip', component: 'Tooltip' },
  { page: 'components', section: 'alert', title: 'Alert', component: 'Alert' },
  { page: 'components', section: 'tabs-and-accordion', title: 'Tabs & Accordion', component: 'Tabs' },
  { page: 'components', section: 'timeline', title: 'Timeline', component: 'Timeline' },
  { page: 'components', section: 'panel', title: 'Panel', component: 'Panel' },
  { page: 'components', section: 'meter', title: 'Meter', component: 'Meter' },
  { page: 'components', section: 'stepper', title: 'Stepper', component: 'Stepper' },
  { page: 'components', section: 'density', title: 'Density', keywords: ['compact'] },
  { page: 'components', section: 'empty-state', title: 'Empty state', component: 'EmptyState', keywords: ['empty', 'compact', 'no results', 'error'] },
  { page: 'components', section: 'code-block', title: 'Code block', component: 'CodeBlock' },
  { page: 'components', section: 'container', title: 'Container', component: 'Container' },
  { page: 'components', section: 'action-row', title: 'Action row', component: 'ActionRow' },
  { page: 'components', section: 'glow-card', title: 'Glow card', component: 'GlowCard' },

  // Layout primitives
  { page: 'layout', section: 'page-shell', title: 'PageShell', component: 'PageShell', keywords: ['shell', 'background', 'page'] },
  { page: 'layout', section: 'page-shell', title: 'Section', component: 'Section', keywords: ['section', 'spacing'] },
  { page: 'layout', section: 'stack-cluster', title: 'Stack', component: 'Stack', keywords: ['vertical', 'gap'] },
  { page: 'layout', section: 'stack-cluster', title: 'Cluster', component: 'Cluster', keywords: ['actions', 'toolbar', 'wrap'] },
  { page: 'layout', section: 'grid-cardgrid', title: 'Grid', component: 'Grid', keywords: ['columns', 'responsive'] },
  { page: 'layout', section: 'grid-cardgrid', title: 'CardGrid', component: 'CardGrid', keywords: ['cards', 'responsive'] },
  { page: 'layout', section: 'split-maincontent', title: 'Split', component: 'Split', keywords: ['aside', 'two column'] },
  { page: 'layout', section: 'split-maincontent', title: 'MainContent', component: 'MainContent', keywords: ['main', 'content', 'width'] },

  // Screen patterns
  { page: 'screens', section: 'page-header', title: 'PageHeader', component: 'PageHeader', keywords: ['title', 'heading', 'actions'] },
  { page: 'screens', section: 'top-nav', title: 'TopNav', component: 'TopNav', keywords: ['nav', 'monogram', 'lockup'] },
  { page: 'screens', section: 'dashboard-shell', title: 'DashboardShell', component: 'DashboardShell', keywords: ['app shell', 'sidebar'] },
  { page: 'screens', section: 'dashboard-shell', title: 'SidebarNav', component: 'SidebarNav', keywords: ['sidebar', 'nav', 'brand'] },
  { page: 'screens', section: 'dashboard-shell', title: 'DashboardTopBar', component: 'DashboardTopBar', keywords: ['top bar', 'breadcrumb', 'context'] },
  { page: 'screens', section: 'settings-form', title: 'SettingsLayout', component: 'SettingsLayout', keywords: ['settings', 'forms'] },
  { page: 'screens', section: 'settings-form', title: 'FormPanel', component: 'FormPanel', keywords: ['forms', 'panel'] },
  { page: 'screens', section: 'resource-detail', title: 'ResourceList', component: 'ResourceList', keywords: ['list', 'table'] },
  { page: 'screens', section: 'resource-detail', title: 'DetailPage', component: 'DetailPage', keywords: ['detail', 'aside'] },
  { page: 'screens', section: 'empty-page', title: 'EmptyPage', component: 'EmptyPage', keywords: ['empty', 'first run'] },
  { page: 'screens', section: 'featuresection-statssection', title: 'FeatureSection', component: 'FeatureSection', keywords: ['features', 'marketing'] },
  { page: 'screens', section: 'featuresection-statssection', title: 'StatsSection', component: 'StatsSection', keywords: ['stats', 'metrics'] },

  // Agent-safe recipes
  { page: 'recipes', section: 'marketing-landing', title: 'Marketing landing page', keywords: ['landing', 'hero', 'marketing'] },
  { page: 'recipes', section: 'dashboard-overview', title: 'Dashboard overview', component: 'DashboardShell', keywords: ['dashboard', 'app shell'] },
  { page: 'recipes', section: 'settings-page', title: 'Settings page', component: 'SettingsLayout', keywords: ['settings', 'forms'] },
  { page: 'recipes', section: 'auth-page', title: 'Auth page', keywords: ['sign in', 'login', 'auth'] },
  { page: 'recipes', section: 'empty-state-page', title: 'Empty state page', component: 'EmptyPage', keywords: ['empty', 'first run'] },
  { page: 'recipes', section: 'detail-page', title: 'Detail page', component: 'DetailPage', keywords: ['detail', 'aside'] },
  { page: 'recipes', section: 'list-table-page', title: 'List / table page', component: 'ResourceList', keywords: ['list', 'table', 'data'] },
  { page: 'recipes', section: 'escape-hatch', title: 'Acceptable Tailwind glue', keywords: ['tailwind', 'consumer', 'styling'] },

  // Consumer guardrails
  { page: 'resources', section: 'consumer-checklist', title: 'Consumer project checklist', keywords: ['audit', 'guardrails', 'anti-pattern', 'tollerud-ui-audit', 'warn-only', 'error code'] },
  { page: 'getting-started', section: 'consumer-checklist', title: 'Consumer project checklist', keywords: ['audit', 'tollerud-ui-audit', 'warn-only'] },

  // Forms
  { page: 'forms', section: 'text-input', title: 'Text input', component: 'Input' },
  { page: 'forms', section: 'combobox', title: 'Combobox', component: 'Combobox' },
  { page: 'forms', section: 'form-row', title: 'Form row', component: 'FormRow' },

  // Navigation & overlays
  { page: 'navigation', section: 'dialog', title: 'Dialog', component: 'Dialog' },
  { page: 'navigation', section: 'command-palette', title: 'Command palette', component: 'CommandMenu', keywords: ['cmdk', 'search'] },

  // Infrastructure
  { page: 'infra', section: 'hostcard', title: 'HostCard', component: 'HostCard' },
  { page: 'infra', section: 'incidentcard', title: 'IncidentCard', component: 'IncidentCard' },
]

export function deepLinkPath(link) {
  return `${link.page}/${link.section}`
}

export function findDeepLink(page, section) {
  return DEEP_LINKS.find((l) => l.page === page && l.section === section)
}

/** Slug arrays for Next.js generateStaticParams (excludes single-segment page routes). */
export function getDeepLinkSlugs() {
  return DEEP_LINKS.map((l) => [l.page, l.section])
}
