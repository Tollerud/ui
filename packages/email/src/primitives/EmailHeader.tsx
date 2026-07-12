import * as React from 'react'
import { Column, Row, Section } from '@react-email/components'
import { BrandMark, type BrandMarkColor } from './BrandMark'
import { emailTheme as t } from '../theme'

export interface EmailHeaderProps {
  /** Project / product name, shown large as the brand wordmark. */
  productName: string
  /** Show the Tollerud monogram beside the name. Default true. */
  monogram?: boolean
  /**
   * Hosted image URL for the monogram (recommended for full client coverage —
   * see BrandMark). When omitted, an inline-SVG monogram is used.
   */
  logoSrc?: string
  logoAlt?: string
  /** Monogram color. Default yellow. */
  color?: BrandMarkColor
  /** Alignment of the lockup. Default left. */
  align?: 'left' | 'center'
  /** Hairline divider beneath the header. Default true. */
  divider?: boolean
}

/**
 * Optional branded header ("logo lockup") — the Tollerud monogram next to the
 * project name in large display type. Table-based so it aligns in Outlook; the
 * large name always renders even where the SVG monogram doesn't.
 */
export function EmailHeader({
  productName,
  monogram = true,
  logoSrc,
  logoAlt,
  color = 'yellow',
  align = 'left',
  divider = true,
}: EmailHeaderProps) {
  const markHeight = 30
  const name = (
    <span
      style={{
        color: t.color.textPrimary,
        fontFamily: t.font.sans,
        fontSize: t.size.h1,
        fontWeight: 700,
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
        verticalAlign: 'middle',
      }}
    >
      {productName}
    </span>
  )

  return (
    <Section
      style={{
        paddingBottom: t.space[6],
        marginBottom: t.space[6],
        borderBottom: divider ? `1px solid ${t.color.border}` : undefined,
      }}
    >
      {align === 'center' ? (
        <Section style={{ textAlign: 'center' }}>
          {monogram ? (
            <Section style={{ marginBottom: t.space[3] }}>
              <table role="presentation" cellPadding={0} cellSpacing={0} style={{ margin: '0 auto' }}>
                <tbody>
                  <tr>
                    <td>
                      <BrandMark color={color} height={markHeight} src={logoSrc} alt={logoAlt} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
          ) : null}
          {name}
        </Section>
      ) : (
        <Row>
          {monogram ? (
            <Column style={{ width: '1%', paddingRight: t.space[3], verticalAlign: 'middle' }}>
              <BrandMark color={color} height={markHeight} src={logoSrc} alt={logoAlt} />
            </Column>
          ) : null}
          <Column style={{ verticalAlign: 'middle' }}>{name}</Column>
        </Row>
      )}
    </Section>
  )
}
