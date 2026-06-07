/* Tollerud DS — Build example: the Data Table page, built on the reusable
   <DataTable> component. → window.PageServers */
function PageServers() {
  const toast = useToast();
  const ALL = [
    { id: 'emma',     ip: '10.0.10.10', region: 'eu-north', status: 'online',  cpu: 23, containers: 4, owner: 'Tia',   load: [12, 18, 14, 22, 19, 26, 23] },
    { id: 'pia',      ip: '10.0.10.11', region: 'eu-north', status: 'online',  cpu: 51, containers: 2, owner: 'Emma',  load: [40, 44, 39, 48, 51, 47, 51] },
    { id: 'iris',     ip: '10.0.10.12', region: 'eu-west',  status: 'warning', cpu: 88, containers: 6, owner: 'Tia',   load: [70, 78, 82, 80, 86, 90, 88] },
    { id: 'miriam',   ip: '10.0.10.13', region: 'us-east',  status: 'online',  cpu: 34, containers: 3, owner: 'Pia',   load: [28, 30, 33, 31, 36, 34, 34] },
    { id: 'victoria', ip: '10.0.10.14', region: 'us-east',  status: 'offline', cpu: 0,  containers: 0, owner: 'Emma',  load: [20, 12, 8, 4, 0, 0, 0] },
    { id: 'embla',    ip: '10.0.10.15', region: 'eu-west',  status: 'online',  cpu: 47, containers: 5, owner: 'Tia',   load: [42, 45, 44, 48, 46, 49, 47] },
    { id: 'sigrid',   ip: '10.0.10.16', region: 'eu-north', status: 'warning', cpu: 76, containers: 4, owner: 'Pia',   load: [60, 64, 70, 72, 74, 78, 76] },
    { id: 'astrid',   ip: '10.0.10.17', region: 'us-west',  status: 'online',  cpu: 19, containers: 2, owner: 'Emma',  load: [16, 18, 15, 20, 17, 21, 19] },
  ];
  const statusVariant = { online: 'success', warning: 'warning', offline: 'error' };

  const columns = [
    { key: 'id', header: 'Host', sortable: true, render: (s) => (
      <div className="ds-row" style={{ gap: 9 }}>
        <span style={{ color: 'var(--tollerud-yellow)' }}><Icons.server size={15}/></span>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>{s.id}</div>
          <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.ip}</div>
        </div>
      </div>
    ) },
    { key: 'status', header: 'Status', sortable: true, render: (s) => <Badge variant={statusVariant[s.status]}>{s.status}</Badge> },
    { key: 'region', header: 'Region', sortable: true, render: (s) => <span className="ds-mono" style={{ fontSize: 12.5 }}>{s.region}</span> },
    { key: 'cpu', header: 'CPU', sortable: true, align: 'right', render: (s) => <span className="ds-mono" style={{ color: s.cpu > 80 ? 'var(--destructive)' : 'var(--text-secondary)' }}>{s.cpu}%</span> },
    { key: 'load', header: 'Load · 7d', render: (s) => <Sparkline data={s.load} w={84} h={26} color={s.status === 'offline' ? '#666' : s.cpu > 80 ? '#EF4444' : '#E8D500'}/> },
    { key: 'containers', header: 'Containers', sortable: true, align: 'right', render: (s) => <span className="ds-mono">{s.containers}</span> },
    { key: 'owner', header: 'Owner', sortable: true },
  ];

  return (
    <div>
      <PageHeader icon="server" eyebrow="Build · data table" title="Data Table"
        lede="A complete table pattern: live search, region filter, sortable columns, row selection with a bulk-action bar, status badges, inline load sparklines, per-row menus and pagination — all driven by the reusable <DataTable> component."/>

      <Section title="Servers" desc="Everything below is the <DataTable> component fed a column config. Sort by any column, select rows for bulk actions, filter by region, search and paginate.">
        <DataTable
          rows={ALL}
          rowKey="id"
          columns={columns}
          searchable
          searchKeys={['id', 'ip', 'owner']}
          searchPlaceholder="Search host, ip, owner…"
          filter={{ key: 'region', allLabel: 'All regions' }}
          selectable
          pageSize={5}
          toolbarRight={<Button variant="terminal" size="sm" onClick={() => toast({ tone: 'accent', title: 'Provisioning new host…' })}><Icons.plus size={14}/>add_host</Button>}
          bulkActions={[
            { label: 'Restart', icon: 'refresh', variant: 'ghost', onRun: (ids, clear) => { toast({ tone: 'success', title: `Restarting ${ids.length} hosts` }); clear(); } },
            { label: 'Stop', icon: 'trash', variant: 'destructive', onRun: (ids, clear) => { toast({ tone: 'error', title: `Stopped ${ids.length} hosts` }); clear(); } },
          ]}
          rowMenu={(s) => [
            { label: 'Connect (SSH)', icon: 'external', onSelect: () => toast({ tone: 'info', title: `Connecting to ${s.id}…` }) },
            { label: 'Restart', icon: 'refresh', onSelect: () => toast({ tone: 'success', title: `${s.id} restarting` }) },
            { sep: true },
            { label: 'Stop host', icon: 'trash', onSelect: () => toast({ tone: 'error', title: `${s.id} stopped` }) },
          ]}
          emptyState={<EmptyState icon="search" title="No hosts found" description="No hosts match your search and filter. Try clearing them."/>}
        />
      </Section>
    </div>
  );
}
window.PageServers = PageServers;
