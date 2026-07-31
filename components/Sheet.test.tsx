import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(document.querySelector('.tollerud-sheet-overlay')).not.toBeInTheDocument()
  })

  it('does not mount overlay when closed', () => {
    render(
      <Sheet open={false}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Deploy logs</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )

    expect(document.querySelector('.tollerud-sheet-overlay')).not.toBeInTheDocument()
  })

  describe('prefers-reduced-motion', () => {
    const originalMatchMedia = window.matchMedia

    afterEach(() => {
      window.matchMedia = originalMatchMedia
    })

    it('closes instantly when the user prefers reduced motion', async () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

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
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })
})
