import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Status = 'online' | 'offline' | 'warning' | 'idle'

const statusStyles: Record<Status, { base: string; glow: string }> = {
  online:  {
    base: 'bg-tia-success',
    glow: 'shadow-[0_0_0_rgba(34,197,94,0)]',
  },
  offline: {
    base: 'bg-tia-error',
    glow: '',
  },
  warning: {
    base: 'bg-tia-yellow',
    glow: 'shadow-[0_0_0_rgba(232,213,0,0)]',
  },
  idle:    {
    base: 'bg-tia-noir-400',
    glow: '',
  },
}

const animationKeyframes = `
@keyframes tia-dot-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 var(--pulse-color, rgba(34,197,94,0.5));
  }
  50% {
    box-shadow: 0 0 0 5px var(--pulse-color, rgba(34,197,94,0));
  }
}
`

const pulseColors: Partial<Record<Status, string>> = {
  online: 'rgba(34,197,94,0.5)',
  warning: 'rgba(232,213,0,0.45)',
}

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  status?: Status
  label?: string
  /** Disable the pulsing animation */
  noPulse?: boolean
}

const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, status = 'idle', label, noPulse, ...props }, ref) => {
    const style = statusStyles[status]
    const shouldPulse = !noPulse && (status === 'online' || status === 'warning')
    const pulseColor = pulseColors[status]

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}
        {...props}
      >
        <style>{animationKeyframes}</style>
        <span
          className={cn(
            'inline-block w-2 h-2 rounded-full',
            style.base,
            style.glow,
            shouldPulse && 'animate-tia-dot-pulse'
          )}
          style={{
            ...(shouldPulse && pulseColor ? { '--pulse-color': pulseColor } as React.CSSProperties : {}),
            animation: shouldPulse ? 'tia-dot-pulse 2s ease-in-out infinite' : undefined,
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