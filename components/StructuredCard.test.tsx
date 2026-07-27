import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StructuredCard } from './StructuredCard'

describe('StructuredCard', () => {
  it('renders title, actions, and content', () => {
    render(
      <StructuredCard title="Deploy" actions={<button>Retry</button>}>
        Body content
      </StructuredCard>,
    )

    expect(screen.getByRole('heading', { name: 'Deploy' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('forces structured (no shell padding) layout unconditionally', () => {
    const { container } = render(<StructuredCard title="Deploy">Body</StructuredCard>)

    expect(container.firstChild).toHaveClass('p-0')
  })

  it('applies contentClassName to CardContent', () => {
    render(
      <StructuredCard title="Deploy" contentClassName="custom-class">
        <span data-testid="body">Body</span>
      </StructuredCard>,
    )

    expect(screen.getByTestId('body').parentElement).toHaveClass('custom-class')
  })
})
