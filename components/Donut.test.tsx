import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Donut } from './Donut'
import { CHART_SERIES_COLORS } from '../lib/chart-series'

const segments = [
  { label: 'Diesel', value: 420 },
  { label: 'Bensin', value: 380 },
  { label: 'El', value: 200 },
]

describe('Donut', () => {
  it('cycles the chart palette when segment colors are omitted', () => {
    const { container } = render(<Donut segments={segments} />)
    const arcs = [...container.querySelectorAll('svg circle')].slice(1) // skip track
    expect(arcs[0]).toHaveAttribute('stroke', CHART_SERIES_COLORS[0])
    expect(arcs[1]).toHaveAttribute('stroke', CHART_SERIES_COLORS[1])
    expect(arcs[2]).toHaveAttribute('stroke', CHART_SERIES_COLORS[2])
  })

  it('explicit segment colors still win', () => {
    const { container } = render(
      <Donut segments={[{ label: 'A', value: 1, color: 'rebeccapurple' }]} />
    )
    const arcs = [...container.querySelectorAll('svg circle')].slice(1)
    expect(arcs[0]).toHaveAttribute('stroke', 'rebeccapurple')
  })

  it('renders a static legend without focus targets by default', () => {
    const { container } = render(<Donut segments={segments} />)
    expect(screen.getByText('Diesel')).toBeInTheDocument()
    expect(screen.getByText('42%')).toBeInTheDocument()
    expect(container.querySelector('[tabindex]')).toBeNull()
  })

  it('interactive legend: roving focus highlights the arc and reveals the value', () => {
    const { container } = render(<Donut segments={segments} interactive ariaLabel="Fuel mix" />)

    const rows = screen.getAllByRole('listitem')
    expect(rows[0]).toHaveAttribute('aria-label', 'Diesel: 420, 42%')
    expect(rows[0]).toHaveAttribute('tabindex', '0')
    expect(rows[1]).toHaveAttribute('tabindex', '-1')

    fireEvent.focus(rows[0]!)
    // Active row reveals the raw value next to the percentage
    expect(screen.getByText('420 · 42%')).toBeInTheDocument()
    // Other arcs dim
    const arcs = [...container.querySelectorAll('svg circle')].slice(1)
    expect(arcs[0]).toHaveAttribute('stroke-opacity', '1')
    expect(arcs[1]).toHaveAttribute('stroke-opacity', '0.35')

    fireEvent.keyDown(rows[0]!, { key: 'ArrowDown' })
    expect(rows[1]).toHaveFocus()
  })

  it('has no axe violations static and interactive', async () => {
    const staticRender = render(<Donut segments={segments} />)
    expect(await axe(staticRender.container)).toHaveNoViolations()
    staticRender.unmount()

    const interactive = render(<Donut segments={segments} interactive ariaLabel="Fuel mix" />)
    fireEvent.focus(screen.getAllByRole('listitem')[0]!)
    expect(await axe(interactive.container)).toHaveNoViolations()
  })
})
