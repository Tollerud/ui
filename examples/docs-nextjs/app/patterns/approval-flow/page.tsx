export default function ApprovalFlowPatternPage() {
  return (
    <div className="docs-content">
      <h1>Approval Flow</h1>
      <p>The approval flow pattern guides an operator through reviewing, approving/rejecting, and tracking an infrastructure action.</p>

      <h2>Flow Stages</h2>

      <h3>1. Diff Review</h3>
      <pre><code>{`<ActionDiff
  label="docker-compose.yml"
  lines={[
    { text: '    image: hermes:latest', type: 'remove', oldLine: 5 },
    { text: '    image: hermes:v2.0', type: 'add', newLine: 5 },
    { text: '    restart: unless-stopped', type: 'context', oldLine: 6, newLine: 6 },
  ]}
/>`}</code></pre>

      <h3>2. Approval</h3>
      <pre><code>{`<ApprovalCard
  action="Deploy hermes v2.0"
  description="Update hermes image tag on emma and restart"
  source="emma → /hdd/config/tia/compose.yml"
  state="pending"
  timestamp="2026-05-26 14:35"
  onApprove={() => {}}
  onReject={() => {}}
/>`}</code></pre>

      <h3>3. Rollback Plan</h3>
      <pre><code>{`<RollbackPlan
  name="Rollback: Undo hermes v2.0 deploy"
  steps={[
    { id: '1', label: 'Stop hermes container', status: 'pending' },
    { id: '2', label: 'Restore previous image tag', status: 'pending' },
    { id: '3', label: 'Start container', status: 'pending' },
  ]}
/>`}</code></pre>

      <h3>4. Timeline Tracking</h3>
      <pre><code>{`<Timeline
  items={[
    { id: '1', time: '14:35', title: 'Deploy requested', status: 'online', meta: ['pending approval'] },
    { id: '2', time: '14:36', title: 'Approved by Mathias', status: 'online' },
    { id: '3', time: '14:37', title: 'Rolling out...', status: 'warning', meta: ['running'] },
    { id: '4', time: '14:38', title: 'Deploy complete', status: 'online', meta: ['success'] },
  ]}
/>`}</code></pre>

      <h2>Components Used</h2>
      <ul>
        <li><code>ActionDiff</code> — review changes</li>
        <li><code>ApprovalCard</code> — approve/reject</li>
        <li><code>RollbackPlan</code> — undo steps</li>
        <li><code>Timeline</code> — track history</li>
      </ul>
    </div>
  )
}