'use client'
import React, { useEffect, useMemo, useState } from 'react'
import {
  render,
  WelcomeEmail,
  VerifyEmail,
  PasswordResetEmail,
  ReceiptEmail,
} from '@tollerud/email'
import * as __p from '@/lib/provide-pages'

const { Segmented, Switch, Input, CodeSnippet } = __p

/* Norwegian copy overrides per template, applied when lang === 'nb'. */
const NB = {
  welcome: {
    ctaLabel: 'Åpne dashbordet',
    copy: {
      heading: (n) => `Velkommen${n ? `, ${n}` : ''}.`,
      body: (p) => `Din ${p}-konto er klar. Ta en titt rundt — alt er satt opp og venter på deg.`,
      help: 'Trenger du hjelp? Bare svar på denne e-posten.',
    },
  },
  verify: {
    expiresIn: '24 timer',
    copy: {
      heading: 'Bekreft e-posten din',
      body: (n, p) =>
        `${n ? `Hei ${n}, ett` : 'Ett'} siste steg — bekreft at dette er e-postadressen din for å fullføre oppsettet av ${p}-kontoen.`,
      buttonLabel: 'Bekreft e-postadresse',
      linkHelp: 'Hvis knappen ikke virker, kopier og lim inn denne lenken i nettleseren:',
      expiresNote: (e) => `Denne lenken utløper om ${e}.`,
    },
  },
  'password-reset': {
    expiresIn: '1 time',
    copy: {
      heading: 'Tilbakestill passordet',
      body: (n, p) =>
        `${n ? `Hei ${n}, vi` : 'Vi'} mottok en forespørsel om å tilbakestille passordet for ${p}-kontoen din. Klikk under for å velge et nytt.`,
      buttonLabel: 'Tilbakestill passord',
      note: (e) => `Denne lenken utløper om ${e}. Hvis du ikke ba om dette, kan du trygt ignorere e-posten.`,
    },
  },
  receipt: {
    copy: {
      heading: 'Kvittering',
      intro: (n, orderId, date) =>
        `${n ? `Takk, ${n}. ` : 'Takk. '}Her er kvitteringen for ordre ${orderId} den ${date}.`,
      totalLabel: 'Totalt',
    },
  },
}

const NB_FOOTER = {
  labels: { tollerudProject: 'Et Tollerud-prosjekt', allRightsReserved: 'Alle rettigheter forbeholdt.' },
}

const TEMPLATES = { WelcomeEmail, VerifyEmail, PasswordResetEmail, ReceiptEmail }
const TEMPLATE_NAMES = {
  welcome: 'WelcomeEmail',
  verify: 'VerifyEmail',
  'password-reset': 'PasswordResetEmail',
  receipt: 'ReceiptEmail',
}

/** Build the props object for the selected template from the configurator state. */
function buildProps(cfg) {
  const { template, productName, name, lang, header, align, address, unsubscribe } = cfg
  const nb = lang === 'nb'
  const footer = {
    ...(nb ? NB_FOOTER : { labels: { tollerudProject: 'A Tollerud Project' } }),
    ...(address ? { address: nb ? 'Oslo, Norge' : 'Oslo, Norway' } : {}),
    ...(unsubscribe ? { unsubscribeUrl: 'https://design.tollerud.dev/unsubscribe' } : {}),
  }
  const headerProp = header ? { header: { productName, align } } : {}
  const nbT = NB[template] || {}

  const base = { name, productName, ...headerProp, footer }
  switch (template) {
    case 'welcome':
      return {
        ...base,
        ctaUrl: 'https://design.tollerud.dev/',
        ...(nb ? { ctaLabel: nbT.ctaLabel, copy: nbT.copy } : {}),
      }
    case 'verify':
      return {
        ...base,
        verifyUrl: 'https://design.tollerud.dev/verify?token=…',
        expiresIn: nb ? nbT.expiresIn : '24 hours',
        ...(nb ? { copy: nbT.copy } : {}),
      }
    case 'password-reset':
      return {
        ...base,
        resetUrl: 'https://design.tollerud.dev/reset?token=…',
        expiresIn: nb ? nbT.expiresIn : '1 hour',
        ...(nb ? { copy: nbT.copy } : {}),
      }
    case 'receipt':
      return {
        ...base,
        orderId: 'INV-1042',
        date: '2026-07-12',
        items: [
          { description: 'Pro plan — monthly', amount: '$49.00' },
          { description: 'Extra seats × 2', amount: '$18.00' },
        ],
        total: '$67.00',
        ...(nb ? { copy: nbT.copy } : {}),
      }
    default:
      return base
  }
}

