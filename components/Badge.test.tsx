import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders with accent variant classes', () => {
    render(<Badge variant="accent">New</Badge>)
    expect(screen.getByText('New')).toHaveClass('text-tollerud-yellow')
  })

  it('defaults to default variant', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default')).toHaveClass('bg-tollerud-noir-700')
  })
})
