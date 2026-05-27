'use client'

import { type HTMLAttributes, forwardRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  /** Optional string content to render inside <code> tags */
  code?: string
  /** When true, prepends a prompt symbol ($) before text content */
  promptPrefix?: boolean
  /** When false, hides the copy-to-clipboard button (default: true) */
  showCopy?: boolean
}

const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ className, children, code, promptPrefix, showCopy = true, ...props }, ref) => {
    const [copied, setCopied] = useState(false)

    const content = code ? (
      <code className="text-tia-noir-200">{code}</code>
    ) : (
      children
    )

    const handleCopy = useCallback(async () => {
      const text = code ?? (typeof children === 'string' ? children : '')
      if (!text) return

      // Try clipboard API first, fallback to execCommand for broader compat
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }, [code, children])

    return (
      <div className="relative group">
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
        {showCopy && (
          <button
            onClick={handleCopy}
            className={cn(
              'absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium',
              'opacity-0 group-hover:opacity-100 transition-all',
              'bg-tia-noir-800 border border-tia-border/30 text-tia-text-muted',
              'hover:bg-tia-surface-raised hover:text-tia-text-primary',
              copied && 'opacity-100 bg-tia-success/15 text-tia-success border-tia-success/40'
            )}
            aria-label={copied ? 'Copied' : 'Copy code'}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
    )
  }
)
CodeBlock.displayName = 'CodeBlock'

export { CodeBlock }
