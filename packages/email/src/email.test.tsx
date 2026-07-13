import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@react-email/render'
import { EmailLayout } from './primitives/EmailLayout'
import { EmailHeader } from './primitives/EmailHeader'
import { BrandMark } from './primitives/BrandMark'
import { EmailButton } from './primitives/EmailButton'
import { EmailHeading } from './primitives/EmailHeading'
import { EmailText } from './primitives/EmailText'
import { EmailDivider } from './primitives/EmailDivider'
import { EmailFooter } from './primitives/EmailFooter'
import { WelcomeEmail } from './templates/WelcomeEmail'
import { VerifyEmail } from './templates/VerifyEmail'
import { PasswordResetEmail } from './templates/PasswordResetEmail'
import { ReceiptEmail } from './templates/ReceiptEmail'
import { emailTheme as t, emailClass, darkModeCss } from './theme'

/**
 * Guards the light-first dark-mode contract: email is light by default with a
 * `@media (prefers-color-scheme: dark)` block that recolors via `t-*` classes.
 * Any element given a light-mode text color MUST also carry a class so the
 * dark-mode override can reach it — otherwise it renders dark-on-dark in Apple
 * Mail / iOS. Regression guard for the 4.13.x footer + receipt fixes.
 */
function assertDarkModeReachable(html: string) {
  const darkInk = [t.color.textPrimary, t.color.textSecondary, t.color.textMuted]
  for (const tag of html.match(/<(?:p|a|span)\b[^>]*>/g) ?? []) {
    const colored = darkInk.some((c) => tag.includes(`color:${c}`))
    if (colored) expect(tag, `text-colored tag lacks a t-* class: ${tag}`).toMatch(/class="[^"]*\bt-/)
  }
}

const TEMPLATES = {
  Welcome: <WelcomeEmail name="Mathias" ctaUrl="https://x.test/app" />,
  Verify: <VerifyEmail verifyUrl="https://x.test/verify?token=abc" expiresIn="24 hours" />,
  PasswordReset: <PasswordResetEmail resetUrl="https://x.test/reset" />,
  Receipt: (
    <ReceiptEmail
      orderId="INV-1"
      date="2026-07-13"
      items={[{ description: 'Pro plan', amount: '$120.00' }]}
      total="$120.00"
    />
  ),
} as const

describe('templates', () => {
  it.each(Object.entries(TEMPLATES))('%s renders, keeps the footer, and is dark-mode reachable', async (_, el) => {
    const html = await render(el)
    expect(html).toContain('A Tollerud Project')
    expect(html).toContain('@media (prefers-color-scheme: dark)')
    assertDarkModeReachable(html)
  })

  it('copy is overridable (i18n / rewording)', async () => {
    const html = await render(
      <WelcomeEmail ctaUrl="https://x.test/app" copy={{ heading: () => 'Velkommen.' }} />,
    )
    expect(html).toContain('Velkommen.')
    expect(html).not.toContain('Welcome,')
  })

  it('an optional header renders the product name when passed', async () => {
    const html = await render(<WelcomeEmail ctaUrl="https://x.test/app" header={{ productName: 'Acme' }} />)
    expect(html).toContain('Acme')
  })
})

describe('EmailLayout', () => {
  it('injects the dark-mode style block and preheader', async () => {
    const html = await render(
      <EmailLayout preview="Hello preview" lang="nb">
        <EmailText>Body</EmailText>
      </EmailLayout>,
    )
    expect(html).toContain(darkModeCss)
    expect(html).toContain('Hello preview')
    expect(html).toContain('lang="nb"')
  })
})

describe('EmailButton', () => {
  it('primary is the yellow accent; secondary follows the card surface via classes', async () => {
    const primary = await render(<EmailButton href="https://x.test">Go</EmailButton>)
    expect(primary).toContain(t.color.accent) // yellow background
    expect(primary).not.toMatch(new RegExp(`class="[^"]*\\b${emailClass.card}`))

    const secondary = await render(
      <EmailButton href="https://x.test" variant="secondary">
        Go
      </EmailButton>,
    )
    expect(secondary).toContain(emailClass.card)
    expect(secondary).toContain(emailClass.border)
    expect(secondary).not.toContain(t.color.accent)
  })
})

