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
  it('sidebar wrapper opts out of flex stretch so it can stick (lg:self-start)', () => {
    const { container } = render(
      <DashboardShell
        projectName="Butikkpils"
        sidebarItems={[{ id: 'home', label: 'Home', href: '/' }]}
      >
        content
      </DashboardShell>
    )
    const wrapper = container.querySelector('.lg\\:sticky') as HTMLElement
    expect(wrapper).toBeTruthy()
    expect(wrapper.className).toContain('lg:self-start')
    expect(wrapper.className).toContain('lg:top-0')
  })
})
