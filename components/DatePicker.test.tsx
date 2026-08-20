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

  describe('keyboard grid navigation', () => {
    it('focuses the selected day on open and moves focus day-by-day with arrow keys', async () => {
      const user = userEvent.setup()
      const selected = new Date(2026, 2, 15) // Sunday, March 15 2026

      render(<DatePicker label="Date" value={selected} onChange={vi.fn()} />)

      await user.click(screen.getByRole('button', { name: /^date/i }))
      expect(screen.getByRole('button', { name: '15' })).toHaveFocus()

      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('button', { name: '16' })).toHaveFocus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('button', { name: '23' })).toHaveFocus()

      await user.keyboard('{ArrowLeft}')
      expect(screen.getByRole('button', { name: '22' })).toHaveFocus()

      await user.keyboard('{ArrowUp}')
      expect(screen.getByRole('button', { name: '15' })).toHaveFocus()
    })

    it('Home/End move focus to the start/end of the current week', async () => {
      const user = userEvent.setup()
      const selected = new Date(2026, 2, 18) // Wednesday, March 18 2026

      render(<DatePicker label="Date" value={selected} onChange={vi.fn()} />)

      await user.click(screen.getByRole('button', { name: /^date/i }))
      expect(screen.getByRole('button', { name: '18' })).toHaveFocus()

      await user.keyboard('{Home}')
      expect(screen.getByRole('button', { name: '15' })).toHaveFocus() // Sunday

      await user.keyboard('{End}')
      expect(screen.getByRole('button', { name: '21' })).toHaveFocus() // Saturday
    })

    it('PageUp/PageDown move focus a month at a time and update the visible month', async () => {
      const user = userEvent.setup()
      const selected = new Date(2026, 2, 15)

      render(<DatePicker label="Date" value={selected} onChange={vi.fn()} />)

      await user.click(screen.getByRole('button', { name: /^date/i }))
      expect(screen.getByText('March 2026')).toBeInTheDocument()

      await user.keyboard('{PageDown}')
      expect(screen.getByText('April 2026')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '15' })).toHaveFocus()

      await user.keyboard('{PageUp}')
      expect(screen.getByText('March 2026')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '15' })).toHaveFocus()
    })

    it('selects the focused day with Enter', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const selected = new Date(2026, 2, 15)

      render(<DatePicker label="Date" value={selected} onChange={onChange} />)

      await user.click(screen.getByRole('button', { name: /^date/i }))
      await user.keyboard('{ArrowRight}{Enter}')

      expect(onChange).toHaveBeenCalledWith(expect.any(Date))
      expect((onChange.mock.calls[0][0] as Date).getDate()).toBe(16)
      expect(screen.queryByRole('dialog', { name: 'Choose date' })).not.toBeInTheDocument()
    })
  })
})
