import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Slider } from './Slider'

describe('Slider', () => {
  it('renders with a label and current value', () => {
    render(<Slider label="Concurrency" showValue defaultValue={4} min={0} max={10} />)

    expect(screen.getByText('Concurrency')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '4')
  })

  it('reports the new numeric value via keyboard interaction', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Slider label="Concurrency" defaultValue={4} min={0} max={10} onChange={onChange} />)

    const slider = screen.getByRole('slider')
    slider.focus()
    await user.keyboard('{ArrowRight}')

    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('does not respond to interaction when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Slider label="Concurrency" defaultValue={4} disabled onChange={onChange} />)

    const slider = screen.getByRole('slider')
    slider.focus()
    await user.keyboard('{ArrowRight}')

    expect(onChange).not.toHaveBeenCalled()
  })
})
