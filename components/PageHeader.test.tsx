import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageHeader, PageHeaderShimmer } from './PageHeader'

describe('PageHeader', () => {
  it('renders eyebrow, title, description, and actions', () => {
    render(
      <PageHeader
        eyebrow="Mission control"
        title="Hosts"
        description="Monitor machines from one view."
        actions={<button type="button">Connect</button>}
      />
    )

    expect(screen.getByText('Mission control')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Hosts' })).toBeInTheDocument()
    expect(screen.getByText('Monitor machines from one view.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Connect' })).toBeInTheDocument()
  })

  it('shimmers a mid-sentence word', () => {
    render(<PageHeader title="Keep beer prices honest." shimmer="honest" />)

    const heading = screen.getByRole('heading', { name: /keep beer prices honest/i })
    expect(heading.querySelector('.tollerud-display-shimmer')).toHaveTextContent('honest')
    expect(heading).toHaveTextContent('Keep beer prices honest.')
  })

  it('shimmers a word before an em dash in a long title', () => {
    render(
      <PageHeader
        title="What does beer really cost — store by store."
        shimmer="really"
      />
    )

    const heading = screen.getByRole('heading', { name: /what does beer really cost/i })
    expect(heading.querySelector('.tollerud-display-shimmer')).toHaveTextContent('really')
    expect(heading).toHaveTextContent('What does beer really cost — store by store.')
  })

  it('wraps a selective word with titleAccent', () => {
    render(<PageHeader title="Hosts online" titleAccent="online" />)

    const heading = screen.getByRole('heading', { name: /hosts online/i })
    const shimmer = heading.querySelector('.tollerud-display-shimmer')
    expect(shimmer).toHaveTextContent('online')
    expect(heading).toHaveTextContent('Hosts online')
  })

  it('renders a second shimmer title line with titleShimmer', () => {
    render(
      <PageHeader
        title="Dark. Monochrome."
        titleShimmer="Yellow where it counts."
      />
    )

    const heading = screen.getByRole('heading', { name: /dark\. monochrome\./i })
    expect(heading).toHaveTextContent('Dark. Monochrome.')
    expect(heading).toHaveTextContent('Yellow where it counts.')
    expect(heading.querySelectorAll('.tollerud-display-shimmer')).toHaveLength(1)
    expect(heading.querySelector('.tollerud-display--secondary')).toHaveTextContent(
      'Yellow where it counts.'
    )
  })

  it('supports manual shimmer spans in title ReactNode', () => {
    render(
      <PageHeader
        title={
          <>
            Fleet <PageHeaderShimmer>status</PageHeaderShimmer>
          </>
        }
      />
    )

    const heading = screen.getByRole('heading', { name: /fleet status/i })
    expect(heading.querySelector('.tollerud-display-shimmer')).toHaveTextContent('status')
  })
})
