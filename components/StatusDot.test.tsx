import type { CSSProperties, ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('framer-motion', () => ({
  motion: {
    span: ({
      children,
      className,
      style,
    }: {
      children?: ReactNode
      className?: string
      style?: CSSProperties
    }) => (
      <span className={className} style={style}>
        {children}
      </span>
    ),
  },
}))

import { StatusDot } from './StatusDot'

describe('StatusDot', () => {
  it('renders label and online status class', () => {
    render(<StatusDot status="online" label="SSH connected" />)
    expect(screen.getByText('SSH connected')).toBeInTheDocument()
    const dot = document.querySelector('.bg-tollerud-success')
    expect(dot).toBeTruthy()
  })

  it('respects noPulse', () => {
    render(<StatusDot status="online" noPulse />)
    const dot = document.querySelector('.animate-tollerud-dot-pulse')
    expect(dot).toBeNull()
  })
})
