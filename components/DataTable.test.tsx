import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DataTable } from './DataTable'

const rows = [
  { id: '1', hostname: 'emma', status: 'online' },
  { id: '2', hostname: 'miriam', status: 'offline' },
]

describe('DataTable', () => {
  it('renders rows and supports column sort', async () => {
    const user = userEvent.setup()

    render(
      <DataTable
        columns={[
          { key: 'hostname', label: 'Host', sortable: true },
          { key: 'status', label: 'Status' },
        ]}
        data={rows}
        rowKey="id"
      />
    )

    expect(screen.getByText('emma')).toBeInTheDocument()
    expect(screen.getByText('miriam')).toBeInTheDocument()

    await user.click(screen.getByRole('columnheader', { name: /host/i }))

    const bodyRows = screen.getAllByRole('row').slice(1)
    expect(bodyRows[0]).toHaveTextContent('emma')
  })

  it('shows empty message when data is empty', () => {
    render(
      <DataTable
        columns={[{ key: 'hostname', label: 'Host' }]}
        data={[]}
        rowKey="id"
        emptyMessage="No hosts found"
      />
    )

    expect(screen.getByText('No hosts found')).toBeInTheDocument()
  })
})
