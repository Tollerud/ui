import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from '@react-email/components'
import { emailTheme as t, emailClass, darkModeCss } from '../theme'

export interface EmailLayoutProps {
  /** Inbox preview line (hidden preheader text). */
  preview?: string
  /** Optional lang attribute for the <html> element. Defaults to "en". */
  lang?: string
  /** Escape hatch: inline styles merged onto the content card, overriding defaults. */
  style?: React.CSSProperties
  children: React.ReactNode
}

/**
 * Root shell for a Tollerud email: <Html>/<Head>/<Body>, light by default so it
 * renders consistently everywhere (Gmail included). Clients that support
 * `prefers-color-scheme: dark` (Apple Mail, iOS Mail) get the noir palette via
 * the injected dark-mode <style>; every surface also carries a `bgcolor`
 * attribute for the clients that ignore CSS backgrounds.
 */
export function EmailLayout({ preview, lang = 'en', style, children }: EmailLayoutProps) {
  return (
    <Html lang={lang}>
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style dangerouslySetInnerHTML={{ __html: darkModeCss }} />
      </Head>
      {preview ? <Preview>{preview}</Preview> : null}
      <Body
        className={emailClass.body}
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: t.color.page,
          color: t.color.textPrimary,
          fontFamily: t.font.sans,
          WebkitTextSizeAdjust: '100%',
        }}
      >
        <Section
          className={emailClass.page}
          bgcolor={t.color.page}
          style={{ backgroundColor: t.color.page, padding: `${t.space[8]} 0` }}
        >
          <Container
            style={{
              width: '100%',
              maxWidth: t.containerWidth,
              margin: '0 auto',
              padding: `0 ${t.space[4]}`,
            }}
          >
            <Section
              className={emailClass.card}
              bgcolor={t.color.surface}
              style={{
                backgroundColor: t.color.surface,
                border: `1px solid ${t.color.border}`,
                borderRadius: t.radius.lg,
                padding: t.space[8],
                ...style,
              }}
            >
              {children}
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  )
}
