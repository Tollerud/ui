import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders children with accent border when accent is set', () => {
    render(<Card accent>Content</Card>)
    expect(screen.getByText('Content')).toHaveClass('border-tollerud-yellow/25')
  })

  it('sets data-density when density prop is provided', () => {
    render(
      <Card density="compact" data-testid="card">
        Dense
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveAttribute('data-density', 'compact')
  })
})
