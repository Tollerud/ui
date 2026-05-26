export default function GettingStartedPage() {
  return (
    <div className="docs-content">
      <h1>Getting Started</h1>
      <p>Tia Noir is a dark, cinematic, keyboard-first infrastructure design system. Drop it into any Next.js project.</p>

      <h2>Install Dependencies</h2>
      <pre><code>{`npm install clsx tailwind-merge

# Optional — for NoirGlowBackground (WebGL shader):
npm install @paper-design/shaders-react

# Fonts — Inter + Inter Mono (Google Fonts):
# Add to your layout.tsx using next/font/google`}</code></pre>

      <h2>Copy Files</h2>
      <p>Copy the design system into your project:</p>
      <pre><code>{`cp -r path/to/tia-noir/globals.css src/app/
cp -r path/to/tia-noir/components src/components/ui
cp -r path/to/tia-noir/lib src/lib`}</code></pre>

      <h2>Font Setup</h2>
      <p>Add Inter + JetBrains Mono via <code>next/font/google</code> in your root layout:</p>
      <pre><code>{`import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Apply to <html>:
// <html className={\`dark \${inter.variable} \${jetbrainsMono.variable}\`}>`}</code></pre>

      <h2>Import Components</h2>
      <pre><code>{`import { Button, Card, Badge, Kbd } from '@/components/ui'
import { CommandMenu } from '@/components/ui'
import { LogViewer, Timeline } from '@/components/ui'
import { NoirGlowBackground } from '@/components/ui'`}</code></pre>

      <h2>Basic Example</h2>
      <pre><code>{`export default function Page() {
  return (
    <div className="relative min-h-screen bg-tia-black">
      <NoirGlowBackground
        intensity="medium"
        speed="slow"
        shape="corners"
        forceCssFallback
      />
      <Container className="relative z-10">
        <Button variant="terminal" size="lg">
          start_building
        </Button>
        <Badge variant="success">Online</Badge>
        <StatusDot status="online" />
      </Container>
    </div>
  )
}`}</code></pre>

      <h2>Key Conventions</h2>
      <ul>
        <li><strong>Dark-first</strong> — design starts in the dark. Add <code>class=&quot;dark&quot;</code> to <code>&lt;html&gt;</code>.</li>
        <li><strong>Yellow is signal</strong> — <code>var(--tia-yellow)</code> / <code>#E8D500</code>. If it's yellow, click it.</li>
        <li><strong>Terminal CTAs</strong> — use <code>variant=&quot;terminal&quot;</code> for monospace ❯-prefixed buttons.</li>
        <li><strong>One color pop</strong> — yellow carries the weight. State colors stay muted.</li>
        <li><strong>Sharp corners</strong> — subtle radius, sharp corners for noir feel.</li>
      </ul>

      <h2>Component Categories</h2>
      <table>
        <thead>
          <tr><th>Category</th><th>Components</th></tr>
        </thead>
        <tbody>
          <tr><td>Form Primitives</td><td>Button, Input, Textarea, Select, Checkbox, Switch, RadioGroup</td></tr>
          <tr><td>Status</td><td>Badge, StatusDot</td></tr>
          <tr><td>Surface</td><td>Card, Container, Footer</td></tr>
          <tr><td>Code / Terminal</td><td>CodeBlock, Kbd, ActionRow</td></tr>
          <tr><td>Command Shell</td><td>CommandMenu</td></tr>
          <tr><td>Atmosphere</td><td>NoirGlowBackground</td></tr>
          <tr><td>Homelab Cards</td><td>ServiceHealthCard, HostCard, DockerStackCard, IncidentCard, ApprovalCard</td></tr>
          <tr><td>Metrics</td><td>StatCard, BackupStatusPanel</td></tr>
          <tr><td>Compound</td><td>Timeline, AlertInbox, RollbackPlan, ActionDiff, LogViewer</td></tr>
        </tbody>
      </table>
    </div>
  )
}
