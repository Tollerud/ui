#!/usr/bin/env node
/**
 * Renders the email templates to static HTML previews for the docs site.
 * Output → docs-app/public/email/*.html, embedded in iframes on the Email page.
 *
 * Runs from the email package so react + @react-email/render resolve locally.
 * Regenerate after changing templates: `npm run gen:email-previews` (repo root).
 */
import React from 'react'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  render,
  WelcomeEmail,
  VerifyEmail,
  PasswordResetEmail,
  ReceiptEmail,
} from '../dist/index.js'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '../../../docs-app/public/email')
mkdirSync(outDir, { recursive: true })

const h = React.createElement

const footer = {
  labels: { tollerudProject: 'A Tollerud Project' },
  address: 'Oslo, Norway',
  unsubscribeUrl: 'https://design.tollerud.dev/unsubscribe',
  links: [{ label: 'Privacy', href: 'https://design.tollerud.dev/privacy' }],
}

const variants = {
  // Default welcome with the branded header.
  welcome: h(WelcomeEmail, {
    name: 'Mathias',
    productName: 'Graphify',
    ctaUrl: 'https://design.tollerud.dev/',
    header: { productName: 'Graphify' },
    footer,
  }),
  // Same, without the header — shows the header is optional.
  'welcome-plain': h(WelcomeEmail, {
    name: 'Mathias',
    productName: 'Graphify',
    ctaUrl: 'https://design.tollerud.dev/',
    footer,
  }),
  // Localized via the `copy` override (Norwegian).
  'welcome-nb': h(WelcomeEmail, {
    name: 'Mathias',
    productName: 'Graphify',
    ctaUrl: 'https://design.tollerud.dev/',
    ctaLabel: 'Åpne dashbordet',
    header: { productName: 'Graphify' },
    copy: {
      preview: (p) => `Velkommen til ${p}`,
      heading: (n) => `Velkommen${n ? `, ${n}` : ''}.`,
      body: (p) => `Din ${p}-konto er klar. Ta en titt rundt — alt er satt opp og venter på deg.`,
      help: 'Trenger du hjelp? Bare svar på denne e-posten.',
    },
    footer: {
      labels: { tollerudProject: 'Et Tollerud-prosjekt', allRightsReserved: 'Alle rettigheter forbeholdt.' },
      address: 'Oslo, Norge',
      unsubscribeUrl: 'https://design.tollerud.dev/avmeld',
    },
  }),
  verify: h(VerifyEmail, {
    name: 'Mathias',
    productName: 'Graphify',
    verifyUrl: 'https://design.tollerud.dev/verify?token=…',
    expiresIn: '24 hours',
    header: { productName: 'Graphify' },
    footer,
  }),
  'password-reset': h(PasswordResetEmail, {
    name: 'Mathias',
    productName: 'Graphify',
    resetUrl: 'https://design.tollerud.dev/reset?token=…',
    header: { productName: 'Graphify' },
    footer,
  }),
  receipt: h(ReceiptEmail, {
    name: 'Mathias',
    productName: 'Graphify',
    orderId: 'INV-1042',
    date: '2026-07-12',
    items: [
      { description: 'Pro plan — monthly', amount: '$49.00' },
      { description: 'Extra seats × 2', amount: '$18.00' },
    ],
    total: '$67.00',
    header: { productName: 'Graphify' },
    footer,
  }),
}

let count = 0
for (const [name, element] of Object.entries(variants)) {
  const html = await render(element)
  writeFileSync(join(outDir, `${name}.html`), html)
  count++
}
console.log(`build-previews: wrote ${count} email previews → docs-app/public/email/`)
