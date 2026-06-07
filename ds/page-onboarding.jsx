/* Tollerud DS — Build example: onboarding wizard + empty states. → window.PageOnboarding */

const WIZ_STEPS = ['Connect host', 'Choose stacks', 'Invite team', 'Finish'];
const STACK_OPTIONS = [
  { id: 'monitoring', name: 'Monitoring', desc: 'Prometheus · Grafana · Alertmanager', icon: 'activity' },
  { id: 'media',      name: 'Media',      desc: 'Jellyfin · *arr suite',             icon: 'play' },
  { id: 'web',        name: 'Web edge',   desc: 'nginx · Hermes API',                icon: 'globe' },
  { id: 'backup',     name: 'Backups',    desc: 'rclone → JottaCloud',               icon: 'database' },
];

function SetupWizard() {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [host, setHost] = useState('');
  const [touched, setTouched] = useState(false);
  const [stacks, setStacks] = useState(['monitoring']);
  const [invites, setInvites] = useState('');

  const hostError = touched && !/^[a-z0-9][a-z0-9.-]*\.tollerud\.no$/.test(host.trim().toLowerCase())
    ? 'Use a fully-qualified host, e.g. emma.tollerud.no' : null;

  const toggleStack = (id) => setStacks(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const next = () => {
    if (step === 0) { setTouched(true); if (hostError || !host.trim()) return; }
    setStep(s => Math.min(WIZ_STEPS.length - 1, s + 1));
  };
  const back = () => setStep(s => Math.max(0, s - 1));
  const reset = () => { setStep(0); setHost(''); setTouched(false); setStacks(['monitoring']); setInvites(''); };
  const inviteCount = invites.split(/[\n,]/).map(s => s.trim()).filter(Boolean).length;

  return (
    <div className="tollerud-card ds-themed" style={{ padding: 22, maxWidth: 640 }}>
      {/* stepper */}
      <Stepper steps={WIZ_STEPS} current={step}/>

      {/* step body */}
      {step === 0 && (
        <div className="ds-col" style={{ gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Connect your first host</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>Tia connects over SSH and installs the agent. Point it at a machine on your network.</p>
          </div>
          <Input label="Hostname" placeholder="emma.tollerud.no" value={host}
            onChange={e => setHost(e.target.value)} onBlur={() => setTouched(true)} error={hostError}/>
          <Alert tone="accent" title="Read-only first">The agent runs in dry-run until you approve its first action. Nothing changes without you.</Alert>
        </div>
      )}

      {step === 1 && (
        <div className="ds-col" style={{ gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Choose stacks to manage</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>Pick the compose stacks on <b style={{ color: 'var(--foreground)' }}>{host || 'this host'}</b> you want Tia to watch.</p>
          </div>
          <div className="ds-grid-2">
            {STACK_OPTIONS.map(s => {
              const on = stacks.includes(s.id);
              const I = Icons[s.icon];
              return (
                <button key={s.id} onClick={() => toggleStack(s.id)}
                  className="tollerud-card ds-themed" style={{ padding: 14, textAlign: 'left', cursor: 'pointer',
                    borderColor: on ? 'var(--tollerud-yellow)' : 'var(--border)',
                    background: on ? 'color-mix(in srgb, var(--tollerud-yellow) 7%, var(--card))' : 'var(--card)' }}>
                  <div className="ds-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: 'var(--tollerud-yellow)' }}><I size={18}/></span>
                    <span style={{ width: 18, height: 18, borderRadius: 5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      border: `1.5px solid ${on ? 'var(--tollerud-yellow)' : 'var(--input)'}`, background: on ? 'var(--tollerud-yellow)' : 'transparent', color: '#0A0A0A' }}>
                      {on && <Icons.check size={12} strokeWidth={2.8}/>}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{s.name}</div>
                  <div className="ds-mono" style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{s.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="ds-col" style={{ gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Invite your team</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>Optional — add teammates by email, one per line. You can do this later from Settings.</p>
          </div>
          <Textarea label="Emails" rows={4} placeholder={'emma@tollerud.no\npia@tollerud.no'} value={invites} onChange={e => setInvites(e.target.value)}/>
          {inviteCount > 0 && <span className="ds-mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{inviteCount} invite{inviteCount > 1 ? 's' : ''} ready to send</span>}
        </div>
      )}

      {step === 3 && (
        <EmptyState icon="rocket" accent title="You're all set"
          description={`Tia is watching ${stacks.length} stack${stacks.length !== 1 ? 's' : ''} on ${host || 'your host'}${inviteCount ? ` · ${inviteCount} invite${inviteCount > 1 ? 's' : ''} queued` : ''}. The agent starts in read-only mode.`}
          action={<Button variant="primary" onClick={() => toast({ tone: 'success', title: 'Workspace ready — opening Mission Control' })}>Open Mission Control</Button>}
          secondaryAction={<Button variant="ghost" onClick={reset}>Start over</Button>}/>
      )}

      {/* nav */}
      {step < 3 && (
        <div className="ds-row" style={{ justifyContent: 'space-between', marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
          <Button variant="ghost" onClick={back} disabled={step === 0}><Icons.chevLeft size={15}/>Back</Button>
          <div className="ds-row" style={{ gap: 10 }}>
            <span className="ds-mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>Step {step + 1} of {WIZ_STEPS.length}</span>
            <Button variant="primary" onClick={next}>{step === 2 ? 'Finish' : 'Continue'}<Icons.chevRight size={15}/></Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PageOnboarding() {
  const toast = useToast();
  return (
    <div>
      <PageHeader icon="rocket" eyebrow="Build · onboarding" title="Onboarding & Empty States"
        lede="The first five minutes. A multi-step setup wizard and a gallery of empty states — the screens a user meets before there's any data — all built from system components and theme-aware."/>

      <Section title="Setup wizard"
        desc="A four-step flow with a live stepper, inline validation, multi-select cards and a success state. Every control is wired — try advancing without a valid hostname.">
        <SetupWizard/>
      </Section>

      <Section title="Empty states"
        desc="Reach for the EmptyState component whenever a surface has no data yet, returned no results, or hit an error. Each pairs an icon, a one-line headline, a calm explanation and a single clear action.">
        <div className="ds-grid-2">
          <EmptyState icon="server" title="No hosts connected"
            description="Connect your first machine and Tia will start watching it within seconds."
            action={<Button variant="primary" size="sm" onClick={() => toast({ tone: 'accent', title: 'Launching setup wizard…' })}><Icons.plus size={14}/>Connect a host</Button>}/>
          <EmptyState icon="checkCircle" accent title="All clear"
            description="No open alerts across your fleet. The last incident was acknowledged 6 days ago."
            action={<Button variant="ghost" size="sm">View history</Button>}/>
          <EmptyState icon="search" title="No results"
            description="Nothing matches “grafna”. Check the spelling or clear the filter to see everything."
            action={<Button variant="secondary" size="sm">Clear search</Button>}/>
          <EmptyState icon="alert" title="Couldn’t reach the agent"
            description="emma.tollerud.no refused the connection. The agent may be offline or the port blocked."
            action={<Button variant="secondary" size="sm"><Icons.refresh size={14}/>Retry</Button>}
            secondaryAction={<Button variant="ghost" size="sm">View logs</Button>}/>
        </div>
      </Section>

      <Section title="Inline & compact"
        desc="A compact variant drops into cards, tables and panels where a full-bleed empty state would be too heavy.">
        <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden', maxWidth: 520 }}>
          <div className="ds-row" style={{ justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid var(--border)' }}>
            <span className="ds-row" style={{ gap: 8, fontWeight: 600, fontSize: 14, color: 'var(--foreground)' }}><Icons.bell size={15}/>Alert inbox</span>
            <span className="tollerud-badge tollerud-badge--default">0</span>
          </div>
          <EmptyState compact icon="bell" title="Inbox zero"
            description="No alerts right now — we’ll surface anything that needs you here."/>
        </div>
      </Section>
    </div>
  );
}
window.PageOnboarding = PageOnboarding;
