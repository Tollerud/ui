import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Sparkline } from './Sparkline'

describe('Sparkline', () => {
  it('is hidden from assistive tech when static', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('tabindex')
    // No idle dot when not interactive
    expect(container.querySelector('circle')).toBeNull()
  })

  it('marks the latest point when interactive and idle', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} interactive />)
    expect(container.querySelectorAll('circle')).toHaveLength(1)
  })

  it('supports keyboard navigation with tooltip and announcements', () => {
    const { container } = render(
      <Sparkline data={[5, 10, 15]} interactive ariaLabel="CPU trend" formatValue={(v) => `${v}%`} />
    )
    const svg = screen.getByRole('img', { name: 'CPU trend' })

    fireEvent.focus(svg)
    expect(screen.getByText('15%')).toBeInTheDocument()

    fireEvent.keyDown(svg, { key: 'ArrowLeft' })
    expect(screen.getByText('10%')).toBeInTheDocument()
    expect(container.querySelector('[aria-live="polite"]')?.textContent).toBe(
      'Point 2 of 3: 10%'
    )

    fireEvent.keyDown(svg, { key: 'Escape' })
    expect(screen.queryByText('10%')).not.toBeInTheDocument()
  })

  it('still accepts the deprecated w/h props', () => {
    const { container } = render(<Sparkline data={[1, 2]} w={84} h={26} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '84')
    expect(svg).toHaveAttribute('height', '26')
  })

  it('has no axe violations interactive with tooltip open', async () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} interactive ariaLabel="Trend" />)
    fireEvent.focus(screen.getByRole('img', { name: 'Trend' }))
    expect(await axe(container)).toHaveNoViolations()
  })
})
