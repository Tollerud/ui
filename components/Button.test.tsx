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
    const btn = screen.getByRole('button', { name: 'Cancel' })
    expect(btn).toHaveClass('tollerud-btn--secondary')
    expect(btn.className).toContain('--surface-raised')
    expect(btn.className).toContain('--border')
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
    expect(buttonVariants({ variant: 'primary', size: 'sm' })).toContain('tollerud-btn--sm')
  })

  it('renders ghost-destructive with ghost rest and error hover classes', () => {
    render(<Button variant="ghost-destructive">Archive</Button>)
    const btn = screen.getByRole('button', { name: 'Archive' })
    expect(btn).toHaveClass('tollerud-btn--ghost-destructive')
    expect(btn).toHaveClass('text-tollerud-text-secondary')
    expect(btn).toHaveClass('border-transparent')
    expect(btn).toHaveClass('hover:text-tollerud-error')
    expect(btn).toHaveClass('hover:bg-tollerud-error/10')
    expect(btn).toHaveClass('hover:border-tollerud-error/30')
  })

  it.each([
    ['ghost-success', 'success', 'Approve'],
    ['ghost-warning', 'warning', 'Pause'],
    ['ghost-info', 'info', 'Details'],
  ] as const)('renders %s with ghost rest and semantic hover classes', (variant, token, label) => {
    render(<Button variant={variant}>{label}</Button>)
    const btn = screen.getByRole('button', { name: label })
    expect(btn).toHaveClass(`tollerud-btn--${variant}`)
    expect(btn).toHaveClass('text-tollerud-text-secondary')
    expect(btn).toHaveClass(`hover:text-tollerud-${token}`)
    expect(btn).toHaveClass(`hover:bg-tollerud-${token}/10`)
    expect(btn).toHaveClass(`hover:border-tollerud-${token}/30`)
  })

  it('uses the same size class for text and icon-only buttons', () => {
    render(
      <>
        <Button size="sm">Deploy</Button>
        <Button size="sm" aria-label="Settings">
          <span data-testid="icon" />
        </Button>
      </>
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveClass('tollerud-btn--sm')
    expect(buttons[1]).toHaveClass('tollerud-btn--sm')
  })
})
