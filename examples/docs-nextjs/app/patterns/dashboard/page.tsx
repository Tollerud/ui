export default function DashboardPatternPage() {
  return (
    <div className="docs-content">
      <h1>Dashboard</h1>
      <p>The homelab mission-control dashboard pattern combines multiple Tia Noir components into a cohesive monitoring surface.</p>

      <h2>Layout</h2>
      <pre><code>{`<div className="space-y-6">
  {/* Header bar with command palette trigger */}
  <header>{/* ... */}</header>

  {/* Host grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <HostCard hostname="emma" ip="10.0.10.10" status="online" cpu="23%" memory="6.2/16" />
    <HostCard hostname="iris" ip="10.0.10.12" status="online" cpu="8%" memory="2.1/8" />
    <HostCard hostname="embla" ip="10.0.10.11" status="online" cpu="15%" />
  </div>

  {/* Two-column layout for services + alerts */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-4">
      <ServiceHealthCard service="nginx" status="online" uptime="14d" />
      <ServiceHealthCard service="hermes-agent" status="online" uptime="3d" />
      <DockerStackCard name="monitoring" services={[...]} />
    </div>
    <div className="space-y-4">
      <AlertInbox alerts={[...]} onAcknowledge={fn} />
    </div>
  </div>

  {/* Bottom row */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <BackupStatusPanel jobs={[...]} totalSize="6.0 GB" />
    <Timeline items={[...]} />
  </div>
</div>`}</code></pre>

      <h2>Components Used</h2>
      <ul>
        <li><code>HostCard</code> — server grid</li>
        <li><code>ServiceHealthCard</code> — service list</li>
        <li><code>DockerStackCard</code> — stack overview</li>
        <li><code>AlertInbox</code> — incident feed</li>
        <li><code>BackupStatusPanel</code> — backup viewer</li>
        <li><code>Timeline</code> — activity feed</li>
        <li><code>CommandMenu</code> — global search</li>
      </ul>
    </div>
  )
}