/* Tollerud DS — Build example: live logs + interactive shell. → window.PageConsole */
(function () {

const LOG_LEVELS = {
  trace: { label: 'TRACE', color: 'var(--text-muted)' },
  debug: { label: 'DEBUG', color: 'var(--info)' },
  info:  { label: 'INFO',  color: 'var(--text-secondary)' },
  warn:  { label: 'WARN',  color: 'var(--warning)' },
  error: { label: 'ERROR', color: 'var(--destructive)' },
};

/* Seed lines + a pool the streamer draws from. */
const LOG_SEED = [
  { level: 'info',  src: 'systemd', msg: 'Started tollerud-agent.service — Tia control plane.' },
  { level: 'info',  src: 'hermes',  msg: 'Listening on 0.0.0.0:8080 (4 workers)' },
  { level: 'debug', src: 'nginx',   msg: 'reload: configuration /etc/nginx/nginx.conf test is successful' },
  { level: 'info',  src: 'postgres',msg: 'database system is ready to accept connections' },
  { level: 'warn',  src: 'nginx',   msg: 'upstream response time 1.84s exceeds 1.5s budget' },
  { level: 'info',  src: 'hermes',  msg: 'GET /api/v1/hosts 200 in 23ms' },
  { level: 'error', src: 'nginx',   msg: 'connect() failed (111: Connection refused) upstream emma:443' },
  { level: 'info',  src: 'backup',  msg: 'rclone sync → JottaCloud:emma-config (4.2 GB) complete' },
];
const LOG_POOL = [
  { level: 'info',  src: 'hermes',  msg: () => `GET /api/v1/${['hosts','stacks','alerts','metrics'][r(4)]} 200 in ${r(40)+8}ms` },
  { level: 'info',  src: 'hermes',  msg: () => `POST /api/v1/deploy 202 accepted job=${Math.random().toString(36).slice(2,8)}` },
  { level: 'debug', src: 'postgres',msg: () => `SELECT … duration: ${(Math.random()*12+0.4).toFixed(1)}ms` },
  { level: 'debug', src: 'nginx',   msg: () => `${r(255)}.${r(255)}.0.${r(255)} "GET / HTTP/2" 200`},
  { level: 'info',  src: 'systemd', msg: () => `tollerud-agent: heartbeat ok · ${r(3)+2} hosts reachable` },
  { level: 'warn',  src: 'iris',    msg: () => `cpu sustained at ${r(12)+85}% for ${r(4)+2}m` },
  { level: 'warn',  src: 'pia',     msg: () => `disk usage ${r(8)+71}% on /hdd` },
  { level: 'error', src: 'hermes',  msg: () => `health check failed for ${['hermes','grafana','prometheus'][r(3)]} (timeout)` },
  { level: 'trace', src: 'agent',   msg: () => `tick scheduler queue depth=${r(6)}` },
  { level: 'info',  src: 'backup',  msg: () => `snapshot ${['emma','iris','pia'][r(3)]}-config ${(Math.random()*3+0.8).toFixed(1)} GB` },
];
function r(n) { return Math.floor(Math.random() * n); }
function clock(d = new Date()) { return d.toTimeString().slice(0, 8); }

/* ── StreamingLogViewer — live auto-scrolling log surface (console page only) ── */
function StreamingLogViewer() {
  const toast = useToast();
  const [lines, setLines] = useState(() => LOG_SEED.map((l, i) => ({ ...l, id: i, ts: clock(new Date(Date.now() - (LOG_SEED.length - i) * 1400)) })));
  const [follow, setFollow] = useState(true);
  const [q, setQ] = useState('');
  const [active, setActive] = useState({ trace: true, debug: true, info: true, warn: true, error: true });
  const bodyRef = useRef(null);
  const idRef = useRef(LOG_SEED.length);

  useEffect(() => {
    if (!follow) return;
    const t = setInterval(() => {
      const p = LOG_POOL[r(LOG_POOL.length)];
      setLines(ls => {
        const next = [...ls, { id: idRef.current++, level: p.level, src: p.src, msg: typeof p.msg === 'function' ? p.msg() : p.msg, ts: clock() }];
        return next.length > 400 ? next.slice(next.length - 400) : next;
      });
    }, 1400);
    return () => clearInterval(t);
  }, [follow]);

  useEffect(() => {
    if (follow && bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, follow]);

  const counts = lines.reduce((a, l) => { a[l.level] = (a[l.level] || 0) + 1; return a; }, {});
  const shown = lines.filter(l => active[l.level] && (!q || l.msg.toLowerCase().includes(q.toLowerCase()) || l.src.includes(q.toLowerCase())));

  const download = () => {
    const text = lines.map(l => `${l.ts} ${LOG_LEVELS[l.level].label.padEnd(5)} ${l.src.padEnd(9)} ${l.msg}`).join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a'); a.href = url; a.download = 'tollerud-agent.log'; a.click();
    URL.revokeObjectURL(url);
    toast({ tone: 'success', title: `Exported ${lines.length} log lines` });
  };

  return (
    <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
      {/* toolbar */}
      <div className="ds-row" style={{ justifyContent: 'space-between', gap: 12, padding: '12px 14px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <div className="ds-row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="tollerud-input ds-row" style={{ gap: 8, width: 232, padding: '0 11px', height: 34 }}>
            <Icons.search size={14}/>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter log output…"
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: 'var(--foreground)', fontSize: 13, fontFamily: 'var(--font-mono)' }}/>
            {q && <button onClick={() => setQ('')} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><Icons.x size={13}/></button>}
          </div>
          <div className="ds-row ds-console__levels" style={{ gap: 5, flexWrap: 'wrap' }}>
            {Object.keys(LOG_LEVELS).map(k => (
              <button key={k} onClick={() => setActive(a => ({ ...a, [k]: !a[k] }))}
                className="ds-console__lvlchip" data-on={active[k]}
                style={{ '--lvl': LOG_LEVELS[k].color }}>
                <span className="ds-console__lvldot" style={{ background: LOG_LEVELS[k].color }}/>
                {LOG_LEVELS[k].label}<span style={{ opacity: .55 }}>{counts[k] || 0}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="ds-row" style={{ gap: 12, flexShrink: 0 }}>
          <Switch label="Follow" checked={follow} onChange={e => setFollow(e.target.checked)}/>
          <button className="ds-iconbtn" style={{ width: 32, height: 32 }} title="Download .log" onClick={download}><Icons.download size={15}/></button>
          <button className="ds-iconbtn" style={{ width: 32, height: 32 }} title="Clear" onClick={() => { setLines([]); toast({ tone: 'info', title: 'Log cleared' }); }}><Icons.trash size={15}/></button>
        </div>
      </div>

      {/* stream */}
      <div ref={bodyRef} className="ds-console__stream" style={{ height: 340, overflow: 'auto', background: 'var(--background)' }}>
        {shown.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>
            {lines.length === 0 ? 'No log output — stream cleared.' : `No lines match “${q}”.`}
          </div>
        )}
        {shown.map(l => (
          <div key={l.id} className="ds-console__line" style={{ borderLeftColor: LOG_LEVELS[l.level].color }}>
            <span className="ds-console__ln">{String(l.id + 1).padStart(3, '0')}</span>
            <span className="ds-console__ts">{l.ts}</span>
            <span className="ds-console__lvl" style={{ color: LOG_LEVELS[l.level].color }}>{LOG_LEVELS[l.level].label}</span>
            <span className="ds-console__src">{l.src}</span>
            <span className="ds-console__msg" style={l.level === 'error' ? { color: 'var(--foreground)' } : undefined}>{l.msg}</span>
          </div>
        ))}
      </div>

      {/* footer */}
      <div className="ds-row" style={{ justifyContent: 'space-between', gap: 10, padding: '9px 14px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <span className="ds-mono" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
          {shown.length} / {lines.length} lines{q && ` · matching “${q}”`}
        </span>
        <span className="ds-row" style={{ gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: follow ? 'var(--success)' : 'var(--text-muted)', boxShadow: follow ? '0 0 6px var(--success)' : 'none' }}/>
          <span className="ds-mono" style={{ fontSize: 11.5, color: follow ? 'var(--success)' : 'var(--text-muted)' }}>{follow ? 'streaming' : 'paused'}</span>
        </span>
      </div>
    </div>
  );
}

/* ── Interactive shell ── */
const HOSTS = ['emma', 'pia', 'iris', 'miriam', 'embla'];
function runCommand(raw, ctx) {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const a = args.join(' ');
  switch (cmd) {
    case '': return [];
    case 'help': return [
      'Available commands:',
      '  help              show this list',
      '  ls                list working directory',
      '  ps                running containers',
      '  status            tollerud-agent service status',
      '  uptime            host uptime + load',
      '  ssh <host>        connect to a host',
      '  deploy            roll out the current stack',
      '  whoami / hostname / date / echo / clear',
    ];
    case 'ls': return ['compose.yml   config/   logs/   backups/   .env'];
    case 'ps': return [
      'CONTAINER   IMAGE              STATUS',
      'a1f2  hermes:v2.0        Up 14d',
      'b7c3  nginx:1.27         Up 14d',
      'c9d1  postgres:16        Up 14d',
      'e4a8  grafana:11.2       Up  3d (healthy)',
    ];
    case 'status': return [
      '● tollerud-agent.service — Tia control plane',
      '   Loaded: loaded (/etc/systemd/system/tollerud-agent.service)',
      '   Active: \u001bactive (running)\u001b since Mon 14d ago',
      '   Memory: 182.4M   Tasks: 24',
    ];
    case 'uptime': return [`${clock()} up 14 days,  3:21,  2 users,  load average: 0.42, 0.51, 0.48`];
    case 'whoami': return ['tia'];
    case 'hostname': return ['emma.tollerud.no'];
    case 'date': return [new Date().toString()];
    case 'echo': return [a];
    case 'ssh':
      if (!args[0]) return ['ssh: usage: ssh <host>'];
      if (!HOSTS.includes(args[0])) return [`ssh: could not resolve hostname ${args[0]}`];
      ctx.setHost(args[0]);
      return [`Connected to ${args[0]}.tollerud.no — last login ${clock()}`];
    case 'deploy': return ['→ docker compose up -d', '✓ 4 services reconciled · 0 changed', 'deploy complete in 2.4s'];
    case 'clear': ctx.clear(); return null;
    default: return [`command not found: ${cmd} — try \u0027help\u0027`];
  }
}

function Terminal() {
  const [host, setHost] = useState('emma');
  const [history, setHistory] = useState([
    { type: 'out', lines: ['Tollerud shell · type \u0027help\u0027 to get started.'] },
  ]);
  const [input, setInput] = useState('');
  const [past, setPast] = useState([]);
  const [ptr, setPtr] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [history]);

  const prompt = `tia@${host}:~$`;
  const submit = () => {
    const raw = input;
    const ctx = { setHost, clear: () => setHistory([]) };
    const out = runCommand(raw, ctx);
    setHistory(h => {
      const base = [...h, { type: 'in', prompt, text: raw }];
      if (out === null) return [];
      return out.length ? [...base, { type: 'out', lines: out }] : base;
    });
    if (raw.trim()) setPast(p => [...p, raw]);
    setPtr(-1); setInput('');
  };
  const onKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setPast(p => { if (!p.length) return p; const ni = ptr < 0 ? p.length - 1 : Math.max(0, ptr - 1); setPtr(ni); setInput(p[ni]); return p; }); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setPast(p => { if (ptr < 0) return p; const ni = ptr + 1; if (ni >= p.length) { setPtr(-1); setInput(''); } else { setPtr(ni); setInput(p[ni]); } return p; }); }
    else if ((e.ctrlKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); setHistory([]); }
  };

  const renderOut = (t) => {
    // crude inline accent: \u001b…\u001b wraps a success-colored span
    if (t.includes('\u001b')) {
      const parts = t.split('\u001b');
      return parts.map((p, i) => i % 2 ? <span key={i} style={{ color: 'var(--success)' }}>{p}</span> : p);
    }
    return t;
  };

  return (
    <div className="tollerud-card ds-themed ds-console__term" style={{ padding: 0, overflow: 'hidden' }} onClick={() => inputRef.current && inputRef.current.focus()}>
      <div className="ds-row" style={{ gap: 8, padding: '9px 14px', borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
        <span style={{ display: 'flex', gap: 6 }}>
          {['var(--destructive)', 'var(--warning)', 'var(--success)'].map((c, i) => <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: .85 }}/>)}
        </span>
        <span className="ds-mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>{prompt.replace('$', '')} — bash</span>
        <span style={{ flex: 1 }}/>
        <StatusDot status="online" label=""/>
      </div>
      <div ref={bodyRef} className="ds-console__termbody" style={{ height: 300, overflow: 'auto', background: 'var(--background)' }}>
        {history.map((h, i) => h.type === 'in'
          ? <div key={i} className="ds-console__termline"><span style={{ color: 'var(--tollerud-yellow)' }}>{h.prompt}</span> <span style={{ color: 'var(--foreground)' }}>{h.text}</span></div>
          : h.lines.map((l, j) => <div key={i + '-' + j} className="ds-console__termline" style={{ color: 'var(--text-secondary)' }}>{renderOut(l)}</div>)
        )}
        <div className="ds-console__termline ds-console__prompt">
          <span style={{ color: 'var(--tollerud-yellow)', whiteSpace: 'nowrap', flexShrink: 0 }}>{prompt}</span>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
            autoComplete="off" spellCheck={false}
            style={{ flex: 1, minWidth: 0, marginLeft: 8, background: 'transparent', border: 'none', outline: 'none', color: 'var(--foreground)', fontFamily: 'var(--font-mono)', fontSize: 13 }}/>
        </div>
      </div>
    </div>
  );
}

function PageConsole() {
  return (
    <div>
      <PageHeader icon="code" eyebrow="Build · console" title="Logs & Console"
        lede="The infrastructure surface: a live, filterable log stream and a keyboard-first interactive shell — both assembled from system tokens and theme-aware in light and dark."/>

      <Section title="Live log stream"
        desc="Streaming output with per-level filtering, search, follow-tail, line numbers and one-click export. Toggle a level chip to mute it; flip Follow to pause auto-scroll.">
        <StreamingLogViewer/>
      </Section>

      <Section title="Interactive shell"
        desc="A working REPL — type a command and hit Enter. Try help, ps, status, uptime, or ssh iris. ↑/↓ walk command history; Ctrl+L clears.">
        <Terminal/>
      </Section>
    </div>
  );
}
window.PageConsole = PageConsole;
})();
