import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renders label and toggles checked state (uncontrolled)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Switch label="Auto-restart" onChange={onChange} />)

    const toggle = screen.getByRole('switch', { name: 'Auto-restart' })
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    await user.click(toggle)

    expect(onChange).toHaveBeenCalled()
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('respects a controlled checked prop', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Switch label="Enabled" checked={false} onChange={onChange} />)
    const toggle = screen.getByRole('switch', { name: 'Enabled' })

    await user.click(toggle)

    expect(onChange).toHaveBeenCalled()
    // Controlled — stays false since the consumer didn't update `checked`.
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Switch label="Locked" disabled onChange={onChange} />)
    const toggle = screen.getByRole('switch', { name: 'Locked' })

    await user.click(toggle)

    expect(onChange).not.toHaveBeenCalled()
  })
})
