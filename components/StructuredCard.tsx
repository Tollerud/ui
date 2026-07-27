import { type ReactNode, forwardRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'

export interface StructuredCardProps {
  title: ReactNode
  /** Trailing header content — change chip, buttons, badge, etc. */
  actions?: ReactNode
  contentClassName?: string
  children: ReactNode
}

/**
 * `Card` + `CardHeader` + `CardTitle` + `CardContent` composed together, with
 * `structured` set explicitly rather than relying on `Card`'s auto-detection —
 * safe to render from a Server Component and pass across a Client boundary.
 */
const StructuredCard = forwardRef<HTMLDivElement, StructuredCardProps>(
  ({ title, actions, contentClassName, children }, ref) => {
    return (
      <Card ref={ref} structured>
        <CardHeader actions={actions}>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className={contentClassName}>{children}</CardContent>
      </Card>
    )
  }
)
StructuredCard.displayName = 'StructuredCard'

export { StructuredCard }
