import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Card } from './Card'
import { Stack } from './Stack'
import { Cluster } from './Cluster'

export interface FormPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  footer?: ReactNode
}

const FormPanel = forwardRef<HTMLDivElement, FormPanelProps>(
  ({ className, title, description, actions, footer, children, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn('overflow-hidden p-0', className)} {...props}>
        <div className="flex flex-col gap-4 border-b border-tollerud-border px-5 py-4 md:flex-row md:items-start md:justify-between">
          <Stack gap="xs">
            <h2 className="text-base font-semibold text-tollerud-text-primary">{title}</h2>
            {description && (
              <p className="text-sm leading-relaxed text-tollerud-text-secondary">{description}</p>
            )}
          </Stack>
          {actions && <Cluster gap="sm">{actions}</Cluster>}
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && (
          <div className="border-t border-tollerud-border bg-tollerud-surface px-5 py-4">
            {footer}
          </div>
        )}
      </Card>
    )
  }
)
FormPanel.displayName = 'FormPanel'

export { FormPanel }
