'use client'
/* @tollerud/ui docs — Command palette section registry */

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const ROUTE_LABELS = {
  overview: 'Overview',
  'getting-started': 'Getting started',
  foundations: 'Foundations',
  components: 'Components',
  infra: 'Infrastructure',
  forms: 'Forms',
  navigation: 'Navigation & Overlays',
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
};

const ROUTE_ICONS = {
  overview: 'home',
  'getting-started': 'code',
  foundations: 'palette',
  components: 'grid',
  infra: 'server',
  forms: 'forms',
  navigation: 'compass',
  charts: 'chart',
  blocks: 'blocks',
  backgrounds: 'layers',
  onboarding: 'rocket',
  'mission-control': 'app',
  'data-table': 'server',
  console: 'code',
  settings: 'settings',
  billing: 'card',
  auth: 'shield',
  resources: 'folder',
  changelog: 'clock',
};

/** [route, sectionTitle, optionalKeywords[]] */
const CMD_SECTION_ENTRIES = [
  ['overview', 'Principles'],
  ['overview', 'Explore the system'],
  ['getting-started', 'Install', ['npm', 'package', 'preset']],
  ['getting-started', 'Tailwind v4', ['source', 'globals']],
  ['getting-started', 'Import components'],
  ['getting-started', 'Server Components', ['rsc', 'ssr']],
  ['getting-started', 'Toaster', ['sonner', 'toast']],
  ['getting-started', 'Subpath imports', ['tree-shake', 'subpath']],

  ['foundations', 'Brand color', ['yellow', 'palette']],
  ['foundations', 'Monogram', ['logo', 'mark', 'wordmark']],
  ['foundations', 'State color'],
  ['foundations', 'Semantic tokens', ['css variables', 'semantic tokens']],
  ['foundations', 'Typography', ['font', 'inter']],
  ['foundations', 'Spacing'],
  ['foundations', 'Radius'],
  ['foundations', 'Elevation', ['shadow']],
  ['foundations', 'Density', ['compact']],
  ['foundations', 'Motion', ['animation']],
  ['foundations', 'Iconography', ['icons']],
  ['foundations', 'Voice', ['copy', 'tone']],
  ['foundations', 'Tia', ['mascot', 'avatar', 'agent']],

  ['components', 'More components', ['hub', 'index']],
  ['components', 'Button'],
  ['components', 'Card'],
  ['components', 'Badge & Pill', ['badge', 'pill']],
  ['components', 'Status & Kbd', ['status', 'kbd', 'keyboard']],
  ['components', 'Stat card', ['stat']],
  ['components', 'Progress, Skeleton & Avatar', ['progress', 'skeleton', 'avatar']],
  ['components', 'Tooltip & Alert', ['tooltip', 'alert']],
  ['components', 'Tabs & Accordion', ['tabs', 'accordion']],
  ['components', 'Timeline'],
  ['components', 'Panel'],
  ['components', 'Meter'],
  ['components', 'Stepper'],
  ['components', 'Density', ['compact']],
  ['components', 'Empty state', ['empty', 'compact']],
  ['components', 'Code block', ['code']],
  ['components', 'Container'],
  ['components', 'Action row'],
  ['components', 'Glow card', ['glow']],

  ['infra', 'HostCard', ['host']],
  ['infra', 'ServiceHealthCard', ['service', 'health']],
  ['infra', 'DockerStackCard', ['docker', 'stack']],
  ['infra', 'IncidentCard', ['incident']],
  ['infra', 'AlertInbox', ['alerts', 'inbox']],
  ['infra', 'ApprovalCard', ['approval']],
  ['infra', 'RollbackPlan', ['rollback']],
  ['infra', 'BackupStatusPanel', ['backup']],
  ['infra', 'ActionDiff', ['diff']],

  ['forms', 'Text input', ['input']],
  ['forms', 'Textarea & Select', ['textarea', 'select']],
  ['forms', 'Toggles', ['checkbox', 'switch', 'radio']],
  ['forms', 'Slider'],
  ['forms', 'Date picker', ['datepicker', 'calendar']],
  ['forms', 'File upload', ['upload']],
  ['forms', 'Tag input', ['tags']],
  ['forms', 'Combobox'],
  ['forms', 'Password input & spinner', ['password', 'spinner']],
  ['forms', 'Form row'],
  ['forms', 'Validation'],

  ['navigation', 'Breadcrumb', ['breadcrumb']],
  ['navigation', 'Segmented control', ['segmented']],
  ['navigation', 'Pagination'],
  ['navigation', 'Dropdown menu', ['dropdown', 'menu']],
  ['navigation', 'Dialog', ['modal']],
  ['navigation', 'Toasts', ['toast', 'sonner']],
  ['navigation', 'Drawer / Sheet', ['drawer', 'sheet']],
  ['navigation', 'Command palette', ['command', 'cmdk', 'search']],

  ['charts', 'Charts', ['chart', 'graph']],

  ['blocks', 'Hero block', ['hero']],
  ['blocks', 'Feature grid', ['feature']],
  ['blocks', 'Pricing'],
  ['blocks', 'CTA band', ['cta']],

  ['backgrounds', 'Grain gradient · live shader', ['grain', 'shader', 'webgl']],
  ['backgrounds', 'Grain gradient · CSS fallback', ['css', 'fallback']],
  ['backgrounds', 'Hero readability treatments', ['shadow', 'blur', 'readability']],
  ['backgrounds', 'Animated grid', ['grid']],
  ['backgrounds', 'In use'],

  ['onboarding', 'Setup wizard', ['wizard']],

  ['data-table', 'Simple table', ['datatable', 'package']],
  ['data-table', 'Servers', ['datatable', 'table', 'bulk']],

  ['console', 'Log viewer', ['logs', 'viewer']],
  ['console', 'Live log stream', ['stream']],
  ['console', 'Interactive shell', ['terminal', 'repl']],

  ['settings', 'Account'],

  ['billing', 'Plans'],
  ['billing', 'Your plan', ['subscription']],
  ['billing', 'Invoices'],

  ['auth', 'Split sign-in', ['login', 'sign in']],

  ['resources', 'Migration', ['breaking', 'esm', 'peer']],
  ['resources', 'AI agents', ['skill', 'claude', 'cursor']],
  ['resources', 'Contributing', ['pr', 'validate']],
  ['resources', 'Prop reference', ['props', 'typescript']],
];

function jumpToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return false;
  const reduced = window.MOTION_REDUCED;
  const y = el.getBoundingClientRect().top + window.scrollY - 78;
  window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  return true;
}

function goToSection(route, sectionId, go) {
  const current = (location.hash.replace('#/', '') || 'overview');
  const navigate = () => {
    if (current !== route) go(route);
    const tryJump = (attempts = 0) => {
      if (jumpToSection(sectionId)) return;
      if (attempts < 24) setTimeout(() => tryJump(attempts + 1), 50);
    };
    setTimeout(() => tryJump(), current === route ? 0 : 80);
  };
  navigate();
}

function buildSectionCommands(go) {
  return CMD_SECTION_ENTRIES.map(([route, title, keywords]) => {
    const page = ROUTE_LABELS[route] || route;
    const sectionId = slugify(title);
    const searchText = [title, page, route, ...(keywords || [])].join(' ');
    return {
      id: `sec-${route}-${sectionId}`,
      label: title,
      description: `${page} → ${title}`,
      icon: ROUTE_ICONS[route] || 'compass',
      searchText,
      onSelect: () => goToSection(route, sectionId, go),
    };
  });
}

function matchesCommandQuery(item, query) {
  if (!query) return true;
  const hay = [
    item.label,
    item.description,
    item.searchText,
  ].filter(Boolean).join(' ').toLowerCase();
  return hay.includes(query.toLowerCase());
}

export { slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery };
