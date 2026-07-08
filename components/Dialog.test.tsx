import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from './Dialog'

describe('Dialog', () => {
  it('renders title and description when open', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restart container</DialogTitle>
            <DialogDescription>emma:hermes will restart immediately.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Restart container')).toBeInTheDocument()
    expect(screen.getByText('emma:hermes will restart immediately.')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <Dialog open={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hidden</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('applies size presets on DialogContent', () => {
    render(
      <Dialog open>
        <DialogContent size="lg" data-testid="dialog-content">
          <DialogHeader>
            <DialogTitle>Wide dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByTestId('dialog-content')).toHaveClass('max-w-2xl')
  })

  it('renders body between header and footer with scroll region', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit host</DialogTitle>
          </DialogHeader>
          <p>Form fields</p>
          <DialogFooter>
            <button type="button">Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByText('Form fields')).toBeInTheDocument()
    expect(screen.getByText('Form fields').parentElement).toHaveClass('overflow-y-auto')
  })

  it('supports DialogBody for explicit scrollable content', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logs</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p>Line 1</p>
          </DialogBody>
        </DialogContent>
      </Dialog>
    )

    const body = screen.getByText('Line 1').closest('[class*="overflow-y-auto"]')
    expect(body).toBeTruthy()
  })
})

describe('DialogPanel', () => {
  it('renders title, body, and footer', () => {
    render(
      <DialogPanel
        open
        title="Stop all containers?"
        description="This stops 4 running services."
        footer={<button type="button">Stop</button>}
      >
        <p>Extra warning copy</p>
      </DialogPanel>
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Stop all containers?')).toBeInTheDocument()
    expect(screen.getByText('This stops 4 running services.')).toBeInTheDocument()
    expect(screen.getByText('Extra warning copy')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <DialogPanel open onClose={onClose} title="Confirm">
        <p>Body</p>
      </DialogPanel>
    )

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalled()
  })
})
