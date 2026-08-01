import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './Sidebar'

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

function BasicSidebar() {
  return (
    <SidebarProvider>
      <Sidebar mobileTitle="Navigation menu">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Servers</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Emma</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Miriam</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    mockMobile(false)
  })

  it('renders expanded by default on desktop with a visible aside', () => {
    render(<BasicSidebar />)
    const aside = document.querySelector('aside')
    expect(aside).toBeInTheDocument()
    expect(aside).toHaveAttribute('data-state', 'expanded')
    expect(screen.getByText('Emma')).toBeVisible()
  })

  it('marks the active item with aria-current', () => {
    render(<BasicSidebar />)
    expect(screen.getByRole('button', { name: 'Emma' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Miriam' })).not.toHaveAttribute('aria-current')
  })

  it('SidebarTrigger toggles collapsed state on desktop', async () => {
    const user = userEvent.setup()
    render(<BasicSidebar />)

    const aside = document.querySelector('aside') as HTMLElement
    expect(aside).toHaveAttribute('data-state', 'expanded')

    await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
    expect(aside).toHaveAttribute('data-state', 'collapsed')
  })

  it('Cmd/Ctrl+B toggles the sidebar', async () => {
    const user = userEvent.setup()
    render(<BasicSidebar />)

    const aside = document.querySelector('aside') as HTMLElement
    expect(aside).toHaveAttribute('data-state', 'expanded')

    await user.keyboard('{Control>}b{/Control}')
    expect(aside).toHaveAttribute('data-state', 'collapsed')
  })

  it('renders asChild content via Slot', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/overview">Overview</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )

    const link = screen.getByRole('link', { name: 'Overview' })
    expect(link).toHaveAttribute('href', '/overview')
  })

  describe('on mobile', () => {
    beforeEach(() => {
      mockMobile(true)
    })

    it('renders the sidebar as a closed Sheet until the trigger opens it', async () => {
      const user = userEvent.setup()
      render(<BasicSidebar />)

      expect(document.querySelector('aside')).not.toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
      const dialog = screen.getByRole('dialog', { name: 'Navigation menu' })
      expect(within(dialog).getByText('Emma')).toBeInTheDocument()
    })

    it('closes on Escape', async () => {
      const user = userEvent.setup()
      render(<BasicSidebar />)

      await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      await user.keyboard('{Escape}')
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('collapsible="icon"', () => {
    it('hides the label visually (sr-only) and shows a tooltip when collapsed', async () => {
      render(
        <SidebarProvider defaultOpen={false}>
          <Sidebar collapsible="icon">
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Overview">Overview</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      )

      const label = screen.getByText('Overview')
      expect(label).toHaveClass('sr-only')

      const trigger = screen.getByRole('button', { name: 'Overview' })
      trigger.focus()
      expect(await screen.findByRole('tooltip', { name: 'Overview' })).toBeInTheDocument()
    })
  })
})
