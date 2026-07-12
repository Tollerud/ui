import * as React from 'react'
import { Column, Row, Section, Text } from '@react-email/components'
import { EmailLayout } from '../primitives/EmailLayout'
import { EmailHeader, type EmailHeaderProps } from '../primitives/EmailHeader'
import { EmailHeading } from '../primitives/EmailHeading'
import { EmailText } from '../primitives/EmailText'
import { EmailDivider } from '../primitives/EmailDivider'
import { EmailFooter, type EmailFooterProps } from '../primitives/EmailFooter'
import { emailTheme as t } from '../theme'

export interface ReceiptLineItem {
  description: string
  /** Pre-formatted amount, e.g. "$49.00". Formatting is the caller's job. */
  amount: string
}

export interface ReceiptEmailProps {
  name?: string
  productName?: string
  /** Human-readable order / invoice reference. */
  orderId: string
  /** ISO date string or pre-formatted date. */
  date: string
  items: ReceiptLineItem[]
  /** Pre-formatted total, e.g. "$49.00". */
  total: string
  /** Optional branded header (monogram + project name) at the top. */
  header?: EmailHeaderProps
  footer?: EmailFooterProps
}

const cell = {
  margin: 0,
  fontFamily: t.font.sans,
  fontSize: t.size.sm,
  lineHeight: 1.6,
  color: t.color.textSecondary,
} as const

/** Purchase / payment receipt template with a line-item table. */
export function ReceiptEmail({
  name,
  productName = 'Tollerud',
  orderId,
  date,
  items,
  total,
  header,
  footer,
}: ReceiptEmailProps) {
  return (
    <EmailLayout preview={`Your ${productName} receipt · ${orderId}`}>
      {header ? <EmailHeader {...header} /> : null}
      <EmailHeading>Receipt</EmailHeading>
      <EmailText tone="muted">
        {name ? `Thanks, ${name}. ` : 'Thanks. '}Here's your receipt for order{' '}
        {orderId} on {date}.
      </EmailText>
      <EmailDivider />
      <Section>
        {items.map((item, i) => (
          <Row key={i} style={{ marginBottom: t.space[2] }}>
            <Column style={{ verticalAlign: 'top' }}>
              <Text style={{ ...cell, color: t.color.textPrimary }}>
                {item.description}
              </Text>
            </Column>
            <Column style={{ verticalAlign: 'top', textAlign: 'right' }}>
              <Text style={{ ...cell, color: t.color.textPrimary }}>
                {item.amount}
              </Text>
            </Column>
          </Row>
        ))}
      </Section>
      <EmailDivider />
      <Section>
        <Row>
          <Column>
            <Text style={{ ...cell, fontWeight: 600, color: t.color.textPrimary }}>
              Total
            </Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text
              style={{
                ...cell,
                fontWeight: 700,
                fontSize: t.size.lg,
                color: t.color.accent,
              }}
            >
              {total}
            </Text>
          </Column>
        </Row>
      </Section>
      <EmailFooter {...footer} />
    </EmailLayout>
  )
}
