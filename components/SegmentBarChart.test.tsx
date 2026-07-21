import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SegmentBarChart } from './SegmentBarChart'

const SAMPLE = [
  { label: 'Mat & drikke', value: 6490 },
  { label: 'Drikke', value: 3150 },
  { label: 'Leie', value: 2400 },
  { label: 'Utstyr', value: 890 },
]

describe('SegmentBarChart', () => {
  it('renders segments, percentage labels, and legend values', () => {
    render(
      <SegmentBarChart
        segments={SAMPLE}
        formatValue={(v) => `${v} kr`}
      />,
    )

    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('24%')).toBeInTheDocument()
    expect(screen.getByText('19%')).toBeInTheDocument()
    expect(screen.getByText('Mat & drikke')).toBeInTheDocument()
    expect(screen.getByText('6490 kr')).toBeInTheDocument()
    expect(screen.getByText('890 kr')).toBeInTheDocument()
  })

  it('cycles SEGMENT_BAR_COLORS when color is omitted', () => {
    const { container } = render(<SegmentBarChart segments={SAMPLE} />)
    const bar = container.querySelector('.flex.w-full.overflow-hidden.rounded-full')
    const barSegments = bar?.querySelectorAll(':scope > div') ?? []
    expect(barSegments).toHaveLength(4)
    expect(barSegments[0]).toHaveAttribute('style', expect.stringContaining('--tollerud-yellow'))
    expect(barSegments[1]).toHaveAttribute('style', expect.stringContaining('--tollerud-yellow-warm'))
  })

  it('supports keyboard navigation when interactive', async () => {
    const user = userEvent.setup()
    render(
      <SegmentBarChart
        interactive
        segments={SAMPLE}
        formatValue={(v) => `${v} kr`}
      />,
    )

    const first = screen.getByRole('img', { name: /Mat & drikke: 6490 kr \(50%\)/ })
    first.focus()
    expect(first).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('img', { name: /Drikke: 3150 kr \(24%\)/ })).toHaveFocus()
  })
})
