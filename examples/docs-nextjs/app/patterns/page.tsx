import Link from 'next/link'

export default function PatternsPage() {
  return (
    <div className="docs-content">
      <h1>Patterns</h1>
      <p>Tia Noir provides reusable page templates and interaction patterns for common infrastructure tasks.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        <Link href="/patterns/dashboard" className="block p-4 rounded-lg border border-tia-border/40 bg-tia-surface-raised hover:border-tia-yellow/30 transition-colors">
          <span className="block text-sm font-semibold text-tia-foreground">Dashboard</span>
          <span className="block text-xs text-tia-text-muted mt-1">
            Host grid, service health, backup status, alert wall, command palette
          </span>
        </Link>
        <Link href="/patterns/approval-flow" className="block p-4 rounded-lg border border-tia-border/40 bg-tia-surface-raised hover:border-tia-yellow/30 transition-colors">
          <span className="block text-sm font-semibold text-tia-foreground">Approval Flow</span>
          <span className="block text-xs text-tia-text-muted mt-1">
            Action diff, approval card, rollback plan, timeline
          </span>
        </Link>
      </div>

      <h2>Component Selection Guide</h2>
      <table>
        <thead>
          <tr><th>Use Case</th><th>Components</th></tr>
        </thead>
        <tbody>
          <tr><td>Show server status</td><td><code>HostCard</code> + <code>StatusDot</code></td></tr>
          <tr><td>Show service health</td><td><code>ServiceHealthCard</code></td></tr>
          <tr><td>Show Docker status</td><td><code>DockerStackCard</code></td></tr>
          <tr><td>Browse logs</td><td><code>LogViewer</code></td></tr>
          <tr><td>Review alerts</td><td><code>AlertInbox</code> + <code>IncidentCard</code></td></tr>
          <tr><td>Backup status</td><td><code>BackupStatusPanel</code></td></tr>
          <tr><td>Approve an action</td><td><code>ApprovalCard</code> + <code>ActionDiff</code></td></tr>
          <tr><td>Track rollback</td><td><code>RollbackPlan</code> + <code>Timeline</code></td></tr>
          <tr><td>Landing/hero page</td><td><code>NoirGlowBackground</code> + <code>Container</code></td></tr>
          <tr><td>Global search</td><td><code>CommandMenu</code> + <code>Kbd</code></td></tr>
        </tbody>
      </table>
    </div>
  )
}