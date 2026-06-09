'use client'
/* Tollerud DS — Command palette section registry. → window.{slugify, jumpToSection, goToSection, buildSectionCommands} */

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const ROUTE_LABELS = {
  overview: 'Overview',
  foundations: 'Foundations',
  components: 'Components',
  infra: 'Infrastructure',
  forms: 'Forms',
  navoverlays: 'Navigation & Overlays',
  datablocks: 'Charts',
  blocks: 'Blocks',
  backgrounds: 'Backgrounds',
  onboarding: 'Onboarding',
  servers: 'Data Table',
  console: 'Logs & Console',
  settings: 'Settings',
  billing: 'Billing',
  auth: 'Sign in',
};

const ROUTE_ICONS = {
  overview: 'home',
  foundations: 'palette',
  components: 'grid',
  infra: 'server',
  forms: 'forms',
  navoverlays: 'compass',
  datablocks: 'chart',
  blocks: 'blocks',
  backgrounds: 'layers',
  onboarding: 'rocket',
  servers: 'server',
  console: 'code',
  settings: 'settings',
  billing: 'card',
  auth: 'shield',
};

/** [route, sectionTitle, optionalKeywords[]] */
const CMD_SECTION_ENTRIES = [
  ['overview', 'Principles'],
  ['overview', 'Explore the system'],
  ['overview', 'Install', ['npm', 'package', 'preset']],

  ['foundations', 'Brand color', ['yellow', 'palette']],
  ['foundations', 'Monogram', ['logo', 'mark', 'wordmark']],
  ['foundations', 'State color'],
  ['foundations', 'Semantic tokens', ['shadcn', 'css variables']],
  ['foundations', 'Typography', ['font', 'inter']],
  ['foundations', 'Spacing'],
  ['foundations', 'Radius'],
  ['foundations', 'Elevation', ['shadow']],
  ['foundations', 'Density', ['compact']],
  ['foundations', 'Motion', ['animation']],
  ['foundations', 'Iconography', ['icons']],
  ['foundations', 'Voice', ['copy', 'tone']],
  ['foundations', 'Tia', ['mascot', 'avatar', 'agent']],

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
  ['components', 'Password input & spinner', ['password', 'spinner']],
  ['components', 'Form row'],
  ['components', 'Pricing card', ['pricing']],
  ['components', 'Toast'],
  ['components', 'Drawer / Sheet', ['drawer', 'sheet']],
  ['components', 'Combobox'],
  ['components', 'Avatar group', ['avatar']],
  ['components', 'Density', ['compact']],
  ['components', 'Empty state', ['empty']],
  ['components', 'Log viewer', ['logs']],
  ['components', 'Data table', ['datatable', 'table']],

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
  ['forms', 'Combobox & Date picker', ['datepicker', 'calendar']],
  ['forms', 'File upload & Tags', ['upload', 'tags']],
  ['forms', 'Validation'],

  ['navoverlays', 'Breadcrumb & Segmented', ['breadcrumb', 'segmented']],
  ['navoverlays', 'Pagination'],
  ['navoverlays', 'Dropdown menu', ['dropdown', 'menu']],
  ['navoverlays', 'Dialog', ['modal']],
  ['navoverlays', 'Toasts'],
  ['navoverlays', 'Command palette', ['command', 'cmdk', 'search']],

  ['datablocks', 'Charts', ['chart', 'graph']],

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
  ['onboarding', 'Empty states', ['empty']],
  ['onboarding', 'Inline & compact', ['compact']],

  ['servers', 'Servers', ['datatable', 'table']],

  ['console', 'Live log stream', ['logs', 'viewer']],
  ['console', 'Interactive shell', ['terminal', 'repl']],

  ['settings', 'Account'],

  ['billing', 'Plans'],
  ['billing', 'Your plan', ['subscription']],
  ['billing', 'Invoices'],

  ['auth', 'Split sign-in', ['login', 'sign in']],
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
