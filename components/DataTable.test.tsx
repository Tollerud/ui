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

    await user.click(screen.getByRole('button', { name: /host/i }))

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

  it('supports header alias and (value, row) render callbacks', () => {
    render(
      <DataTable
        columns={[
          { key: 'hostname', header: 'Host', render: (_value, row) => <strong>{row.hostname}</strong> },
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
    const scrollCell = container.querySelector('tbody td:not(.sticky)')
    expect(pinnedCell).toBeTruthy()
    expect(scrollCell).toBeTruthy()
    expect(pinnedCell).toHaveClass('bg-tollerud-noir-900')
    expect(scrollCell).toHaveClass('bg-tollerud-noir-900')
    expect(pinnedCell).toHaveClass('group-hover/tr:bg-tollerud-noir-800')
    expect(scrollCell).toHaveClass('group-hover/tr:bg-tollerud-noir-800')
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
    expect(bodyRows[0].querySelector('td')).toHaveClass('bg-tollerud-noir-950')
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

    const sortButton = within(hostHeader).getByRole('button')
    await user.click(sortButton)
    expect(hostHeader).toHaveAttribute('aria-sort', 'ascending')

    // Keyboard users can sort too — the header control is a real button
    sortButton.focus()
    await user.keyboard('{Enter}')
    expect(hostHeader).toHaveAttribute('aria-sort', 'descending')
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

    await user.click(screen.getByRole('combobox', { name: 'Rows: 5' }))
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

  it('shows indeterminate select-all state with partial page selection', async () => {
    const user = userEvent.setup()

    render(
      <DataTable
        columns={[{ key: 'hostname', label: 'Host' }]}
        data={[
          { id: '1', hostname: 'emma' },
          { id: '2', hostname: 'pia' },
        ]}
        rowKey="id"
        selectable
      />
    )

    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows on page' }) as HTMLInputElement
    expect(selectAll.indeterminate).toBe(false)

    await user.click(screen.getByRole('checkbox', { name: /select row 1/i }))
    expect(selectAll.indeterminate).toBe(true)
    expect(selectAll.checked).toBe(false)

    await user.click(screen.getByRole('checkbox', { name: /select row 2/i }))
    expect(selectAll.indeterminate).toBe(false)
    expect(selectAll.checked).toBe(true)
  })

  it('combines sort, search, filter, pagination, and selection in rich mode', async () => {
    const user = userEvent.setup()

    render(
      <DataTable
        columns={[
          { key: 'hostname', label: 'Host', sortable: true },
          { key: 'region', label: 'Region' },
        ]}
        data={[
          { id: '1', hostname: 'delta', region: 'eu' },
          { id: '2', hostname: 'alpha', region: 'eu' },
          { id: '3', hostname: 'charlie', region: 'us' },
          { id: '4', hostname: 'bravo', region: 'eu' },
        ]}
        rowKey="id"
        searchable
        searchKeys={['hostname']}
        filter={{ key: 'region', allLabel: 'All' }}
        selectable
        pageSize={2}
      />
    )

    // Filter to eu → 3 rows, 2 pages (Segmented renders a radiogroup)
    await user.click(screen.getByRole('radio', { name: 'eu' }))
    expect(screen.getByText(/showing 1–2 of 3/i)).toBeInTheDocument()
    expect(screen.queryByText('charlie')).not.toBeInTheDocument()

    // Sort by host → alpha, bravo on page 1
    await user.click(within(screen.getByRole('columnheader', { name: /host/i })).getByRole('button'))
    let bodyRows = screen.getAllByRole('row').slice(1)
    expect(bodyRows[0]).toHaveTextContent('alpha')
    expect(bodyRows[1]).toHaveTextContent('bravo')

    // Select all on page, then go to page 2 — selection persists, header reflects page 2
    await user.click(screen.getByRole('checkbox', { name: 'Select all rows on page' }))
    expect(screen.getByText('selected')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /next page|next/i }))
    bodyRows = screen.getAllByRole('row').slice(1)
    expect(bodyRows[0]).toHaveTextContent('delta')
    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows on page' }) as HTMLInputElement
    expect(selectAll.checked).toBe(false)

    // Search narrows within the active filter
    await user.type(screen.getByPlaceholderText('Search…'), 'alp')
    expect(screen.getByText('alpha')).toBeInTheDocument()
    expect(screen.queryByText('delta')).not.toBeInTheDocument()
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

  it('keeps filter and toolbarRight on the same toolbar row below search on mobile', () => {
    const { container } = render(
      <DataTable
        columns={[{ key: 'hostname', label: 'Host' }]}
        data={[{ id: '1', hostname: 'emma' }]}
        rowKey="id"
        searchable
        filter={{ key: 'hostname', allLabel: 'All' }}
        toolbarRight={<button type="button">Add host</button>}
      />
    )

    const toolbar = container.querySelector('.border-b.border-tollerud-border\\/30.px-4.py-3\\.5')
    expect(toolbar).toBeTruthy()
    expect(toolbar).toHaveClass('flex-col')
    expect(toolbar?.children).toHaveLength(2)
    const actionRow = toolbar?.children[1] as HTMLElement
    expect(actionRow).toHaveTextContent('Add host')
    expect(within(actionRow).getByRole('button', { name: 'Add host' })).toBeInTheDocument()
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
