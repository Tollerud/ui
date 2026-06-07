/* Tollerud DS — Navigation & Overlays. → window.PageNavOverlays */

/* ── Command palette (Raycast-style) ── */
function CommandMenu({ open, onClose, groups, placeholder = 'Search pages, sections, actions…' }) {
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const inputRef = useRef(null);
  const flat = [];
  groups.forEach(g => g.items.forEach(it => { if (!q || (window.matchesCommandQuery ? window.matchesCommandQuery(it, q) : (it.label + ' ' + (it.description || '')).toLowerCase().includes(q.toLowerCase()))) flat.push(it); }));
  useEffect(() => { if (open) { setQ(''); setHi(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') { e.preventDefault(); setHi(i => Math.min(flat.length - 1, i + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(i => Math.max(0, i - 1)); }
      else if (e.key === 'Enter') { const it = flat[hi]; if (it) { it.onSelect && it.onSelect(); onClose(); } }
    };
    document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h);
  }, [open, flat, hi, onClose]);
  if (!open) return null;
  let idx = -1;
  return (
    <div className="tollerud-cmd-overlay" onClick={onClose}>
      <div className="tollerud-cmd ds-themed" onClick={e => e.stopPropagation()} style={{ background: 'var(--surface-overlay)' }}>
        <div className="tollerud-cmd__header">
          <span className="tollerud-cmd__search-icon"><Icons.search size={17}/></span>
          <input ref={inputRef} className="tollerud-cmd__input" placeholder={placeholder} value={q} onChange={e => { setQ(e.target.value); setHi(0); }}/>
          <Kbd keys="Esc" size="sm"/>
        </div>
        <div className="tollerud-cmd__list">
          {flat.length === 0 && <div className="tollerud-cmd__empty">No results for “{q}”</div>}
          {groups.map(g => {
            const items = g.items.filter(it => !q || (window.matchesCommandQuery ? window.matchesCommandQuery(it, q) : (it.label + ' ' + (it.description || '')).toLowerCase().includes(q.toLowerCase())));
            if (!items.length) return null;
            return (
              <div className="tollerud-cmd__group" key={g.label}>
                <div className="tollerud-cmd__group-label">{g.label}</div>
                {items.map(it => {
                  idx++; const active = idx === hi; const I = it.icon ? Icons[it.icon] : Icons.dot;
                  return (
                    <button key={it.id} className={`tollerud-action-row ${active ? 'tollerud-action-row--highlighted' : ''}`}
                      onMouseEnter={() => setHi(idx)} onClick={() => { it.onSelect && it.onSelect(); onClose(); }}>
                      <span className="tollerud-action-row__icon"><I size={17}/></span>
                      <span className="tollerud-action-row__content">
                        <span className="tollerud-action-row__label">{it.label}</span>
                        {it.description && <span className="tollerud-action-row__description">{it.description}</span>}
                      </span>
                      {it.shortcut && <span className="tollerud-action-row__shortcut"><Kbd keys={it.shortcut} size="sm"/></span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="tollerud-cmd__footer">
          <span className="tollerud-cmd__hint"><Kbd keys="↑" size="sm"/><Kbd keys="↓" size="sm"/><span className="tollerud-cmd__hint-text">navigate</span></span>
          <span className="tollerud-cmd__hint"><Kbd keys="↵" size="sm"/><span className="tollerud-cmd__hint-text">select</span></span>
        </div>
      </div>
    </div>
  );
}

function PageNavOverlays() {
  const toast = useToast();
  const [dialog, setDialog] = useState(false);
  const [cmd, setCmd] = useState(false);

  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd(true); } };
    document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h);
  }, []);

  const cmdGroups = [
    { label: 'Servers', items: [
      { id: 'emma', label: 'emma.tollerud.no', description: 'SSH · 4 containers · uptime 14d', icon: 'server', onSelect: () => toast({ tone: 'info', title: 'Connecting to emma…' }) },
      { id: 'pia', label: 'pia.tollerud.no', description: 'SSH · 2 containers · uptime 9d', icon: 'server', onSelect: () => toast({ tone: 'info', title: 'Connecting to pia…' }) },
    ]},
    { label: 'Actions', items: [
      { id: 'backup', label: 'Run Backup', description: 'rclone to JottaCloud', icon: 'database', shortcut: '⌘B', onSelect: () => toast({ tone: 'success', title: 'Backup started' }) },
      { id: 'deploy', label: 'Deploy Stack', description: 'docker compose up -d', icon: 'rocket', shortcut: '↵', onSelect: () => toast({ tone: 'accent', title: 'Deploying…' }) },
    ]},
  ];

  return (
    <div>
      <PageHeader icon="compass" eyebrow="Navigation & Overlays" title="Navigation & Overlays"
        lede="Wayfinding and floating surfaces — breadcrumbs, pagination, menus, dialogs, toasts and the keyboard-first command palette."/>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0 32px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Navigation</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)', margin: 0 }}/>
      </div>

      <Section title="Breadcrumb" desc="Shows the user's location in the hierarchy. Items are clickable except the last (current).">
        <Demo name="breadcrumb" variant="col" code={`<Breadcrumb items={['Servers', 'emma', 'Containers']} />`}>
          <Breadcrumb items={['Servers', 'emma', 'Containers']}/>
        </Demo>
      </Section>

      <Section title="Segmented control" desc="Switch between a small set of mutually exclusive views.">
        <Demo name="segmented" variant="center" code={`<Segmented options={[{value:'grid',label:'Grid'},{value:'list',label:'List'}]} />`}>
          <div className="ds-row" style={{ gap: 14 }}>
            <Segmented options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'graph', label: 'Graph' }]}/>
            <Segmented options={[{ value: '24h', label: '24h' }, { value: '7d', label: '7d' }, { value: '30d', label: '30d' }]}/>
          </div>
        </Demo>
      </Section>

      <Section title="Pagination" desc="Numbered pages with prev/next, keyboard and disabled-edge handling.">
        <Demo name="pagination" variant="center" code={`<Pagination total={7} current={1} />`}>
          <Pagination total={7} current={1}/>
        </Demo>
      </Section>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0 32px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Overlays</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)', margin: 0 }}/>
      </div>

      <Section title="Dropdown menu" desc="A floating action menu with sections, icons and separators. Click outside to dismiss.">
        <Demo name="dropdown" variant="center" code={`<DropdownMenu trigger={<Button variant="secondary">Actions ▾</Button>} items={[
  { label: 'Account', heading: true },
  { label: 'Profile', icon: 'user', onSelect },
  { label: 'Settings', icon: 'settings', onSelect },
  { sep: true },
  { label: 'Sign out', icon: 'logout', onSelect },
]} />`}>
          <DropdownMenu trigger={<Button variant="secondary">Actions ▾</Button>} items={[
            { label: 'Account', heading: true },
            { label: 'Profile', icon: 'user', onSelect: () => toast({ tone: 'info', title: 'Profile' }) },
            { label: 'Settings', icon: 'settings', onSelect: () => toast({ tone: 'info', title: 'Settings' }) },
            { sep: true },
            { label: 'Sign out', icon: 'logout', onSelect: () => toast({ tone: 'info', title: 'Signed out' }) },
          ]}/>
        </Demo>
      </Section>

      <Section title="Dialog" desc="A focused modal for confirmation. Escape or backdrop click closes; destructive intent reads in the copy.">
        <Demo name="dialog" variant="center" code={`<Button variant="destructive" onClick={() => setOpen(true)}>Stop containers</Button>

<Dialog open={open} onClose={close}
  title="Stop all containers on emma?"
  description="This stops 4 running services. They can be restarted from the dashboard."
  footer={<>
    <Button variant="ghost" onClick={close}>Cancel</Button>
    <Button variant="destructive" onClick={confirm}>Stop</Button>
  </>} />`}>
          <Button variant="destructive" onClick={() => setDialog(true)}>Stop containers</Button>
          <Dialog open={dialog} onClose={() => setDialog(false)}
            title="Stop all containers on emma?"
            description="This stops 4 running services. They can be restarted from the dashboard at any time."
            footer={<>
              <Button variant="ghost" onClick={() => setDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { setDialog(false); toast({ tone: 'error', title: 'emma — 4 containers stopped' }); }}>Stop</Button>
            </>}/>
        </Demo>
      </Section>

      <Section title="Toasts" desc="Transient confirmations, bottom-right. Four tones, auto-dismiss, stackable.">
        <Demo name="toasts" variant="center" code={`const toast = useToast();
<Button onClick={() => toast({ tone: 'success', title: 'emma — deployment complete' })}>Success</Button>`}>
          <Button variant="secondary" onClick={() => toast({ tone: 'success', title: 'emma — deployment complete', message: 'hermes v2.0 is live' })}>Success</Button>
          <Button variant="secondary" onClick={() => toast({ tone: 'error', title: 'Port 8080 is in use', message: 'Pick another port and retry' })}>Error</Button>
          <Button variant="secondary" onClick={() => toast({ tone: 'info', title: 'Backup scheduled for 03:00' })}>Info</Button>
          <Button variant="secondary" onClick={() => toast({ tone: 'accent', title: 'New version available', message: 'v1.1 — see changelog' })}>Accent</Button>
        </Demo>
      </Section>

      <Section title="Command palette" desc="The signature component. ⌘K opens it anywhere; arrow keys navigate, Enter selects, Esc closes.">
        <Demo name="command" variant="center" code={`useEffect(() => {
  const h = e => { if ((e.metaKey||e.ctrlKey) && e.key==='k') { e.preventDefault(); setOpen(true); } };
  document.addEventListener('keydown', h);
  return () => document.removeEventListener('keydown', h);
}, []);

<CommandMenu open={open} onClose={close} groups={groups} />`}>
          <div className="ds-row" style={{ gap: 12 }}>
            <Button variant="terminal" onClick={() => setCmd(true)}>open_command</Button>
            <span className="ds-row" style={{ gap: 7, fontSize: 13, color: 'var(--text-muted)' }}>or press <Kbd keys="⌘+K"/></span>
          </div>
          <CommandMenu open={cmd} onClose={() => setCmd(false)} groups={cmdGroups}/>
        </Demo>
      </Section>
    </div>
  );
}
window.CommandMenu = CommandMenu;
window.PageNavOverlays = PageNavOverlays;
