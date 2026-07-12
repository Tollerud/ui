// Rendering — turn a template element into HTML/plain-text for your mailer.
// `render` is async-capable in @react-email/render v2 (renderAsync was removed).
export { render, pretty, toPlainText } from '@react-email/render'

// Design tokens (synced from @tollerud/ui) + email semantic theme.
export { tokens, type TokenName } from './tokens'
export { emailTheme, type EmailTheme } from './theme'

// Primitives.
export { EmailLayout, type EmailLayoutProps } from './primitives/EmailLayout'
export { EmailButton, type EmailButtonProps } from './primitives/EmailButton'
export { EmailHeading, type EmailHeadingProps } from './primitives/EmailHeading'
export { EmailText, type EmailTextProps } from './primitives/EmailText'
export { EmailDivider, type EmailDividerProps } from './primitives/EmailDivider'
export {
  EmailFooter,
  type EmailFooterProps,
  type EmailFooterLink,
} from './primitives/EmailFooter'

// Ready-made templates.
export { WelcomeEmail, type WelcomeEmailProps } from './templates/WelcomeEmail'
export { VerifyEmail, type VerifyEmailProps } from './templates/VerifyEmail'
export {
  PasswordResetEmail,
  type PasswordResetEmailProps,
} from './templates/PasswordResetEmail'
export {
  ReceiptEmail,
  type ReceiptEmailProps,
  type ReceiptLineItem,
} from './templates/ReceiptEmail'
