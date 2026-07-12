import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from '@react-email/components'
import { emailTheme as t } from '../theme'

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
 * Root shell for a Tollerud email: <Html>/<Head>/<Body> with the noir palette
 * applied via explicit bgcolor + inline styles so it survives clients that
 * strip <style> blocks or force color inversion.
 *
 * Dark-mode note: `color-scheme`/`supported-color-schemes` meta tags tell
 * Apple Mail and iOS Mail to respect our dark palette instead of re-inverting.
 * Outlook.com and Gmail still may nudge colors; that's why every surface also
 * carries an explicit bgcolor.
 */
export function EmailLayout({ preview, lang = 'en', style, children }: EmailLayoutProps) {
  return (
    <Html lang={lang}>
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      {preview ? <Preview>{preview}</Preview> : null}
      <Body
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
