import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './Sheet'

describe('Sheet', () => {
  it('opens and shows sheet content', async () => {
    const user = userEvent.setup()

    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Deploy logs</SheetTitle>
          </SheetHeader>
          <p>Streaming output</p>
        </SheetContent>
      </Sheet>
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeVisible()
    expect(dialog).toHaveClass('tollerud-sheet-panel')
    expect(document.querySelector('.tollerud-sheet-overlay')).toBeInTheDocument()
    expect(screen.getByText('Deploy logs')).toBeVisible()
  })

  it('opens with a screen reader title when SheetTitle is omitted', async () => {
    const user = userEvent.setup()

    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Open</Button>
        </SheetTrigger>
        <SheetContent>
          <p>Panel body</p>
        </SheetContent>
      </Sheet>
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog', { name: 'Panel' })).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()

    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Deploy logs</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeVisible()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
