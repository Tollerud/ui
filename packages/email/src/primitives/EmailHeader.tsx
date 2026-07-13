import * as React from 'react'
import { Column, Row, Section } from '@react-email/components'
import { BrandMark } from './BrandMark'
import { emailTheme as t, emailClass } from '../theme'

export interface EmailHeaderProps {
  /** Project / product name, shown large as the brand wordmark. */
  productName: string
  /** Show the Tollerud monogram beside the name. Default true. */
  monogram?: boolean
  /**
   * Custom logo image URL. When omitted, the hosted Tollerud monogram is used
   * (dark on light backgrounds, yellow in dark mode). See BrandMark.
   */
  logoSrc?: string
  logoAlt?: string
  /** Alignment of the lockup. Default left. */
  align?: 'left' | 'center'
  /** Hairline divider beneath the header. Default true. */
  divider?: boolean
  /** Escape hatch: inline styles merged onto the header section, overriding defaults. */
  style?: React.CSSProperties
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
  align = 'left',
  divider = true,
  style,
}: EmailHeaderProps) {
  const markHeight = 30
  const name = (
    <span
      className={emailClass.heading}
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
      className={divider ? emailClass.border : undefined}
      style={{
        paddingBottom: t.space[6],
        marginBottom: t.space[6],
        borderBottom: divider ? `1px solid ${t.color.border}` : undefined,
        ...style,
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
                      <BrandMark height={markHeight} src={logoSrc} alt={logoAlt} />
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
              <BrandMark height={markHeight} src={logoSrc} alt={logoAlt} />
            </Column>
          ) : null}
          <Column style={{ verticalAlign: 'middle' }}>{name}</Column>
        </Row>
      )}
    </Section>
  )
}
