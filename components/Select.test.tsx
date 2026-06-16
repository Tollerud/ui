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

    const listbox = screen.getByRole('listbox')
    expect(listbox).toHaveAttribute('data-placement', 'top')
    expect(document.body.contains(listbox)).toBe(true)
  })

  it('renders listbox in a portal so overflow containers do not clip it', async () => {
    const user = userEvent.setup()

    render(
      <div style={{ overflow: 'hidden', height: 120 }}>
        <Select
          label="Region"
          value="eu"
          options={[
            { value: 'eu', label: 'EU' },
            { value: 'us', label: 'US' },
          ]}
        />
      </div>,
    )

    await user.click(screen.getByRole('button'))
    expect(document.body.contains(screen.getByRole('listbox'))).toBe(true)
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
