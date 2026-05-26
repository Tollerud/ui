'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/* ── Device selector button row ──
   Bumped text size + added responsive variant for mobile. */
type DeviceSize = 'desktop' | 'tablet' | 'mobile'

const DEVICE_WIDTHS: Record<DeviceSize, number | null> = {
  desktop: null,
  tablet: 768,
  mobile: 375,
} as const

interface PreviewFrameProps {
  children: React.ReactNode
  className?: string
}

export function PreviewFrame({ children, className }: PreviewFrameProps) {
  const [device, setDevice] = React.useState<DeviceSize>('desktop')

  return (
    <div className={cn(
      'border border-tia-border/30 rounded-lg bg-tia-surface-raised overflow-hidden',
      className,
    )}>
      {/* Device toolbar */}
      <div className="flex items-center gap-2 border-b border-tia-border/20 p-2">
        {(['desktop', 'tablet', 'mobile'] as DeviceSize[]).map((d) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={cn(
              'px-3 py-1.5 rounded-md font-medium transition-colors',
              device === d
                ? 'bg-tia-yellow/15 text-tia-yellow ring-1 ring-tia-yellow/40'
                : 'text-tia-text-primary hover:bg-tia-surface',
            )}
          >
            {d === 'desktop' ? '🖥' : d === 'tablet' ? '📱' : '📱'}
            <span className="ml-1.5">{d.charAt(0).toUpperCase() + d.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* Preview area — responsive max-width wrapper */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden',
          device === 'mobile' && 'max-w-[375px] mx-auto',
          device === 'tablet' && 'max-w-[768px] mx-auto',
        )}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}