import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { BarChart } from './BarChart'

const data = [
  { label: 'Oslo', value: 42 },
  { label: 'Bergen', value: 28, accent: true },
  { label: 'Tromsø', value: 15 },
]

describe('BarChart', () => {
  it('renders static bars without focus targets (pre-4.8.44 API)', () => {
    const { container } = render(<BarChart data={data} />)
    expect(screen.getByText('Oslo')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(container.querySelector('[tabindex]')).toBeNull()
    expect(container.querySelector('[role="group"]')).toBeNull()
  })

  it('formats visible values with formatValue', () => {
    render(<BarChart data={data} formatValue={(v) => `${v} kr`} />)
    expect(screen.getByText('42 kr')).toBeInTheDocument()
  })

  it('supports roving keyboard focus with tooltips when interactive', () => {
    render(<BarChart data={data} interactive ariaLabel="Sales by city" formatValue={(v) => `${v} kr`} />)

    const bars = screen.getAllByRole('img')
    expect(bars).toHaveLength(3)
    expect(bars[0]).toHaveAttribute('aria-label', 'Oslo: 42 kr')
    expect(bars[0]).toHaveAttribute('tabindex', '0')
    expect(bars[1]).toHaveAttribute('tabindex', '-1')

    fireEvent.focus(bars[0]!)
    // Tooltip shows label + value (value also exists as the bar's static label)
    expect(screen.getAllByText('42 kr').length).toBeGreaterThan(1)

    fireEvent.keyDown(bars[0]!, { key: 'ArrowRight' })
    expect(bars[1]).toHaveFocus()
    expect(bars[1]).toHaveAttribute('tabindex', '0')
    expect(bars[0]).toHaveAttribute('tabindex', '-1')

    fireEvent.keyDown(bars[1]!, { key: 'End' })
    expect(bars[2]).toHaveFocus()
  })

  it('Escape blurs the focused bar without propagating', () => {
    const outerEscape = vi.fn()
    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- test probe for event propagation
      <div onKeyDown={(e) => e.key === 'Escape' && outerEscape()}>
        <BarChart data={data} interactive />
      </div>
    )
    const bars = screen.getAllByRole('img')
    fireEvent.focus(bars[0]!)
    fireEvent.keyDown(bars[0]!, { key: 'Escape' })
    expect(outerEscape).not.toHaveBeenCalled()
    expect(bars[0]).not.toHaveFocus()
  })

  it('has no axe violations interactive with a tooltip open', async () => {
    const { container } = render(<BarChart data={data} interactive ariaLabel="Sales" />)
    fireEvent.focus(screen.getAllByRole('img')[0]!)
    expect(await axe(container)).toHaveNoViolations()
  })
})
