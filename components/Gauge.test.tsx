import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Gauge } from './Gauge'

describe('Gauge', () => {
  it('exposes meter semantics with the value range', () => {
    render(<Gauge value={72} label="Disk" />)
    const meter = screen.getByRole('meter', { name: 'Disk' })
    expect(meter).toHaveAttribute('aria-valuenow', '72')
    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '100')
  })

  it('renders the formatted value and label', () => {
    render(<Gauge value={72} label="Disk" formatValue={(v) => `${v}%`} />)
    expect(screen.getByText('72%')).toBeInTheDocument()
    expect(screen.getByText('Disk')).toBeInTheDocument()
  })

  it('supports a custom min/max range', () => {
    render(<Gauge value={30} min={0} max={60} ariaLabel="Load" />)
    const meter = screen.getByRole('meter', { name: 'Load' })
    expect(meter).toHaveAttribute('aria-valuenow', '30')
    expect(meter).toHaveAttribute('aria-valuemax', '60')
  })

  it('colors the value arc by tone', () => {
    const { container } = render(<Gauge value={90} tone="error" ariaLabel="CPU" />)
    // second arc circle is the value arc
    const arcs = container.querySelectorAll('svg circle')
    expect(arcs[1]).toHaveAttribute('stroke', 'var(--tollerud-error, #EF4444)')
  })

  it('clamps the arc for out-of-range values without breaking dasharray', () => {
    const { container } = render(<Gauge value={150} max={100} ariaLabel="Over" />)
    const valueArc = container.querySelectorAll('svg circle')[1]!
    const dash = valueArc.getAttribute('stroke-dasharray')!
    // fraction clamps to 1 → drawn length is finite and positive
    const drawn = parseFloat(dash.split(' ')[0]!)
    expect(Number.isFinite(drawn)).toBe(true)
    expect(drawn).toBeGreaterThan(0)
  })

  it('scales to the container when fluid, fixed otherwise', () => {
    const { container, rerender } = render(<Gauge value={50} size={160} ariaLabel="G" />)
    let svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '160')
    expect(svg).not.toHaveClass('w-full')

    rerender(<Gauge value={50} size={160} fluid ariaLabel="G" />)
    svg = container.querySelector('svg')!
    expect(svg).toHaveClass('w-full')
    expect(svg).toHaveClass('h-auto')
  })

  it('has no axe violations', async () => {
    const { container } = render(<Gauge value={72} label="Disk usage" formatValue={(v) => `${v}%`} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
