import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { TimeSeriesChart } from './TimeSeriesChart'

const data = [
  { date: '2026-01-01', value: 10 },
  { date: '2026-02-01', value: 20 },
  { date: '2026-03-01', value: 30 },
]

const formatValue = (v: number) => `val-${v}`

describe('TimeSeriesChart', () => {
  it('renders an accessible chart with the latest-value badge when idle', () => {
    render(<TimeSeriesChart data={data} formatValue={formatValue} ariaLabel="Prices" />)

    const svg = screen.getByRole('img', { name: 'Prices' })
    expect(svg).toHaveAttribute('tabindex', '0')
    // Latest badge shows while nothing is active; tooltip does not
    expect(screen.getAllByText('val-30').length).toBeGreaterThan(0)
  })

  it('supports keyboard navigation: focus selects latest, arrows move the crosshair', () => {
    const { container } = render(
      <TimeSeriesChart data={data} formatValue={formatValue} ariaLabel="Prices" srTable={false} />
    )
    const svg = screen.getByRole('img', { name: 'Prices' })

    fireEvent.focus(svg)
    // Tooltip for the latest point
    expect(screen.getByText('val-30')).toBeInTheDocument()

    fireEvent.keyDown(svg, { key: 'ArrowLeft' })
    expect(screen.getByText('val-20')).toBeInTheDocument()

    fireEvent.keyDown(svg, { key: 'Home' })
    expect(screen.getByText('val-10')).toBeInTheDocument()

    // Live region announces keyboard-selected points
    const liveRegion = container.querySelector('[aria-live="polite"]')
    expect(liveRegion?.textContent).toContain('val-10')
  })

  it('Escape clears the active point without propagating to a parent layer', () => {
    const outerEscape = vi.fn()
    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- test probe for event propagation, stands in for a Dialog layer
      <div onKeyDown={(e) => e.key === 'Escape' && outerEscape()}>
        <TimeSeriesChart data={data} formatValue={formatValue} ariaLabel="Prices" srTable={false} />
      </div>
    )
    const svg = screen.getByRole('img', { name: 'Prices' })

    fireEvent.focus(svg)
    fireEvent.keyDown(svg, { key: 'ArrowLeft' })
    expect(screen.getByText('val-20')).toBeInTheDocument()

    fireEvent.keyDown(svg, { key: 'Escape' })
    expect(screen.queryByText('val-20')).not.toBeInTheDocument()
    expect(outerEscape).not.toHaveBeenCalled()

    fireEvent.keyDown(svg, { key: 'Escape' })
    expect(outerEscape).toHaveBeenCalledTimes(1)
  })

  it('renders the empty state without data', () => {
    render(<TimeSeriesChart data={[]} emptyMessage="Nothing yet" />)
    expect(screen.getByText('Nothing yet')).toBeInTheDocument()
  })

  it('exposes a screen-reader data table by default and can opt out', () => {
    const { rerender } = render(
      <TimeSeriesChart data={data} formatValue={formatValue} ariaLabel="Prices" />
    )
    const table = screen.getByRole('table', { name: 'Prices' })
    expect(table).toBeInTheDocument()
    // One row per data point, each pairing date + value
    const valueCell = screen.getByRole('cell', { name: 'val-30' })
    expect(valueCell).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(data.length + 1) // + header row

    rerender(<TimeSeriesChart data={data} formatValue={formatValue} ariaLabel="Prices" srTable={false} />)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('has no axe violations idle and with the keyboard tooltip open', async () => {
    const { container } = render(
      <TimeSeriesChart data={data} formatValue={formatValue} ariaLabel="Prices" />
    )
    expect(await axe(container)).toHaveNoViolations()

    fireEvent.focus(screen.getByRole('img', { name: 'Prices' }))
    fireEvent.keyDown(screen.getByRole('img', { name: 'Prices' }), { key: 'ArrowLeft' })
    expect(await axe(container)).toHaveNoViolations()
  })
})
