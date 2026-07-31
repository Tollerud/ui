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

  it('traps Tab focus inside the palette', async () => {
    const user = userEvent.setup()

    render(
      <>
        <button type="button">Outside before</button>
        <CommandMenu open onOpenChange={vi.fn()} groups={groups} />
        <button type="button">Outside after</button>
      </>
    )

    const dialog = screen.getByRole('dialog', { name: 'Command palette' })
    const input = screen.getByPlaceholderText('Type a command…')
    input.focus()
    expect(input).toHaveFocus()

    // Tabbing forward from the last focusable row must not escape to
    // "Outside after" — it should cycle back inside the dialog.
    for (let i = 0; i < 6; i++) {
      await user.tab()
      expect(dialog.contains(document.activeElement)).toBe(true)
    }

    // Shift+Tab from the first focusable element must not escape to
    // "Outside before" either.
    for (let i = 0; i < 6; i++) {
      await user.tab({ shift: true })
      expect(dialog.contains(document.activeElement)).toBe(true)
    }
  })
})
