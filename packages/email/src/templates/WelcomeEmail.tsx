import * as React from 'react'
import { EmailLayout } from '../primitives/EmailLayout'
import { EmailHeading } from '../primitives/EmailHeading'
import { EmailText } from '../primitives/EmailText'
import { EmailButton } from '../primitives/EmailButton'
import { EmailDivider } from '../primitives/EmailDivider'
import { EmailFooter, type EmailFooterProps } from '../primitives/EmailFooter'

export interface WelcomeEmailProps {
  /** Recipient's first name or handle. */
  name?: string
  /** Product / app name. */
  productName?: string
  /** Primary CTA destination (e.g. dashboard). */
  ctaUrl: string
  ctaLabel?: string
  footer?: EmailFooterProps
}

/** Onboarding welcome email. */
export function WelcomeEmail({
  name,
  productName = 'Tollerud',
  ctaUrl,
  ctaLabel = 'Open your dashboard',
  footer,
}: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Welcome to ${productName}`}>
      <EmailHeading>Welcome{name ? `, ${name}` : ''}.</EmailHeading>
      <EmailText>
        Your {productName} account is ready. Jump in and take a look around —
        everything's set up and waiting for you.
      </EmailText>
      <EmailButton href={ctaUrl}>{ctaLabel}</EmailButton>
      <EmailDivider variant="accent" />
      <EmailText tone="muted">
        Need a hand getting started? Just reply to this email and we'll help you
        out.
      </EmailText>
      <EmailFooter {...footer} />
    </EmailLayout>
  )
}
