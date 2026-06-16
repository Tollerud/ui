import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { TopNav, TopNavAction } from './TopNav'

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

  it('opens an overlay mobile menu with backdrop and closes on link select', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <TopNav
        projectName="Mission Control"
        navItems={[
          { label: 'Overview', href: '/overview' },
          { label: 'Hosts', href: '/hosts' },
        ]}
        actions={<Button size="sm" variant="primary">Deploy</Button>}
      />
    )

    const mobileBar = container.querySelector('.ml-auto.flex.items-center.gap-2.lg\\:hidden')
    expect(mobileBar).toBeTruthy()
    expect(within(mobileBar as HTMLElement).queryByRole('button', { name: 'Deploy' })).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const menuButton = screen.getByRole('button', { name: 'Toggle navigation menu' })
    await user.click(menuButton)

    const menu = screen.getByRole('dialog', { name: 'Navigation menu' })
    expect(menu).toBeInTheDocument()
    expect(document.querySelector('.tollerud-topnav-menu-overlay')).toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(within(menu).getByRole('link', { name: 'Hosts' })).toBeInTheDocument()
    expect(within(menu).getByRole('button', { name: 'Deploy' })).toBeInTheDocument()

    await user.click(within(menu).getByRole('link', { name: 'Hosts' }))
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the mobile menu on Escape', async () => {
    const user = userEvent.setup()

    render(
      <TopNav
        projectName="Mission Control"
        navItems={[{ label: 'Overview', href: '/overview' }]}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Toggle navigation menu' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps TopNavAction mobile="inline" in the header bar on mobile', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <TopNav
        projectName="Mission Control"
        navItems={[{ label: 'Overview', href: '/overview' }]}
        actions={
          <>
            <TopNavAction mobile="inline">
              <Button size="sm" variant="primary">Deploy</Button>
            </TopNavAction>
            <TopNavAction mobile="menu">
              <Button size="sm" variant="secondary">Sign in</Button>
            </TopNavAction>
          </>
        }
      />
    )

    const mobileBar = container.querySelector('.ml-auto.flex.items-center.gap-2.lg\\:hidden') as HTMLElement
    expect(within(mobileBar).getByRole('button', { name: 'Deploy' })).toBeInTheDocument()
    expect(within(mobileBar).queryByRole('button', { name: 'Sign in' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Toggle navigation menu' }))
    const menu = screen.getByRole('dialog', { name: 'Navigation menu' })
    expect(within(menu).getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    expect(within(menu).queryByRole('button', { name: 'Deploy' })).not.toBeInTheDocument()
  })

  it('hides TopNavAction mobile="hidden" on mobile but shows on desktop', () => {
    const { container } = render(
      <TopNav
        projectName="Mission Control"
        actions={
          <TopNavAction mobile="hidden">
            <Button size="sm" variant="ghost">Docs</Button>
          </TopNavAction>
        }
      />
    )

    const mobileBar = container.querySelector('.ml-auto.flex.items-center.gap-2.lg\\:hidden')
    expect(mobileBar).toBeNull()
    expect(screen.getByRole('button', { name: 'Docs', hidden: true })).toBeInTheDocument()
  })
})
