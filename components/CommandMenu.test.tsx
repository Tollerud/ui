import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CommandMenu } from './CommandMenu'

const groups = [
  {
    label: 'Servers',
    items: [
      { id: 'emma', label: 'emma.tollerud.no', onSelect: vi.fn() },
      { id: 'miriam', label: 'miriam.tollerud.no', onSelect: vi.fn() },
    ],
  },
]

describe('CommandMenu', () => {
  it('filters results and selects an item', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const onAction = vi.fn()

    render(
      <CommandMenu
        open
        onOpenChange={onOpenChange}
        groups={groups}
        onAction={onAction}
      />
    )

    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Type a command…'), 'emma')
    expect(screen.getByText('emma.tollerud.no')).toBeInTheDocument()
    expect(screen.queryByText('miriam.tollerud.no')).not.toBeInTheDocument()

    await user.click(screen.getByText('emma.tollerud.no'))
    expect(onAction).toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('navigates with arrow keys and selects with Enter', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const onAction = vi.fn()

    render(
      <CommandMenu
        open
        onOpenChange={onOpenChange}
        groups={groups}
        onAction={onAction}
      />
    )

    const input = screen.getByPlaceholderText('Type a command…')
    await user.click(input)
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')

    expect(onAction).toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <CommandMenu open onOpenChange={onOpenChange} groups={groups} />
    )

    await user.click(screen.getByPlaceholderText('Type a command…'))
    await user.keyboard('{Escape}')

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('returns null when closed', () => {
    const { container } = render(
      <CommandMenu open={false} onOpenChange={vi.fn()} groups={groups} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
