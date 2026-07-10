import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('renders change indicator via shared CardChange', () => {
    render(
      <StatCard
        label="Sessions"
        value={42}
        change={{ value: '+12%', direction: 'up' }}
      />,
    )

    expect(screen.getByText('+12%')).toBeInTheDocument()
    expect(screen.getByText('+12%')).toHaveClass('text-tollerud-success')
  })

  it('renders flat unchanged via CardChange', () => {
    render(
      <StatCard label="Sessions" value={42} change={{ direction: 'flat' }} />,
    )

    expect(screen.getByText('—')).toHaveClass('text-tollerud-info')
  })
})
