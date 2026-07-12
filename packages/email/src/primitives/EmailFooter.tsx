import * as React from 'react'
import { Column, Link, Row, Section, Text } from '@react-email/components'
import { BrandMark, type BrandMarkColor } from './BrandMark'
import { emailTheme as t } from '../theme'

export interface EmailFooterLink {
  label: string
  href: string
}

export interface EmailFooterLabels {
  /** Text for the tollerud.no link. Default "A Tollerud Project". */
  tollerudProject: string
  /** Optional middle segment after the link (e.g. "for Advania Norge AS."). */
  attribution?: string
  /** Default "All rights reserved." */
  allRightsReserved: string
}

const defaultLabels: EmailFooterLabels = {
  tollerudProject: 'A Tollerud Project',
  allRightsReserved: 'All rights reserved.',
}

export interface EmailFooterProps {
  /** Wordmark labels — mirrors the web Footer's FooterLabels. */
  labels?: Partial<EmailFooterLabels>
  /** Show the Tollerud monogram. Default true. */
  monogram?: boolean
  /** Hosted image URL for the monogram (recommended — see BrandMark). */
  logoSrc?: string
  /** Monogram color. Default yellow. */
  color?: BrandMarkColor
  /** Optional physical address line (CAN-SPAM). */
  address?: string
  /** Optional unsubscribe URL — rendered as a link when provided (CAN-SPAM). */
  unsubscribeUrl?: string
  /** Optional secondary links (e.g. Privacy, Terms). */
  links?: EmailFooterLink[]
  /** Escape hatch: inline styles merged onto the footer section, overriding defaults. */
  style?: React.CSSProperties
}

/**
 * The Tollerud email footer — monogram + the "A Tollerud Project" wordmark
 * linking to tollerud.no, mirroring the web Footer. Table-based (Row/Column)
 * so it aligns in Outlook. Pass `address` + `unsubscribeUrl` for bulk mail to
 * stay CAN-SPAM compliant.
 */
export function EmailFooter({
  labels,
  monogram = true,
  logoSrc,
  color = 'yellow',
  address,
  unsubscribeUrl,
  links = [],
  style,
}: EmailFooterProps) {
  const l = { ...defaultLabels, ...labels }
  const attribution = l.attribution?.trim()
  const year = new Date().getFullYear()

  const wordmark = {
    margin: 0,
    color: t.color.textSecondary,
    fontFamily: t.font.sans,
    fontSize: t.size.sm,
    lineHeight: 1.6,
  } as const
  const fine = {
    margin: 0,
    color: t.color.textMuted,
    fontFamily: t.font.sans,
    fontSize: t.size.xs,
    lineHeight: 1.6,
  } as const

  return (
    <Section
      style={{
        marginTop: t.space[8],
        paddingTop: t.space[6],
        borderTop: `1px solid ${t.color.border}`,
        ...style,
      }}
    >
      <Row>
        {monogram ? (
          <Column style={{ width: '1%', paddingRight: t.space[3], verticalAlign: 'middle' }}>
            <BrandMark color={color} height={20} src={logoSrc} />
          </Column>
        ) : null}
        <Column style={{ verticalAlign: 'middle' }}>
          <Text style={wordmark}>
            <Link
              href="https://tollerud.no"
              style={{
                color: t.color.textSecondary,
                textDecoration: 'underline',
                textDecorationColor: t.color.accent,
                textUnderlineOffset: '4px',
              }}
            >
              {l.tollerudProject}
            </Link>
            {attribution ? ` ${attribution}` : ''} {l.allRightsReserved}
          </Text>
        </Column>
      </Row>

      {(address || links.length > 0 || unsubscribeUrl) && (
        <Row>
          <Column>
            <Text style={{ ...fine, marginTop: t.space[3] }}>
              {`© ${year}`}
              {address ? ` · ${address}` : ''}
              {links.map((link) => (
                <React.Fragment key={link.href}>
                  {' · '}
                  <Link href={link.href} style={{ color: t.color.textSecondary }}>
                    {link.label}
                  </Link>
                </React.Fragment>
              ))}
              {unsubscribeUrl ? (
                <>
                  {' · '}
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
