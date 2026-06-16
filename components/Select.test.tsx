import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { Select } from './Select'

describe('Select', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens upward when space below is limited', async () => {
    const user = userEvent.setup()
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      const role = this.getAttribute('role')
      if (role === 'listbox') {
        return { top: 520, bottom: 760, left: 0, right: 88, width: 88, height: 240, x: 0, y: 520, toJSON: () => ({}) }
      }
      return {
        top: 760,
        bottom: 792,
        left: 0,
        right: 88,
        width: 88,
        height: 32,
        x: 0,
        y: 760,
        toJSON: () => ({}),
      }
    })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    render(
      <Select
        label="Rows"
        layout="inline"
        size="sm"
        value="25"
        options={[
          { value: '10', label: '10' },
          { value: '25', label: '25' },
        ]}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Rows: 25' }))

    expect(screen.getByRole('listbox').className).toContain('bottom-full')
  })

  it('opens the list and selects an option', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Select
        label="Region"
        value="eu"
        onChange={onChange}
        options={[
          { value: 'eu', label: 'EU' },
          { value: 'us', label: 'US' },
        ]}
      />
    )

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('option', { name: 'US' }))
    expect(onChange).toHaveBeenCalledWith('us')
  })
})
