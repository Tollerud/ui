import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { TopNav } from './TopNav'

describe('TopNav', () => {
  it('renders the monogram lockup and desktop nav links', () => {
    render(
      <TopNav
        projectName="Mission Control"
        navItems={[
          { label: 'Overview', href: '/overview', active: true },
          { label: 'Hosts', href: '/hosts' },
        ]}
      />
    )

    expect(screen.getByText('Mission Control')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Hosts' })).toBeInTheDocument()
  })

  it('applies maxWidth classes when set', () => {
    const { container } = render(
      <TopNav projectName="Mission Control" maxWidth="default" navItems={[{ label: 'Overview', href: '/' }]} />
    )

    const inner = container.querySelector('.max-w-\\[1100px\\]')
    expect(inner).toBeInTheDocument()
  })

  it('toggles the mobile menu and closes on link select', async () => {
    const user = userEvent.setup()

    render(
      <TopNav
        projectName="Mission Control"
        navItems={[
          { label: 'Overview', href: '/overview' },
          { label: 'Hosts', href: '/hosts' },
        ]}
        actions={<Button size="sm" variant="primary">Deploy</Button>}
      />
    )

    const menuButton = screen.getByRole('button', { name: 'Open menu' })
    await user.click(menuButton)

    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('link', { name: 'Hosts' }).length).toBeGreaterThan(1)

    await user.click(screen.getAllByRole('link', { name: 'Hosts' })[1])
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  })
})
