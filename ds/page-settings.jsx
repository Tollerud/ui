/* Tollerud DS — Build example: account settings. → window.PageSettings */
function PageSettings() {
  const toast = useToast();
  const SECTIONS = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'danger', label: 'Danger zone', icon: 'alert' },
  ];
  const [active, setActive] = useState('profile');
  const [confirm, setConfirm] = useState(false);
  const [name, setName] = useState('Tia Tollerud');
  const [dirty, setDirty] = useState(false);

  const Field = FormRow;

  return (
    <div>
      <PageHeader icon="settings" eyebrow="Build · settings" title="Settings"
        lede="An account settings screen — a left sub-nav, grouped fields with descriptions, toggles, and a destructive danger zone confirmed through a dialog."/>

      <Section title="Account" desc="Switch sections on the left. Changes raise a sticky save bar; the danger zone routes through a confirmation dialog.">
        <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="ds-settings">
            {/* sub-nav */}
            <aside className="ds-settings__nav">
              {SECTIONS.map(s => {
                const I = Icons[s.icon];
                return (
                  <button key={s.id} className={`ds-settings__navlink ${active === s.id ? 'is-active' : ''} ${s.id === 'danger' ? 'is-danger' : ''}`} onClick={() => setActive(s.id)}>
                    <I size={15}/>{s.label}
                  </button>
                );
              })}
            </aside>

            {/* panel */}
            <div className="ds-settings__panel">
              {active === 'profile' && (
                <div>
                  <div className="ds-row" style={{ gap: 16, paddingBottom: 18, borderBottom: '1px solid var(--border)' }}>
                    <Avatar name="Tia Tollerud" size={56}/>
                    <div>
                      <Button variant="secondary" size="sm"><Icons.upload size={13}/>Change avatar</Button>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>PNG or SVG, up to 2 MB</div>
                    </div>
                  </div>
                  <Field label="Display name" hint="Shown across the dashboard and in activity logs.">
                    <Input value={name} onChange={e => { setName(e.target.value); setDirty(true); }}/>
                  </Field>
                  <Field label="Email" hint="Used for sign-in and critical alerts.">
                    <Input defaultValue="tia@tollerud.no" onChange={() => setDirty(true)}/>
                  </Field>
                  <Field label="Timezone" hint="Schedules and timestamps use this zone.">
                    <Select defaultValue="oslo" onChange={() => setDirty(true)} options={[
                      { value: 'oslo', label: 'Europe/Oslo (CET)' },
                      { value: 'utc', label: 'UTC' },
                      { value: 'ny', label: 'America/New_York (EST)' },
                    ]}/>
                  </Field>
                </div>
              )}

              {active === 'security' && (
                <div>
                  <Field label="Two-factor auth" hint="Require a TOTP code at sign-in.">
                    <Switch label="Enabled" defaultChecked onChange={() => setDirty(true)}/>
                  </Field>
                  <Field label="Session timeout" hint="Sign out automatically after inactivity.">
                    <Select defaultValue="30" onChange={() => setDirty(true)} options={[
                      { value: '15', label: '15 minutes' }, { value: '30', label: '30 minutes' }, { value: '120', label: '2 hours' },
                    ]}/>
                  </Field>
                  <Field label="SSH key" hint="Public key used for host access.">
                    <Textarea rows={3} defaultValue="ssh-ed25519 AAAAC3NzaC1lZDI1... tia@tollerud" onChange={() => setDirty(true)}/>
                  </Field>
                  <Field label="Active sessions" hint="Devices currently signed in.">
                    <div className="ds-col" style={{ gap: 8 }}>
                      {[['MacBook Pro · Oslo', 'this device'], ['iPhone 15 · Oslo', '2h ago']].map(([d, t], i) => (
                        <div key={i} className="ds-row" style={{ justifyContent: 'space-between', padding: '9px 11px', border: '1px solid var(--border)', borderRadius: 6 }}>
                          <span style={{ fontSize: 13, color: 'var(--foreground)' }}>{d}</span>
                          <span className="ds-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </Field>
                </div>
              )}

              {active === 'notifications' && (
                <div>
                  {[
                    ['Deployments', 'When a stack deploys or rolls back', true],
                    ['Alerts', 'CPU, memory and disk thresholds', true],
                    ['Host offline', 'A host stops responding to health checks', true],
                    ['Weekly digest', 'A Monday summary of activity', false],
                    ['Product updates', 'New features and changelog', false],
                  ].map(([l, h, on], i) => (
                    <Field key={i} label={l} hint={h}>
                      <Switch defaultChecked={on} onChange={() => setDirty(true)}/>
                    </Field>
                  ))}
                </div>
              )}

              {active === 'danger' && (
                <div>
                  <Alert tone="error" title="These actions are irreversible">Double-check before you proceed — there is no undo.</Alert>
                  <div style={{ marginTop: 18 }}>
                    <Field label="Transfer ownership" hint="Hand this account to another user.">
                      <Button variant="secondary" size="sm" onClick={() => toast({ tone: 'info', title: 'Transfer flow opened' })}>Transfer</Button>
                    </Field>
                    <Field label="Delete account" hint="Permanently remove this account, hosts and logs.">
                      <Button variant="destructive" size="sm" onClick={() => setConfirm(true)}><Icons.trash size={13}/>Delete account</Button>
                    </Field>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* sticky save bar */}
          {dirty && active !== 'danger' && (
            <div className="ds-row" style={{ justifyContent: 'flex-end', gap: 10, padding: '12px 18px', borderTop: '1px solid var(--border)', background: 'var(--surface-raised)' }}>
              <Button variant="ghost" size="sm" onClick={() => setDirty(false)}>Discard</Button>
              <Button variant="primary" size="sm" onClick={() => { setDirty(false); toast({ tone: 'success', title: 'Settings saved' }); }}>Save changes</Button>
            </div>
          )}
        </div>
      </Section>

      <Dialog open={confirm} onClose={() => setConfirm(false)}
        title="Delete this account?"
        description="This permanently removes the account, all hosts, and their logs. This cannot be undone."
        footer={<>
          <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { setConfirm(false); toast({ tone: 'error', title: 'Account deletion scheduled' }); }}>Delete account</Button>
        </>}/>
    </div>
  );
}
window.PageSettings = PageSettings;
