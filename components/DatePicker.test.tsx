import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  it('opens the calendar and selects a date', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <DatePicker
        label="Maintenance"
        placeholder="Select a date"
        onChange={onChange}
        formatDate={(date) => `day-${date.getDate()}`}
      />
    )

    await user.click(screen.getByRole('button', { name: /maintenance/i }))
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument()

    const dayButtons = screen.getAllByRole('button').filter(
      (btn) => btn.getAttribute('aria-label') === null && /^\d+$/.test(btn.textContent ?? '')
    )
    await user.click(dayButtons[0])

    expect(onChange).toHaveBeenCalledWith(expect.any(Date))
    expect(screen.getByRole('button', { name: /maintenance/i })).toHaveTextContent(/^day-/)
  })

  it('closes the calendar on outside click', async () => {
    const user = userEvent.setup()

    render(
      <div>
        <DatePicker label="Window" placeholder="Select a date" />
        <button type="button">Outside</button>
      </div>
    )

    await user.click(screen.getByRole('button', { name: /window/i }))
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('dialog', { name: 'Choose date' })).not.toBeInTheDocument()
  })
})
