import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageShell } from './PageShell'
import { DashboardShell } from './DashboardShell'
import { TopNav } from './TopNav'

describe('PageShell', () => {
  // Regression: overflow-hidden made the shell root a scroll container, which
  // silently broke position:sticky for every descendant (sidebar, TopNav,
  // consumer sticky elements). overflow-clip contains the decorative layers
  // without creating a scroll container.
  it.each(['plain', 'grid', 'glow'] as const)(
    'uses overflow-clip (not overflow-hidden) so sticky descendants work — background=%s',
    (background) => {
      const { container } = render(<PageShell background={background}>content</PageShell>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('overflow-clip')
      expect(root.className).not.toContain('overflow-hidden')
    }
  )

  it('renders sticky TopNav inside the shell without an overflow-hidden ancestor', () => {
    render(
      <PageShell>
        <TopNav projectName="Butikkpils" sticky navItems={[{ label: 'Home', href: '/' }]} />
      </PageShell>
    )
    const nav = screen.getByRole('navigation')
    let el: HTMLElement | null = nav
    while (el) {
      expect(el.className || '').not.toContain('overflow-hidden')
      el = el.parentElement
    }
  })
})

describe('DashboardShell sidebar', () => {
  // Regression: the sidebar must not be stretched by the flex row's default
  // align-items:stretch, or it loses its scroll travel room and can't stick.
  // The Sidebar primitive avoids this with an absolute height (not a
  // parent-relative h-full), so it sticks unconditionally rather than
  // needing a self-start opt-out on the wrapper. It's driven by a CSS custom
  // property (--sidebar-height, default 100dvh) rather than a bare h-screen
  // so an embedding context (e.g. a bounded docs demo box) can override it
  // without a new prop — see the DashboardShell demo in docs-app's
  // page-screens.jsx for a real usage of that override.
  it('sidebar has an absolute, overridable height so it sticks without being stretched', () => {
    const { container } = render(
      <DashboardShell
        projectName="Butikkpils"
        sidebarItems={[{ id: 'home', label: 'Home', href: '/' }]}
      >
        content
      </DashboardShell>
    )
    const wrapper = container.querySelector('aside') as HTMLElement
    expect(wrapper).toBeTruthy()
    expect(wrapper.className).toContain('sticky')
    expect(wrapper.className).toContain('top-0')
    expect(wrapper.className).toContain('h-[var(--sidebar-height,100dvh)]')
  })
})
