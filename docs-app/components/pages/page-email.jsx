'use client'
import React from 'react'
import * as __p from '@/lib/provide-pages'
const { Button, Card, CodeSnippet, Demo, PageHeader, Section, Icons } = __p

/* @tollerud/email docs — previews + configuration */

/** Iframe preview of a pre-rendered email (docs-app/public/email/*.html). */
function EmailPreview({ src, title, height = 520 }) {
  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      style={{
        width: '100%',
        height,
        border: '1px solid var(--border)',
        borderRadius: 10,
        background: '#0A0A0A',
        display: 'block',
      }}
    />
  )
}

function PageEmail() {
  return (
    <div>
      <PageHeader
        icon="mail"
        eyebrow="Resources"
        title="Email"
        lede="On-brand HTML email with @tollerud/email — a separate render target from the web components, built on React Email. Previews below are the real rendered output."
      />

      <Section
        title="Overview"
        desc="Email is table-based, inline-styled, and can't use CSS variables — so it ships as its own package that shares Tollerud's tokens (inlined as literals), not the @tollerud/ui components. Each project composes its own templates from the primitives."
      >
        <div className="ds-col" style={{ gap: 12 }}>
          <Card>
            <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Install</div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.55 }}>
              Never render <code className="ds-mono">@tollerud/ui</code> web components into email — they break in Outlook/Gmail. Use <code className="ds-mono">@tollerud/email</code>.
            </p>
            <CodeSnippet name="install" code={`npm install @tollerud/email`} />
          </Card>
        </div>
      </Section>

      <Section
        title="Welcome"
        desc="Onboarding welcome email, shown with the optional branded header (monogram + project name) and the Tollerud footer. Pass a template's copy, header, and footer props to configure it."
      >
        <Demo
          name="WelcomeEmail"
          code={`import { render, WelcomeEmail } from '@tollerud/email'

const html = await render(
  <WelcomeEmail
    name="Mathias"
    productName="Graphify"
    ctaUrl={dashboardUrl}
    header={{ productName: 'Graphify' }}
    footer={{ labels: { tollerudProject: 'A Tollerud Project' }, address: 'Oslo, Norway', unsubscribeUrl }}
  />,
)
// hand the HTML to your mailer (Resend, SES, Nodemailer, …)`}
        >
          <EmailPreview src="/email/welcome.html" title="Welcome email" />
        </Demo>
      </Section>

      <Section
        title="Branded header — optional"
        desc="The header is opt-in. Omit the `header` prop for a clean, no-lockup email; the footer still carries the brand."
      >
        <Demo
          name="WelcomeEmail — no header"
          code={`// Drop the header prop for no lockup at the top
<WelcomeEmail name="Mathias" productName="Graphify" ctaUrl={dashboardUrl} />`}
        >
          <EmailPreview src="/email/welcome-plain.html" title="Welcome email without header" height={460} />
        </Demo>
      </Section>

      <Section
        title="Localization — copy override"
        desc="Every template takes an overridable `copy` prop. Each exports a *Copy type whose dynamic lines are functions (values still interpolate) and static lines are strings — reword or localize without forking. Here: Norwegian."
      >
        <Demo
          name="WelcomeEmail — Norwegian"
          code={`<WelcomeEmail
  name="Mathias" productName="Graphify" ctaUrl={url} ctaLabel="Åpne dashbordet"
  header={{ productName: 'Graphify' }}
  copy={{
    heading: (n) => \`Velkommen\${n ? ', ' + n : ''}.\`,
    body: (p) => \`Din \${p}-konto er klar. Ta en titt rundt.\`,
    help: 'Trenger du hjelp? Bare svar på denne e-posten.',
  }}
  footer={{ labels: { tollerudProject: 'Et Tollerud-prosjekt', allRightsReserved: 'Alle rettigheter forbeholdt.' } }}
/>`}
        >
          <EmailPreview src="/email/welcome-nb.html" title="Welcome email in Norwegian" />
        </Demo>
      </Section>

      <Section title="Verify email" desc="Email-address confirmation, with a link fallback and optional expiry note.">
        <Demo
          name="VerifyEmail"
          code={`<VerifyEmail
  name="Mathias" productName="Graphify"
  verifyUrl={verifyUrl} expiresIn="24 hours"
  header={{ productName: 'Graphify' }}
/>`}
        >
          <EmailPreview src="/email/verify.html" title="Verify email" />
        </Demo>
      </Section>

      <Section title="Password reset" desc="Reset request with expiry + an ignore-if-you-didn't-ask note.">
        <Demo
          name="PasswordResetEmail"
          code={`<PasswordResetEmail
  name="Mathias" productName="Graphify"
  resetUrl={resetUrl} expiresIn="1 hour"
  header={{ productName: 'Graphify' }}
/>`}
        >
          <EmailPreview src="/email/password-reset.html" title="Password reset email" />
        </Demo>
      </Section>

      <Section title="Receipt" desc="Purchase receipt with a line-item table and an accent total. Amounts are pre-formatted by the caller.">
        <Demo
          name="ReceiptEmail"
          code={`<ReceiptEmail
  name="Mathias" productName="Graphify"
  orderId="INV-1042" date="2026-07-12"
  items={[
    { description: 'Pro plan — monthly', amount: '$49.00' },
    { description: 'Extra seats × 2', amount: '$18.00' },
  ]}
  total="$67.00"
  header={{ productName: 'Graphify' }}
/>`}
        >
          <EmailPreview src="/email/receipt.html" title="Receipt email" height={620} />
        </Demo>
      </Section>

      <Section
        title="Configuration"
        desc="Content and branding are fully prop-driven; copy is overridable for i18n; every primitive takes a `style` escape hatch (merged last, overrides the token default) for one-off tweaks. Visual design otherwise stays token-locked to the brand."
      >
        <div className="ds-col" style={{ gap: 12 }}>
          <CodeSnippet
            name="style escape hatch"
            code={`// One-off overrides via \`style\` — merged after the token defaults
<EmailButton href={url} style={{ borderRadius: '999px' }}>Pill</EmailButton>
<EmailText style={{ textAlign: 'center' }}>Centered</EmailText>`}
          />
          <Card>
            <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>Monogram in email</div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              The monogram is inline SVG by default (renders in Apple Mail / iOS Mail). Where Outlook desktop and Gmail strip SVG, pass <code className="ds-mono">logoSrc</code> a hosted PNG/GIF; the large project name always renders regardless.
            </p>
          </Card>
          <Button asChild variant="secondary" size="sm">
            <a href="https://github.com/Tollerud/ui/blob/main/packages/email/README.md" target="_blank" rel="noreferrer">
              Full API — @tollerud/email README
              <Icons.arrowRight size={14} />
            </a>
          </Button>
        </div>
      </Section>
    </div>
  )
}

export default PageEmail
export { PageEmail }
