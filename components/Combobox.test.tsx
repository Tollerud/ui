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

  it('exposes the highlighted option via aria-activedescendant', async () => {
    const user = userEvent.setup()

    render(
      <Combobox
        label="Host"
        value=""
        onChange={vi.fn()}
        options={[
          { value: 'emma', label: 'emma.tollerud.no' },
          { value: 'iris', label: 'iris.tollerud.no' },
        ]}
      />
    )

    const input = screen.getByRole('combobox')
    expect(input).not.toHaveAttribute('aria-activedescendant')

    await user.click(input)
    const options = screen.getAllByRole('option')
    expect(input).toHaveAttribute('aria-activedescendant', options[0].id)

    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant', options[1].id)
  })

  it('Escape closes the dropdown without propagating to a parent layer', async () => {
    const user = userEvent.setup()
    const onOuterKeyDown = vi.fn()

    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- test probe for event propagation, stands in for a Dialog layer
      <div onKeyDown={onOuterKeyDown}>
        <Combobox
          label="Host"
          value=""
          onChange={vi.fn()}
          options={[{ value: 'emma', label: 'emma.tollerud.no' }]}
        />
      </div>
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    // First Escape: consumed by the open dropdown
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onOuterKeyDown).not.toHaveBeenCalled()

    // Second Escape: dropdown closed, so it propagates (a Dialog would close)
    await user.keyboard('{Escape}')
    expect(onOuterKeyDown).toHaveBeenCalledTimes(1)
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

  it('renders grouped section titles and filters across groups', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Combobox
        label="Target"
        value=""
        onChange={onChange}
        groups={[
          {
            label: 'Servers',
            options: [
              { value: 'emma', label: 'emma.tollerud.no' },
              { value: 'iris', label: 'iris.tollerud.no' },
            ],
          },
          {
            label: 'Actions',
            options: [
              { value: 'backup', label: 'Run backup' },
              { value: 'deploy', label: 'Deploy stack' },
            ],
          },
        ]}
      />
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    expect(screen.getByText('Servers')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
    await user.type(input, 'deploy')
    expect(screen.queryByText('Servers')).not.toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Deploy stack' }))
    expect(onChange).toHaveBeenCalledWith('deploy')
  })

  it('navigates across grouped options with keyboard', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Combobox
        label="Target"
        value=""
        onChange={onChange}
        groups={[
          {
            label: 'Servers',
            options: [{ value: 'emma', label: 'emma.tollerud.no' }],
          },
          {
            label: 'Actions',
            options: [{ value: 'deploy', label: 'Deploy stack' }],
          },
        ]}
      />
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('deploy')
  })
})
