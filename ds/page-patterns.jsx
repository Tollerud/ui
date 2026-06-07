/* Tollerud DS — Patterns: a real, working dashboard built from the system.
   Uses the shared infra components (HostCard, AlertInbox, ApprovalCard).
   → window.PagePatterns */

function PagePatterns() {
  const toast = useToast();
  const [cmd, setCmd] = useState(false);
  const [hosts, setHosts] = useState([
    { name: 'emma', ip: '10.0.10.10', status: 'online', cpu: 23, mem: 62, disk: 45, uptime: '14d', containers: 4 },
    { name: 'pia', ip: '10.0.10.11', status: 'online', cpu: 51, mem: 40, disk: 71, uptime: '9d', containers: 2 },
    { name: 'iris', ip: '10.0.10.12', status: 'warning', cpu: 88, mem: 79, disk: 52, uptime: '3d', containers: 6 },
  ]);
  const [series, setSeries] = useState([28, 35, 30, 44, 52, 48, 63, 58, 71, 65, 80, 62]);
  const [alerts, setAlerts] = useState([
    { id: '1', title: 'iris — CPU sustained at 88%', severity: 'high', timestamp: '14:32', acknowledged: false },
    { id: '2', title: 'pia — disk at 71%', severity: 'medium', timestamp: '13:15', acknowledged: false },
    { id: '3', title: 'backup job completed late', severity: 'low', timestamp: '03:14', acknowledged: true },
  ]);
  const [approval, setApproval] = useState('pending');

  useEffect(() => {
    const t = setInterval(() => {
      setHosts(hs => hs.map(h => ({ ...h, cpu: Math.max(8, Math.min(97, h.cpu + Math.round((Math.random() - 0.5) * 14))) })));
      setSeries(s => [...s.slice(1), Math.max(20, Math.min(95, s[s.length - 1] + Math.round((Math.random() - 0.5) * 22)))]);
    }, 2200);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd(true); } };
    document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h);
  }, []);

  const avgCpu = Math.round(hosts.reduce((a, h) => a + h.cpu, 0) / hosts.length);
  const openAlerts = alerts.filter(a => !a.acknowledged).length;
  const ackAlert = (id) => { setAlerts(al => al.map(x => x.id === id ? { ...x, acknowledged: true } : x)); toast({ tone: 'success', title: 'Alert acknowledged' }); };

  const cmdGroups = [
    { label: 'Servers', items: hosts.map(h => ({ id: h.name, label: `${h.name}.tollerud.no`, description: `SSH · ${h.containers} containers · uptime ${h.uptime}`, icon: 'server', onSelect: () => toast({ tone: 'info', title: `Connecting to ${h.name}…` }) })) },
    { label: 'Actions', items: [
      { id: 'backup', label: 'Run Backup', description: 'rclone to JottaCloud', icon: 'database', shortcut: '⌘B', onSelect: () => toast({ tone: 'success', title: 'Backup started' }) },
      { id: 'deploy', label: 'Deploy Stack', description: 'docker compose up -d', icon: 'rocket', onSelect: () => toast({ tone: 'accent', title: 'Deploying…' }) },
      { id: 'refresh', label: 'Refresh metrics', icon: 'refresh', onSelect: () => toast({ tone: 'info', title: 'Metrics refreshed' }) },
    ]},
  ];

  return (
    <div>
      <PageHeader icon="app" eyebrow="Patterns" title="Mission Control"
        lede="A live dashboard assembled entirely from Tollerud components — stat cards, host cards, charts, an alert inbox and an approval flow. Metrics update in real time. Press ⌘K."/>

      {/* toolbar */}
      <div className="ds-row" style={{ justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
        <div className="ds-row" style={{ gap: 10 }}>
          <StatusDot status="online" label="3 hosts · all reachable"/>
        </div>
        <div className="ds-row" style={{ gap: 10, flexShrink: 0 }}>
          <Button variant="secondary" size="sm" onClick={() => setCmd(true)}><Icons.search size={14}/>Search <Kbd keys="⌘+K" size="sm"/></Button>
          <Button variant="terminal" size="sm" onClick={() => toast({ tone: 'accent', title: 'Deploying all stacks…' })}>deploy_all</Button>
        </div>
      </div>

      {/* stat row */}
      <div className="ds-dash-stats" style={{ marginBottom: 16 }}>
        <StatCard label="Active Sessions" value="42" change={{ value: '12%', direction: 'up' }} icon="activity"/>
        <StatCard label="Avg CPU" value={`${avgCpu}%`} change={{ value: '4%', direction: avgCpu > 55 ? 'up' : 'down' }} icon="cpu"/>
        <StatCard label="Storage" value="1.2 TB" icon="database"/>
        <StatCard label="Open Alerts" value={openAlerts} change={openAlerts ? { value: 'attention', direction: 'up' } : undefined} icon="bell"/>
      </div>

      <div className="ds-dash-grid" style={{ alignItems: 'start' }}>
        {/* LEFT */}
        <div className="ds-col" style={{ gap: 16 }}>
          <Card>
            <div className="ds-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
              <SubHead>Cluster CPU · live</SubHead>
              <span className="tollerud-badge tollerud-badge--accent">streaming</span>
            </div>
            <AreaChart data={series} height={150}/>
          </Card>
          <div className="ds-grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
            {hosts.map(h => (
              <HostCard key={h.name} hostname={h.name} ip={h.ip} status={h.status}
                cpu={h.cpu} memory={h.mem} disk={h.disk} uptime={h.uptime} containers={h.containers}/>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="ds-col" style={{ gap: 16 }}>
          <AlertInbox alerts={alerts} onAcknowledge={ackAlert}/>

          <ApprovalCard
            action="restart_container"
            description={<>Restart <b style={{ color: 'var(--foreground)' }}>iris:tollerud-hermes</b> to clear the sustained CPU alert.</>}
            source="iris → /hdd/config/tia/compose.yml"
            state={approval}
            onApprove={() => { setApproval('approved'); toast({ tone: 'success', title: 'Approved — restarting iris:hermes' }); }}
            onReject={() => { setApproval('rejected'); toast({ tone: 'error', title: 'Rejected' }); }}/>
          {approval !== 'pending' && (
            <div className="ds-row" style={{ justifyContent: 'flex-end' }}>
              <button className="ds-demo__btn" onClick={() => setApproval('pending')}>Reset approval</button>
            </div>
          )}

          {/* Activity timeline */}
          <Card>
            <SubHead>Recent activity</SubHead>
            <Timeline items={[
              { time: '14:32', title: 'Deployed hermes v2.0', description: 'Rolled out to emma', status: 'online', meta: ['success', '3s'] },
              { time: '14:31', title: 'Restarted nginx', description: 'Config reloaded on pia', status: 'warning', meta: ['warning'] },
              { time: '14:30', title: 'SSH connection failed', description: 'iris refused connection', status: 'offline' },
            ]}/>
          </Card>
        </div>
      </div>

      <CommandMenu open={cmd} onClose={() => setCmd(false)} groups={cmdGroups}/>
    </div>
  );
}
window.PagePatterns = PagePatterns;
