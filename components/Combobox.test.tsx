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

  describe('onCreateOption', () => {
    it('shows a create row when the query has no exact match and commits it on click', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const onCreateOption = vi.fn()

      render(
        <Combobox
          label="Category"
          value=""
          onChange={onChange}
          onCreateOption={onCreateOption}
          options={[{ value: 'shoes', label: 'Shoes' }]}
        />
      )

      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'Hats')

      const createRow = screen.getByRole('option', { name: 'Create "Hats"' })
      await user.click(createRow)

      expect(onCreateOption).toHaveBeenCalledWith('Hats')
      expect(onChange).toHaveBeenCalledWith('Hats')
    })

    it('does not show a create row when the query exactly matches an existing option', async () => {
      const user = userEvent.setup()

      render(
        <Combobox
          label="Category"
          value=""
          onChange={vi.fn()}
          onCreateOption={vi.fn()}
          options={[{ value: 'shoes', label: 'Shoes' }]}
        />
      )

      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'Shoes')

      expect(screen.queryByRole('option', { name: /Create/ })).not.toBeInTheDocument()
    })

    it('shows the create row alongside partial matches', async () => {
      const user = userEvent.setup()

      render(
        <Combobox
          label="Category"
          value=""
          onChange={vi.fn()}
          onCreateOption={vi.fn()}
          options={[{ value: 'shoes', label: 'Shoes' }]}
        />
      )

      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'Sho')

      expect(screen.getByRole('option', { name: 'Shoes' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Create "Sho"' })).toBeInTheDocument()
    })

    it('is not shown when onCreateOption is not provided', async () => {
      const user = userEvent.setup()

      render(
        <Combobox
          label="Category"
          value=""
          onChange={vi.fn()}
          options={[{ value: 'shoes', label: 'Shoes' }]}
        />
      )

      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'Hats')

      expect(screen.getByText('No results')).toBeInTheDocument()
    })

    it('uses a returned value from onCreateOption instead of the typed label', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <Combobox
          label="Category"
          value=""
          onChange={onChange}
          onCreateOption={() => 'cat_new_123'}
          options={[{ value: 'shoes', label: 'Shoes' }]}
        />
      )

      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'Hats')
      await user.click(screen.getByRole('option', { name: 'Create "Hats"' }))

      expect(onChange).toHaveBeenCalledWith('cat_new_123')
    })

    it('supports a custom createOptionLabel and keyboard selection', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <Combobox
          label="Category"
          value=""
          onChange={onChange}
          onCreateOption={vi.fn()}
          createOptionLabel={(q) => `Add new category "${q}"`}
          options={[{ value: 'shoes', label: 'Shoes' }]}
        />
      )

      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'Hats')

      expect(screen.getByRole('option', { name: 'Add new category "Hats"' })).toBeInTheDocument()

      await user.keyboard('{ArrowDown}{Enter}')
      expect(onChange).toHaveBeenCalledWith('Hats')
    })
  })
})
