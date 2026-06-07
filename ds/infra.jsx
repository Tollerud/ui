/* Tollerud DS — Homelab / Infrastructure components. → window
   HostCard · ServiceHealthCard · DockerStackCard · IncidentCard · AlertInbox
   · ApprovalCard · RollbackPlan · BackupStatusPanel · ActionDiff
   Severity scale shared across IncidentCard + AlertInbox. */

const SEVERITY = {
  critical: { color: 'var(--destructive)', label: 'critical' },
  high:     { color: '#F97316',            label: 'high' },
  medium:   { color: 'var(--warning)',     label: 'medium' },
  low:      { color: 'var(--info)',        label: 'low' },
  info:     { color: 'var(--text-muted)',  label: 'info' },
};
window.SEVERITY = SEVERITY;

/* ── HostCard ── */
function HostCard({ hostname, ip, status = 'online', cpu = 0, memory = 0, disk = 0, uptime, containers, loading }) {
  if (loading) {
    return (
      <div className="tollerud-card ds-themed" style={{ padding: 16 }}>
        <Skeleton h={16} w="50%"/><div style={{ height: 12 }}/>
        <Skeleton h={10} w="100%"/><div style={{ height: 8 }}/>
        <Skeleton h={10} w="100%"/><div style={{ height: 8 }}/>
        <Skeleton h={10} w="100%"/>
      </div>
    );
  }
  return (
    <div className="tollerud-card ds-themed" style={{ padding: 16 }}>
      <div className="ds-row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="ds-row" style={{ gap: 9 }}>
          <span style={{ color: 'var(--tollerud-yellow)' }}><Icons.server size={16}/></span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{hostname}</div>
            {ip && <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ip}</div>}
          </div>
        </div>
        <StatusDot status={status} label=""/>
      </div>
      <div className="ds-col" style={{ gap: 9 }}>
        <Meter label="CPU" value={cpu} valueLabel={`${cpu}%`}/>
        <Meter label="Memory" value={memory} valueLabel={`${memory}%`}/>
        <Meter label="Disk" value={disk} valueLabel={`${disk}%`}/>
      </div>
      {(uptime || containers != null) && (
        <div className="ds-row" style={{ justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          {uptime && <span className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>uptime {uptime}</span>}
          {containers != null && <span className="tollerud-badge tollerud-badge--default">{containers} containers</span>}
        </div>
      )}
    </div>
  );
}

/* ── ServiceHealthCard ── */
function ServiceHealthCard({ service, status = 'online', uptime, responseTime, version, loading }) {
  if (loading) {
    return <div className="tollerud-card ds-themed" style={{ padding: 16 }}><Skeleton h={16} w="60%"/><div style={{ height: 14 }}/><Skeleton h={28} w="100%"/></div>;
  }
  const stats = [['Uptime', uptime], ['Response', responseTime], ['Version', version]].filter(s => s[1] != null);
  return (
    <div className="tollerud-card ds-themed" style={{ padding: 16 }}>
      <div className="ds-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <span className="ds-mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{service}</span>
        <Badge variant={status === 'online' ? 'success' : status === 'warning' ? 'warning' : 'error'}>{status}</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
        {stats.map(([l, v], i) => (
          <div key={l} style={{ minWidth: 0, textAlign: 'center',
            borderLeft: i ? '1px solid var(--border)' : 'none',
            paddingLeft: i ? 16 : 0, paddingRight: i < stats.length - 1 ? 16 : 0 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{l}</div>
            <div className="ds-mono" style={{ fontSize: 14, color: 'var(--foreground)', marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── DockerStackCard ── */
function DockerStackCard({ name, services = [], composePath, loading }) {
  if (loading) return <div className="tollerud-card ds-themed" style={{ padding: 16 }}><Skeleton h={16} w="40%"/><div style={{ height: 12 }}/><Skeleton h={40} w="100%"/></div>;
  const up = services.filter(s => s.status === 'online').length;
  return (
    <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="ds-panel__head">
        <span className="ds-panel__title"><Icons.grid size={15}/>{name}</span>
        <span className="tollerud-badge tollerud-badge--default">{up}/{services.length} up</span>
      </div>
      <div className="ds-col" style={{ padding: '6px 0' }}>
        {services.map(s => (
          <div key={s.name} className="ds-row" style={{ justifyContent: 'space-between', padding: '7px 16px' }}>
            <span className="ds-mono" style={{ fontSize: 12.5, color: 'var(--foreground)' }}>{s.name}</span>
            <StatusDot status={s.status} label=""/>
          </div>
        ))}
      </div>
      {composePath && <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)', padding: '10px 16px', borderTop: '1px solid var(--border)', wordBreak: 'break-all' }}>{composePath}</div>}
    </div>
  );
}

/* ── IncidentCard ── */
function IncidentCard({ title, severity = 'info', timestamp, description, service, acknowledged }) {
  const sev = SEVERITY[severity] || SEVERITY.info;
  return (
    <div className="tollerud-card ds-themed" style={{ padding: 14, borderLeft: `3px solid ${sev.color}`, opacity: acknowledged ? 0.6 : 1 }}>
      <div className="ds-row" style={{ justifyContent: 'space-between', gap: 10 }}>
        <div className="ds-row" style={{ gap: 9, minWidth: 0 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: sev.color, flexShrink: 0 }}/>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{title}</span>
        </div>
        {acknowledged
          ? <span className="ds-row" style={{ gap: 5, fontSize: 12, color: 'var(--success)', flexShrink: 0 }}><Icons.check size={14}/>ack</span>
          : <span className="ds-mono" style={{ fontSize: 11, color: sev.color, flexShrink: 0, textTransform: 'uppercase' }}>{sev.label}</span>}
      </div>
      {description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 8 }}>{description}</p>}
      <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{[service, timestamp].filter(Boolean).join(' · ')}</div>
    </div>
  );
}

/* ── AlertInbox ── */
function AlertInbox({ alerts = [], onAcknowledge, loading = false }) {
  const [filter, setFilter] = useState('all');
  const open = alerts.filter(a => !a.acknowledged);
  const counts = open.reduce((m, a) => { m[a.severity] = (m[a.severity] || 0) + 1; return m; }, {});
  const sevs = Object.keys(SEVERITY).filter(s => alerts.some(a => a.severity === s));
  const shown = alerts.filter(a => filter === 'all' || a.severity === filter);
  if (loading) {
    return (
      <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="ds-panel__head">
          <span className="ds-panel__title"><Icons.bell size={15}/>Alert inbox</span>
          <Skeleton w={56} h={18} r={999}/>
        </div>
        <div className="ds-col">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ds-row" style={{ gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <Skeleton w={8} h={8} r={999}/>
              <div style={{ flex: 1 }}><Skeleton w="60%" h={12}/><div style={{ height: 6 }}/><Skeleton w="32%" h={9}/></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="ds-panel__head">
        <span className="ds-panel__title"><Icons.bell size={15}/>Alert inbox</span>
        <span className={`tollerud-badge tollerud-badge--${open.length ? 'error' : 'success'}`}>{open.length} open</span>
      </div>
      {sevs.length > 1 && (
        <div className="ds-row" style={{ gap: 6, padding: '10px 16px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <button className="ds-console__lvlchip" data-on={filter === 'all'} style={{ '--lvl': 'var(--tollerud-yellow)' }} onClick={() => setFilter('all')}>ALL<span style={{ opacity: .55 }}>{open.length}</span></button>
          {sevs.map(s => (
            <button key={s} className="ds-console__lvlchip" data-on={filter === s} style={{ '--lvl': SEVERITY[s].color }} onClick={() => setFilter(s)}>
              <span className="ds-console__lvldot" style={{ background: SEVERITY[s].color }}/>{SEVERITY[s].label}<span style={{ opacity: .55 }}>{counts[s] || 0}</span>
            </button>
          ))}
        </div>
      )}
      <div className="ds-col" style={{ maxHeight: 320, overflow: 'auto' }}>
        {shown.length === 0 && <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>No alerts — everything looks good</div>}
        {shown.map(a => (
          <div key={a.id} className="ds-row" style={{ justifyContent: 'space-between', gap: 10, padding: '11px 16px', borderBottom: '1px solid var(--border)', opacity: a.acknowledged ? 0.5 : 1 }}>
            <div className="ds-row" style={{ gap: 10, minWidth: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: (SEVERITY[a.severity] || SEVERITY.info).color, flexShrink: 0 }}/>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(SEVERITY[a.severity] || SEVERITY.info).label} · {a.timestamp}</div>
              </div>
            </div>
            {a.acknowledged
              ? <span style={{ color: 'var(--success)', flexShrink: 0 }}><Icons.check size={15}/></span>
              : <button className="ds-demo__btn" style={{ flexShrink: 0 }} onClick={() => onAcknowledge && onAcknowledge(a.id)}>Ack</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ApprovalCard ── */
function ApprovalCard({ action, description, source, state = 'pending', timestamp, onApprove, onReject }) {
  return (
    <div className="tollerud-card ds-themed">
      <div className="ds-row" style={{ gap: 8, marginBottom: 10 }}>
        <span style={{ color: 'var(--tollerud-yellow)' }}><Icons.shield size={15}/></span>
        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--foreground)' }}>Approval required</span>
        {timestamp && <span className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{timestamp}</span>}
      </div>
      <div className="ds-mono" style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 4 }}>{action}</div>
      {description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{description}</p>}
      {source && <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{source}</div>}
      {state === 'pending' ? (
        <div className="ds-row" style={{ gap: 10, marginTop: 14 }}>
          <Button variant="primary" size="sm" onClick={onApprove}>Approve</Button>
          <Button variant="ghost" size="sm" onClick={onReject}>Reject</Button>
        </div>
      ) : (
        <div className="ds-row" style={{ gap: 8, marginTop: 14, color: state === 'approved' ? 'var(--success)' : 'var(--destructive)', fontSize: 13, fontWeight: 500 }}>
          {state === 'approved' ? <Icons.checkCircle size={16}/> : <Icons.xCircle size={16}/>}
          {state === 'approved' ? 'Approved' : 'Rejected'}
        </div>
      )}
    </div>
  );
}

/* ── RollbackPlan ── */
const STEP_ICON = {
  pending: { el: <Icons.dot size={12}/>, color: 'var(--text-muted)' },
  running: { el: <Spinner size={13}/>, color: 'var(--tollerud-yellow)' },
  success: { el: <Icons.checkCircle size={15}/>, color: 'var(--success)' },
  failed:  { el: <Icons.xCircle size={15}/>, color: 'var(--destructive)' },
  skipped: { el: <Icons.x size={13}/>, color: 'var(--text-muted)' },
};
function RollbackPlan({ name, executing, steps = [] }) {
  return (
    <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="ds-panel__head">
        <span className="ds-panel__title"><Icons.refresh size={15}/>{name}</span>
        {executing && <span className="tollerud-badge tollerud-badge--accent">executing</span>}
      </div>
      <div className="ds-col" style={{ padding: '6px 0' }}>
        {steps.map(s => {
          const ic = STEP_ICON[s.status] || STEP_ICON.pending;
          return (
            <div key={s.id} className="ds-row" style={{ gap: 11, padding: '9px 16px' }}>
              <span style={{ color: ic.color, display: 'inline-flex', width: 16, justifyContent: 'center', flexShrink: 0 }}>{ic.el}</span>
              <span style={{ fontSize: 13, color: s.status === 'pending' ? 'var(--text-muted)' : 'var(--foreground)', textDecoration: s.status === 'skipped' ? 'line-through' : 'none' }}>{s.label}</span>
              <span className="ds-mono" style={{ marginLeft: 'auto', fontSize: 11, color: ic.color }}>{s.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── BackupStatusPanel ── */
function BackupStatusPanel({ jobs = [], totalSize, lastFullBackup, loading = false, emptyState }) {
  const failed = jobs.filter(j => j.status === 'offline' || j.status === 'failed');
  if (loading) {
    return (
      <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="ds-panel__head"><span className="ds-panel__title"><Icons.database size={15}/>Backups</span><Skeleton w={48} h={12}/></div>
        <div className="ds-col">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="ds-row" style={{ gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <Skeleton w={8} h={8} r={999}/>
              <div style={{ flex: 1 }}><Skeleton w="45%" h={12}/><div style={{ height: 6 }}/><Skeleton w="60%" h={9}/></div>
              <Skeleton w={42} h={11}/>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="ds-panel__head">
        <span className="ds-panel__title"><Icons.database size={15}/>Backups</span>
        {totalSize && <span className="ds-mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{totalSize}</span>}
      </div>
      {jobs.length === 0 ? (
        emptyState || <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>No backup jobs configured yet.</div>
      ) : (
      <div className="ds-col">
        {jobs.map(j => (
          <div key={j.name} className="ds-row" style={{ justifyContent: 'space-between', gap: 10, padding: '11px 16px', borderBottom: '1px solid var(--border)' }}>
            <div className="ds-row" style={{ gap: 10, minWidth: 0 }}>
              <StatusDot status={j.status} label=""/>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--foreground)' }}>{j.name}</div>
                <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{[j.lastRun && `ran ${j.lastRun}`, j.target].filter(Boolean).join(' · ')}</div>
              </div>
            </div>
            {j.size && <span className="ds-mono" style={{ fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0 }}>{j.size}</span>}
          </div>
        ))}
      </div>
      )}
      <div className="ds-row" style={{ justifyContent: 'space-between', padding: '10px 16px', borderTop: failed.length ? '1px solid var(--destructive)' : '1px solid var(--border)' }}>
        {failed.length
          ? <span className="ds-row" style={{ gap: 7, fontSize: 12.5, color: 'var(--destructive)' }}><Icons.alert size={14}/>{failed.length} job{failed.length > 1 ? 's' : ''} failed</span>
          : <span className="ds-row" style={{ gap: 7, fontSize: 12.5, color: 'var(--success)' }}><Icons.checkCircle size={14}/>All jobs healthy</span>}
        {lastFullBackup && <span className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>full: {lastFullBackup}</span>}
      </div>
    </div>
  );
}

/* ── ActionDiff ── */
function ActionDiff({ label, lines = [], showContext = true }) {
  const [ctx, setCtx] = useState(showContext);
  const rows = lines.filter(l => ctx || l.type !== 'context');
  const sign = { add: '+', remove: '-', context: ' ' };
  return (
    <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="ds-panel__head">
        <span className="ds-panel__title"><Icons.code size={15}/>{label}</span>
        <button className="ds-demo__btn" onClick={() => setCtx(c => !c)}>{ctx ? 'Hide context' : 'Show context'}</button>
      </div>
      <div className="ds-diff">
        {rows.map((l, i) => (
          <div key={i} className="ds-diff__line" data-type={l.type}>
            <span className="ds-diff__gutter">{l.oldLine ?? ''}</span>
            <span className="ds-diff__gutter">{l.newLine ?? ''}</span>
            <span className="ds-diff__sign">{sign[l.type]}</span>
            <span className="ds-diff__code">{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox,
  ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff,
});
