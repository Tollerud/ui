import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { ButtonGroup } from './ButtonGroup'

describe('ButtonGroup', () => {
  it('renders fused action buttons with a group role', () => {
    render(
      <ButtonGroup>
        <Button variant="secondary">Deploy</Button>
        <Button variant="secondary">Cancel</Button>
      </ButtonGroup>
    )

    expect(screen.getByRole('group')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Deploy' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('applies the group size to child buttons', () => {
    render(
      <ButtonGroup size="sm">
        <Button variant="secondary">Deploy</Button>
        <Button variant="ghost" aria-label="Settings">
          <span data-testid="icon" />
        </Button>
      </ButtonGroup>
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveClass('tollerud-btn--sm')
    expect(buttons[1]).toHaveClass('tollerud-btn--sm')
  })

  it('fires independent actions from each segment', async () => {
    const user = userEvent.setup()
    const onDeploy = vi.fn()
    const onCancel = vi.fn()

    render(
      <ButtonGroup>
        <Button variant="secondary" onClick={onDeploy}>
          Deploy
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </ButtonGroup>
    )

    await user.click(screen.getByRole('button', { name: 'Deploy' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onDeploy).toHaveBeenCalledOnce()
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
