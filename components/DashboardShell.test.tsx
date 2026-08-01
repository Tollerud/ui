import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DashboardShell } from './DashboardShell'

function mockMobile(matches: boolean) {
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: query === '(max-width: 767px)' ? matches : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as MediaQueryList
  )
}

const sidebarItems = [
  { id: 'overview', label: 'Overview', href: '/overview', active: true },
  { id: 'services', label: 'Services', href: '/services' },
]

describe('DashboardShell', () => {
  beforeEach(() => {
    mockMobile(false)
  })

  it('renders the sidebar with grouped items on desktop', () => {
    render(
      <DashboardShell projectName="Mission Control" sidebarItems={sidebarItems}>
        content
      </DashboardShell>
    )

    expect(document.querySelector('aside')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument()
  })

  describe('on mobile', () => {
    beforeEach(() => {
      mockMobile(true)
    })

    it('opens the mobile nav via the trigger and closes on Escape', async () => {
      const user = userEvent.setup()
      render(
        <DashboardShell projectName="Mission Control" sidebarItems={sidebarItems}>
          content
        </DashboardShell>
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
      const dialog = screen.getByRole('dialog', { name: 'Navigation menu' })
      expect(dialog).toBeInTheDocument()

      await user.keyboard('{Escape}')
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('closes the mobile nav when a sidebar item is selected', async () => {
      const user = userEvent.setup()
      render(
        <DashboardShell projectName="Mission Control" sidebarItems={sidebarItems}>
          content
        </DashboardShell>
      )

      await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      await user.click(screen.getByRole('link', { name: 'Services' }))
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })
})
