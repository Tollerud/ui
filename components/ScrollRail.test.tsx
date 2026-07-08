import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ScrollRail } from './ScrollRail'

describe('ScrollRail', () => {
  it('renders a labelled scroll region without touch-pan-x', () => {
    render(
      <ScrollRail ariaLabel="Featured beers" peek="md">
        <div style={{ width: 280 }}>Card 1</div>
        <div style={{ width: 280 }}>Card 2</div>
      </ScrollRail>
    )

    const region = screen.getByRole('region', { name: 'Featured beers' })
    expect(region).toBeInTheDocument()
    expect(region).not.toHaveClass('touch-pan-x')
    expect(region).toHaveClass('tollerud-scroll-rail', 'overflow-x-auto', 'overscroll-x-contain', '@container')
  })

  it('hides controls by default', () => {
    render(
      <ScrollRail>
        <div style={{ width: 320 }}>Wide item</div>
      </ScrollRail>
    )

    expect(screen.queryByRole('button', { name: 'Scroll left' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Scroll right' })).not.toBeInTheDocument()
  })

  it('shows controls when controls is true', () => {
    render(
      <ScrollRail controls>
        <div style={{ width: 320 }}>Wide item</div>
      </ScrollRail>
    )

    expect(screen.getByRole('button', { name: 'Scroll left' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Scroll right' })).toBeInTheDocument()
  })

  it('scrolls horizontally when the right control is clicked', async () => {
    const user = userEvent.setup()
    const scrollBy = vi.fn()
    if (!HTMLElement.prototype.scrollBy) {
      HTMLElement.prototype.scrollBy = () => {}
    }
    vi.spyOn(HTMLElement.prototype, 'scrollBy').mockImplementation(scrollBy)

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        return 200
      },
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        return 800
      },
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      writable: true,
      value: 0,
    })

    render(
      <ScrollRail controls>
        <div style={{ width: 320 }}>One</div>
        <div style={{ width: 320 }}>Two</div>
      </ScrollRail>
    )

    await user.click(screen.getByRole('button', { name: 'Scroll right' }))
    expect(scrollBy).toHaveBeenCalledWith({ left: 160, behavior: 'smooth' })

    vi.restoreAllMocks()
  })

  it('applies uniform item width wrappers', () => {
    const { container } = render(
      <ScrollRail itemWidth={280}>
        <div>Card</div>
      </ScrollRail>
    )

    const item = container.querySelector('[style*="flex-basis: 280px"]')
    expect(item).toBeTruthy()
  })

  it('sets scrollport CSS variables for gap and peek', () => {
    render(
      <ScrollRail gap="md" peek="md" ariaLabel="Vars">
        <div>One</div>
      </ScrollRail>
    )

    const region = screen.getByRole('region', { name: 'Vars' })
    expect(region).toHaveStyle({ '--scroll-rail-gap': '1rem' })
    expect(region).toHaveStyle({ '--scroll-rail-peek': '1.5rem' })
  })

  it('uses visibleCount column math on item wrappers', () => {
    const { container } = render(
      <ScrollRail visibleCount={4} gap="md" ariaLabel="Trophies">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i}>Trophy {i + 1}</div>
        ))}
      </ScrollRail>
    )

    const region = screen.getByRole('region', { name: 'Trophies' })
    expect(region).toHaveStyle({ '--scroll-rail-columns': '4' })
    expect(region).toHaveStyle({ '--scroll-rail-peek-inset': '1.5rem' })

    const item = container.querySelector('[style*="100cqw"]')
    expect(item).toBeTruthy()

    const track = container.querySelector('.tollerud-scroll-rail-track')
    expect(track).toHaveClass('w-max')
    expect(track).toHaveClass('pe-[var(--scroll-rail-peek-inset)]')
  })

  it('fills the row evenly when child count is below visibleCount', () => {
    const { container } = render(
      <ScrollRail visibleCount={4} gap="md" ariaLabel="Few trophies">
        <div>One</div>
        <div>Two</div>
      </ScrollRail>
    )

    const region = screen.getByRole('region', { name: 'Few trophies' })
    expect(region).toHaveStyle({ '--scroll-rail-columns': '2' })
    expect(region).toHaveStyle({ '--scroll-rail-peek-inset': '0px' })

    const track = container.querySelector('.tollerud-scroll-rail-track')
    expect(track).toHaveClass('w-full')
    expect(track).not.toHaveClass('pe-[var(--scroll-rail-peek-inset)]')
  })

  it('wraps items in a flex column shell so h-full on children works', () => {
    const { container } = render(
      <ScrollRail visibleCount={4} ariaLabel="Shell">
        <div data-testid="card">Card</div>
      </ScrollRail>
    )

    const shell = container.querySelector('[data-testid="card"]')?.parentElement
    expect(shell).toHaveClass('flex', 'h-full', 'flex-col', 'shrink-0')
  })
})
