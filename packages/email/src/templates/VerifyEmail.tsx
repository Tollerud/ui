import * as React from 'react'
import { EmailLayout } from '../primitives/EmailLayout'
import { EmailHeader, type EmailHeaderProps } from '../primitives/EmailHeader'
import { EmailHeading } from '../primitives/EmailHeading'
import { EmailText } from '../primitives/EmailText'
import { EmailButton } from '../primitives/EmailButton'
import { EmailFooter, type EmailFooterProps } from '../primitives/EmailFooter'

/** Overridable copy — pass any subset to reword or localize. */
export interface VerifyEmailCopy {
  preview: (productName: string) => string
  heading: string
  body: (name: string | undefined, productName: string) => string
  buttonLabel: string
  linkHelp: string
  expiresNote: (expiresIn: string) => string
}

const defaultCopy: VerifyEmailCopy = {
  preview: (p) => `Confirm your email for ${p}`,
  heading: 'Confirm your email',
  body: (name, p) =>
    `${name ? `Hi ${name}, one` : 'One'} last step — confirm this is your email address to finish setting up your ${p} account.`,
  buttonLabel: 'Confirm email address',
  linkHelp: "If the button doesn't work, copy and paste this link into your browser:",
  expiresNote: (e) => `This link expires in ${e}.`,
}

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
  /** Override any of the template's copy (for rewording or i18n). */
  copy?: Partial<VerifyEmailCopy>
}

/** Email-address verification / confirm-your-email template. */
export function VerifyEmail({
  name,
  productName = 'Tollerud',
  verifyUrl,
  expiresIn,
  header,
  footer,
  copy,
}: VerifyEmailProps) {
  const c = { ...defaultCopy, ...copy }
  return (
    <EmailLayout preview={c.preview(productName)}>
      {header ? <EmailHeader {...header} /> : null}
      <EmailHeading>{c.heading}</EmailHeading>
      <EmailText>{c.body(name, productName)}</EmailText>
      <EmailButton href={verifyUrl}>{c.buttonLabel}</EmailButton>
      <EmailText tone="fine">
        {c.linkHelp}
        <br />
        {verifyUrl}
      </EmailText>
      {expiresIn ? <EmailText tone="fine">{c.expiresNote(expiresIn)}</EmailText> : null}
      <EmailFooter {...footer} />
    </EmailLayout>
  )
}
