/* Tollerud DS — Components gallery. → window.PageComponents */
function Timeline({ items }) {
  const statusColor = { online: 'var(--success)', warning: 'var(--warning)', offline: 'var(--destructive)', idle: 'var(--tollerud-noir-400)' };
  return (
    <div className="tollerud-timeline ds-themed" style={{ width: '100%' }}>
      {items.map((it, i) => (
        <div className="tollerud-timeline__item" key={i}>
          <div className="tollerud-timeline__marker">
            <div className="tollerud-timeline__dot-group" style={{ height: '100%' }}>
              <span className="tollerud-timeline__dot" style={{ background: statusColor[it.status] }}/>
              {i < items.length - 1 && <span className="tollerud-timeline__line"/>}
            </div>
          </div>
          <div className="tollerud-timeline__content">
            <div className="ds-row" style={{ justifyContent: 'space-between' }}>
              <span className="tollerud-timeline__title">{it.title}</span>
              <span className="tollerud-timeline__time">{it.time}</span>
            </div>
            <div className="tollerud-timeline__description">{it.description}</div>
            {it.meta && <div className="ds-row" style={{ gap: 6, marginTop: 6 }}>{it.meta.map((m, j) => <span key={j} className="tollerud-timeline__meta">{m}</span>)}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function PageComponents() {
  const toast = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [combo, setCombo] = useState('emma');
  const [density, setDensity] = useState('comfortable');
  return (
    <div>
      <PageHeader icon="grid" eyebrow="Components" title="Components"
        lede="The core building blocks. Every example is live and theme-aware — hit Code to grab the React + Tailwind."/>

      <Section title="Button" desc="Five variants, three sizes. Supports icons, loading spinners, disabled state, and icon-only. Primary is yellow; terminal carries the ❯ for technical actions.">
        <Demo name="buttons" variant="center" code={`<Button variant="primary">Deploy</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">More</Button>
<Button variant="destructive">Delete</Button>
<Button variant="terminal">start_building</Button>`}>
          <Button variant="primary">Deploy</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost">More</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="terminal">start_building</Button>
        </Demo>
        <Demo name="button-sizes" variant="center" code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Demo>
        <Demo name="button-icons" variant="center" code={`{/* With icon */}
<Button variant="primary"><Icons.rocket size={15}/>Deploy</Button>
<Button variant="secondary"><Icons.refresh size={15}/>Restart</Button>
<Button variant="destructive"><Icons.trash size={15}/>Delete</Button>

{/* Loading */}
<Button variant="primary" disabled><Spinner size={14}/>Deploying…</Button>

{/* Icon-only */}
<Button variant="ghost" style={{width:36,height:36,padding:0}}><Icons.settings size={16}/></Button>

{/* Disabled */}
<Button variant="primary" disabled>Disabled</Button>
<Button variant="secondary" disabled>Disabled</Button>`}>
          <Button variant="primary"><Icons.rocket size={15}/>Deploy</Button>
          <Button variant="secondary"><Icons.refresh size={15}/>Restart</Button>
          <Button variant="destructive"><Icons.trash size={15}/>Delete</Button>
          <Button variant="primary" disabled><Spinner size={14}/>Deploying…</Button>
          <Button variant="ghost" style={{ width: 36, height: 36, padding: 0 }}><Icons.settings size={16}/></Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </Demo>
      </Section>

      <Section title="Card" desc="The default surface. Add an accent for a yellow-bordered, highlighted card.">
        <Demo name="cards" code={`<Card>
  <h3 className="font-semibold mb-1">Standard card</h3>
  <p className="text-sm text-tollerud-noir-200">A raised surface with a hairline border.</p>
</Card>
<Card accent>
  <h3 className="font-semibold mb-1">Accent card</h3>
  <p className="text-sm text-tollerud-noir-200">Yellow border for emphasis.</p>
</Card>`}>
          <Card style={{ flex: 1, minWidth: 220 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Standard card</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>A raised surface with a hairline border.</p>
          </Card>
          <Card accent style={{ flex: 1, minWidth: 220 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 4, color: 'var(--foreground)' }}>Accent card</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>Yellow border for emphasis.</p>
          </Card>
        </Demo>
      </Section>

      <Section title="Divider" desc="A horizontal rule. Default uses the border token; accent variant draws a short yellow rule for section breaks.">
        <Demo name="dividers" variant="col" code={`<Divider />
<Divider accent />`}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 12 }}>Content above the divider</p>
            <Divider/>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '12px 0' }}>Content below the divider</p>
            <Divider accent/>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 12 }}>Accent variant — short yellow rule</p>
          </div>
        </Demo>
      </Section>

      <Section title="Badge & Pill" desc="Badges label status inline. Pills are tiny mono-flavored tags.">
        <Demo name="badges" variant="center" code={`<Badge variant="accent">New</Badge>
<Badge variant="success">Online</Badge>
<Badge variant="warning">Degraded</Badge>
<Badge variant="error">Offline</Badge>
<Badge variant="info">Beta</Badge>`}>
          <Badge variant="accent">New</Badge>
          <Badge variant="success">Online</Badge>
          <Badge variant="warning">Degraded</Badge>
          <Badge variant="error">Offline</Badge>
          <Badge variant="info">Beta</Badge>
          <Badge variant="default">Default</Badge>
        </Demo>
        <Demo name="pills" variant="center" code={`<Pill variant="outline">new</Pill>
<Pill variant="muted">deprecated</Pill>
<Pill variant="success">stable</Pill>
<Pill variant="error">critical</Pill>`}>
          <Pill variant="outline">new</Pill>
          <Pill variant="muted">deprecated</Pill>
          <Pill variant="success">stable</Pill>
          <Pill variant="error">critical</Pill>
        </Demo>
      </Section>

      <Section title="Status & Kbd" desc="Status dots show liveness with a soft glow. Kbd renders shortcut chips.">
        <Demo name="status" variant="center" code={`<StatusDot status="online" label="emma — ready" />
<StatusDot status="warning" label="CPU 87%" />
<StatusDot status="offline" label="pia — unreachable" />
<StatusDot status="idle" label="iris — idle" />`}>
          <StatusDot status="online" label="emma — ready"/>
          <StatusDot status="warning" label="CPU 87%"/>
          <StatusDot status="offline" label="pia — unreachable"/>
          <StatusDot status="idle" label="iris — idle"/>
        </Demo>
        <Demo name="kbd" variant="center" code={`<Kbd keys="⌘+K" />
<Kbd keys={["⌘","⇧","S"]} />
<Kbd keys="Esc" size="sm" />`}>
          <Kbd keys="⌘+K"/>
          <Kbd keys={["⌘", "⇧", "S"]}/>
          <Kbd keys="Esc" size="sm"/>
        </Demo>
      </Section>

      <Section title="Stat card" desc="Compact metric tiles for dashboards, with optional trend.">
        <Demo name="stats" code={`<StatCard label="Active Sessions" value="42" change={{ value: "12%", direction: "up" }} icon="activity" />
<StatCard label="CPU Load" value="63%" change={{ value: "4%", direction: "down" }} icon="cpu" />
<StatCard label="Storage" value="1.2 TB" icon="database" />`}>
          <div className="ds-grid-3" style={{ width: '100%' }}>
            <StatCard label="Active Sessions" value="42" change={{ value: '12%', direction: 'up' }} icon="activity"/>
            <StatCard label="CPU Load" value="63%" change={{ value: '4%', direction: 'down' }} icon="cpu"/>
            <StatCard label="Storage" value="1.2 TB" icon="database"/>
          </div>
        </Demo>
      </Section>

      <Section title="Progress, Skeleton & Avatar" desc="Loading and identity primitives. Avatar and AvatarGroup stack naturally.">
        <Demo name="progress" variant="col" code={`<Progress value={72} />
<Skeleton h={14} w="60%" />
<Avatar name="Tia Tollerud" />`}>
          <div style={{ maxWidth: 320 }}><Progress value={72}/></div>
          <div className="ds-col" style={{ gap: 8, maxWidth: 320 }}>
            <Skeleton h={14} w="60%"/>
            <Skeleton h={14} w="90%"/>
            <Skeleton h={48} w="100%" r={8}/>
          </div>
          <div className="ds-row"><Avatar name="Tia Tollerud"/><Avatar name="Emma R" size={44}/><Avatar name="Pia K" size={28}/></div>
        </Demo>
        <Demo name="avatar-group" variant="center" code={`<AvatarGroup max={4} users={[
  { name: 'Tia', status: 'online' },
  { name: 'Emma Pung', status: 'online' },
  { name: 'Pia Berg', status: 'warning' },
]} />`}>
          <AvatarGroup max={4} size={36} users={[
            { name: 'Tia', status: 'online' },
            { name: 'Emma Pung', status: 'online' },
            { name: 'Pia Berg', status: 'warning' },
            { name: 'Sigrid Vik', status: 'offline' },
            { name: 'Astrid Lund' },
            { name: 'Embla Ro' },
          ]}/>
        </Demo>
      </Section>

      <Section title="Tooltip" desc="Appears on hover and focus. Supports top (default) and bottom placement.">
        <Demo name="tooltip" variant="center" code={`<Tooltip label="⌘K to open">
  <Button variant="secondary">Hover me</Button>
</Tooltip>`}>
          <Tooltip label="⌘K to open"><Button variant="secondary">Hover me</Button></Tooltip>
          <Tooltip label="Restart container" side="bottom"><Button variant="ghost">Bottom</Button></Tooltip>
        </Demo>
      </Section>

      <Section title="Alert" desc="Four semantic tones. Pass icon to override the default icon per tone.">
        <Demo name="alerts" variant="col" code={`<Alert tone="accent"  title="Heads up">Yellow signals an action worth noticing.</Alert>
<Alert tone="info"    title="Scheduled">Maintenance window at 03:00 UTC.</Alert>
<Alert tone="success" title="Deployed">emma — hermes v2.0 is live.</Alert>
<Alert tone="error"   title="Connection failed">Could not resolve host — check DNS.</Alert>
<Alert tone="error"   title="Storage full" icon="database">Custom icon via icon prop.</Alert>`}>
          <Alert tone="accent"  title="Heads up">Yellow signals an action worth noticing.</Alert>
          <Alert tone="info"    title="Scheduled">Maintenance window at 03:00 UTC. No action needed.</Alert>
          <Alert tone="success" title="Deployed">emma — hermes v2.0 is live.</Alert>
          <Alert tone="error"   title="Connection failed">Could not resolve host — check DNS.</Alert>
          <Alert tone="error"   title="Storage full" icon="database">Custom icon via the <code>icon</code> prop.</Alert>
        </Demo>
      </Section>

      <Section title="Tabs & Accordion" desc="Organize content. Tabs ship pill and underline variants.">
        <Demo name="tabs" variant="col" code={`<Tabs tabs={[
  { id: 'overview', label: 'Overview', content: '...' },
  { id: 'logs', label: 'Logs', content: '...' },
  { id: 'config', label: 'Config', content: '...' },
]} />`}>
          <Tabs tabs={[
            { id: 'overview', label: 'Overview', content: 'Pill tabs — the default. Good for switching views inside a card.' },
            { id: 'logs', label: 'Logs', content: 'Each tab swaps the panel below it.' },
            { id: 'config', label: 'Config', content: 'Keyboard and click both work.' },
          ]}/>
          <Tabs variant="underline" tabs={[
            { id: 'a', label: 'Services', content: 'Underline tabs — for page-level sections.' },
            { id: 'b', label: 'Hosts', content: 'A yellow underline marks the active tab.' },
            { id: 'c', label: 'Backups', content: 'Lower-chrome, more editorial.' },
          ]}/>
        </Demo>
        <Demo name="accordion" variant="col" code={`<Accordion items={[
  { q: 'How do I install?', a: '...' },
  { q: 'Does it support light mode?', a: '...' },
]} />`}>
          <div style={{ width: '100%', maxWidth: 560 }}>
            <Accordion items={[
              { q: 'How do I install the system?', a: 'Add the Tailwind preset, import globals.css, and copy the components folder. Three steps, on the Overview page.' },
              { q: 'Does it support light mode?', a: 'Yes — the entire system flips on a single data-theme attribute. Try the toggle in the top bar.' },
              { q: 'Can I use it without React?', a: 'Yes. Every component has a matching .tollerud-* CSS class in globals.css for plain HTML.' },
            ]}/>
          </div>
        </Demo>
      </Section>

      <Section title="Timeline" desc="Vertical activity feed with status-colored dots and metadata.">
        <Demo name="timeline" variant="col" code={`<Timeline items={[
  { time: '14:32', title: 'Deployed hermes v2.0', description: 'Rolled out to emma', status: 'online', meta: ['success','3s'] },
  { time: '14:31', title: 'Restarted nginx', description: 'Config reloaded', status: 'warning', meta: ['warning'] },
  { time: '14:30', title: 'SSH connection failed', description: 'emma refused connection', status: 'offline' },
]} />`}>
          <div style={{ width: '100%', maxWidth: 520 }}>
            <Timeline items={[
              { time: '14:32', title: 'Deployed hermes v2.0', description: 'Rolled out to emma', status: 'online', meta: ['success', '3s'] },
              { time: '14:31', title: 'Restarted nginx', description: 'Config reloaded', status: 'warning', meta: ['warning'] },
              { time: '14:30', title: 'SSH connection failed', description: 'emma refused connection', status: 'offline' },
            ]}/>
          </div>
        </Demo>
      </Section>

      <Section title="Panel" desc="A card with a header bar (title + optional actions) and optional footer. Pass a fragment with multiple buttons to actions for a toolbar.">
        <Demo name="panel" variant="col" code={`<Panel title="Compose stack" icon="grid"
  actions={<Button variant="ghost" size="sm">Edit</Button>}
  footer={<span className="ds-mono">compose.yml · 4 services</span>}>
  …content…
</Panel>

{/* Multiple actions */}
<Panel title="hermes" icon="server"
  actions={<>
    <Button variant="ghost" size="sm">Logs</Button>
    <Button variant="ghost" size="sm">Restart</Button>
    <Button variant="destructive" size="sm">Stop</Button>
  </>}>
  …content…
</Panel>`}>
          <div className="ds-col" style={{ width: '100%', maxWidth: 460, gap: 16 }}>
            <Panel title="Compose stack" icon="grid" actions={<Button variant="ghost" size="sm">Edit</Button>}
              footer={<span className="ds-mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>compose.yml · 4 services</span>}>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0 }}>Single action in the header.</p>
            </Panel>
            <Panel title="hermes" icon="server"
              actions={<><Button variant="ghost" size="sm">Logs</Button><Button variant="ghost" size="sm">Restart</Button><Button variant="destructive" size="sm">Stop</Button></>}>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0 }}>Multiple actions — pass a React fragment to <code>actions</code>.</p>
            </Panel>
          </div>
        </Demo>
      </Section>

      <Section title="Meter" desc="A labeled progress row that turns red past a hot threshold (default 85%). Used for CPU/memory/disk and plan-usage limits.">
        <Demo name="meter" variant="col" code={`<Meter label="CPU" value={23} valueLabel="23%" />
<Meter label="Disk" value={88} valueLabel="88%" />
<Meter label="Containers" value={28} unlimited valueLabel="28 running" />`}>
          <div className="ds-col" style={{ width: '100%', maxWidth: 380, gap: 12 }}>
            <Meter label="CPU" value={23} valueLabel="23%"/>
            <Meter label="Disk" value={88} valueLabel="88%"/>
            <Meter label="Containers" value={28} unlimited valueLabel="28 running"/>
          </div>
        </Demo>
      </Section>

      <Section title="Stepper" desc="Horizontal step indicator for wizards and multi-stage flows. Pass an array of step labels and the current step index (0-based). Completed steps fill yellow; the active step carries a ring.">
        <Demo name="stepper" variant="col" code={`const steps = ['Connect host', 'Choose stacks', 'Invite team', 'Finish'];

// Step 0 = first (active), step 1 = second (active), etc.
<Stepper steps={steps} current={0} />  {/* on step 1 of 4 */}
<Stepper steps={steps} current={2} />  {/* on step 3, first two done */}
<Stepper steps={steps} current={3} />  {/* last step */}`}>
          <div className="ds-col" style={{ width: '100%', gap: 24 }}>
            <Stepper steps={['Connect host', 'Choose stacks', 'Invite team', 'Finish']} current={0}/>
            <Stepper steps={['Connect host', 'Choose stacks', 'Invite team', 'Finish']} current={2}/>
            <Stepper steps={['Connect host', 'Choose stacks', 'Invite team', 'Finish']} current={3}/>
          </div>
        </Demo>
      </Section>

      <Section title="Password input & spinner" desc="A password field with a show/hide toggle and an optional label action, plus the inline loading spinner.">
        <Demo name="password-input" variant="col" code={`<PasswordInput label="Password" placeholder="••••••••"
  labelAction={<a href="#">Forgot?</a>} />

<Button variant="primary"><Spinner size={14}/> Signing in…</Button>`}>
          <div className="ds-col" style={{ width: '100%', maxWidth: 340, gap: 16 }}>
            <PasswordInput label="Password" placeholder="••••••••" defaultValue="hunter2"
              labelAction={<a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: 'var(--accent-text)' }}>Forgot?</a>}/>
            <Button variant="primary" style={{ alignSelf: 'flex-start' }}><Spinner size={14}/> Signing in…</Button>
          </div>
        </Demo>
      </Section>

      <Section title="Form row" desc="Label + hint on the left, control on the right. The canonical settings-form layout; stacks vertically on narrow viewports.">
        <Demo name="form-row" variant="col" code={`<FormRow label="Two-factor auth" hint="Require a TOTP code at sign-in.">
  <Switch defaultChecked />
</FormRow>`}>
          <div style={{ width: '100%', maxWidth: 520 }}>
            <FormRow label="Display name" hint="Shown across the dashboard and in activity logs."><Input defaultValue="Tia"/></FormRow>
            <FormRow label="Two-factor auth" hint="Require a TOTP code at sign-in."><Switch defaultChecked/></FormRow>
          </div>
        </Demo>
      </Section>

      <Section title="Pricing card" desc="A single plan tier with optional ribbon, feature list and CTA. Powers the Billing page and the marketing pricing block.">
        <Demo name="pricing-card" variant="col" code={`<PricingCard name="Pro" tagline="For a growing fleet"
  price={12} priceNote="billed monthly" recommended
  features={['10 hosts', 'Approvals & rollback', 'Priority support']}
  cta="Upgrade to Pro" />`}>
          <div className="ds-price-grid" style={{ width: '100%' }}>
            <PricingCard name="Homelab" price="Free" priceNote="Forever" features={['1 host', '5 containers', 'Community support']} cta="Current plan" ctaVariant="secondary" ctaDisabled/>
            <PricingCard name="Pro" tagline="For a growing fleet" price={12} priceNote="billed monthly" recommended features={['10 hosts', 'Approvals & rollback', 'Priority support']} cta="Upgrade to Pro"/>
            <PricingCard name="Fleet" price={49} priceNote="billed monthly" features={['Unlimited hosts', 'SSO & SCIM', 'Audit log']} cta="Contact sales"/>
          </div>
        </Demo>
      </Section>

      <Section title="Toast" desc="Transient feedback via the useToast() hook. Tones: success, error, info, accent. Auto-dismisses; stacks bottom-right.">
        <Demo name="toast" variant="center" code={`const toast = useToast();
toast({ tone: 'success', title: 'Deployed', message: 'hermes v2.0 is live' });`}>
          <div className="ds-row" style={{ gap: 10 }}>
            <Button variant="secondary" size="sm" onClick={() => toast({ tone: 'success', title: 'Deployed', message: 'hermes v2.0 is live' })}>Success</Button>
            <Button variant="secondary" size="sm" onClick={() => toast({ tone: 'error', title: 'Build failed', message: 'exit code 1' })}>Error</Button>
            <Button variant="secondary" size="sm" onClick={() => toast({ tone: 'accent', title: 'Heads up' })}>Accent</Button>
          </div>
        </Demo>
      </Section>

      <Section title="Drawer / Sheet" desc="A side panel for detail views and slide-over forms. Opens from the right or left, closes on Esc or overlay click.">
        <Demo name="drawer" variant="center" code={`<Drawer open={open} onClose={() => setOpen(false)} title="Host details"
  description="emma.tollerud.no"
  footer={<><Button variant="ghost" size="sm">Close</Button><Button variant="primary" size="sm">Connect</Button></>}>
  …content…
</Drawer>`}>
          <Button variant="primary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Host details" description="emma.tollerud.no"
            footer={<><Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>Close</Button><Button variant="primary" size="sm" onClick={() => { setDrawerOpen(false); toast({ tone: 'info', title: 'Connecting to emma…' }); }}>Connect (SSH)</Button></>}>
            <div className="ds-col" style={{ gap: 14 }}>
              <Meter label="CPU" value={23} valueLabel="23%"/>
              <Meter label="Memory" value={62} valueLabel="62%"/>
              <Meter label="Disk" value={45} valueLabel="45%"/>
              <FormRow label="Auto-restart" hint="Restart on failure."><Switch defaultChecked/></FormRow>
            </div>
          </Drawer>
        </Demo>
      </Section>

      <Section title="Combobox" desc="A searchable single-select with full keyboard navigation (↑/↓/Enter/Esc) and an empty state. The autocomplete every dashboard needs.">
        <Demo name="combobox" variant="col" code={`<Combobox
  label="Host"
  value={value}
  onChange={setValue}
  options={[{ value: 'emma', label: 'emma.tollerud.no' }, …]}
/>`}>
          <div style={{ width: '100%', maxWidth: 320 }}>
            <Combobox label="Connect to host" value={combo} onChange={setCombo}
              options={[
                { value: 'emma', label: 'emma.tollerud.no' },
                { value: 'pia', label: 'pia.tollerud.no' },
                { value: 'iris', label: 'iris.tollerud.no' },
                { value: 'miriam', label: 'miriam.tollerud.no' },
                { value: 'embla', label: 'embla.tollerud.no' },
              ]}/>
          </div>
        </Demo>
      </Section>

      <Section title="Density" desc="Two ways to apply compact density: set density='compact' directly on a Card, or wrap a group with data-density='compact' to tighten everything inside.">
        <Demo name="density" variant="col" code={`{/* Per-card density prop */}
<Card density="compact">…</Card>
<Card>…</Card>

{/* Or wrap a container */}
<div data-density="compact">
  {/* all cards, tables, form rows inside are compact */}
</div>`}>
          <div style={{ width: '100%' }}>
            <div className="ds-row" style={{ marginBottom: 14 }}>
              <Segmented value={density} onChange={setDensity} options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]}/>
            </div>
            <div data-density={density}>
              <div className="ds-grid-2" style={{ gap: 12 }}>
                <Card><div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Card title</div><p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Padding tightens in compact mode.</p></Card>
                <Card><FormRow label="Two-factor" hint="TOTP at sign-in."><Switch defaultChecked/></FormRow></Card>
              </div>
            </div>
            <div className="ds-row" style={{ gap: 12, marginTop: 12 }}>
              <Card density="compact" style={{ flex: 1 }}><div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>density="compact"</div><p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Always compact via prop.</p></Card>
              <Card style={{ flex: 1 }}><div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Default</div><p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Comfortable by default.</p></Card>
            </div>
          </div>
        </Demo>
      </Section>

      <Section title="Empty state" desc="For surfaces with no data, no results, or an error. Icon, headline, calm explanation, one clear action. A compact variant fits inside cards.">
        <Demo name="empty-state" code={`<EmptyState
  icon="server"
  title="No hosts connected"
  description="Connect your first machine and Tia will start watching it."
  action={<Button variant="primary" size="sm">Connect a host</Button>}
/>`}>
          <div className="ds-grid-2" style={{ width: '100%' }}>
            <EmptyState icon="server" title="No hosts connected"
              description="Connect your first machine and Tia will start watching it."
              action={<Button variant="primary" size="sm"><Icons.plus size={14}/>Connect a host</Button>}/>
            <EmptyState icon="checkCircle" accent title="All clear"
              description="No open alerts across your fleet."
              action={<Button variant="ghost" size="sm">View history</Button>}/>
          </div>
        </Demo>
      </Section>

      <Section title="Log viewer" desc="Level-coded streaming logs with optional search, line numbers and follow-tail. Pass an array of { text, level, timestamp, source }.">
        <Demo name="log-viewer" variant="col" code={`<LogViewer
  searchable
  showLineNumbers
  height={220}
  lines={[
    { timestamp: '14:32:01', level: 'info',  source: 'hermes', text: 'Listening on 0.0.0.0:8080' },
    { timestamp: '14:32:04', level: 'warn',  source: 'nginx',  text: 'upstream response 1.84s exceeds budget' },
    { timestamp: '14:32:05', level: 'error', source: 'nginx',  text: 'connect() failed (111: Connection refused)' },
    { timestamp: '14:32:10', level: 'info',  source: 'hermes', text: 'GET /api/v1/hosts 200 in 23ms' },
  ]}
/>`}>
          <div style={{ width: '100%' }}>
            <LogViewer searchable showLineNumbers height={220} lines={[
              { timestamp: '14:32:01', level: 'info',  source: 'systemd',  text: 'Started tollerud-agent.service' },
              { timestamp: '14:32:02', level: 'info',  source: 'hermes',   text: 'Listening on 0.0.0.0:8080 (4 workers)' },
              { timestamp: '14:32:03', level: 'debug', source: 'postgres', text: 'database system is ready to accept connections' },
              { timestamp: '14:32:04', level: 'warn',  source: 'nginx',    text: 'upstream response time 1.84s exceeds 1.5s budget' },
              { timestamp: '14:32:05', level: 'error', source: 'nginx',    text: 'connect() failed (111: Connection refused) upstream emma:443' },
              { timestamp: '14:32:10', level: 'info',  source: 'hermes',   text: 'GET /api/v1/hosts 200 in 23ms' },
              { timestamp: '14:32:12', level: 'trace', source: 'agent',    text: 'tick scheduler queue depth=2' },
            ]}/>
          </div>
        </Demo>
      </Section>

      <Section title="Data table" desc="The config-driven <DataTable>: pass rows + a column spec and opt into search, a filter, selection with bulk actions, per-row menus, pagination and an empty state. Powers the Data Table build example.">
        <Demo name="data-table" variant="col" code={`<DataTable
  rows={services}
  rowKey="name"
  columns={[
    { key: 'name', header: 'Service', sortable: true,
      render: (r) => <b>{r.name}</b> },
    { key: 'status', header: 'Status',
      render: (r) => <Badge variant={r.status === 'online' ? 'success' : 'error'}>{r.status}</Badge> },
    { key: 'replicas', header: 'Replicas', align: 'right', sortable: true },
  ]}
  searchable
  selectable
  pageSize={4}
  bulkActions={[{ label: 'Restart', icon: 'refresh', onRun: (ids, clear) => clear() }]}
  rowMenu={(r) => [{ label: 'View logs', icon: 'code', onSelect: () => {} }]}
/>`}>
          <div style={{ width: '100%' }}>
            <DataTable
              rows={[
                { name: 'hermes', status: 'online', replicas: 4, image: 'hermes:v2.0' },
                { name: 'nginx', status: 'online', replicas: 2, image: 'nginx:1.27' },
                { name: 'postgres', status: 'online', replicas: 1, image: 'postgres:16' },
                { name: 'grafana', status: 'online', replicas: 1, image: 'grafana:11.2' },
                { name: 'prometheus', status: 'online', replicas: 1, image: 'prom:2.54' },
                { name: 'alertmanager', status: 'offline', replicas: 0, image: 'alert:0.27' },
              ]}
              rowKey="name"
              columns={[
                { key: 'name', header: 'Service', sortable: true, render: (r) => (
                  <div className="ds-row" style={{ gap: 8 }}>
                    <span style={{ color: 'var(--tollerud-yellow)' }}><Icons.grid size={14}/></span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>{r.name}</div>
                      <div className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.image}</div>
                    </div>
                  </div>
                ) },
                { key: 'status', header: 'Status', sortable: true, render: (r) => <Badge variant={r.status === 'online' ? 'success' : 'error'}>{r.status}</Badge> },
                { key: 'replicas', header: 'Replicas', align: 'right', sortable: true, render: (r) => <span className="ds-mono">{r.replicas}</span> },
              ]}
              searchable
              searchKeys={['name', 'image']}
              searchPlaceholder="Search services…"
              selectable
              pageSize={4}
              bulkActions={[{ label: 'Restart', icon: 'refresh', onRun: (ids, clear) => clear() }]}
              rowMenu={() => [{ label: 'View logs', icon: 'code', onSelect: () => {} }, { sep: true }, { label: 'Remove', icon: 'trash', onSelect: () => {} }]}
              emptyState={<EmptyState compact icon="search" title="No services" description="Nothing matches your search."/>}
            />
          </div>
        </Demo>
      </Section>
    </div>
  );
}
window.Timeline = Timeline;
window.PageComponents = PageComponents;
