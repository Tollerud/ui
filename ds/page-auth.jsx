/* Tollerud DS — Build example: sign-in screen. → window.PageAuth */
function PageAuth() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailErr = touched && !/^[^@]+@[^@]+\.[^@]+$/.test(email) ? 'Enter a valid email' : '';
  const pwErr = touched && pw.length < 6 ? 'At least 6 characters' : '';

  const submit = (e) => {
    e.preventDefault(); setTouched(true);
    if (!emailErr && !pwErr && email && pw) {
      setLoading(true);
      setTimeout(() => { setLoading(false); toast({ tone: 'success', title: 'Signed in', message: 'Welcome back, Tia' }); }, 1100);
    }
  };

  return (
    <div>
      <PageHeader icon="shield" eyebrow="Build · authentication" title="Sign in"
        lede="An authentication screen pairing the live tollerud.no grain-gradient atmosphere with a validated form, OAuth options and a loading state — the system's most cinematic surface."/>

      <Section title="Split sign-in" desc="A two-panel layout: brand and terminal on the left over the grain gradient, the form on the right. Collapses to a single column on mobile.">
        <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="ds-auth">
            {/* brand panel */}
            <div className="ds-auth__brand">
              <GrainGradient intensity={0.55}/>
              <div className="tollerud-grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4, zIndex: 1 }}/>
              <div className="ds-auth__brand-inner" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 30px' }}>
                <div className="ds-row" style={{ gap: 11 }}>
                  <img src="tollerud-logo.svg" alt="" style={{ width: 26 }}/>
                  <span style={{ fontWeight: 700, color: '#F5F5F5', fontSize: 15 }}>Tollerud</span>
                </div>
                <div>
                  <h3 className="tollerud-display" style={{ fontSize: 30, color: '#F5F5F5', lineHeight: 1.05 }}>Welcome back to mission control.</h3>
                  <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 9, padding: '9px 13px', borderRadius: 8, background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(245,245,245,0.14)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                    <span style={{ color: 'var(--tollerud-yellow)' }}>❯</span>
                    <Typewriter lines={['ssh tia@emma.tollerud.no', 'authenticating…', 'access granted ✓']} style={{ color: '#E5E5E5', whiteSpace: 'nowrap' }}/>
                  </div>
                </div>
                <div className="ds-row" style={{ gap: 8, fontSize: 12, color: 'rgba(245,245,245,0.5)' }}>
                  <span className="ds-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}/>
                  All systems operational
                </div>
              </div>
            </div>

            {/* form panel */}
            <div className="ds-auth__form">
              <div style={{ width: '100%', maxWidth: 320 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--foreground)' }}>Sign in to your account</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 6 }}>Use your Tollerud credentials.</p>

                <div className="ds-row" style={{ gap: 10, marginTop: 22 }}>
                  <Button variant="secondary" style={{ flex: 1 }} onClick={() => toast({ tone: 'info', title: 'Redirecting to GitHub…' })}><Icons.github size={15}/>GitHub</Button>
                  <Button variant="secondary" style={{ flex: 1 }} onClick={() => toast({ tone: 'info', title: 'Redirecting to SSO…' })}><Icons.shield size={15}/>SSO</Button>
                </div>
                <div className="ds-row" style={{ gap: 12, margin: '18px 0' }}>
                  <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>or</span>
                  <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
                </div>

                <form onSubmit={submit} className="ds-col" style={{ gap: 14 }}>
                  <Input label="Email" type="email" placeholder="tia@tollerud.no" value={email} onChange={e => setEmail(e.target.value)} error={emailErr}/>
                  <PasswordInput label="Password" id="pw" placeholder="••••••••" value={pw}
                    onChange={e => setPw(e.target.value)} error={pwErr}
                    labelAction={<a href="#" onClick={e => { e.preventDefault(); toast({ tone: 'info', title: 'Reset link sent' }); }} style={{ fontSize: 12, color: 'var(--accent-text)' }}>Forgot?</a>}/>
                  <div className="ds-row" style={{ justifyContent: 'space-between' }}>
                    <Checkbox label="Remember me" defaultChecked/>
                  </div>
                  <Button variant="primary" type="submit" style={{ width: '100%' }} disabled={loading}>
                    {loading ? <><span className="ds-spin" style={{ width: 14, height: 14 }}/> Signing in…</> : 'Sign in'}
                  </Button>
                </form>

                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', textAlign: 'center', marginTop: 18 }}>
                  No account? <a href="#" onClick={e => { e.preventDefault(); toast({ tone: 'info', title: 'Request access' }); }} style={{ color: 'var(--accent-text)' }}>Request access</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
window.PageAuth = PageAuth;
