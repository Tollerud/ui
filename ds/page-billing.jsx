/* Tollerud DS — Build example: billing & pricing. → window.PageBilling */

const PLANS = [
  { id: 'homelab', name: 'Homelab', tagline: 'For a single machine', monthly: 0, annual: 0,
    features: ['1 host', '5 containers', '24-hour log retention', 'Community support'], cta: 'Current plan', current: true },
  { id: 'pro', name: 'Pro', tagline: 'For a growing fleet', monthly: 12, annual: 120, recommended: true,
    features: ['10 hosts', 'Unlimited containers', '30-day log retention', 'Approvals & rollback', 'Email & webhook alerts', 'Priority support'], cta: 'Upgrade to Pro' },
  { id: 'fleet', name: 'Fleet', tagline: 'For teams & orgs', monthly: 49, annual: 490,
    features: ['Unlimited hosts', 'SSO & SCIM', '1-year log retention', 'Audit log & RBAC', '99.9% uptime SLA', 'Dedicated support'], cta: 'Contact sales' },
];

function PageBilling() {
  const toast = useToast();
  const [cycle, setCycle] = useState('monthly');

  const invoices = [
    { id: 'INV-2026-006', date: '2026-06-01', amount: 12.00, status: 'paid' },
    { id: 'INV-2026-005', date: '2026-05-01', amount: 12.00, status: 'paid' },
    { id: 'INV-2026-004', date: '2026-04-01', amount: 12.00, status: 'paid' },
    { id: 'INV-2026-003', date: '2026-03-01', amount: 12.00, status: 'paid' },
    { id: 'INV-2026-002', date: '2026-02-01', amount: 9.00,  status: 'paid' },
    { id: 'INV-2026-001', date: '2026-01-01', amount: 9.00,  status: 'refunded' },
  ];
  const invStatus = { paid: 'success', due: 'warning', refunded: 'default' };

  return (
    <div>
      <PageHeader icon="card" eyebrow="Build · billing" title="Billing & Pricing"
        lede="The commercial surface: a pricing table with a billing-cycle toggle, the current plan with live usage meters, and an invoice history — the invoices dogfood the same <DataTable> component."/>

      <Section title="Plans" desc="Three tiers with a monthly / annual toggle. The recommended plan carries the yellow accent; the current plan is marked.">
        <div className="ds-row" style={{ justifyContent: 'center', marginBottom: 22 }}>
          <Segmented value={cycle} onChange={setCycle} options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'annual', label: 'Annual · save 17%' },
          ]}/>
        </div>
        <div className="ds-price-grid">
          {PLANS.map(p => {
            const price = cycle === 'monthly' ? p.monthly : Math.round(p.annual / 12);
            return (
              <PricingCard key={p.id} name={p.name} tagline={p.tagline}
                price={p.monthly === 0 ? 'Free' : price}
                priceNote={p.monthly === 0 ? 'Forever' : cycle === 'annual' ? `$${p.annual} billed yearly` : 'billed monthly'}
                recommended={p.recommended}
                features={p.features}
                cta={p.cta}
                ctaVariant={p.recommended ? 'primary' : p.current ? 'secondary' : 'ghost'}
                ctaDisabled={p.current}
                onCta={() => toast({ tone: p.id === 'fleet' ? 'info' : 'accent', title: p.id === 'fleet' ? 'Opening sales chat…' : `Upgrading to ${p.name}…` })}/>
            );
          })}
        </div>
      </Section>

      <Section title="Your plan" desc="The current subscription with usage tracked against plan limits, the next invoice, and the active payment method.">
        <div className="ds-bill-grid">
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="ds-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="ds-row" style={{ gap: 9 }}>
                  <SubHead>Pro</SubHead>
                  <span className="tollerud-badge tollerud-badge--accent">active</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Renews 30 Jun 2026 · $12/mo</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toast({ tone: 'info', title: 'Opening plan options…' })}>Change plan</Button>
            </div>
            <div className="ds-col" style={{ gap: 14 }}>
              <Meter label="Hosts" value={6} max={10} valueLabel="6 / 10"/>
              <Meter label="Containers" value={28} unlimited valueLabel="28 running"/>
              <Meter label="Team seats" value={3} max={5} valueLabel="3 / 5"/>
              <Meter label="Log retention" value={30} max={30} valueLabel="30 / 30 days"/>
            </div>
          </Card>

          <div className="ds-col" style={{ gap: 16 }}>
            <Card>
              <SubHead>Next invoice</SubHead>
              <div className="ds-row" style={{ alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-mono)' }}>$12.00</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>due 30 Jun</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>Pro plan · 1 month. Usage is within limits — no overage this cycle.</p>
            </Card>
            <Card>
              <SubHead>Payment method</SubHead>
              <div className="ds-row" style={{ justifyContent: 'space-between', marginTop: 6 }}>
                <span className="ds-row" style={{ gap: 11 }}>
                  <span style={{ color: 'var(--tollerud-yellow)' }}><Icons.card size={22}/></span>
                  <span>
                    <span className="ds-mono" style={{ fontSize: 13.5, color: 'var(--foreground)' }}>•••• •••• •••• 4242</span>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)' }}>Visa · expires 09/27</span>
                  </span>
                </span>
                <Button variant="ghost" size="sm" onClick={() => toast({ tone: 'info', title: 'Update card…' })}>Update</Button>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section title="Invoices" desc="Billing history rendered with the reusable <DataTable> — sortable, paginated, with a per-row menu to download or view each invoice.">
        <DataTable
          rows={invoices}
          rowKey="id"
          pageSize={5}
          columns={[
            { key: 'id', header: 'Invoice', sortable: true, render: (r) => <span className="ds-mono" style={{ fontSize: 12.5, color: 'var(--foreground)' }}>{r.id}</span> },
            { key: 'date', header: 'Date', sortable: true, render: (r) => <span className="ds-mono" style={{ fontSize: 12.5 }}>{r.date}</span> },
            { key: 'status', header: 'Status', sortable: true, render: (r) => <Badge variant={invStatus[r.status]}>{r.status}</Badge> },
            { key: 'amount', header: 'Amount', align: 'right', sortable: true, render: (r) => <span className="ds-mono" style={{ color: 'var(--foreground)' }}>${r.amount.toFixed(2)}</span> },
          ]}
          rowMenu={(r) => [
            { label: 'Download PDF', icon: 'download', onSelect: () => toast({ tone: 'success', title: `Downloading ${r.id}.pdf` }) },
            { label: 'View invoice', icon: 'external', onSelect: () => toast({ tone: 'info', title: `Opening ${r.id}` }) },
          ]}
        />
      </Section>
    </div>
  );
}
window.PageBilling = PageBilling;
