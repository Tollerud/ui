import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders label and associates it with the input', () => {
    render(<Input label="Server name" id="server" />)
    expect(screen.getByLabelText('Server name')).toHaveAttribute('id', 'server')
  })

  it('shows error message with alert semantics', () => {
    render(<Input label="Host" id="host" error="Connection timed out" />)
    expect(screen.getByText('Connection timed out')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Host' })).toHaveClass('border-tollerud-error')
  })
})
