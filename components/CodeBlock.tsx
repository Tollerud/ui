import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  /** Optional string content to render inside <code> tags */
  code?: string
  /** When true, prepends a prompt symbol ($) before text content */
  promptPrefix?: boolean
}

const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ className, children, code, promptPrefix, ...props }, ref) => {
    const content = code ? (
      <code className="text-tia-noir-200">{code}</code>
    ) : (
      children
    )
    return (
      <pre
        ref={ref}
        className={cn(
          'font-mono text-sm leading-relaxed overflow-x-auto rounded border p-4',
          'bg-tia-noir-900 border-tia-border text-tia-noir-200',
          className
        )}
        {...props}
      >
        {content}
      </pre>
    )
  }
)
CodeBlock.displayName = 'CodeBlock'

export { CodeBlock }
