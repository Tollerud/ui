/* Tollerud DS — App shell: sidebar nav, topbar, theme toggle, hash routing. */
const NAV = [
  { group: 'Start', items: [
    { id: 'overview', label: 'Overview', icon: 'home' },
  ]},
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
];
const PAGE_TITLES = {
  overview: 'Overview', foundations: 'Foundations', components: 'Components',
  forms: 'Forms', navoverlays: 'Navigation & Overlays', datablocks: 'Charts', blocks: 'Blocks',
  backgrounds: 'Backgrounds', patterns: 'Mission Control', servers: 'Data Table',
  console: 'Logs & Console', settings: 'Settings', auth: 'Sign in', onboarding: 'Onboarding', billing: 'Billing', infra: 'Infrastructure',
};

function useHashRoute() {
  const [route, setRoute] = useState(() => (location.hash.replace('#/', '') || 'overview'));
  useEffect(() => {
    const h = () => setRoute(location.hash.replace('#/', '') || 'overview');
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  const go = useCallback((id) => { location.hash = '#/' + id; window.scrollTo({ top: 0 }); }, []);
  return [route, go];
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('tollerud-theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tollerud-theme', theme);
  }, [theme]);
  return [theme, () => setTheme(t => t === 'dark' ? 'light' : 'dark')];
}

const DARK_BG_PRESETS  = [
  { label: 'Default',   bg: '#0A0A0A', surface: '#121212' },
  { label: 'Noir 800',  bg: '#1A1A1A', surface: '#252525' },
  { label: 'Slate',     bg: '#0F172A', surface: '#1E293B' },
  { label: 'Forest',    bg: '#0A1A12', surface: '#112218' },
  { label: 'Navy',      bg: '#0A0F1A', surface: '#111827' },
];
const LIGHT_BG_PRESETS = [
  { label: 'Default',   bg: '#FAFAF7', surface: '#FFFFFF' },
  { label: 'Gray',      bg: '#F1F0EC', surface: '#FFFFFF' },
  { label: 'White',     bg: '#FFFFFF', surface: '#F7F7F5' },
  { label: 'Warm',      bg: '#FDF8F0', surface: '#FFFFFF' },
];
function useBgPicker(theme) {
  const presets = theme === 'dark' ? DARK_BG_PRESETS : LIGHT_BG_PRESETS;
  const [bgIdx, setBgIdx] = useState(0);

  // Reset to default (0) whenever theme changes
  const prevTheme = useRef(theme);
  useEffect(() => {
    if (prevTheme.current !== theme) { setBgIdx(0); prevTheme.current = theme; }
  }, [theme]);

  const idx = Math.min(bgIdx, presets.length - 1);
  useEffect(() => {
    const { bg, surface } = presets[idx];
    document.documentElement.style.setProperty('--background', bg);
    document.documentElement.style.setProperty('--surface', bg);
    document.documentElement.style.setProperty('--card', surface);
    document.documentElement.style.setProperty('--surface-raised', surface);
  }, [idx, theme]);
  return [idx, setBgIdx, presets];
}

