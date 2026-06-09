'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, Badge, Pill, StatusDot, Kbd, Input, Textarea, Select, Checkbox, Switch, RadioGroup, Radio, StatCard, Progress, Skeleton, Avatar, Divider, Tabs, Segmented, Tooltip, Alert, Accordion, Breadcrumb, Pagination, Slider, DropdownMenu, Dialog, EmptyState, LogViewer, Spinner, Panel, Meter, Stepper, PasswordInput, FormRow, PricingCard, Drawer, Combobox, AvatarGroup, Timeline, DatePicker, FileUpload, TagInput, CodeBlock, Container, ActionRow, GlowCard, PackageDataTable, Toaster, toast, Footer, BentoDashboard, NoirGlowBackground, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, ToastProvider, useToast, Icons, Ico, DataTable, BarChart, AreaChart, Donut, Sparkline, HeroBlock, FeatureCard, CTABand, HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, AlertInbox, ApprovalCard, RollbackPlan, BackupStatusPanel, ActionDiff, initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED, slugify, jumpToSection, goToSection, buildSectionCommands, matchesCommandQuery, Squares, GrainGradient, PageBackgrounds, BgFrame, GradientReadabilityDemo, GrainGradientGL, CommandMenu } = __p

/* Tollerud DS — Forms. → window.PageForms */

/* ── Validation example ── */
function ValidationForm() {
  const toast = useToast();
  const [name, setName] = useState('');
  const [port, setPort] = useState('');
  const [touched, setTouched] = useState(false);
  const nameErr = touched && !name ? 'Server name is required' : '';
  const portErr = touched && port && !/^\d+$/.test(port) ? 'Port must be a number' : '';
  const submit = (e) => {
    e.preventDefault(); setTouched(true);
    if (name && (!port || /^\d+$/.test(port))) toast({ tone: 'success', title: `${name} — configuration saved`, message: port ? `Listening on port ${port}` : 'Using default port' });
    else toast({ tone: 'error', title: 'Check the highlighted fields' });
  };
  return (
    <form onSubmit={submit} className="ds-col" style={{ gap: 16, width: '100%', maxWidth: 360 }}>
      <Input label="Server name" placeholder="e.g. emma.tollerud.no" value={name} onChange={e => setName(e.target.value)} error={nameErr}/>
      <Input label="Port" placeholder="8080" value={port} onChange={e => setPort(e.target.value)} error={portErr}/>
      <Button variant="primary" type="submit">Save configuration</Button>
    </form>
  );
}

