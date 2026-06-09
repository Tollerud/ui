import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './Dialog'

describe('Dialog', () => {
  it('renders title and description when open', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Restart container</DialogTitle>
          <DialogDescription>emma:hermes will restart immediately.</DialogDescription>
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
          <DialogTitle>Hidden</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
