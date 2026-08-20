import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Radio, RadioGroup } from './RadioGroup'

describe('RadioGroup', () => {
  it('renders options and reports the selected value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <RadioGroup label="Restart policy" value="always" onChange={onChange}>
        <Radio value="always" label="Always" />
        <Radio value="on-failure" label="On failure" />
        <Radio value="never" label="Never" />
      </RadioGroup>
    )

    expect(screen.getByRole('radio', { name: 'Always' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'On failure' })).toHaveAttribute('aria-checked', 'false')

    await user.click(screen.getByRole('radio', { name: 'On failure' }))

    expect(onChange).toHaveBeenCalledWith('on-failure')
  })

  it('groups radios under one accessible legend', () => {
    render(
      <RadioGroup label="Restart policy">
        <Radio value="always" label="Always" />
        <Radio value="never" label="Never" />
      </RadioGroup>
    )

    expect(screen.getByRole('group', { name: 'Restart policy' })).toBeInTheDocument()
  })

  it('shows an error message wired via aria-describedby', () => {
    render(
      <RadioGroup label="Restart policy" error="Pick a policy">
        <Radio value="always" label="Always" />
      </RadioGroup>
    )

    const group = screen.getByRole('group', { name: 'Restart policy' })
    expect(group).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Pick a policy')).toBeInTheDocument()
  })
})
