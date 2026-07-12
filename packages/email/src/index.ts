// Rendering — turn a template element into HTML/plain-text for your mailer.
// `render` is async-capable in @react-email/render v2 (renderAsync was removed).
export { render, pretty, toPlainText } from '@react-email/render'

// Design tokens (synced from @tollerud/ui) + email semantic theme.
export { tokens, type TokenName } from './tokens'
export { emailTheme, type EmailTheme } from './theme'

// Primitives.
export { EmailLayout, type EmailLayoutProps } from './primitives/EmailLayout'
export { EmailHeader, type EmailHeaderProps } from './primitives/EmailHeader'
export { BrandMark, type BrandMarkProps, type BrandMarkColor } from './primitives/BrandMark'
export { EmailButton, type EmailButtonProps } from './primitives/EmailButton'
export { EmailHeading, type EmailHeadingProps } from './primitives/EmailHeading'
export { EmailText, type EmailTextProps } from './primitives/EmailText'
export { EmailDivider, type EmailDividerProps } from './primitives/EmailDivider'
export {
  EmailFooter,
  type EmailFooterProps,
  type EmailFooterLink,
  type EmailFooterLabels,
} from './primitives/EmailFooter'

// Ready-made templates. Each accepts `header`, `footer`, and an overridable
// `copy` (for rewording / i18n).
export {
  WelcomeEmail,
  type WelcomeEmailProps,
  type WelcomeEmailCopy,
} from './templates/WelcomeEmail'
export { VerifyEmail, type VerifyEmailProps, type VerifyEmailCopy } from './templates/VerifyEmail'
export {
  PasswordResetEmail,
  type PasswordResetEmailProps,
  type PasswordResetEmailCopy,
} from './templates/PasswordResetEmail'
export {
  ReceiptEmail,
  type ReceiptEmailProps,
  type ReceiptEmailCopy,
  type ReceiptLineItem,
} from './templates/ReceiptEmail'