/** Human-readable usage snippet reflecting the current config. */
function codeFor(cfg) {
  const comp = TEMPLATE_NAMES[cfg.template]
  const lines = [`<${comp}`]
  lines.push(`  name="${cfg.name}"`)
  lines.push(`  productName="${cfg.productName}"`)
  if (cfg.template === 'welcome') lines.push('  ctaUrl={dashboardUrl}')
  if (cfg.template === 'verify') lines.push('  verifyUrl={verifyUrl}')
  if (cfg.template === 'password-reset') lines.push('  resetUrl={resetUrl}')
  if (cfg.template === 'receipt') lines.push('  orderId="INV-1042" date="2026-07-12" items={items} total="$67.00"')
  if (cfg.header) lines.push(`  header={{ productName: '${cfg.productName}'${cfg.align === 'center' ? ", align: 'center'" : ''} }}`)
  if (cfg.lang === 'nb') lines.push('  copy={{ /* Norwegian overrides */ }}')
  const footerBits = []
  footerBits.push(`labels: { tollerudProject: '${cfg.lang === 'nb' ? 'Et Tollerud-prosjekt' : 'A Tollerud Project'}' }`)
  if (cfg.address) footerBits.push(`address: '${cfg.lang === 'nb' ? 'Oslo, Norge' : 'Oslo, Norway'}'`)
  if (cfg.unsubscribe) footerBits.push('unsubscribeUrl')
  lines.push(`  footer={{ ${footerBits.join(', ')} }}`)
  lines.push('/>')
  return `import { render, ${comp} } from '@tollerud/email'\n\nconst html = await render(\n  ${lines.join('\n  ')},\n)`
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: 6,
  display: 'block',
}

export function EmailConfigurator() {
  const [cfg, setCfg] = useState({
    template: 'welcome',
    productName: 'Graphify',
    name: 'Mathias',
    lang: 'en',
    header: true,
    align: 'left',
    address: true,
    unsubscribe: true,
  })
  const [html, setHtml] = useState('')
  const set = (patch) => setCfg((c) => ({ ...c, ...patch }))

  useEffect(() => {
    let cancelled = false
    const Template = TEMPLATES[TEMPLATE_NAMES[cfg.template]]
    Promise.resolve(render(React.createElement(Template, buildProps(cfg)))).then((h) => {
      if (!cancelled) setHtml(h)
    })
    return () => {
      cancelled = true
    }
  }, [cfg])

  const code = useMemo(() => codeFor(cfg), [cfg])

  return (
    <div className="ds-col" style={{ gap: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          padding: 16,
          border: '1px solid var(--border)',
          borderRadius: 12,
          background: 'var(--surface-raised)',
        }}
      >
        <div style={{ gridColumn: '1 / -1' }}>
          <span style={labelStyle}>Template</span>
          <Segmented
            value={cfg.template}
            onChange={(v) => set({ template: v })}
            options={[
              { value: 'welcome', label: 'Welcome' },
              { value: 'verify', label: 'Verify' },
              { value: 'password-reset', label: 'Reset' },
              { value: 'receipt', label: 'Receipt' },
            ]}
          />
        </div>
        <div>
          <span style={labelStyle}>Product name</span>
          <Input value={cfg.productName} onChange={(e) => set({ productName: e.target.value })} />
        </div>
        <div>
          <span style={labelStyle}>Recipient name</span>
          <Input value={cfg.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div>
          <span style={labelStyle}>Language</span>
          <Segmented
            value={cfg.lang}
            onChange={(v) => set({ lang: v })}
            options={[
              { value: 'en', label: 'English' },
              { value: 'nb', label: 'Norsk' },
            ]}
          />
        </div>
        <div>
          <span style={labelStyle}>Header align</span>
          <Segmented
            value={cfg.align}
            onChange={(v) => set({ align: v })}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
            ]}
          />
        </div>
        <div className="ds-row" style={{ gap: 20, gridColumn: '1 / -1', flexWrap: 'wrap' }}>
          <Switch
            label="Branded header"
            checked={cfg.header}
            onChange={(e) => set({ header: e.target.checked })}
          />
          <Switch
            label="Footer address"
            checked={cfg.address}
            onChange={(e) => set({ address: e.target.checked })}
          />
          <Switch
            label="Unsubscribe link"
            checked={cfg.unsubscribe}
            onChange={(e) => set({ unsubscribe: e.target.checked })}
          />
        </div>
      </div>

      <iframe
        title="Live email preview"
        srcDoc={html}
        style={{
          width: '100%',
          height: 560,
          border: '1px solid var(--border)',
          borderRadius: 10,
          background: '#0A0A0A',
          display: 'block',
        }}
      />

      <CodeSnippet name="usage" code={code} />
    </div>
  )
}

export default EmailConfigurator
