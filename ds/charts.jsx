/* Tollerud DS — Charts. Palette-aware SVG charts. → window
   { BarChart, AreaChart, Donut, Sparkline } */

/* ── Bar chart ── */
function BarChart({ data, height = 180 }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height, padding: '0 4px', borderBottom: '1px solid var(--chart-grid)' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <span className="ds-mono" style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 5 }}>{d.value}</span>
            <div style={{ width: '100%', maxWidth: 38, height: `${(d.value / max) * 100}%`, background: d.accent ? 'var(--tollerud-yellow)' : 'var(--tollerud-noir-600)', borderRadius: '3px 3px 0 0', transition: 'height .5s var(--motion-ease-out)' }}/>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '8px 4px 0' }}>
        {data.map((d, i) => <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>{d.label}</div>)}
      </div>
    </div>
  );
}

/* ── Area / line chart ── */
function AreaChart({ data, height = 180 }) {
  const w = 520, h = height, pad = 8;
  const max = Math.max(...data) * 1.1, min = Math.min(...data, 0);
  const x = i => pad + (i / (data.length - 1)) * (w - pad * 2);
  const y = v => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const line = data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;
  const gid = 'areaFill-' + (height | 0);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D500" stopOpacity="0.30"/>
          <stop offset="100%" stopColor="#E8D500" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g, i) => <line key={i} x1={pad} x2={w - pad} y1={h * g} y2={h * g} stroke="var(--chart-grid)" strokeWidth="1"/>)}
      <polygon points={area} fill={`url(#${gid})`}/>
      <polyline points={line} fill="none" stroke="#E8D500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="var(--card)" stroke="#E8D500" strokeWidth="1.5"/>)}
    </svg>
  );
}

/* ── Donut ── */
function Donut({ segments, size = 160 }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = size / 2 - 14, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="ds-row" style={{ gap: 24 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth="14"/>
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const gap = len > 10 ? 4 : 0;
          const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth="14"
            strokeDasharray={`${Math.max(0.1, len - gap)} ${c - (len - gap)}`} strokeDashoffset={-offset} strokeLinecap="butt"/>;
          offset += len; return el;
        })}
      </svg>
      <div className="ds-col" style={{ gap: 8 }}>
        {segments.map((s, i) => (
          <div key={i} className="ds-row" style={{ gap: 8, fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }}/>
            <span style={{ color: 'var(--foreground)', minWidth: 70 }}>{s.label}</span>
            <span className="ds-mono" style={{ color: 'var(--text-muted)' }}>{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sparkline ── */
function Sparkline({ data, w = 120, h = 34, color = '#E8D500' }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - min) / (max - min || 1)) * (h - 4)}`).join(' ');
  return <svg width={w} height={h} style={{ display: 'block' }}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

Object.assign(window, { BarChart, AreaChart, Donut, Sparkline });
