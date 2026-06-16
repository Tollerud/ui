import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Segmented } from './Segmented'

const OPTIONS = [
  { value: 'kr-l', label: 'kr/l' },
  { value: 'kr-stk', label: 'kr/stk' },
  { value: 'name', label: 'Navn' },
]

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
      }) as MediaQueryList,
  )
}

describe('Segmented', () => {
  beforeEach(() => {
    mockMobile(false)
  })

  it('renders all options on desktop when collapseMobile is set', () => {
    render(
      <Segmented
        value="kr-stk"
        onChange={() => {}}
        options={OPTIONS}
        collapseMobile
      />,
    )

    expect(screen.getByRole('radio', { name: 'kr/l' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'kr/stk' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Navn' })).toBeInTheDocument()
  })

  it('collapses to the selected option on mobile and opens a dropdown on tap', async () => {
    mockMobile(true)
    const user = userEvent.setup()
    const onChange = vi.fn()

    function Harness() {
      const [sort, setSort] = useState('kr-stk')
      return (
        <Segmented
          value={sort}
          onChange={(next) => {
            setSort(next)
            onChange(next)
          }}
          options={OPTIONS}
          collapseMobile
        />
      )
    }

    render(<Harness />)

    expect(screen.queryByRole('radio', { name: 'kr/l' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'kr/stk, show options' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'kr/stk, show options' }))

    expect(screen.getByRole('option', { name: 'kr/l' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Navn' })).toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Navn' }))

    expect(onChange).toHaveBeenCalledWith('name')
    expect(screen.queryByRole('radio', { name: 'kr/l' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Navn, show options' })).toBeInTheDocument()
  })
})
