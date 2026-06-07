/* Tollerud DS — Forms. → window.PageForms */

/* ── Date picker ── */
function DatePicker() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(new Date(2026, 5, 1));
  const [sel, setSel] = useState(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popRef = useRef(null);

  useEffect(() => {
    const h = e => {
      if (triggerRef.current && !triggerRef.current.contains(e.target) &&
          popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const openPicker = () => {
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX });
    setOpen(o => !o);
  };

  const y = view.getFullYear(), m = view.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const monthName = view.toLocaleString('en', { month: 'long', year: 'numeric' });
  const cells = []; for (let i = 0; i < (first + 6) % 7; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  const fmt = sel ? sel.toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  return (
    <div style={{ width: 280 }}>
      <button ref={triggerRef} className="tollerud-input ds-row" onClick={openPicker} style={{ justifyContent: 'space-between', cursor: 'pointer', width: '100%' }}>
        <span style={{ color: sel ? 'var(--foreground)' : 'var(--text-muted)' }}>{fmt || 'Pick a date'}</span>
        <Icons.calendar size={15}/>
      </button>
      {open && ReactDOM.createPortal(
        <div ref={popRef} className="tollerud-menu ds-themed" style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 9999, padding: 12, width: 256 }}>
          <div className="ds-row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
            <button className="ds-iconbtn" style={{ width: 28, height: 28 }} onClick={() => setView(new Date(y, m - 1, 1))}><Icons.chevLeft size={14}/></button>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--foreground)' }}>{monthName}</span>
            <button className="ds-iconbtn" style={{ width: 28, height: 28 }} onClick={() => setView(new Date(y, m + 1, 1))}><Icons.chevRight size={14}/></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i} style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>)}
            {cells.map((d, i) => {
              const isSel = sel && d && sel.getDate() === d && sel.getMonth() === m && sel.getFullYear() === y;
              return d ? (
                <button key={i} onClick={() => { setSel(new Date(y, m, d)); setOpen(false); }}
                  style={{ aspectRatio: '1', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12.5, fontFamily: 'var(--font-mono)',
                    background: isSel ? 'var(--tollerud-yellow)' : 'transparent', color: isSel ? '#0A0A0A' : 'var(--text-secondary)', fontWeight: isSel ? 600 : 400 }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}>{d}</button>
              ) : <div key={i}/>;
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ── File upload (drag-drop) ── */
function FileUpload() {
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState([]);
  const add = (list) => setFiles(f => [...f, ...Array.from(list).map(x => ({ name: x.name, size: (x.size / 1024).toFixed(0) + ' KB' }))]);
  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <label onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '28px 20px', border: `1.5px dashed ${over ? 'var(--tollerud-yellow)' : 'var(--input)'}`, borderRadius: 8, background: over ? 'rgba(232,213,0,0.05)' : 'var(--card)', cursor: 'pointer', transition: 'all .15s', textAlign: 'center' }}>
        <span style={{ color: over ? 'var(--tollerud-yellow)' : 'var(--text-muted)' }}><Icons.upload size={22}/></span>
        <div style={{ fontSize: 13.5, color: 'var(--foreground)', fontWeight: 500 }}>Drop files or click to browse</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>compose.yml, .env, certs · up to 10 MB</div>
        <input type="file" multiple style={{ display: 'none' }} onChange={e => add(e.target.files)}/>
      </label>
      {files.length > 0 && (
        <div className="ds-col" style={{ gap: 6, marginTop: 10 }}>
          {files.map((f, i) => (
            <div key={i} className="ds-row" style={{ justifyContent: 'space-between', padding: '8px 11px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--card)' }}>
              <span className="ds-row" style={{ gap: 8, fontSize: 13, color: 'var(--foreground)' }}><Icons.folder size={15}/>{f.name}</span>
              <span className="ds-row" style={{ gap: 10 }}><span className="ds-mono" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{f.size}</span>
                <button onClick={() => setFiles(fs => fs.filter((_, j) => j !== i))} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><Icons.x size={14}/></button></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Tag input ── */
function TagInput() {
  const [tags, setTags] = useState(['production', 'docker']);
  const [v, setV] = useState('');
  const add = () => { const t = v.trim(); if (t && !tags.includes(t)) setTags([...tags, t]); setV(''); };
  return (
    <div className="tollerud-input ds-row" style={{ flexWrap: 'wrap', gap: 6, width: 360, cursor: 'text' }}>
      {tags.map(t => (
        <span key={t} className="tollerud-chip">{t}<button onClick={() => setTags(tags.filter(x => x !== t))}><Icons.x size={11}/></button></span>
      ))}
      <input value={v} onChange={e => setV(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } if (e.key === 'Backspace' && !v) setTags(tags.slice(0, -1)); }}
        placeholder={tags.length ? '' : 'Add tags…'} style={{ flex: 1, minWidth: 80, background: 'transparent', border: 'none', outline: 'none', color: 'var(--foreground)', fontSize: 14, fontFamily: 'var(--font-sans)' }}/>
    </div>
  );
}

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
        <Demo name="datepicker" variant="col" code={`<DatePicker />`}>
          <DatePicker/>
        </Demo>
      </Section>

      <Section title="File upload" desc="A drag-and-drop dropzone. Drop files or click to browse; accepted files are listed with a remove button.">
        <Demo name="upload" variant="col" code={`<FileUpload />`}>
          <FileUpload/>
        </Demo>
      </Section>

      <Section title="Tag input" desc="Chip-style tag entry. Press Enter to add, Backspace to remove the last tag.">
        <Demo name="tags" variant="col" code={`<TagInput />  // Enter to add · Backspace to remove`}>
          <TagInput/>
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
window.PageForms = PageForms;
