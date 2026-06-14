'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, CommandMenu } = __p

/* @tollerud/ui docs — Onboarding build example */

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
        <div className="ds-col" style={{ gap: 16, marginTop: 20 }}>
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
        <div className="ds-col" style={{ gap: 16, marginTop: 20 }}>
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
        <div className="ds-col" style={{ gap: 16, marginTop: 20 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Invite your team</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>Optional — add teammates by email, one per line. You can do this later from Settings.</p>
          </div>
          <Textarea label="Emails" rows={4} placeholder={'emma@tollerud.no\npia@tollerud.no'} value={invites} onChange={e => setInvites(e.target.value)}/>
          {inviteCount > 0 && <span className="ds-mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{inviteCount} invite{inviteCount > 1 ? 's' : ''} ready to send</span>}
        </div>
      )}

      {step === 3 && (
        <div style={{ marginTop: 20 }}>
        <EmptyState icon="rocket" accent title="You're all set"
          description={`Tia is watching ${stacks.length} stack${stacks.length !== 1 ? 's' : ''} on ${host || 'your host'}${inviteCount ? ` · ${inviteCount} invite${inviteCount > 1 ? 's' : ''} queued` : ''}. The agent starts in read-only mode.`}
          action={<Button variant="primary" onClick={() => toast({ tone: 'success', title: 'Workspace ready — opening Mission Control' })}>Open Mission Control</Button>}
          secondaryAction={<Button variant="ghost" onClick={reset}>Start over</Button>}/>
        </div>
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

function PageOnboarding({ go }) {
  return (
    <div>
      <PageHeader icon="rocket" eyebrow="Examples · onboarding" title="Onboarding"
        lede="The first five minutes — a multi-step setup wizard for connecting a host, choosing stacks, and inviting teammates. Built from Stepper, Input, Alert, and EmptyState."/>

      <Section title="Setup wizard"
        desc="A four-step flow with a live stepper, inline validation, multi-select cards and a success state. Every control is wired — try advancing without a valid hostname.">
        <SetupWizard/>
        {go && (
          <div className="ds-row" style={{ gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <button type="button" className="tollerud-btn tollerud-btn--ghost tollerud-btn--sm" onClick={() => go('components/empty-state')}>
              EmptyState component — gallery and compact variant
              <Icons.arrowRight size={14} />
            </button>
            <button type="button" className="tollerud-btn tollerud-btn--ghost tollerud-btn--sm" onClick={() => go('screens/empty-page')}>
              EmptyPage — full-page empty state
              <Icons.arrowRight size={14} />
            </button>
          </div>
        )}
      </Section>
    </div>
  );
}
export default PageOnboarding;