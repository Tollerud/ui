import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthSplitLayout } from './AuthSplitLayout'

describe('AuthSplitLayout', () => {
  it('renders project name, header, description, and children', () => {
    render(
      <AuthSplitLayout
        projectName="Butikkpils"
        title="Track"
        highlight="every price."
        description="Crowdsourced beer prices."
      >
        <form aria-label="Sign in">form</form>
      </AuthSplitLayout>,
    )

    expect(screen.getAllByText('Butikkpils').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: /Track every price\./ })).toBeInTheDocument()
    expect(screen.getByText('Crowdsourced beer prices.')).toBeInTheDocument()
    expect(screen.getByLabelText('Sign in')).toBeInTheDocument()
  })

  it('renders the decoration slot when provided', () => {
    render(
      <AuthSplitLayout projectName="X" title="A" highlight="B" description="C" decoration={<div data-testid="deco" />}>
        children
      </AuthSplitLayout>,
    )

    expect(screen.getByTestId('deco')).toBeInTheDocument()
  })

  it('omits the decoration slot by default', () => {
    render(
      <AuthSplitLayout projectName="X" title="A" highlight="B" description="C">
        children
      </AuthSplitLayout>,
    )

    expect(screen.queryByTestId('deco')).not.toBeInTheDocument()
  })
})
