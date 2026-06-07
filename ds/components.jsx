/* Tollerud DS — Component library (React). Uses the .tollerud-* classes
   + semantic tokens from globals.css so every component is theme-aware. → window */

/* ── Button ── */
function Button({ variant = 'secondary', size = 'md', children, className = '', ...p }) {
  return (
    <button className={`tollerud-btn tollerud-btn--${variant} tollerud-btn--${size} ${className}`} {...p}>
      {children}
    </button>
  );
}

/* ── Card ── */
function Card({ accent, density, children, className = '', style, ...p }) {
  return (
    <div className={`tollerud-card ${className}`}
      data-density={density || undefined}
      style={accent ? { borderColor: 'rgba(232,213,0,0.30)', ...style } : style} {...p}>
      {children}
    </div>
  );
}

/* ── Badge ── */
function Badge({ variant = 'default', children, ...p }) {
  return <span className={`tollerud-badge tollerud-badge--${variant}`} {...p}>{children}</span>;
}

/* ── Pill ── */
function Pill({ variant = 'outline', children }) {
  return <span className={`tollerud-pill tollerud-pill--${variant}`}>{children}</span>;
}

/* ── StatusDot ── */
function StatusDot({ status = 'online', label }) {
  return <span className={`tollerud-status tollerud-status--${status}`} style={{ color: 'var(--text-secondary)' }}>{label}</span>;
}

/* ── Kbd ── */
function Kbd({ keys, size }) {
  const arr = Array.isArray(keys) ? keys : String(keys).split('+');
  return (
    <span className={`tollerud-kbd ${size === 'sm' ? 'tollerud-kbd--sm' : ''}`}>
      {arr.map((k, i) => <kbd key={i} className="tollerud-kbd__key">{k}</kbd>)}
    </span>
  );
}

/* ── Input ── */
function Input({ label, error, id, className = '', ...p }) {
  const _id = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="ds-col" style={{ gap: 6 }}>
      {label && <label htmlFor={_id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <input id={_id} className={`tollerud-input ${className}`}
        style={error ? { borderColor: 'var(--destructive)' } : undefined} {...p}/>
      {error && <span style={{ fontSize: 12, color: 'var(--destructive)' }}>{error}</span>}
    </div>
  );
}

/* ── Textarea ── */
function Textarea({ label, error, id, rows = 4, ...p }) {
  const _id = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="ds-col" style={{ gap: 6 }}>
      {label && <label htmlFor={_id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <textarea id={_id} rows={rows} className="tollerud-input" style={{ resize: 'vertical', ...(error ? { borderColor: 'var(--destructive)' } : {}) }} {...p}/>
      {error && <span style={{ fontSize: 12, color: 'var(--destructive)' }}>{error}</span>}
    </div>
  );
}

/* ── Select ── */
function Select({ label, error, options, placeholder, children, id, ...p }) {
  const _id = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="ds-col" style={{ gap: 6 }}>
      {label && <label htmlFor={_id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <select id={_id} className="tollerud-input" style={{ appearance: 'none', paddingRight: 34, cursor: 'pointer', ...(error ? { borderColor: 'var(--destructive)' } : {}) }} {...p}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options ? options.map(o => <option key={o.value} value={o.value}>{o.label}</option>) : children}
        </select>
        <span style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}><Icons.chevDown size={15}/></span>
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--destructive)' }}>{error}</span>}
    </div>
  );
}

