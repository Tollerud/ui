/* Tollerud DS — Infrastructure component gallery. → window.PageInfra */
function PageInfra() {
  const toast = useToast();
  const [alerts, setAlerts] = useState([
    { id: 'a1', title: 'iris — CPU sustained at 88%', severity: 'critical', timestamp: '14:32', acknowledged: false },
    { id: 'a2', title: 'pia — disk at 71%', severity: 'medium', timestamp: '13:15', acknowledged: false },
    { id: 'a3', title: 'cert renews in 6 days', severity: 'low', timestamp: '09:00', acknowledged: false },
    { id: 'a4', title: 'backup completed late', severity: 'info', timestamp: '03:14', acknowledged: true },
  ]);
  const [approval, setApproval] = useState('pending');
  const [rolling, setRolling] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const ack = (id) => setAlerts(al => al.map(a => a.id === id ? { ...a, acknowledged: true } : a));

  const rollbackSteps = rolling
    ? [
      { id: 1, label: 'Drain traffic from hermes:v2.1', status: 'success' },
      { id: 2, label: 'Stop hermes:v2.1 containers', status: 'success' },
      { id: 3, label: 'Restore hermes:v2.0 image', status: 'running' },
      { id: 4, label: 'Re-attach traffic', status: 'pending' },
      { id: 5, label: 'Verify health checks', status: 'pending' },
    ]
    : [
      { id: 1, label: 'Drain traffic from hermes:v2.1', status: 'pending' },
      { id: 2, label: 'Stop hermes:v2.1 containers', status: 'pending' },
      { id: 3, label: 'Restore hermes:v2.0 image', status: 'pending' },
      { id: 4, label: 'Re-attach traffic', status: 'pending' },
      { id: 5, label: 'Verify health checks', status: 'skipped' },
    ];

  return (
    <div>
      <PageHeader icon="server" eyebrow="Components · infrastructure" title="Infrastructure"
        lede="Higher-order components for the homelab domain — host and service cards, container stacks, incidents, an alert inbox, the approval and rollback flows, backups and config diffs. These compose the Mission Control dashboard."/>

      <Section title="HostCard" desc="A machine at a glance: status dot, CPU / memory / disk meters (red past 85%), uptime and container count. Supports a loading skeleton.">
        <Demo name="host-card" code={`<HostCard hostname="emma" ip="10.0.10.10" status="online"
  cpu={23} memory={62} disk={45} uptime="14d" containers={4} />`}>
          <div className="ds-grid-3" style={{ width: '100%', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <HostCard hostname="emma" ip="10.0.10.10" status="online" cpu={23} memory={62} disk={45} uptime="14d" containers={4}/>
            <HostCard hostname="iris" ip="10.0.10.12" status="warning" cpu={88} memory={79} disk={52} uptime="3d" containers={6}/>
            <HostCard loading/>
          </div>
        </Demo>
      </Section>

      <Section title="ServiceHealthCard" desc="A single service with status badge and a compact stat strip — uptime, response time, version.">
        <Demo name="service-health" code={`<ServiceHealthCard service="hermes" status="online"
  uptime="99.98%" responseTime="23ms" version="v2.0" />`}>
          <div className="ds-grid-3" style={{ width: '100%', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <ServiceHealthCard service="hermes" status="online" uptime="99.98%" responseTime="23ms" version="v2.0"/>
            <ServiceHealthCard service="nginx" status="warning" uptime="99.4%" responseTime="1.84s" version="1.27"/>
          </div>
        </Demo>
      </Section>

      <Section title="DockerStackCard" desc="A compose stack with per-service status rows and an up/total count.">
        <Demo name="docker-stack" code={`<DockerStackCard name="monitoring" composePath="/hdd/config/monitoring/compose.yml"
  services={[{ name: 'prometheus', status: 'online' }, { name: 'grafana', status: 'online' }]} />`}>
          <div style={{ width: '100%', maxWidth: 360 }}>
            <DockerStackCard name="monitoring" composePath="/hdd/config/monitoring/compose.yml"
              services={[
                { name: 'prometheus', status: 'online' },
                { name: 'grafana', status: 'online' },
                { name: 'alertmanager', status: 'offline' },
                { name: 'node-exporter', status: 'online' },
              ]}/>
          </div>
        </Demo>
      </Section>

      <Section title="IncidentCard" desc="A severity-coded incident with a colored left border. Acknowledged incidents dim. Severity scale: critical · high · medium · low · info.">
        <Demo name="incident-card" variant="col" code={`<IncidentCard title="CPU sustained at 88%" severity="critical"
  service="iris" timestamp="14:32" description="hermes worker pool saturated." />`}>
          <div className="ds-col" style={{ width: '100%', gap: 10 }}>
            <IncidentCard title="CPU sustained at 88% for 12m" severity="critical" service="iris" timestamp="14:32" description="hermes worker pool saturated — requests queueing."/>
            <IncidentCard title="TLS certificate renews in 6 days" severity="low" service="nginx" timestamp="09:00"/>
            <IncidentCard title="Nightly backup completed" severity="info" service="backup" timestamp="03:14" acknowledged/>
          </div>
        </Demo>
      </Section>

      <Section title="AlertInbox" desc="A live inbox with severity filter chips, an open count, and per-row acknowledge. Wire onAcknowledge to your state. Pass loading for a skeleton; shows a clear all-good empty state.">
        <Demo name="alert-inbox" variant="col" code={`<AlertInbox alerts={alerts} loading={loading} onAcknowledge={(id) => ack(id)} />`}>
          <div style={{ width: '100%', maxWidth: 460 }}>
            <div className="ds-row" style={{ marginBottom: 12 }}>
              <Switch label="Loading state" checked={loadingDemo} onChange={e => setLoadingDemo(e.target.checked)}/>
            </div>
            <AlertInbox alerts={alerts} loading={loadingDemo} onAcknowledge={(id) => { ack(id); toast({ tone: 'success', title: 'Acknowledged' }); }}/>
          </div>
        </Demo>
      </Section>

      <Section title="ApprovalCard" desc="A human-in-the-loop gate: the action, its blast radius, and approve / reject. Settles into an approved or rejected state.">
        <Demo name="approval-card" variant="col" code={`<ApprovalCard action="restart_container" state={state}
  description="Restart iris:hermes to clear the CPU alert."
  source="iris → compose.yml"
  onApprove={…} onReject={…} />`}>
          <div className="ds-col" style={{ width: '100%', maxWidth: 460, gap: 10 }}>
            <ApprovalCard action="restart_container" state={approval}
              description={<>Restart <b style={{ color: 'var(--foreground)' }}>iris:tollerud-hermes</b> to clear the sustained CPU alert.</>}
              source="iris → /hdd/config/tia/compose.yml" timestamp="14:33"
              onApprove={() => { setApproval('approved'); toast({ tone: 'success', title: 'Approved' }); }}
              onReject={() => { setApproval('rejected'); toast({ tone: 'error', title: 'Rejected' }); }}/>
            {approval !== 'pending' && <button className="ds-demo__btn" style={{ alignSelf: 'flex-end' }} onClick={() => setApproval('pending')}>Reset</button>}
          </div>
        </Demo>
      </Section>

      <Section title="RollbackPlan" desc="An ordered execution plan with live per-step status — pending, running (spinner), success, failed or skipped.">
        <Demo name="rollback-plan" variant="col" code={`<RollbackPlan name="Rollback hermes → v2.0" executing steps={steps} />`}>
          <div className="ds-col" style={{ width: '100%', maxWidth: 460, gap: 10 }}>
            <RollbackPlan name="Rollback hermes → v2.0" executing={rolling} steps={rollbackSteps}/>
            <Button variant="secondary" size="sm" style={{ alignSelf: 'flex-start' }} onClick={() => setRolling(r => !r)}>{rolling ? 'Reset plan' : 'Execute rollback'}</Button>
          </div>
        </Demo>
      </Section>

      <Section title="BackupStatusPanel" desc="Backup jobs with status, target and size, plus a health summary footer that turns red when any job has failed. Supports loading and empty states.">
        <Demo name="backup-status" variant="col" code={`<BackupStatusPanel totalSize="48.6 GB" lastFullBackup="2026-06-01" loading={loading}
  jobs={[{ name: 'emma-config', status: 'online', lastRun: '03:14', target: 'JottaCloud', size: '4.2 GB' }]} />`}>
          <div style={{ width: '100%', maxWidth: 460 }}>
            <div className="ds-row" style={{ marginBottom: 12 }}>
              <Switch label="Loading state" checked={loadingDemo} onChange={e => setLoadingDemo(e.target.checked)}/>
            </div>
            <BackupStatusPanel totalSize="48.6 GB" lastFullBackup="2026-06-01" loading={loadingDemo}
              jobs={[
                { name: 'emma-config', status: 'online', lastRun: '03:14', target: 'JottaCloud', size: '4.2 GB' },
                { name: 'pia-media', status: 'online', lastRun: '02:50', target: 'JottaCloud', size: '38 GB' },
                { name: 'iris-config', status: 'offline', lastRun: 'failed', target: 'JottaCloud', size: '—' },
              ]}/>
          </div>
        </Demo>
      </Section>

      <Section title="ActionDiff" desc="A unified config diff for previewing changes before an agent applies them. Context lines toggle off to focus on edits.">
        <Demo name="action-diff" variant="col" code={`<ActionDiff label="compose.yml" lines={[
  { type: 'context', oldLine: 11, newLine: 11, text: '  hermes:' },
  { type: 'remove', oldLine: 12, text: '    image: hermes:v2.1' },
  { type: 'add', newLine: 12, text: '    image: hermes:v2.0' },
]} />`}>
          <div style={{ width: '100%', maxWidth: 520 }}>
            <ActionDiff label="iris:/hdd/config/tia/compose.yml" lines={[
              { type: 'context', oldLine: 10, newLine: 10, text: 'services:' },
              { type: 'context', oldLine: 11, newLine: 11, text: '  hermes:' },
              { type: 'remove', oldLine: 12, text: '    image: hermes:v2.1' },
              { type: 'add', newLine: 12, text: '    image: hermes:v2.0' },
              { type: 'context', oldLine: 13, newLine: 13, text: '    restart: unless-stopped' },
              { type: 'remove', oldLine: 14, text: '    mem_limit: 512m' },
              { type: 'add', newLine: 14, text: '    mem_limit: 768m' },
            ]}/>
          </div>
        </Demo>
      </Section>
    </div>
  );
}
window.PageInfra = PageInfra;
