import * as React from 'react'
import { EmailLayout } from '../primitives/EmailLayout'
import { EmailHeader, type EmailHeaderProps } from '../primitives/EmailHeader'
import { EmailHeading } from '../primitives/EmailHeading'
import { EmailText } from '../primitives/EmailText'
import { EmailButton } from '../primitives/EmailButton'
import { EmailFooter, type EmailFooterProps } from '../primitives/EmailFooter'

export interface VerifyEmailProps {
  /** Recipient's first name or handle. */
  name?: string
  productName?: string
  /** Verification link. */
  verifyUrl: string
  /** Optional expiry hint shown as fine print, e.g. "24 hours". */
  expiresIn?: string
  /** Optional branded header (monogram + project name) at the top. */
  header?: EmailHeaderProps
  footer?: EmailFooterProps
}

/** Email-address verification / confirm-your-email template. */
export function VerifyEmail({
  name,
  productName = 'Tollerud',
  verifyUrl,
  expiresIn,
  header,
  footer,
}: VerifyEmailProps) {
  return (
    <EmailLayout preview={`Confirm your email for ${productName}`}>
      {header ? <EmailHeader {...header} /> : null}
      <EmailHeading>Confirm your email</EmailHeading>
      <EmailText>
        {name ? `Hi ${name}, one` : 'One'} last step — confirm this is your email
        address to finish setting up your {productName} account.
      </EmailText>
      <EmailButton href={verifyUrl}>Confirm email address</EmailButton>
      <EmailText tone="fine">
        If the button doesn't work, copy and paste this link into your browser:
        <br />
        {verifyUrl}
      </EmailText>
      {expiresIn ? (
        <EmailText tone="fine">This link expires in {expiresIn}.</EmailText>
      ) : null}
      <EmailFooter {...footer} />
    </EmailLayout>
  )
}