function App() {
  const [route, go] = useHashRoute();
  const [theme, toggleTheme] = useTheme();
  const toggleThemeRef = useRef(toggleTheme);
  toggleThemeRef.current = toggleTheme;
  const [bgIdx, setBgIdx, bgPresets] = useBgPicker(theme); // eslint-disable-line
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const bgPickerRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const h = (e) => { if (bgPickerRef.current && !bgPickerRef.current.contains(e.target)) setBgPickerOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { setNavOpen(false); }, [route]);
  useEffect(() => { initMotion(); }, []);
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') { setNavOpen(false); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(o => !o); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); toggleThemeRef.current(); }
    };
    document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h);
  }, []);

  const PAGES = {
    overview: <PageOverview go={go}/>,
    foundations: <PageFoundations/>,
    components: <PageComponents/>,
    infra: <PageInfra/>,
    forms: <PageForms/>,
    navoverlays: <PageNavOverlays/>,
    datablocks: <PageCharts/>,
    blocks: <PageBlocks/>,
    backgrounds: <PageBackgrounds/>,
    patterns: <PagePatterns/>,
    onboarding: <PageOnboarding/>,
    servers: <PageServers/>,
    console: <PageConsole/>,
    settings: <PageSettings/>,
    billing: <PageBilling/>,
    auth: <PageAuth/>,
  };

  // Global command palette: pages, in-doc sections, and actions
  const cmdGroups = [
    { label: 'Navigate', items: NAV.flatMap(g => g.items).map(it => ({
      id: 'nav-' + it.id, label: it.label, description: 'Go to ' + it.label, icon: it.icon,
      searchText: it.label + ' ' + it.id,
      onSelect: () => go(it.id),
    })) },
    { label: 'Sections', items: buildSectionCommands(go) },
    { label: 'Actions', items: [
      { id: 'theme', label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', icon: theme === 'dark' ? 'sun' : 'moon', shortcut: '⌘L', onSelect: toggleTheme },
      { id: 'repo', label: 'Open repository', description: 'github.com/Tollerud', icon: 'github', onSelect: () => window.open('https://github.com/Tollerud/design-system', '_blank') },
    ] },
  ];

  return (
    <ToastProvider>
      <div className="ds-shell">
        <div className={`ds-nav-scrim ${navOpen ? 'is-open' : ''}`} onClick={() => setNavOpen(false)}/>
        <aside className={`ds-sidebar ds-themed ${navOpen ? 'ds-sidebar--open' : ''}`}>
          <div className="ds-sidebar__brand">
            <img className="ds-sidebar__logo" src="tollerud-logo.svg" alt=""/>
            <div>
              <div className="ds-sidebar__title">Tollerud</div>
              <div className="ds-sidebar__ver">design system · v1.0</div>
            </div>
          </div>
          <nav className="ds-sidebar__nav">
            {NAV.map(g => (
              <div className="ds-navgroup" key={g.group}>
                <div className="ds-navgroup__label">{g.group}</div>
                {g.items.map(it => {
                  const I = Icons[it.icon];
                  return (
                    <button key={it.id} className={`ds-navlink ${route === it.id ? 'ds-navlink--active' : ''}`} onClick={() => go(it.id)}>
                      <span className="ds-navlink__icon"><I size={15}/></span>{it.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        <div className="ds-main">
          <header className="ds-topbar ds-themed">
            <button className="ds-iconbtn ds-topbar__menu" onClick={() => setNavOpen(o => !o)} aria-label="Menu" aria-expanded={navOpen}>
              {navOpen ? <Icons.x/> : <Icons.menu/>}
            </button>
            <img className="ds-topbar__logo" src="tollerud-logo.svg" alt="Tollerud" onClick={() => go('overview')}/>            <span className="ds-topbar__crumb"><span className="ds-topbar__crumb-prefix">Design System <span style={{ opacity: .4, margin: '0 6px' }}>/</span> </span><b>{PAGE_TITLES[route] || 'Overview'}</b></span>
            <span className="ds-topbar__spacer"/>
            <button className="ds-topbar__cmd" onClick={() => setCmdOpen(true)} title="Command palette">
              <Icons.search size={14}/>
              <span className="ds-topbar__cmd-text">Search</span>
              <Kbd keys="⌘+K" size="sm"/>
            </button>
            {/* Background picker */}
            <span ref={bgPickerRef} style={{ position: 'relative' }}>
              <button className="ds-iconbtn" onClick={() => setBgPickerOpen(o => !o)} title="Change background" style={{ gap: 5 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: bgPresets[bgIdx].bg, border: '1.5px solid var(--border)', display: 'inline-block', flexShrink: 0 }}/>
                <Icons.layers size={14}/>
              </button>
              {bgPickerOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--surface-overlay)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, boxShadow: 'var(--shadow-lg)', zIndex: 100, minWidth: 160 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 8 }}>Background</div>
                  {bgPresets.map((p, i) => (
                    <button key={p.label} onClick={() => { setBgIdx(i); setBgPickerOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '6px 8px', border: 'none', borderRadius: 6, background: i === bgIdx ? 'var(--surface-hover)' : 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--foreground)', fontWeight: i === bgIdx ? 600 : 400 }}>
                      <span style={{ width: 18, height: 18, borderRadius: 4, background: p.bg, border: '1.5px solid var(--border)', flexShrink: 0 }}/>
                      {p.label}
                      {i === bgIdx && <Icons.check size={13} style={{ marginLeft: 'auto', color: 'var(--tollerud-yellow)' }}/>}
                    </button>
                  ))}
                </div>
              )}
            </span>
            <a className="ds-iconbtn" href="https://github.com/Tollerud/design-system" target="_blank" rel="noreferrer" title="Repository"><Icons.github/></a>
            <button className="ds-iconbtn" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
              <span className="ds-theme-icon" key={theme}>{theme === 'dark' ? <Icons.sun/> : <Icons.moon/>}</span>
            </button>
          </header>
          <main className="ds-content">
            <div className="ds-page" key={route}>
              {PAGES[route] || PAGES.overview}
            </div>
            <PageTOC route={route}/>
          </main>
        </div>
      </div>
      <CommandMenu open={cmdOpen} onClose={() => setCmdOpen(false)} groups={cmdGroups} placeholder="Search pages, sections, components…"/>
    </ToastProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
