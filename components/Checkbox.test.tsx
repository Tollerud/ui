import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders label and toggles checked state', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Checkbox label="Enable backups" onChange={onChange} />)

    const input = screen.getByRole('checkbox', { name: 'Enable backups' })
    await user.click(input)

    expect(onChange).toHaveBeenCalled()
  })

  it('exposes mixed state via aria-checked for indeterminate', () => {
    const { rerender } = render(<Checkbox label="Select all" indeterminate />)

    const box = screen.getByRole('checkbox', { name: 'Select all' })
    expect(box).toHaveAttribute('aria-checked', 'mixed')
    expect(box).toHaveAttribute('data-indeterminate')

    rerender(<Checkbox label="Select all" indeterminate={false} />)
    expect(box).not.toHaveAttribute('data-indeterminate')
  })
})
