export default function GettingStartedPage() {
  return (
    <div className="docs-content">
      <h1>Getting Started</h1>
      <p>Tollerud Design System is a dark, cinematic, keyboard-first infrastructure design system. Install it from npm and drop it into any Next.js (or React) project.</p>

      <h2>Install</h2>
      <pre><code>{`npm install @tollerud/ui clsx tailwind-merge

# Optional — for NoirGlowBackground (WebGL shader):
npm install @paper-design/shaders-react`}</code></pre>

      <h2>Tailwind Setup — v3</h2>
      <p>Add the preset to <code>tailwind.config.ts</code>:</p>
      <pre><code>{`import type { Config } from 'tailwindcss'
import tollerud from '@tollerud/ui/preset'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [tollerud],
} satisfies Config`}</code></pre>

      <h2>Tailwind Setup — v4</h2>
      <p>In your <code>globals.css</code>:</p>
      <pre><code>{`@import "tailwindcss";
@import "@tollerud/ui/globals.css";`}</code></pre>

      <h2>Font Setup</h2>
      <p>Add Inter + JetBrains Mono via <code>next/font/google</code> in your root layout:</p>
      <pre><code>{`import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

// Apply to <html>:
// <html className={\`dark \${inter.variable} \${mono.variable}\`}>`}</code></pre>

      <h2>Import Components</h2>
      <pre><code>{`import {
  Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select,
  Checkbox, Switch, RadioGroup, Slider, PasswordInput,
  StatCard, Progress, Skeleton, Meter, Panel, FormRow,
  Avatar, AvatarGroup, Divider, Breadcrumb, Pagination, Segmented, Stepper,
  Tabs, Accordion, Tooltip, Alert, Empty, Toaster,
  Dialog, Sheet, DropdownMenu, Combobox, DatePicker, TagInput, FileUpload,
  DataTable, PricingCard,
  CommandMenu, ActionRow, CodeBlock, GlowCard, BentoDashboard,
  Container, Footer, NoirGlowBackground,
  ServiceHealthCard, HostCard, DockerStackCard, IncidentCard,
  ApprovalCard, ActionDiff, RollbackPlan, LogViewer, AlertInbox,
  Timeline, BackupStatusPanel,
} from '@tollerud/ui'`}</code></pre>

      <p><strong>RSC note:</strong> All components are client-side (hooks). Importing from <code>@tollerud/ui</code> in a Server Component is fine — Next.js will bundle it as client code. To render a component server-side you must wrap it in a Client Component boundary.</p>

      <h2>Basic Example</h2>
      <pre><code>{`export default function Page() {
  return (
    <div className="relative min-h-screen bg-tollerud-black">
      <NoirGlowBackground intensity="medium" speed="slow" shape="corners" forceCssFallback />
      <Container className="relative z-10">
        <Button variant="terminal" size="lg">start_building</Button>
        <Badge variant="success">Online</Badge>
        <StatusDot status="online" />
      </Container>
    </div>
  )
}`}</code></pre>

      <h2>Key Conventions</h2>
      <ul>
        <li><strong>Dark-first</strong> — add <code>class=&quot;dark&quot;</code> to <code>&lt;html&gt;</code>.</li>
        <li><strong>Yellow is signal</strong> — <code>var(--tollerud-yellow)</code> / <code>#FFFF00</code>. If it&apos;s yellow, click it. The warm secondary is <code>--tollerud-yellow-warm</code> / <code>#E8D500</code>.</li>
        <li><strong>Terminal CTAs</strong> — use <code>variant=&quot;terminal&quot;</code> for monospace ❯-prefixed buttons.</li>
        <li><strong>One color pop</strong> — yellow carries the weight. State colors stay muted.</li>
        <li><strong>Sharp corners</strong> — subtle radius for noir feel.</li>
      </ul>

      <h2>Component Categories</h2>
      <table>
        <thead>
          <tr><th>Category</th><th>Components</th></tr>
        </thead>
        <tbody>
          <tr><td>Form Primitives</td><td>Button, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Slider, PasswordInput, TagInput, FileUpload, Combobox, DatePicker</td></tr>
          <tr><td>Form Layout</td><td>FormRow, Segmented</td></tr>
          <tr><td>Status / Feedback</td><td>Badge, Pill, StatusDot, Alert, Toaster, Meter, Progress, Skeleton, Spinner</td></tr>
          <tr><td>Display</td><td>Card, Panel, StatCard, GlowCard, PricingCard, Avatar, AvatarGroup</td></tr>
          <tr><td>Navigation</td><td>Breadcrumb, Pagination, Tabs, Stepper, Accordion</td></tr>
          <tr><td>Overlays</td><td>Dialog, Sheet, Tooltip, DropdownMenu</td></tr>
          <tr><td>Layout</td><td>Container, Divider, BentoDashboard, Footer</td></tr>
          <tr><td>Code / Terminal</td><td>CodeBlock, Kbd, ActionRow, CommandMenu</td></tr>
          <tr><td>Atmosphere</td><td>NoirGlowBackground</td></tr>
          <tr><td>Homelab</td><td>ServiceHealthCard, HostCard, DockerStackCard, IncidentCard, ApprovalCard, ActionDiff, RollbackPlan, LogViewer, AlertInbox, Timeline, BackupStatusPanel, DataTable, Empty</td></tr>
        </tbody>
      </table>
    </div>
  )
}
