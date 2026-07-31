import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from './Sidebar'

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

describe('DropdownMenu', () => {
  beforeEach(() => {
    mockMobile(false)
  })

  it('opens and selects an item', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Restart</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('menuitem', { name: 'Restart' })).toBeInTheDocument()

    await user.click(screen.getByRole('menuitem', { name: 'Restart' }))
    expect(onSelect).toHaveBeenCalled()
  })

  // Regression: DropdownMenu's portal renders as a document-body sibling
  // outside a Dialog's own content subtree, so react-remove-scroll's
  // document-level scroll lock can swallow wheel/touch events meant for the
  // dropdown's own content. useBypassModalScrollLock guards against this —
  // this nests a DropdownMenu inside Sidebar's mobile Sheet (a new call site
  // introduced by the Sidebar primitive) to confirm the guard still holds.
  it('dropdown content does not leak wheel events to document when nested inside an open Sidebar mobile Sheet', async () => {
    mockMobile(true)
    const user = userEvent.setup()
    const documentWheelHandler = vi.fn()
    document.addEventListener('wheel', documentWheelHandler)

    render(
      <SidebarProvider>
        <Sidebar mobileTitle="Navigation menu">
          <SidebarContent>
            <DropdownMenu>
              <DropdownMenuTrigger>Account menu</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
    expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Account menu' }))
    const item = screen.getByRole('menuitem', { name: 'Sign out' })

    item.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true }))

    expect(documentWheelHandler).not.toHaveBeenCalled()
    document.removeEventListener('wheel', documentWheelHandler)
  })
})
