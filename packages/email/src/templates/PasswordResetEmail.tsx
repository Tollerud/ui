import * as React from 'react'
import { EmailLayout } from '../primitives/EmailLayout'
import { EmailHeading } from '../primitives/EmailHeading'
import { EmailText } from '../primitives/EmailText'
import { EmailButton } from '../primitives/EmailButton'
import { EmailFooter, type EmailFooterProps } from '../primitives/EmailFooter'

export interface PasswordResetEmailProps {
  name?: string
  productName?: string
  /** Password-reset link. */
  resetUrl: string
  /** Optional expiry hint, e.g. "1 hour". */
  expiresIn?: string
  footer?: EmailFooterProps
}

/** Password-reset request template. */
export function PasswordResetEmail({
  name,
  productName = 'Tollerud',
  resetUrl,
  expiresIn = '1 hour',
  footer,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout preview={`Reset your ${productName} password`}>
      <EmailHeading>Reset your password</EmailHeading>
      <EmailText>
        {name ? `Hi ${name}, we` : 'We'} received a request to reset the password
        for your {productName} account. Click below to choose a new one.
      </EmailText>
      <EmailButton href={resetUrl}>Reset password</EmailButton>
      <EmailText tone="fine">
        This link expires in {expiresIn}. If you didn't request a reset, you can
        safely ignore this email — your password won't change.
      </EmailText>
      <EmailFooter {...footer} />
    </EmailLayout>
  )
}