function PageForms() {
  const servers = [
    { value: 'emma', label: 'emma.tollerud.no' }, { value: 'miriam', label: 'miriam.tollerud.no' },
    { value: 'pia', label: 'pia.tollerud.no' }, { value: 'iris', label: 'iris.tollerud.no' },
    { value: 'victoria', label: 'victoria.tollerud.no' }, { value: 'embla', label: 'embla.tollerud.no' },
  ];
  const [rg, setRg] = useState('staging');
  return (
    <div>
      <PageHeader icon="forms" eyebrow="Forms" title="Forms"
        lede="Every input control, all states, and the higher-order patterns — combobox, date picker, file upload, tag entry and live validation."/>

      <Section title="Text input" desc="All states: default, filled, focused, error, disabled, and readonly. Labels and inline errors are built in.">
        <Demo name="inputs" code={`<Input label="Server name" placeholder="e.g. emma.tollerud.no" />
<Input label="Port" defaultValue="8080" />
<Input label="Host" error="Could not resolve host" defaultValue="emma" />
<Input label="Region" disabled defaultValue="eu-north" />
<Input label="API key" readOnly defaultValue="sk-••••••••••••••••" />`}>
          <div className="ds-grid-2" style={{ width: '100%' }}>
            <Input label="Default" placeholder="e.g. emma.tollerud.no"/>
            <Input label="Filled" defaultValue="8080"/>
            <Input label="Error" error="Could not resolve host" defaultValue="emma"/>
            <Input label="Disabled" disabled defaultValue="eu-north"/>
            <Input label="Readonly" readOnly defaultValue="sk-tollerud-••••••••" style={{ cursor: 'default', opacity: 0.75 }}/>
          </div>
        </Demo>
      </Section>

      <Section title="Textarea & Select" desc="Multiline entry and a styled native select with custom chevron.">
        <Demo name="textarea-select" code={`<Textarea label="Description" placeholder="Enter details…" rows={4} />
<Select label="Server" placeholder="Select a server" options={servers} />`}>
          <div className="ds-grid-2" style={{ width: '100%', alignItems: 'start' }}>
            <Textarea label="Description" placeholder="Enter details…" rows={4}/>
            <Select label="Server" placeholder="Select a server" options={servers}/>
          </div>
        </Demo>
      </Section>

      <Section title="Toggles" desc="Checkbox, switch and radio group — all keyboard accessible with custom indicators.">
        <Demo name="toggles" code={`<Checkbox label="Enable backups" defaultChecked />
<Switch label="Dark mode" defaultChecked />
<RadioGroup label="Deploy target" value={target} onChange={setTarget}>
  <Radio value="staging" label="Staging" />
  <Radio value="production" label="Production" />
  <Radio value="canary" label="Canary" disabled />
</RadioGroup>`}>
          <div className="ds-row" style={{ gap: 48, alignItems: 'flex-start' }}>
            <div className="ds-col" style={{ gap: 12 }}>
              <Checkbox label="Enable backups" defaultChecked/>
              <Checkbox label="Send alerts"/>
              <Checkbox label="Locked" disabled/>
            </div>
            <div className="ds-col" style={{ gap: 12 }}>
              <Switch label="Dark mode" defaultChecked/>
              <Switch label="Notifications"/>
              <Switch label="Beta features" disabled/>
            </div>
            <RadioGroup label="Deploy target" value={rg} onChange={setRg}>
              <Radio value="staging" label="Staging"/>
              <Radio value="production" label="Production"/>
              <Radio value="canary" label="Canary" disabled/>
            </RadioGroup>
          </div>
        </Demo>
      </Section>

      <Section title="Slider" desc="Range input with a yellow thumb and a live value readout.">
        <Demo name="slider" variant="col" code={`<Slider min={0} max={100} defaultValue={64} />`}>
          <div style={{ maxWidth: 360 }}><Slider min={0} max={100} defaultValue={64}/></div>
        </Demo>
      </Section>

      <Section title="Date picker" desc="A calendar popover for date selection — the control native HTML handles poorly.">
        <Demo name="datepicker" variant="col" code={`<DatePicker placeholder="Pick a date" />`}>
          <div style={{ maxWidth: 280 }}><DatePicker placeholder="Pick a date"/></div>
        </Demo>
      </Section>

      <Section title="File upload" desc="A drag-and-drop dropzone. Drop files or click to browse; accepted files are listed with a remove button.">
        <Demo name="upload" variant="col" code={`<FileUpload multiple description="compose.yml, .env, certs · up to 10 MB" />`}>
          <FileUpload multiple description="compose.yml, .env, certs · up to 10 MB"/>
        </Demo>
      </Section>

      <Section title="Tag input" desc="Chip-style tag entry. Press Enter to add, Backspace to remove the last tag.">
        <Demo name="tags" variant="col" code={`<TagInput defaultValue={['production', 'docker']} />`}>
          <TagInput defaultValue={['production', 'docker']} className="max-w-[360px]"/>
        </Demo>
      </Section>

      <Section title="Validation" desc="Errors surface on submit and clear as the user corrects. Success and failure both confirm with a toast.">
        <Demo name="validation" variant="col" code={`function ValidationForm() {
  const toast = useToast();
  const [name, setName] = useState('');
  const nameErr = touched && !name ? 'Server name is required' : '';
  // …validate on submit, then toast the result
}`}>
          <ValidationForm/>
        </Demo>
      </Section>
    </div>
  );
}
export default PageForms;