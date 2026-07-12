import * as React from 'react'
import { EmailLayout } from '../primitives/EmailLayout'
import { EmailHeader, type EmailHeaderProps } from '../primitives/EmailHeader'
import { EmailHeading } from '../primitives/EmailHeading'
import { EmailText } from '../primitives/EmailText'
import { EmailButton } from '../primitives/EmailButton'
import { EmailDivider } from '../primitives/EmailDivider'
import { EmailFooter, type EmailFooterProps } from '../primitives/EmailFooter'

/**
 * Overridable copy. Dynamic lines are functions so interpolated values still
 * flow through; pass any subset to localize or reword (e.g. Norwegian).
 */
export interface WelcomeEmailCopy {
  preview: (productName: string) => string
  heading: (name?: string) => string
  body: (productName: string) => string
  help: string
}

const defaultCopy: WelcomeEmailCopy = {
  preview: (p) => `Welcome to ${p}`,
  heading: (name) => `Welcome${name ? `, ${name}` : ''}.`,
  body: (p) =>
    `Your ${p} account is ready. Jump in and take a look around — everything's set up and waiting for you.`,
  help: "Need a hand getting started? Just reply to this email and we'll help you out.",
}

export interface WelcomeEmailProps {
  /** Recipient's first name or handle. */
  name?: string
  /** Product / app name. */
  productName?: string
  /** Primary CTA destination (e.g. dashboard). */
  ctaUrl: string
  ctaLabel?: string
  /** Optional branded header (monogram + project name) at the top. */
  header?: EmailHeaderProps
  footer?: EmailFooterProps
  /** Override any of the template's copy (for rewording or i18n). */
  copy?: Partial<WelcomeEmailCopy>
}

/** Onboarding welcome email. */
export function WelcomeEmail({
  name,
  productName = 'Tollerud',
  ctaUrl,
  ctaLabel = 'Open your dashboard',
  header,
  footer,
  copy,
}: WelcomeEmailProps) {
  const c = { ...defaultCopy, ...copy }
  return (
    <EmailLayout preview={c.preview(productName)}>
      {header ? <EmailHeader {...header} /> : null}
      <EmailHeading>{c.heading(name)}</EmailHeading>
      <EmailText>{c.body(productName)}</EmailText>
      <EmailButton href={ctaUrl}>{ctaLabel}</EmailButton>
      <EmailDivider variant="accent" />
      <EmailText tone="muted">{c.help}</EmailText>
      <EmailFooter {...footer} />
    </EmailLayout>
  )
}
