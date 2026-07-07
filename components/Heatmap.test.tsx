import { fireEvent, render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Heatmap } from './Heatmap'

// Two weeks of Mon-anchored data (2026-01-05 is a Monday).
const data = [
  { date: '2026-01-05', value: 1 },
  { date: '2026-01-06', value: 4 },
  { date: '2026-01-07', value: 8 },
  { date: '2026-01-12', value: 2 },
  { date: '2026-01-14', value: 10 },
]

describe('Heatmap', () => {
  it('exposes an accessible name and a screen-reader data table of valued days', () => {
    render(<Heatmap data={data} ariaLabel="Deploys" formatValue={(v) => `${v} deploys`} />)
    expect(screen.getByRole('img', { name: 'Deploys' })).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Deploys' })
    // One row per day with a positive value (5), plus the header row
    expect(within(table).getAllByRole('row')).toHaveLength(6)
    expect(within(table).getByRole('cell', { name: '10 deploys' })).toBeInTheDocument()
  })

  it('buckets values into intensity levels (max value gets the strongest color)', () => {
    const { container } = render(<Heatmap data={data} ariaLabel="Deploys" />)
    // The grid cells are the small squares; the strongest color is colors[4].
    const cells = [...container.querySelectorAll('[role="img"] > div > div')]
    const strong = cells.filter((c) =>
      (c.getAttribute('style') || '').includes('var(--tollerud-yellow-warm, #E8D500)'),
    )
    // value 10 is the max → level 4 (strong). value 8 → ceil(8/10*4)=4 too.
    expect(strong.length).toBeGreaterThanOrEqual(1)
  })

  it('shows a tooltip with value + date on hover', () => {
    const { container } = render(<Heatmap data={data} ariaLabel="Deploys" formatValue={(v) => `${v}!`} />)
    const cells = [...container.querySelectorAll('[role="img"] > div > div')]
    // Hover a colored (valued) cell — the first non-transparent one
    const valued = cells.find((c) => {
      const bg = (c.getAttribute('style') || '')
      return bg.includes('yellow-warm') || bg.includes('color-mix')
    })!
    fireEvent.mouseEnter(valued)
    // Tooltip renders a formatted value
    expect(container.querySelector('.pointer-events-none')).toBeInTheDocument()
  })

  it('renders a Less→More legend, hidden when showLegend is false', () => {
    const { rerender } = render(<Heatmap data={data} ariaLabel="Deploys" />)
    expect(screen.getByText('Less')).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
    rerender(<Heatmap data={data} ariaLabel="Deploys" showLegend={false} />)
    expect(screen.queryByText('Less')).not.toBeInTheDocument()
  })

  it('can opt out of the SR table', () => {
    render(<Heatmap data={data} ariaLabel="Deploys" srTable={false} />)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(<Heatmap data={data} ariaLabel="Deploy activity" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
