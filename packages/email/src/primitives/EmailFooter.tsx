import * as React from 'react'
import { Column, Link, Row, Section, Text } from '@react-email/components'
import { emailTheme as t } from '../theme'

export interface EmailFooterLink {
  label: string
  href: string
}

export interface EmailFooterProps {
  /** Company / sender name shown in the copyright line. */
  brandName?: string
  /** Optional physical address line (CAN-SPAM compliance). */
  address?: string
  /** Optional unsubscribe URL — rendered as a link when provided. */
  unsubscribeUrl?: string
  /** Optional secondary links (e.g. Privacy, Terms). */
  links?: EmailFooterLink[]
}

/**
 * Email footer echoing the web Footer's restrained, monochrome tone. Kept
 * table-based (Row/Column) so it aligns in Outlook. Include an address and
 * unsubscribe link for bulk mail to stay CAN-SPAM compliant.
 */
export function EmailFooter({
  brandName = 'Tollerud',
  address,
  unsubscribeUrl,
  links = [],
}: EmailFooterProps) {
  const year = new Date().getFullYear()
  const fine = {
    margin: 0,
    color: t.color.textMuted,
    fontFamily: t.font.sans,
    fontSize: t.size.xs,
    lineHeight: 1.6,
  } as const
  return (
    <Section style={{ padding: `${t.space[6]} ${t.space[4]} 0` }}>
      <Row>
        <Column>
          <Text style={fine}>
            © {year} {brandName}
            {address ? ` · ${address}` : ''}
          </Text>
        </Column>
      </Row>
      {(links.length > 0 || unsubscribeUrl) && (
        <Row>
          <Column>
            <Text style={{ ...fine, marginTop: t.space[2] }}>
              {links.map((l, i) => (
                <React.Fragment key={l.href}>
                  {i > 0 ? ' · ' : ''}
                  <Link href={l.href} style={{ color: t.color.textSecondary }}>
                    {l.label}
                  </Link>
                </React.Fragment>
              ))}
              {unsubscribeUrl ? (
                <>
                  {links.length > 0 ? ' · ' : ''}
                  <Link href={unsubscribeUrl} style={{ color: t.color.textSecondary }}>
                    Unsubscribe
                  </Link>
                </>
              ) : null}
            </Text>
          </Column>
        </Row>
      )}
    </Section>
  )
}
