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

describe('BarChart multi-series', () => {
  const series = [
    { label: 'CPU', values: [30, 60, 45] },
    { label: 'Memory', values: [50, 40, 70] },
  ]
  const categories = ['emma', 'pia', 'iris']

  it('renders grouped bars — a legend and one focusable bar per (category, series)', () => {
    render(
      <BarChart series={series} categories={categories} interactive ariaLabel="Host load" formatValue={(v) => `${v}%`} />
    )
    // Legend
    expect(screen.getByText('CPU')).toBeInTheDocument()
    expect(screen.getByText('Memory')).toBeInTheDocument()
    // 3 categories × 2 series = 6 focusable bars, labeled "category · series: value"
    const bars = screen.getAllByRole('img')
    expect(bars).toHaveLength(6)
    expect(bars[0]).toHaveAttribute('aria-label', 'emma · CPU: 30%')
    expect(bars[1]).toHaveAttribute('aria-label', 'emma · Memory: 50%')
  })

  it('grouped: roving arrow keys move focus across all bars', () => {
    render(<BarChart series={series} categories={categories} interactive ariaLabel="Host load" />)
    const bars = screen.getAllByRole('img')
    fireEvent.focus(bars[0]!)
    expect(bars[0]).toHaveAttribute('tabindex', '0')
    fireEvent.keyDown(bars[0]!, { key: 'ArrowRight' })
    expect(bars[1]).toHaveFocus()
    fireEvent.keyDown(bars[1]!, { key: 'End' })
    expect(bars[5]).toHaveFocus()
  })

  it('renders stacked bars — one focusable column per category with a stacked aria-label', () => {
    render(
      <BarChart
        series={series}
        categories={categories}
        stacked
        interactive
        ariaLabel="Host load"
        formatValue={(v) => `${v}%`}
      />
    )
    // 3 categories = 3 focusable columns
    const cols = screen.getAllByRole('img')
    expect(cols).toHaveLength(3)
    expect(cols[0]).toHaveAttribute('aria-label', 'emma: CPU 30%, Memory 50%')
  })

  it('stacked: tooltip lists every series for the focused category', () => {
    render(
      <BarChart series={series} categories={categories} stacked interactive ariaLabel="Host load" formatValue={(v) => `${v}%`} />
    )
    const cols = screen.getAllByRole('img')
    fireEvent.focus(cols[1]!)
    // pia column: CPU 60%, Memory 40%
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('40%')).toBeInTheDocument()
  })

  it('cycles the palette and honors explicit series colors', () => {
    const { container } = render(
      <BarChart
        series={[
          { label: 'A', values: [1, 2, 3] },
          { label: 'B', values: [3, 2, 1], color: 'rebeccapurple' },
        ]}
        categories={categories}
      />
    )
    const swatches = [...container.querySelectorAll('span[aria-hidden="true"]')]
    // jsdom lowercases hex inside var()
    expect(swatches[0]).toHaveStyle({ background: 'var(--chart-1, #ffff00)' })
    expect(swatches[1]).toHaveStyle({ background: 'rebeccapurple' })
  })

  it('has no axe violations (grouped and stacked)', async () => {
    const grouped = render(<BarChart series={series} categories={categories} interactive ariaLabel="Host load" />)
    expect(await axe(grouped.container)).toHaveNoViolations()
    grouped.unmount()
    const stacked = render(<BarChart series={series} categories={categories} stacked interactive ariaLabel="Host load" />)
    expect(await axe(stacked.container)).toHaveNoViolations()
  })
})
