import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { AreaChart } from './AreaChart'

const labeled = [
  { value: 10, label: 'Jan' },
  { value: 20, label: 'Feb' },
  { value: 30, label: 'Mar' },
]

describe('AreaChart', () => {
  it('stays a decorative static graphic with plain numbers (pre-4.8.43 API)', () => {
    const { container } = render(<AreaChart data={[1, 2, 3]} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('tabindex')
    expect(container.querySelectorAll('circle')).toHaveLength(3)
  })

  it('supports keyboard navigation with tooltip and announcements when interactive', () => {
    const { container } = render(
      <AreaChart data={labeled} interactive ariaLabel="Monthly output" formatValue={(v) => `v${v}`} />
    )
    const svg = screen.getByRole('img', { name: 'Monthly output' })
    expect(svg).toHaveAttribute('tabindex', '0')

    fireEvent.focus(svg)
    expect(screen.getByText('v30')).toBeInTheDocument()
    expect(screen.getByText('Mar')).toBeInTheDocument()

    fireEvent.keyDown(svg, { key: 'ArrowLeft' })
    expect(screen.getByText('v20')).toBeInTheDocument()
    expect(container.querySelector('[aria-live="polite"]')?.textContent).toBe('Feb: v20')

    fireEvent.keyDown(svg, { key: 'Escape' })
    expect(screen.queryByText('v20')).not.toBeInTheDocument()
  })

  it('supports custom renderTooltip', () => {
    render(
      <AreaChart
        data={labeled}
        interactive
        renderTooltip={(point, index, formatted) => <b>{`${point.label}#${index}=${formatted}`}</b>}
      />
    )
    const svg = screen.getByRole('img', { name: 'Area chart' })
    fireEvent.focus(svg)
    expect(screen.getByText('Mar#2=30')).toBeInTheDocument()
  })

  it('has no axe violations static and with the keyboard tooltip open', async () => {
    const { container } = render(<AreaChart data={labeled} interactive ariaLabel="Output" />)
    expect(await axe(container)).toHaveNoViolations()
    fireEvent.focus(screen.getByRole('img', { name: 'Output' }))
    expect(await axe(container)).toHaveNoViolations()
  })

  it('does not attach interaction handlers when static', () => {
    const { container } = render(<AreaChart data={[1, 2]} />)
    const svg = container.querySelector('svg')!
    fireEvent.focus(svg)
    fireEvent.keyDown(svg, { key: 'ArrowLeft' })
    expect(container.querySelector('[aria-live]')).toBeNull()
    expect(vi.fn()).not.toHaveBeenCalled()
  })
})