describe('EmailText tones', () => {
  it.each([
    ['default', emailClass.text, t.color.textPrimary, t.size.base],
    ['muted', emailClass.muted, t.color.textSecondary, t.size.base],
    ['fine', emailClass.fine, t.color.textMuted, t.size.xs],
  ] as const)('%s → %s + color + size', async (tone, cls, color, size) => {
    const html = await render(<EmailText tone={tone}>x</EmailText>)
    const tag = html.match(/<p\b[^>]*>/)?.[0] ?? ''
    expect(tag).toContain(cls)
    expect(tag).toContain(`color:${color}`)
    expect(tag).toContain(`font-size:${size}`)
  })
})

describe('EmailHeading', () => {
  it.each([
    ['h1', t.size.h1],
    ['h2', t.size.h2],
    ['h3', t.size.lg],
  ] as const)('as=%s renders the right tag + size', async (as, size) => {
    const html = await render(<EmailHeading as={as}>Title</EmailHeading>)
    expect(html).toContain(`<${as}`)
    expect(html).toContain(`font-size:${size}`)
    expect(html).toContain(emailClass.heading)
  })
})

describe('EmailDivider', () => {
  it('accent is a short yellow rule; default is a full-width hairline', async () => {
    const accent = await render(<EmailDivider variant="accent" />)
    expect(accent).toContain(t.color.accentLine)
    expect(accent).toContain('width:48px')

    const def = await render(<EmailDivider />)
    expect(def).toContain(emailClass.border)
    expect(def).toContain('width:100%')
  })
})

describe('BrandMark', () => {
  it('default renders both monograms with swap classes', async () => {
    const html = await render(<BrandMark />)
    expect(html).toContain(t.monogram.dark)
    expect(html).toContain(t.monogram.yellow)
    expect(html).toContain(emailClass.monoLight)
    expect(html).toContain(emailClass.monoDark)
  })

  it('a custom src renders a single image with no dark-mode swap', async () => {
    const html = await render(<BrandMark src="https://x.test/logo.png" />)
    expect(html).toContain('https://x.test/logo.png')
    expect(html).not.toContain(t.monogram.dark)
    expect(html).not.toContain(emailClass.monoDark)
  })
})

describe('EmailHeader', () => {
  it('shows the product name; monogram can be toggled off', async () => {
    const withMark = await render(<EmailHeader productName="Acme" />)
    expect(withMark).toContain('Acme')
    expect(withMark).toContain(t.monogram.dark)

    const noMark = await render(<EmailHeader productName="Acme" monogram={false} />)
    expect(noMark).toContain('Acme')
    expect(noMark).not.toContain(t.monogram.dark)
  })
})

describe('EmailFooter', () => {
  it('the wordmark link carries the muted class so it recolors in dark mode', async () => {
    const html = await render(<EmailFooter unsubscribeUrl="https://x.test/unsub" />)
    const link = html.match(/<a\b[^>]*href="https:\/\/tollerud\.no"[^>]*>/)?.[0] ?? ''
    expect(link).toMatch(new RegExp(`class="[^"]*\\b${emailClass.muted}`))
  })

  it('centers the fine-print line and renders address + unsubscribe', async () => {
    const html = await render(<EmailFooter address="Oslo, Norway" unsubscribeUrl="https://x.test/unsub" />)
    expect(html).toContain('text-align:center')
    expect(html).toContain('Oslo, Norway')
    expect(html).toContain('Unsubscribe')
  })
})

describe('ReceiptEmail', () => {
  it('does not paint text with the yellow accent (unreadable on the white card)', async () => {
    const html = await render(TEMPLATES.Receipt)
    // ReceiptEmail has no button, so the yellow accent must not appear at all.
    expect(html).not.toContain(t.color.accent)
  })
})

describe('dark-mode contract', () => {
  it('every class a primitive applies has a matching dark-mode rule (or is a display swap)', () => {
    // Classes whose only job is the monogram show/hide swap — no color rule needed.
    const swapOnly = new Set([emailClass.monoLight, emailClass.monoDark])
    for (const cls of Object.values(emailClass)) {
      if (swapOnly.has(cls)) continue
      expect(darkModeCss, `darkModeCss is missing a rule for .${cls}`).toContain(`.${cls}`)
    }
    // And the swap classes must still be toggled.
    expect(darkModeCss).toContain(`.${emailClass.monoLight}`)
    expect(darkModeCss).toContain(`.${emailClass.monoDark}`)
  })
})
