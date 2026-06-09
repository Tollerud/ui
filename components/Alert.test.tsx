import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders with alert role and error tone classes', () => {
    render(
      <Alert tone="error" title="Connection failed">
        Host unreachable
      </Alert>
    )
    expect(screen.getByRole('alert')).toHaveClass('border-red-500/30')
    expect(screen.getByText('Connection failed')).toBeInTheDocument()
    expect(screen.getByText('Host unreachable')).toBeInTheDocument()
  })
})
