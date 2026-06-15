import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Combobox } from './Combobox'

describe('Combobox', () => {
  it('filters and selects an option', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Combobox
        label="Host"
        value=""
        onChange={onChange}
        options={[
          { value: 'emma', label: 'emma.tollerud.no' },
          { value: 'iris', label: 'iris.tollerud.no' },
        ]}
      />
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.type(input, 'iris')
    await user.click(screen.getByRole('option', { name: 'iris.tollerud.no' }))
    expect(onChange).toHaveBeenCalledWith('iris')
  })

  it('selects with keyboard navigation', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Combobox
        label="Host"
        value=""
        onChange={onChange}
        options={[
          { value: 'emma', label: 'emma.tollerud.no' },
          { value: 'iris', label: 'iris.tollerud.no' },
        ]}
      />
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('{Enter}')

    expect(onChange).toHaveBeenCalledWith('emma')
  })

  it('moves highlight with ArrowDown before selecting', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Combobox
        label="Host"
        value=""
        onChange={onChange}
        options={[
          { value: 'emma', label: 'emma.tollerud.no' },
          { value: 'iris', label: 'iris.tollerud.no' },
        ]}
      />
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('{ArrowDown}{Enter}')

    expect(onChange).toHaveBeenCalledWith('iris')
  })
})
