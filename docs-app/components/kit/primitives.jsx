'use client'
import { useState, useCallback } from 'react'
import { Icons } from './icons'
import propsData from '../../lib/props-data.json'

/* ── lightweight JSX syntax highlighter — single pass, never re-scans
   its own injected markup (so output stays valid XML for serialization) ── */
function highlight(code) {
  const esc = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/("[^"]*")|('[^']*')|(&lt;\/?)([A-Za-z][\w.]*)|([a-zA-Z_][\w-]*)(=)|(#[^\n]*|\/\/[^\n]*)/g,
    (m, dstr, sstr, lt, tag, attr, eq, comment) => {
      if (dstr !== undefined) return `<span class="tok-str">${dstr}</span>`;
      if (sstr !== undefined) return `<span class="tok-str">${sstr}</span>`;
      if (lt !== undefined && tag !== undefined) {
        const cls = /^[A-Z]/.test(tag) ? 'tok-comp' : 'tok-tag';
        return `<span class="tok-punct">${lt}</span><span class="${cls}">${tag}</span>`;
      }
      if (attr !== undefined && eq !== undefined) return `<span class="tok-attr">${attr}</span><span class="tok-punct">${eq}</span>`;
      if (comment !== undefined) return `<span class="tok-comment">${comment}</span>`;
      return m;
    });
}

/* ── Copy button ── */
function CopyButton({ text, label = 'Copy', className = 'ds-demo__btn' }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(text).then(() => {
      setDone(true)
      setTimeout(() => setDone(false), 1400)
    }).catch(() => {})
  }
  return (
    <button className={className} onClick={copy}>
      {done ? <Icons.check/> : <Icons.copy/>}
      {done ? 'Copied' : label}
    </button>
  );
}

/* ── Demo: live preview + collapsible code + copy ── */
function Demo({ code, children, variant = '', name, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const stageCls = 'ds-demo__stage' +
    (variant.includes('center') ? ' ds-demo__stage--center' : '') +
    (variant.includes('col') ? ' ds-demo__stage--col' : '');
  return (
    <div className="ds-demo ds-themed">
      <div className={stageCls}>{children}</div>
      {code && (
        <>
          <div className="ds-demo__bar">
            <span className="ds-demo__name">{name || 'example'}</span>
            <button className="ds-demo__btn" onClick={() => setOpen(o => !o)}>
              <Icons.code/>{open ? 'Hide code' : 'Code'}
            </button>
            <CopyButton text={code}/>
          </div>
          {open && (
            <div className="ds-demo__code">
              <pre><code dangerouslySetInnerHTML={{ __html: highlight(code) }}/></pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Standalone code block ── */
function CodeSnippet({ code, name }) {
  return (
    <div className="ds-demo ds-themed">
      <div className="ds-demo__bar">
        <span className="ds-demo__name">{name || 'code'}</span>
        <CopyButton text={code}/>
      </div>
      <div className="ds-demo__code">
        <pre><code dangerouslySetInnerHTML={{ __html: highlight(code) }}/></pre>
      </div>
    </div>
  );
}

/* ── Page + section scaffolding ── */
function PageHeader({ eyebrow, title, lede, icon }) {
  const I = icon ? Icons[icon] : null;
  return (
    <header className="ds-pagehead" data-reveal>
      {eyebrow && <div className="ds-eyebrow">{I && <I size={14}/>}{eyebrow}</div>}
      <h1 className="ds-pagetitle">{title}</h1>
      {lede && <p className="ds-pagelede">{lede}</p>}
    </header>
  );
}

function slugifySectionTitle(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function pickPrimaryInterface(component, interfaces) {
  if (!interfaces?.length) return null
  const preferred = `${component}Props`
  return interfaces.find((i) => i.name === preferred) || interfaces[0]
}

function PropTable({ component }) {
  const interfaces = propsData[component]
  const primary = pickPrimaryInterface(component, interfaces)
  if (!primary) return null

  return (
    <div className="ds-proptable">
      <div className="ds-row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span className="ds-subhead" style={{ margin: 0 }}>Props</span>
        <code className="ds-mono" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{primary.name}</code>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="ds-table">
          <thead>
            <tr><th>Prop</th><th>Type</th></tr>
          </thead>
          <tbody>
            {primary.props.map((prop) => {
              const colon = prop.indexOf(': ')
              const nameRaw = colon === -1 ? prop : prop.slice(0, colon)
              const optional = nameRaw.endsWith('?')
              const name = nameRaw.replace(/\?$/, '')
              const type = colon === -1 ? '' : prop.slice(colon + 2)
              return (
                <tr key={prop}>
                  <td><code className="ds-mono" style={{ fontSize: 12 }}>{name}{optional ? '?' : ''}</code></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{type || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Section({ id, title, desc, component, permalink, children }) {
  const sectionId = id || (title ? slugifySectionTitle(title) : undefined);
  return (
    <section className="ds-section" id={sectionId} data-reveal>
      <div className="ds-section__head">
        <h2 className="ds-section__title">{title}</h2>
        {permalink && (
          <a className="ds-section__permalink ds-mono" href={`/${permalink.replace(/\/$/, '')}/`} title="Permalink">
            /{permalink}/
          </a>
        )}
      </div>
      {desc && <p className="ds-section__desc">{desc}</p>}
      {(component || children) && (
        <div className="ds-section__body">
          {component && <PropTable component={component} />}
          {children}
        </div>
      )}
    </section>
  );
}

function SubHead({ children }) { return <h3 className="ds-subhead">{children}</h3>; }

/* ── Swatch + token tables ── */
function Swatch({ name, value, varName }) {
  const isVar = value && value.startsWith('var');
  return (
    <div className="ds-swatch ds-themed">
      <div className="ds-swatch__chip" style={{ background: value }}/>
      <div className="ds-swatch__meta">
        <div className="ds-swatch__name">{name}</div>
        <div className="ds-swatch__val">{varName || value}</div>
      </div>
    </div>
  );
}

function TokenTable({ cols, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="ds-table">
        <thead><tr>{cols.map((c,i) => <th key={i}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i}>{r.map((cell,j) => (
              <td key={j} dangerouslySetInnerHTML={typeof cell === 'string' ? { __html: cell } : undefined}>
                {typeof cell === 'string' ? undefined : cell}
              </td>
            ))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { highlight, CopyButton, Demo, CodeSnippet, PageHeader, Section, SubHead, Swatch, TokenTable, PropTable };