/* ── Checkbox ── */
function Checkbox({ label, checked, defaultChecked, disabled, onChange }) {
  const [on, setOn] = useState(defaultChecked || false);
  const isCtrl = checked !== undefined;
  const val = isCtrl ? checked : on;
  const toggle = (e) => { if (disabled) return; if (!isCtrl) setOn(e.target.checked); onChange && onChange(e); };
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 9, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontSize: 14, color: 'var(--foreground)' }}>
      <span style={{ position: 'relative', width: 18, height: 18, display: 'inline-flex' }}>
        <input type="checkbox" checked={val} disabled={disabled} onChange={toggle} style={{ position: 'absolute', opacity: 0, width: 18, height: 18, margin: 0, cursor: 'inherit' }}/>
        <span style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${val ? 'var(--tollerud-yellow)' : 'var(--input)'}`, background: val ? 'var(--tollerud-yellow)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', color: '#0A0A0A' }}>
          {val && <Icons.check size={13} strokeWidth={2.6}/>}
        </span>
      </span>
      {label}
    </label>
  );
}

/* ── Switch ── */
function Switch({ label, checked, defaultChecked, disabled, onChange }) {
  const [on, setOn] = useState(defaultChecked || false);
  const isCtrl = checked !== undefined;
  const val = isCtrl ? checked : on;
  const toggle = () => { if (disabled) return; const nv = !val; if (!isCtrl) setOn(nv); onChange && onChange({ target: { checked: nv } }); };
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontSize: 14, color: 'var(--foreground)' }}>
      <button type="button" role="switch" aria-checked={val} disabled={disabled} onClick={toggle}
        style={{ width: 38, height: 22, borderRadius: 999, border: 'none', padding: 2, cursor: disabled ? 'not-allowed' : 'pointer', background: val ? 'var(--tollerud-yellow)' : 'var(--input)', transition: 'background .2s', display: 'inline-flex', alignItems: 'center' }}>
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: val ? '#0A0A0A' : 'var(--card)', transform: val ? 'translateX(16px)' : 'translateX(0)', transition: 'transform .2s var(--motion-ease-out)', boxShadow: '0 1px 2px rgba(0,0,0,.3)' }}/>
      </button>
      {label}
    </label>
  );
}

/* ── Radio / RadioGroup ── */
function RadioGroup({ label, error, value, onChange, name, children }) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      {label && <legend style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, padding: 0 }}>{label}</legend>}
      <div className="ds-col" style={{ gap: 9 }} role="radiogroup">
        {React.Children.map(children, c => React.cloneElement(c, { name, checked: value === c.props.value, onChange: () => onChange && onChange(c.props.value) }))}
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--destructive)', marginTop: 6, display: 'block' }}>{error}</span>}
    </fieldset>
  );
}
function Radio({ label, value, checked, disabled, name, onChange }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 9, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontSize: 14, color: 'var(--foreground)' }}>
      <span style={{ position: 'relative', width: 18, height: 18, display: 'inline-flex' }}>
        <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} style={{ position: 'absolute', opacity: 0, width: 18, height: 18, margin: 0, cursor: 'inherit' }}/>
        <span style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${checked ? 'var(--tollerud-yellow)' : 'var(--input)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
          {checked && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--tollerud-yellow)' }}/>}
        </span>
      </span>
      {label}
    </label>
  );
}

/* ── StatCard ── */
function StatCard({ label, value, change, icon }) {
  const I = icon ? Icons[icon] : null;
  return (
    <div className="tollerud-stat ds-themed">
      <div className="ds-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="tollerud-stat__label">{label}</div>
          <div className="tollerud-stat__value">{value}</div>
        </div>
        {I && <span style={{ color: 'var(--text-muted)' }}><I size={18}/></span>}
      </div>
      {change && <div className={`tollerud-stat__change tollerud-stat__change--${change.direction}`}>{change.direction === 'up' ? '↑' : '↓'} {change.value}</div>}
    </div>
  );
}

/* ── Progress ── */
function Progress({ value = 0, max = 100 }) {
  return <div className="tollerud-progress ds-themed"><div className="tollerud-progress__bar" style={{ width: `${Math.min(100, (value / max) * 100)}%` }}/></div>;
}

/* ── Skeleton ── */
function Skeleton({ w = '100%', h = 16, r }) {
  return <div className="tollerud-skeleton" style={{ width: w, height: h, borderRadius: r }}/>;
}

/* ── Avatar ── */
function Avatar({ src, name = '', size = 36 }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="tollerud-avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : initials}
    </span>
  );
}

/* ── Divider ── */
function Divider({ accent }) { return <hr className={accent ? 'tollerud-divider tollerud-divider--accent' : 'tollerud-divider'}/>; }

/* ── Tabs ── */
function Tabs({ tabs, variant, defaultTab }) {
  const [active, setActive] = useState(defaultTab || tabs[0].id);
  const cur = tabs.find(t => t.id === active);
  return (
    <div>
      <div className={`tollerud-tabs ${variant === 'underline' ? 'tollerud-tabs--underline' : ''}`}>
        <div className="tollerud-tabs__list" role="tablist">
          {tabs.map(t => (
            <button key={t.id} role="tab" aria-selected={active === t.id}
              className={`tollerud-tabs__trigger ${active === t.id ? 'tollerud-tabs__trigger--active' : ''}`}
              onClick={() => setActive(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>
      {cur && cur.content && <div style={{ paddingTop: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{cur.content}</div>}
    </div>
  );
}

/* ── Segmented control ── */
function Segmented({ options, value, onChange }) {
  const [v, setV] = useState(value || options[0].value);
  const cur = value !== undefined ? value : v;
  return (
    <div className="tollerud-segmented ds-themed">
      {options.map(o => (
        <button key={o.value} aria-pressed={cur === o.value}
          onClick={() => { setV(o.value); onChange && onChange(o.value); }}>{o.label}</button>
      ))}
    </div>
  );
}

/* ── Tooltip ── */
function Tooltip({ label, children, side = 'top' }) {
  const [show, setShow] = useState(false);
  const pos = side === 'top'
    ? { bottom: '100%', left: '50%', transform: `translateX(-50%) translateY(${show ? '0' : '4px'})`, marginBottom: 7 }
    : { top: '100%', left: '50%', transform: `translateX(-50%) translateY(${show ? '0' : '-4px'})`, marginTop: 7 };
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
      {children}
      <span className="tollerud-tooltip" data-visible={show} style={pos}>{label}</span>
    </span>
  );
}

/* ── Alert ── */
function Alert({ tone = 'default', title, children, icon }) {
  const map = { default: 'info', accent: 'zap', error: 'alert', success: 'checkCircle', info: 'info' };
  const colors = { default: 'var(--text-muted)', accent: 'var(--tollerud-yellow)', error: 'var(--destructive)', success: 'var(--success)', info: 'var(--info)' };
  const I = Icons[icon || map[tone]] || Icons.info;
  return (
    <div className={`tollerud-alert ${tone !== 'default' ? 'tollerud-alert--' + tone : ''} ds-themed`}>
      <span className="tollerud-alert__icon" style={{ color: colors[tone] }}><I size={18}/></span>
      <div>
        {title && <div className="tollerud-alert__title">{title}</div>}
        <div className="tollerud-alert__msg">{children}</div>
      </div>
    </div>
  );
}

/* ── Accordion ── */
function Accordion({ items }) {
  const [open, setOpen] = useState(items[0] ? 0 : -1);
  return (
    <div className="tollerud-accordion ds-themed">
      {items.map((it, i) => (
        <div className="tollerud-accordion__item" key={i}>
          <button className="tollerud-accordion__trigger" onClick={() => setOpen(open === i ? -1 : i)}>
            {it.q}
            <span className={`tollerud-accordion__chev ${open === i ? 'tollerud-accordion__chev--open' : ''}`}><Icons.chevDown size={16}/></span>
          </button>
          {open === i && <div className="tollerud-accordion__panel">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}

/* ── Breadcrumb ── */
function Breadcrumb({ items }) {
  return (
    <nav className="tollerud-breadcrumb">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="tollerud-breadcrumb__sep"><Icons.chevRight size={13}/></span>}
          {i === items.length - 1 ? <span className="tollerud-breadcrumb__current">{it}</span> : <a href="#">{it}</a>}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ── Pagination ── */
function Pagination({ total = 7, current = 1 }) {
  const [page, setPage] = useState(current);
  return (
    <div className="tollerud-pagination ds-themed">
      <button disabled={page === 1} onClick={() => setPage(p => p - 1)}><Icons.chevLeft size={15}/></button>
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <button key={n} aria-current={page === n ? 'page' : undefined} onClick={() => setPage(n)}>{n}</button>
      ))}
      <button disabled={page === total} onClick={() => setPage(p => p + 1)}><Icons.chevRight size={15}/></button>
    </div>
  );
}

/* ── Slider ── */
function Slider({ min = 0, max = 100, defaultValue = 50, onChange }) {
  const [v, setV] = useState(defaultValue);
  return (
    <div className="ds-row" style={{ gap: 14 }}>
      <input type="range" className="tollerud-slider" min={min} max={max} value={v}
        onChange={e => { setV(+e.target.value); onChange && onChange(+e.target.value); }}/>
      <span className="ds-mono" style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 34, textAlign: 'right' }}>{v}</span>
    </div>
  );
}

/* ── Dropdown menu ── */
function DropdownMenu({ trigger, items }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target) &&
          menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', onScroll, true);
    return () => { document.removeEventListener('mousedown', close); window.removeEventListener('scroll', onScroll, true); };
  }, []);
  const openMenu = () => {
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX });
    setOpen(o => !o);
  };
  return (
    <span style={{ display: 'inline-flex' }} ref={triggerRef}>
      <span onClick={openMenu}>{trigger}</span>
      {open && ReactDOM.createPortal(
        <div ref={menuRef} className="tollerud-menu ds-themed" style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 9999 }}>
          {items.map((it, i) => it.sep
            ? <div key={i} className="tollerud-menu__sep"/>
            : it.label && it.heading
              ? <div key={i} className="tollerud-menu__label">{it.label}</div>
              : <button key={i} className="tollerud-menu__item" onClick={() => { setOpen(false); it.onSelect && it.onSelect(); }}>
                  {it.icon && React.createElement(Icons[it.icon])}{it.label}
                </button>
          )}
        </div>,
        document.body
      )}
    </span>
  );
}

/* ── EmptyState ── */
function EmptyState({ icon = 'folder', title, description, action, secondaryAction, compact, accent }) {
  const I = Icons[icon] || Icons.folder;
  return (
    <div className="ds-empty ds-themed" data-compact={compact ? 'true' : undefined} data-accent={accent ? 'true' : undefined}>
      <span className="ds-empty__icon"><I size={compact ? 20 : 24}/></span>
      {title && <div className="ds-empty__title">{title}</div>}
      {description && <p className="ds-empty__desc">{description}</p>}
      {(action || secondaryAction) && (
        <div className="ds-row" style={{ justifyContent: 'center', gap: 10, marginTop: 6 }}>{action}{secondaryAction}</div>
      )}
    </div>
  );
}

/* ── LogViewer — level-coded, searchable, follow-tail log surface ── */
const LOG_LEVEL_STYLE = {
  trace: { label: 'TRACE', color: 'var(--text-muted)' },
  debug: { label: 'DEBUG', color: 'var(--info)' },
  info:  { label: 'INFO',  color: 'var(--text-secondary)' },
  warn:  { label: 'WARN',  color: 'var(--warning)' },
  error: { label: 'ERROR', color: 'var(--destructive)' },
};
function LogViewer({ lines = [], follow = false, searchable = false, showLineNumbers = false, height = 300 }) {
  const [q, setQ] = useState('');
  const bodyRef = useRef(null);
  useEffect(() => { if (follow && bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [lines, follow]);
  const shown = lines.filter(l => !q ||
    (l.text || '').toLowerCase().includes(q.toLowerCase()) ||
    (l.source || '').toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden', width: '100%' }}>
      {searchable && (
        <div className="ds-row" style={{ gap: 10, padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
          <div className="tollerud-input ds-row" style={{ gap: 8, flex: 1, padding: '0 11px', height: 32 }}>
            <Icons.search size={14}/>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter…"
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: 'var(--foreground)', fontSize: 13, fontFamily: 'var(--font-mono)' }}/>
          </div>
          <span className="ds-mono" style={{ fontSize: 11.5, color: 'var(--text-muted)', flexShrink: 0 }}>{shown.length}/{lines.length}</span>
        </div>
      )}
      <div ref={bodyRef} className="ds-console__stream" style={{ height, overflow: 'auto', background: 'var(--background)' }}>
        {shown.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>No log output.</div>
        )}
        {shown.map((l, i) => {
          const lv = LOG_LEVEL_STYLE[l.level] || LOG_LEVEL_STYLE.info;
          return (
            <div key={i} className="ds-console__line" style={{ borderLeftColor: lv.color }}>
              {showLineNumbers && <span className="ds-console__ln">{String(i + 1).padStart(3, '0')}</span>}
              {l.timestamp && <span className="ds-console__ts">{l.timestamp}</span>}
              <span className="ds-console__lvl" style={{ color: lv.color }}>{lv.label}</span>
              {l.source && <span className="ds-console__src">{l.source}</span>}
              <span className="ds-console__msg" style={l.level === 'error' ? { color: 'var(--foreground)' } : undefined}>{l.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Spinner ── */
function Spinner({ size = 16, style }) {
  return <span className="ds-spin" style={{ width: size, height: size, ...style }}/>;
}

/* ── Panel — card with a header bar + optional footer ── */
function Panel({ title, icon, actions, footer, noPadding, children, className = '', style }) {
  const I = icon ? Icons[icon] : null;
  return (
    <div className={`tollerud-card ds-themed ${className}`} style={{ padding: 0, overflow: 'hidden', ...style }}>
      {(title || actions) && (
        <div className="ds-panel__head">
          <span className="ds-panel__title">{I && <I size={15}/>}{title}</span>
          {actions && <span className="ds-row" style={{ gap: 8 }}>{actions}</span>}
        </div>
      )}
      <div style={noPadding ? undefined : { padding: 16 }}>{children}</div>
      {footer && <div className="ds-panel__foot">{footer}</div>}
    </div>
  );
}

/* ── Meter — labeled progress with a hot threshold ── */
function Meter({ label, value, max = 100, valueLabel, hot = 85, unlimited }) {
  const pct = unlimited ? 100 : Math.max(0, Math.min(100, (value / max) * 100));
  const isHot = !unlimited && pct >= hot;
  return (
    <div>
      <div className="ds-row" style={{ justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{label}</span>
        <span className="ds-mono" style={{ fontSize: 12.5, color: isHot ? 'var(--destructive)' : 'var(--text-secondary)' }}>
          {valueLabel != null ? valueLabel : (unlimited ? value : `${value} / ${max}`)}
        </span>
      </div>
      <div className="tollerud-progress ds-themed">
        <div className="tollerud-progress__bar" style={{ width: `${pct}%`, background: isHot ? 'var(--destructive)' : 'var(--tollerud-yellow)', opacity: unlimited ? 0.35 : 1 }}/>
      </div>
    </div>
  );
}

/* ── Stepper — horizontal step indicator ── */
function Stepper({ steps, current = 0 }) {
  return (
    <div className="ds-wizard__steps">
      {steps.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo';
        return (
          <React.Fragment key={i}>
            <div className="ds-wizard__step" data-state={state}>
              <span className="ds-wizard__num">{state === 'done' ? <Icons.check size={14} strokeWidth={2.6}/> : i + 1}</span>
              <span className="ds-wizard__label">{label}</span>
            </div>
            {i < steps.length - 1 && <span className="ds-wizard__bar" data-done={i < current}/>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── PasswordInput — input with show/hide toggle ── */
function PasswordInput({ label, labelAction, error, id, className = '', ...p }) {
  const [show, setShow] = useState(false);
  const _id = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : 'password');
  return (
    <div className="ds-col" style={{ gap: 6 }}>
      {(label || labelAction) && (
        <div className="ds-row" style={{ justifyContent: 'space-between' }}>
          {label && <label htmlFor={_id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
          {labelAction}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <input id={_id} type={show ? 'text' : 'password'} className={`tollerud-input ${className}`}
          style={{ paddingRight: 38, ...(error ? { borderColor: 'var(--destructive)' } : {}) }} {...p}/>
        <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
          {show ? <Icons.eyeOff size={16}/> : <Icons.eye size={16}/>}
        </button>
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--destructive)' }}>{error}</span>}
    </div>
  );
}

/* ── FormRow — label + hint on the left, control on the right ── */
function FormRow({ label, hint, children }) {
  return (
    <div className="ds-formrow">
      <div className="ds-formrow__label">
        <div className="ds-formrow__title">{label}</div>
        {hint && <div className="ds-formrow__hint">{hint}</div>}
      </div>
      <div className="ds-formrow__control">{children}</div>
    </div>
  );
}

/* ── PricingCard — a single plan tier ── */
function PricingCard({ name, tagline, price, period = '/mo', priceNote, features = [], recommended, ribbon = 'Recommended', cta, ctaVariant, ctaDisabled, onCta }) {
  const free = price === 0 || price === 'Free' || price === '$0';
  return (
    <div className="ds-price ds-themed" data-recommended={recommended ? 'true' : undefined}>
      {recommended && <span className="ds-price__ribbon">{ribbon}</span>}
      <div className="ds-price__name">{name}</div>
      {tagline && <div className="ds-price__tag">{tagline}</div>}
      <div className="ds-price__amount">
        {free
          ? <span className="ds-price__num">Free</span>
          : <><span className="ds-price__num">{typeof price === 'number' ? '$' + price : price}</span><span className="ds-price__per">{period}</span></>}
      </div>
      {priceNote && <div className="ds-price__sub">{priceNote}</div>}
      {cta && <Button variant={ctaVariant || (recommended ? 'primary' : 'ghost')} size="md" disabled={ctaDisabled} onClick={onCta} className="ds-price__cta">{cta}</Button>}
      <hr className="tollerud-divider"/>
      <ul className="ds-price__features">
        {features.map((f, i) => <li key={i}><span className="ds-price__check"><Icons.check2 size={17}/></span>{f}</li>)}
      </ul>
    </div>
  );
}

/* ── Dialog / Modal ── */
function Dialog({ open, onClose, title, description, children, footer }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="tollerud-overlay" onClick={onClose}>
      <div className="tollerud-dialog ds-themed" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="tollerud-dialog__body">
          {title && <div className="tollerud-dialog__title">{title}</div>}
          {description && <div className="tollerud-dialog__desc">{description}</div>}
          {children}
        </div>
        {footer && <div className="tollerud-dialog__foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

/* ── Drawer / Sheet ── */
function Drawer({ open, onClose, side = 'right', title, description, children, footer, width = 380 }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="tollerud-overlay" onClick={onClose}>
      <div className={`ds-drawer ds-drawer--${side} ds-themed`} style={{ width }} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="ds-drawer__head">
          <div style={{ minWidth: 0 }}>
            {title && <div className="ds-drawer__title">{title}</div>}
            {description && <div className="ds-drawer__desc">{description}</div>}
          </div>
          <button className="ds-iconbtn" style={{ width: 30, height: 30, flexShrink: 0 }} onClick={onClose} aria-label="Close"><Icons.x size={16}/></button>
        </div>
        <div className="ds-drawer__body">{children}</div>
        {footer && <div className="ds-drawer__foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

/* ── Combobox — searchable single-select with keyboard nav ── */
function Combobox({ options = [], value, onChange, placeholder = 'Search…', label, emptyText = 'No matches' }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [internal, setInternal] = useState(null);
  const [popPos, setPopPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef(null);
  const popRef = useRef(null);
  const isCtrl = value !== undefined;
  const selected = isCtrl ? value : internal;
  const selectedLabel = (options.find(o => o.value === selected) || {}).label || '';
  const filtered = q ? options.filter(o => o.label.toLowerCase().includes(q.toLowerCase())) : options;

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target) &&
          popRef.current && !popRef.current.contains(e.target)) { setOpen(false); setQ(''); }
    };
    const onScroll = () => { setOpen(false); setQ(''); };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('scroll', onScroll, true);
    return () => { document.removeEventListener('mousedown', onDoc); window.removeEventListener('scroll', onScroll, true); };
  }, []);

  const openPop = () => {
    const r = wrapRef.current.getBoundingClientRect();
    setPopPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX, width: r.width });
    setOpen(true);
  };

  const choose = (o) => { if (!isCtrl) setInternal(o.value); onChange && onChange(o.value); setOpen(false); setQ(''); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) openPop(); setActive(a => Math.min(filtered.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (open && filtered[active]) choose(filtered[active]); else openPop(); }
    else if (e.key === 'Escape') { setOpen(false); setQ(''); }
  };

  return (
    <div className="ds-col" style={{ gap: 6 }} ref={wrapRef}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <div className="tollerud-input ds-row" style={{ gap: 8, height: 38, cursor: 'text' }} onClick={openPop}>
        <Icons.search size={15}/>
        <input value={open ? q : selectedLabel} onChange={e => { setQ(e.target.value); if (!open) openPop(); setActive(0); }}
          onFocus={openPop} onKeyDown={onKey}
          placeholder={selectedLabel || placeholder}
          style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: 'var(--foreground)', fontSize: 13.5 }}/>
        <Icons.chevDown size={15} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s', color: 'var(--text-muted)' }}/>
      </div>
      {open && ReactDOM.createPortal(
        <div ref={popRef} className="ds-combobox__pop ds-themed" style={{ position: 'absolute', top: popPos.top, left: popPos.left, width: popPos.width, zIndex: 9999 }}>
          {filtered.length === 0 && <div className="ds-combobox__empty">{emptyText}</div>}
          {filtered.map((o, i) => (
            <button key={o.value} className="ds-combobox__opt" data-active={i === active} data-selected={o.value === selected}
              onMouseEnter={() => setActive(i)} onClick={() => choose(o)}>
              <span>{o.label}</span>
              {o.value === selected && <Icons.check size={14}/>}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

/* ── AvatarGroup — stacked avatars with overflow + presence ── */
function AvatarGroup({ users = [], max = 4, size = 32 }) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className="ds-avatar-group">
      {shown.map((u, i) => (
        <span key={i} className="ds-avatar-group__item" style={{ zIndex: shown.length - i }} title={u.name}>
          <Avatar src={u.src} name={u.name} size={size}/>
          {u.status && <span className={`ds-avatar-group__dot tollerud-status--${u.status}`} style={{ width: Math.max(8, size * 0.28), height: Math.max(8, size * 0.28) }}/>}
        </span>
      ))}
      {extra > 0 && <span className="tollerud-avatar ds-avatar-group__more" style={{ width: size, height: size, fontSize: size * 0.36 }}>+{extra}</span>}
    </div>
  );
}

Object.assign(window, {
  Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select,
  Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar,
  Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination,
  Slider, DropdownMenu, Dialog, EmptyState, LogViewer,
  Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard,
  Drawer, Combobox, AvatarGroup,
});
