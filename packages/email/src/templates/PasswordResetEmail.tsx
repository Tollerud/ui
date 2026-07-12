import * as React from 'react'
import { EmailLayout } from '../primitives/EmailLayout'
import { EmailHeader, type EmailHeaderProps } from '../primitives/EmailHeader'
import { EmailHeading } from '../primitives/EmailHeading'
import { EmailText } from '../primitives/EmailText'
import { EmailButton } from '../primitives/EmailButton'
import { EmailFooter, type EmailFooterProps } from '../primitives/EmailFooter'

/** Overridable copy — pass any subset to reword or localize. */
export interface PasswordResetEmailCopy {
  preview: (productName: string) => string
  heading: string
  body: (name: string | undefined, productName: string) => string
  buttonLabel: string
  note: (expiresIn: string) => string
}

const defaultCopy: PasswordResetEmailCopy = {
  preview: (p) => `Reset your ${p} password`,
  heading: 'Reset your password',
  body: (name, p) =>
    `${name ? `Hi ${name}, we` : 'We'} received a request to reset the password for your ${p} account. Click below to choose a new one.`,
  buttonLabel: 'Reset password',
  note: (e) =>
    `This link expires in ${e}. If you didn't request a reset, you can safely ignore this email — your password won't change.`,
}

export interface PasswordResetEmailProps {
  name?: string
  productName?: string
  /** Password-reset link. */
  resetUrl: string
  /** Optional expiry hint, e.g. "1 hour". */
  expiresIn?: string
  /** Optional branded header (monogram + project name) at the top. */
  header?: EmailHeaderProps
  footer?: EmailFooterProps
  /** Override any of the template's copy (for rewording or i18n). */
  copy?: Partial<PasswordResetEmailCopy>
}

/** Password-reset request template. */
export function PasswordResetEmail({
  name,
  productName = 'Tollerud',
  resetUrl,
  expiresIn = '1 hour',
  header,
  footer,
  copy,
}: PasswordResetEmailProps) {
  const c = { ...defaultCopy, ...copy }
  return (
    <EmailLayout preview={c.preview(productName)}>
      {header ? <EmailHeader {...header} /> : null}
      <EmailHeading>{c.heading}</EmailHeading>
      <EmailText>{c.body(name, productName)}</EmailText>
      <EmailButton href={resetUrl}>{c.buttonLabel}</EmailButton>
      <EmailText tone="fine">{c.note(expiresIn)}</EmailText>
      <EmailFooter {...footer} />
    </EmailLayout>
  )
}
