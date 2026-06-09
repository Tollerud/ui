import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button, buttonVariants } from './Button'

describe('Button', () => {
  it('renders a button with variant classes', () => {
    render(<Button variant="primary">Deploy</Button>)
    expect(screen.getByRole('button', { name: 'Deploy' })).toHaveClass('bg-tollerud-yellow')
  })

  it('defaults to secondary variant', () => {
    render(<Button>Cancel</Button>)
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('bg-transparent')
  })

  it('supports asChild to style a link as a button', () => {
    render(
      <Button asChild variant="primary">
        <a href="/deploy">Deploy</a>
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Deploy' })
    expect(link).toHaveAttribute('href', '/deploy')
    expect(link).toHaveClass('bg-tollerud-yellow')
  })

  it('exports buttonVariants helper', () => {
    expect(buttonVariants({ variant: 'terminal', size: 'sm' })).toContain('font-mono')
  })
})
