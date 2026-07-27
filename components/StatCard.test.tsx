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

  it('accepts a ReactNode value for inline-editable tiles', () => {
    render(<StatCard label="Ticket price" value={<input aria-label="Price" defaultValue="150" />} />)

    expect(screen.getByLabelText('Price')).toBeInTheDocument()
  })

  it('renders a secondary value as a tinted badge', () => {
    render(
      <StatCard
        label="Price"
        value="23,90 kr"
        secondaryValue="47,80 kr/l"
        secondaryTone="accent"
      />,
    )

    const badge = screen.getByText('47,80 kr/l')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('text-tollerud-yellow')
  })

  it('omits the secondary badge when secondaryValue is not set', () => {
    render(<StatCard label="Price" value="23,90 kr" />)

    expect(screen.queryByText(/kr\/l/)).not.toBeInTheDocument()
  })
})
