'use client'

import { useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* ──────────────────── GlowCard (cursor-follow glow wrapper) ──────────────────── */

export interface GlowCardProps {
  children: ReactNode
  className?: string
  /** Color of the glow. Default: accent yellow */
  glowColor?: string
  /** Glow intensity (0–1). Default: 0.15 */
  intensity?: number
}

function GlowCard({
  children,
  className,
  glowColor = 'var(--tollerud-accent, #FFFF00)',
  intensity = 0.15,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content */}
      <div className="relative">{children}</div>
      {/* Follow-cursor glow — rendered above content via isolation + screen blend so it shows through solid backgrounds */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-slow"
        style={{
          opacity: isHovered ? intensity : 0,
          background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, ${glowColor}, transparent 70%)`,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}

export { GlowCard }
export default GlowCard
