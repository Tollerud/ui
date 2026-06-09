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
})
