import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PriceDisplay } from './PriceDisplay'

describe('PriceDisplay', () => {
  it('renders primary and secondary values', () => {
    render(<PriceDisplay primary="58,0 kr/l" secondary="29,00 kr" />)
    expect(screen.getByText('58,0 kr/l')).toBeInTheDocument()
    expect(screen.getByText('29,00 kr')).toBeInTheDocument()
  })

  it('defaults to md size typography', () => {
    render(<PriceDisplay primary="58,0 kr/l" />)
    expect(screen.getByText('58,0 kr/l')).toHaveClass('text-base')
  })

  it('applies sm and lg size typography', () => {
    const { rerender } = render(<PriceDisplay primary="Small" size="sm" />)
    expect(screen.getByText('Small')).toHaveClass('text-sm')

    rerender(<PriceDisplay primary="Large" size="lg" />)
    expect(screen.getByText('Large')).toHaveClass('text-lg')
  })

  it('uses success styling when highlight is cheapest', () => {
    render(<PriceDisplay primary="54,5 kr/l" secondary="27,25 kr" highlight="cheapest" />)
    expect(screen.getByText('54,5 kr/l')).toHaveClass('text-tollerud-success')
  })
})
