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
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByText('Deploy logs')).toBeVisible()
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
