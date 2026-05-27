'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { CodeBlock } from '../../../components/CodeBlock'

type ViewMode = 'preview' | 'code'
type DeviceSize = 'desktop' | 'tablet' | 'mobile'

const DEVICE_WIDTHS: Record<DeviceSize, number | null> = {
  desktop: null,
  tablet: 768,
  mobile: 375,
} as const

interface PreviewFrameProps {
  children: React.ReactNode
  className?: string
  /** Optional source code to show in the code tab */
  code?: string
  /** Optional language label for the code tab (default: 'tsx') */
  codeLanguage?: string
}

export function PreviewFrame({ children, className, code, codeLanguage = 'tsx' }: PreviewFrameProps) {
  const [device, setDevice] = React.useState<DeviceSize>('desktop')
  const [view, setView] = React.useState<ViewMode>('preview')

  return (
    <div className={cn(
      'border border-tollerud-border/30 rounded-lg bg-tollerud-surface-raised overflow-hidden',
      className,
    )}>
      {/* Toolbar: device buttons left, code toggle right */}
      <div className="flex items-center justify-between border-b border-tollerud-border/20 p-2">
        {/* Device selector */}
        <div className="flex items-center gap-1">
          {(['desktop', 'tablet', 'mobile'] as DeviceSize[]).map((d) => (
            <button
              key={d}
              onClick={() => { setDevice(d); setView('preview') }}
              className={cn(
                'px-2.5 py-1.5 rounded-md font-medium transition-colors text-xs',
                view === 'preview' && device === d
                  ? 'bg-tollerud-yellow/15 text-tollerud-yellow ring-1 ring-tollerud-yellow/40'
                  : 'text-tollerud-text-muted hover:text-tollerud-foreground hover:bg-tollerud-surface-hover',
              )}
            >
              {d === 'desktop' ? '🖥' : d === 'tablet' ? '📱' : '📱'}
              <span className="ml-1.5">{d.charAt(0).toUpperCase() + d.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Code toggle — only show when code is provided */}
        {code && (
          <div className="flex items-center gap-2">
            <div className="w-px h-5 bg-tollerud-border/30" />
            <button
              onClick={() => setView(view === 'code' ? 'preview' : 'code')}
              className={cn(
                'px-2.5 py-1.5 rounded-md font-medium transition-colors text-xs',
                view === 'code'
                  ? 'bg-tollerud-yellow/15 text-tollerud-yellow ring-1 ring-tollerud-yellow/40'
                  : 'text-tollerud-text-muted hover:text-tollerud-foreground hover:bg-tollerud-surface-hover',
              )}
            >
              {'</>'} Code
            </button>
          </div>
        )}
      </div>

      {/* Content area */}
      {view === 'code' && code ? (
        <div className="p-0">
          <div className="flex items-center justify-between border-b border-tollerud-border/20 px-3 py-1.5 bg-tollerud-noir-950/50">
            <span className="text-[11px] font-medium uppercase tracking-wider text-tollerud-text-muted">
              {codeLanguage}
            </span>
          </div>
          <div className="p-0">
            <CodeBlock code={code} showCopy />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden',
            device === 'mobile' && 'max-w-[375px] mx-auto',
            device === 'tablet' && 'max-w-[768px] mx-auto',
          )}
        >
          <div className="p-4">{children}</div>
        </div>
      )}
    </div>
  )
}