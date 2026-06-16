'use client'

import { useEffect } from 'react'
import { initButtonGlow } from '@tollerud/ui'

/** Mount once near the app root for pointer-following glow on primary/terminal buttons. */
export function ButtonGlowRoot() {
  useEffect(() => initButtonGlow(), [])
  return null
}
