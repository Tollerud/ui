/**
 * Single source of truth for docs site routes, nav, and legacy redirects.
 */

/** @type {Record<string, string>} Old slug → canonical slug */
export const ROUTE_ALIASES = {
  datablocks: 'charts',
  navoverlays: 'navigation',
  patterns: 'mission-control',
  servers: 'data-table',
}

export const NAV = [
  {
    group: 'Start',
    items: [
      { id: 'overview', label: 'Overview', icon: 'home' },
      { id: 'getting-started', label: 'Getting started', icon: 'code' },
    ],
  },
  {
    group: 'Design',
    subgroups: [
      {
        label: 'Core',
        items: [
          { id: 'foundations', label: 'Foundations', icon: 'palette' },
          { id: 'components', label: 'Components', icon: 'grid' },
        ],
      },
      {
        label: 'Forms & input',
        items: [{ id: 'forms', label: 'Forms', icon: 'forms' }],
      },
      {
        label: 'Navigation',
        items: [{ id: 'navigation', label: 'Navigation & Overlays', icon: 'compass' }],
      },
      {
        label: 'Data & infra',
        items: [
          { id: 'infra', label: 'Infrastructure', icon: 'server' },
          { id: 'charts', label: 'Charts', icon: 'chart' },
        ],
      },
      {
        label: 'Marketing',
        items: [
          { id: 'blocks', label: 'Blocks', icon: 'blocks' },
          { id: 'backgrounds', label: 'Backgrounds', icon: 'layers' },
        ],
      },
    ],
  },
  {
    group: 'Examples',
    items: [
      { id: 'onboarding', label: 'Onboarding', icon: 'rocket' },
      { id: 'mission-control', label: 'Mission Control', icon: 'app' },
      { id: 'data-table', label: 'Data Table', icon: 'server' },
      { id: 'console', label: 'Logs & Console', icon: 'code' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
      { id: 'billing', label: 'Billing', icon: 'card' },
      { id: 'auth', label: 'Sign in', icon: 'shield' },
    ],
  },
  {
    group: 'Resources',
    items: [
      { id: 'resources', label: 'Guides', icon: 'folder' },
      { id: 'changelog', label: 'Changelog', icon: 'clock' },
    ],
  },
]

export const PAGE_TITLES = {
  overview: 'Overview',
  'getting-started': 'Getting started',
  foundations: 'Foundations',
  components: 'Components',
  forms: 'Forms',
  navigation: 'Navigation & Overlays',
  infra: 'Infrastructure',
  charts: 'Charts',
  blocks: 'Blocks',
  backgrounds: 'Backgrounds',
  onboarding: 'Onboarding',
  'mission-control': 'Mission Control',
  'data-table': 'Data Table',
  console: 'Logs & Console',
  settings: 'Settings',
  billing: 'Billing',
  auth: 'Sign in',
  resources: 'Guides',
  changelog: 'Changelog',
}

/** Flatten nav entries (supports Design subgroups). */
export function flattenNavItems(nav = NAV) {
  const items = []
  for (const group of nav) {
    if (group.subgroups) {
      for (const sub of group.subgroups) {
        items.push(...sub.items)
      }
    } else {
      items.push(...group.items)
    }
  }
  return items
}

/** Canonical route IDs (no aliases). */
export const CANONICAL_ROUTES = flattenNavItems().map((it) => it.id)

/** All routes for static export — canonical + legacy aliases. */
export const ALL_ROUTES = [...CANONICAL_ROUTES, ...Object.keys(ROUTE_ALIASES)]

export function resolveRoute(route) {
  return ROUTE_ALIASES[route] || route
}

export function isLegacyRoute(route) {
  return route in ROUTE_ALIASES
}
