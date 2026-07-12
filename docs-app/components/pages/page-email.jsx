'use client'
import React from 'react'
import * as __p from '@/lib/provide-pages'
import { EmailConfigurator } from '@/components/email-configurator'
const { Button, Card, CodeSnippet, PageHeader, Section, Icons } = __p

/* @tollerud/email docs — interactive configurator + configuration */

function PageEmail() {
  return (
    <div>
      <PageHeader
        icon="mail"
        eyebrow="Resources"
        title="Email"
        lede="On-brand HTML email with @tollerud/email — a separate render target from the web components, built on React Email. Configure a template below and watch it render live."
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
        title="Configurator"
        desc="Pick a template and toggle its options — the preview renders live in an isolated iframe with the real @tollerud/email output, and the code updates to match. Product name and recipient are free-text; Language swaps in the copy override (Norwegian); the header and footer options map to the header / footer props."
      >
        <EmailConfigurator />
      </Section>

      <Section
        title="Configuration reference"
        desc="Content and branding are fully prop-driven; copy is overridable for i18n (each template exports a *Copy type; dynamic lines are functions); every primitive takes a `style` escape hatch (merged last, overrides the token default). Visual design otherwise stays token-locked to the brand."
      >
        <div className="ds-col" style={{ gap: 12 }}>
          <CodeSnippet
            name="copy override + style hatch"
            code={`// Localize (or reword) via \`copy\`
<WelcomeEmail
  copy={{
    heading: (n) => \`Velkommen\${n ? ', ' + n : ''}.\`,
    body: (p) => \`Din \${p}-konto er klar. Ta en titt rundt.\`,
  }}
/>

// One-off visual tweaks via \`style\` (merged after the token defaults)
<EmailButton href={url} style={{ borderRadius: '999px' }}>Pill</EmailButton>`}
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
