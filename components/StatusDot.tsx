'use client'

import { type HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { motionDuration, motionEase } from '@/lib/motion'

type Status = 'online' | 'offline' | 'warning' | 'idle'

const statusColors: Record<Status, string> = {
  online: 'bg-tollerud-success',
  offline: 'bg-tollerud-error',
  warning: 'bg-tollerud-yellow',
  idle: 'bg-tollerud-noir-400',
}

const pulseColors: Partial<Record<Status, string>> = {
  online: 'rgba(34,197,94,0.5)',
  warning: 'rgba(232,213,0,0.45)',
  offline: 'rgba(239,68,68,0.5)',
}

const animationKeyframes = `
@keyframes tollerud-dot-pulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--pulse-color, rgba(34,197,94,0.5)); }
  50% { box-shadow: 0 0 0 5px var(--pulse-color, rgba(34,197,94,0)); }
}
`

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  status?: Status
  label?: string
  /** Disable the pulsing animation */
  noPulse?: boolean
}

const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, status = 'idle', label, noPulse, ...props }, ref) => {
    const shouldPulse = !noPulse && (status === 'online' || status === 'warning' || status === 'offline')
    const pulseColor = pulseColors[status]

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}
        {...props}
      >
        <style>{animationKeyframes}</style>
        <motion.span
          layout
          key={status}
          animate={{
            scaleX: [1, 1.6, 1],
            scaleY: [1, 0.6, 1],
          }}
          transition={{
            duration: motionDuration.slow,
            ease: motionEase.out,
            times: [0, 0.3, 1],
          }}
          className={cn(
            'inline-block w-2 h-2 rounded-full',
            statusColors[status],
            shouldPulse && 'animate-tollerud-dot-pulse'
          )}
          style={{
            ...(shouldPulse && pulseColor ? ({ '--pulse-color': pulseColor } as React.CSSProperties) : {}),
            animation: shouldPulse ? 'tollerud-dot-pulse 2s var(--motion-ease-in-out) infinite' : undefined,
          } as React.CSSProperties}
        />
        {label && <span>{label}</span>}
      </span>
    )
  }
)
StatusDot.displayName = 'StatusDot'

export { StatusDot }
export type { Status }