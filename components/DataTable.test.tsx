import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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

  it('supports header alias and row-only render callbacks', () => {
    render(
      <DataTable
        columns={[
          { key: 'hostname', header: 'Host', render: (row) => <strong>{row.hostname}</strong> },
        ]}
        data={[{ id: '1', hostname: 'emma' }]}
        rowKey="id"
      />
    )

    expect(screen.getByRole('columnheader', { name: /host/i })).toBeInTheDocument()
    expect(screen.getByText('emma')).toBeInTheDocument()
  })

  it('uses opaque backgrounds on pinned columns', () => {
    const { container } = render(
      <DataTable
        columns={[
          { key: 'hostname', label: 'Host' },
          { key: 'status', label: 'Status' },
        ]}
        data={[{ id: '1', hostname: 'emma', status: 'online' }]}
        rowKey="id"
        pageSize={10}
        pinColumns
      />
    )

    const pinnedCell = container.querySelector('tbody td.sticky')
    expect(pinnedCell).toBeTruthy()
    expect(pinnedCell).toHaveClass('bg-tollerud-noir-900')
    expect(pinnedCell).toHaveClass('group-hover/tr:bg-tollerud-noir-800')
    expect(pinnedCell).not.toHaveClass('group-hover/tr:bg-tollerud-surface-raised/50')
  })

  it('shows striped rows and scroll region in rich mode', () => {
    render(
      <DataTable
        columns={[{ key: 'hostname', label: 'Host' }]}
        data={[
          { id: '1', hostname: 'emma' },
          { id: '2', hostname: 'pia' },
          { id: '3', hostname: 'iris' },
        ]}
        rowKey="id"
        pageSize={2}
        striped
        pinColumns
      />
    )

    expect(screen.getByText(/showing 1–2 of 3/i)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Scrollable table' })).toBeInTheDocument()
    const bodyRows = screen.getAllByRole('row').slice(1)
    expect(bodyRows[0]).toHaveClass('bg-tollerud-noir-950/40')
  })

  it('exposes aria-sort on sorted column headers', async () => {
    const user = userEvent.setup()

    render(
      <DataTable
        columns={[
          { key: 'hostname', label: 'Host', sortable: true },
          { key: 'region', label: 'Region' },
        ]}
        data={[{ id: '1', hostname: 'emma', region: 'eu' }]}
        rowKey="id"
        searchable
      />
    )

    const hostHeader = screen.getByRole('columnheader', { name: /host/i })
    expect(hostHeader).toHaveAttribute('aria-sort', 'none')

    await user.click(hostHeader)
    expect(hostHeader).toHaveAttribute('aria-sort', 'ascending')
  })

  it('lets users change rows per page with pageSizeOptions', async () => {
    const user = userEvent.setup()

    render(
      <DataTable
        columns={[{ key: 'hostname', label: 'Host' }]}
        data={Array.from({ length: 12 }, (_, i) => ({
          id: String(i + 1),
          hostname: `host-${i + 1}`,
        }))}
        rowKey="id"
        pageSize={5}
        pageSizeOptions={[5, 10]}
      />
    )

    expect(screen.getByText('host-5')).toBeInTheDocument()
    expect(screen.queryByText('host-6')).not.toBeInTheDocument()
    expect(screen.getByText('Rows')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Rows: 5' }))
    await user.click(screen.getByRole('option', { name: '10' }))

    expect(screen.getByText('host-10')).toBeInTheDocument()
    expect(screen.queryByText('host-11')).not.toBeInTheDocument()
  })

  it('does not pad partial pages with empty spacer rows', () => {
    render(
      <DataTable
        columns={[{ key: 'name', label: 'Name' }]}
        data={Array.from({ length: 11 }, (_, i) => ({ id: String(i + 1), name: `item-${i + 1}` }))}
        rowKey="id"
        pageSize={25}
      />
    )

    expect(screen.getByText(/showing 1–11 of 11/i)).toBeInTheDocument()
    const table = screen.getByRole('table')
    expect(table.querySelectorAll('tbody tr')).toHaveLength(11)
    expect(table.querySelectorAll('tr[aria-hidden]')).toHaveLength(0)
  })

  it('stretches the table to the container width', () => {
    render(
      <DataTable
        columns={[
          { key: 'hostname', label: 'Host' },
          { key: 'status', label: 'Status' },
        ]}
        data={[{ id: '1', hostname: 'emma', status: 'online' }]}
        rowKey="id"
        searchable
        pageSize={10}
      />
    )

    expect(screen.getByRole('table')).toHaveClass('w-full')
  })

  it('wraps multiple bulk actions in ButtonGroup', async () => {
    const user = userEvent.setup()

    render(
      <DataTable
        columns={[{ key: 'hostname', label: 'Host' }]}
        data={[{ id: '1', hostname: 'emma' }]}
        rowKey="id"
        selectable
        bulkActions={[
          { label: 'Restart', onRun: vi.fn() },
          { label: 'Stop', variant: 'destructive', onRun: vi.fn() },
        ]}
      />
    )

    await user.click(screen.getByRole('checkbox', { name: /select row 1/i }))

    const group = screen.getByRole('group')
    expect(within(group).getByRole('button', { name: 'Restart' })).toBeInTheDocument()
    expect(within(group).getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('filters rows with combobox variant filter', async () => {
    const user = userEvent.setup()

    render(
      <DataTable
        columns={[
          { key: 'hostname', label: 'Host' },
          { key: 'region', label: 'Region' },
        ]}
        data={[
          { id: '1', hostname: 'emma', region: 'eu-north' },
          { id: '2', hostname: 'pia', region: 'us-east' },
        ]}
        rowKey="id"
        filter={{ key: 'region', allLabel: 'All regions', variant: 'combobox', placeholder: 'Region…' }}
      />
    )

    const trigger = screen.getByRole('combobox')
    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: 'eu-north' }))

    expect(screen.getByText('emma')).toBeInTheDocument()
    expect(screen.queryByText('pia')).not.toBeInTheDocument()
  })

  it('supports search, selection, and pagination in rich mode', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()

    render(
      <DataTable
        columns={[
          { key: 'hostname', label: 'Host', sortable: true },
          { key: 'region', label: 'Region' },
        ]}
        data={[
          { id: '1', hostname: 'emma', region: 'eu' },
          { id: '2', hostname: 'pia', region: 'us' },
          { id: '3', hostname: 'iris', region: 'eu' },
        ]}
        rowKey="id"
        searchable
        searchKeys={['hostname']}
        selectable
        pageSize={2}
        bulkActions={[{ label: 'Restart', onRun }]}
      />
    )

    await user.type(screen.getByPlaceholderText('Search…'), 'emma')
    expect(screen.getByText('emma')).toBeInTheDocument()
    expect(screen.queryByText('pia')).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /select row 1/i }))
    expect(screen.getByText('selected')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Restart' }))
    expect(onRun).toHaveBeenCalledWith(['1'], expect.any(Function))
  })
})
