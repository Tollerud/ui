'use client'

import { useState, useMemo, forwardRef, type ReactNode } from 'react'
import { ChevronDown, MoreHorizontal, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from './Badge'
import { Button } from './Button'
import { Checkbox } from './Checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { Pagination } from './Pagination'
import { Segmented } from './Segmented'
import { Skeleton } from './Skeleton'

/* ──────────────────── Sortable & Filterable Data Table ──────────────────── */

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
  render?: (value: unknown, row: T) => ReactNode
}

export interface DataTableFilter {
  key: string
  options?: string[]
  allLabel?: string
}

export interface DataTableBulkAction {
  label: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'terminal'
  icon?: ReactNode
  onRun: (selectedIds: (string | number)[], clearSelection: () => void) => void
}

export interface DataTableRowMenuItem {
  label: string
  onSelect?: () => void
  icon?: ReactNode
  sep?: boolean
  heading?: boolean
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  /** Row data — use `data` or `rows` (alias). */
  data?: T[]
  rows?: T[]
  /** Row key extractor — defaults to `row.id` or `row.key` */
  rowKey?: keyof T | ((row: T) => string | number)
  onRowClick?: (row: T) => void
  className?: string
  emptyMessage?: string
  /** Global search across `searchKeys` (or all column keys). */
  searchable?: boolean
  searchKeys?: (keyof T | string)[]
  searchPlaceholder?: string
  /** Segmented filter on a single column value. */
  filter?: DataTableFilter
  selectable?: boolean
  pageSize?: number
  bulkActions?: DataTableBulkAction[]
  rowMenu?: (row: T) => DataTableRowMenuItem[]
  toolbarRight?: ReactNode
  emptyState?: ReactNode
  loading?: boolean
  skeletonRows?: number
}

interface DataTableInnerProps<T extends Record<string, unknown>> extends DataTableProps<T> {
  forwardedRef?: React.Ref<HTMLDivElement>
}

function DataTableInner<T extends Record<string, unknown>>({
  columns,
  data,
  rows,
  rowKey,
  onRowClick,
  className,
  emptyMessage = 'No data',
  searchable = false,
  searchKeys,
  searchPlaceholder = 'Search…',
  filter,
  selectable = false,
  pageSize,
  bulkActions = [],
  rowMenu,
  toolbarRight,
  emptyState,
  loading = false,
  skeletonRows = 5,
  forwardedRef,
}: DataTableInnerProps<T>) {
  const tableData = useMemo(() => rows ?? data ?? [], [rows, data])

  const isRich =
    searchable ||
    filter ||
    selectable ||
    pageSize !== undefined ||
    !!rowMenu ||
    !!toolbarRight ||
    bulkActions.length > 0 ||
    !!emptyState ||
    loading

  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [query, setQuery] = useState('')
  const [filterValue, setFilterValue] = useState('all')
  const [selected, setSelected] = useState<(string | number)[]>([])
  const [page, setPage] = useState(1)

  const getRowKey = (row: T, i: number): string | number => {
    if (typeof rowKey === 'function') return rowKey(row)
    if (rowKey) return row[rowKey] as string | number
    return (row.id ?? row.key ?? i) as string | number
  }

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev }
      if (value.trim() === '') {
        delete next[key]
      } else {
        next[key] = value
      }
      return next
    })
  }

  const searchKeysResolved = searchKeys ?? columns.map((c) => c.key)
  const filterOptions = filter
    ? (filter.options ?? Array.from(new Set(tableData.map((r) => String(r[filter.key] ?? '')))))
    : []

  const filtered = useMemo(() => {
    let result = tableData

    if (isRich && filter && filterValue !== 'all') {
      result = result.filter((row) => String(row[filter.key] ?? '') === filterValue)
    }

    if (isRich && searchable && query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter((row) =>
        searchKeysResolved.some((key) => String(row[key as keyof T] ?? '').toLowerCase().includes(q))
      )
    }

    if (!isRich) {
      const activeFilters = Object.entries(filters).filter(([, v]) => v.trim() !== '')
      if (activeFilters.length > 0) {
        result = result.filter((row) =>
          activeFilters.every(([key, filterVal]) => {
            const cellValue = String(row[key] ?? '').toLowerCase()
            return cellValue.includes(filterVal.toLowerCase())
          })
        )
      }
    }

    return result
  }, [tableData, filters, isRich, filter, filterValue, searchable, query, searchKeysResolved])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortable) return filtered

    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal ?? '')
      const bStr = String(bVal ?? '')
      const cmp = aStr.localeCompare(bStr, 'nb', { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir, columns])

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  const currentPage = Math.min(page, pageCount)
  const pageRows = pageSize
    ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sorted

  const clearSelection = () => setSelected([])
  const allOnPageSelected =
    pageRows.length > 0 && pageRows.every((row) => selected.includes(getRowKey(row, 0)))

  const toggleAllOnPage = () => {
    const pageIds = pageRows.map((row, i) => getRowKey(row, i))
    if (allOnPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  const toggleRow = (id: string | number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const hasActiveFilters = Object.values(filters).some((v) => v.trim() !== '')
  const filterableColumns = columns.filter((c) => c.filterable)
  const colSpan = columns.length + (selectable ? 1 : 0) + (rowMenu ? 1 : 0)

  const sortIndicator = (key: string) => {
    const active = sortKey === key
    return (
      <ChevronDown
        size={12}
        className={cn(
          'shrink-0 transition-transform duration-150',
          active ? 'text-tollerud-yellow opacity-100' : 'opacity-25',
          active && sortDir === 'desc' && 'rotate-180'
        )}
        aria-hidden
      />
    )
  }

  const headerCell = (col: Column<T>) => (
    <th
      key={col.key}
      className={cn(
        'px-3 py-2.5 text-xs font-semibold text-tollerud-text-muted uppercase tracking-wider',
        col.sortable && 'cursor-pointer select-none hover:text-tollerud-text-primary transition-colors',
        col.align === 'right' && 'text-right',
        col.align === 'center' && 'text-center',
      )}
      style={col.width ? { width: col.width } : undefined}
      onClick={() => col.sortable && toggleSort(col.key)}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1',
          col.align === 'right' && 'justify-end w-full',
          col.align === 'center' && 'justify-center w-full',
        )}
      >
        {col.label}
        {col.sortable && (isRich ? sortIndicator(col.key) : (
          <>
            {sortKey === col.key && (
              <span className="text-tollerud-accent">{sortDir === 'asc' ? '↑' : '↓'}</span>
            )}
            {sortKey !== col.key && <span className="text-tollerud-text-muted/30">↕</span>}
          </>
        ))}
        {!isRich && col.filterable && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('opacity-40', filters[col.key] && 'opacity-100 text-tollerud-yellow')}
            aria-hidden
          >
            <path d="M4 4h16v2.172a2 2 0 0 1-.586 1.414L15 12v7l-6 2v-8.5L4.52 7.53A2 2 0 0 1 4 6.16V4z" />
          </svg>
        )}
      </span>
    </th>
  )

  const tableBody = () => {
    if (loading) {
      return (
        <tbody>
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <tr key={i} className="border-b border-tollerud-border/20">
              {selectable && (
                <td className="px-3 py-2.5 w-10">
                  <Skeleton className="h-4 w-4 rounded" />
                </td>
              )}
              {columns.map((col, j) => (
                <td key={col.key} className={cn('px-3 py-2.5', col.align === 'right' && 'text-right')}>
                  <Skeleton className={cn('h-3', j === 0 ? 'w-[70%]' : 'w-[55%]')} />
                </td>
              ))}
              {rowMenu && (
                <td className="px-3 py-2.5 w-11">
                  <Skeleton className="h-4 w-4 rounded" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      )
    }

    if (sorted.length === 0) {
      if (isRich && emptyState) {
        return null
      }
      return (
        <tbody>
          <tr>
            <td colSpan={colSpan} className="px-3 py-8 text-center text-sm text-tollerud-text-muted">
              {hasActiveFilters || query || filterValue !== 'all' ? 'No matching rows' : emptyMessage}
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <tbody>
        {pageRows.map((row, i) => {
          const id = getRowKey(row, i)
          const isSelected = selected.includes(id)
          return (
            <tr
              key={id}
              className={cn(
                'border-b border-tollerud-border/20 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-tollerud-surface-raised/50',
                isSelected && 'bg-tollerud-yellow/[0.05]',
              )}
              onClick={() => onRowClick?.(row)}
            >
              {selectable && (
                <td className="px-3 py-2.5 w-10" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={isSelected} onChange={() => toggleRow(id)} aria-label={`Select row ${id}`} />
                </td>
              )}
              {columns.map((col) => {
                const value = row[col.key]
                return (
                  <td
                    key={col.key}
                    className={cn(
                      'px-3 py-2.5 text-tollerud-text-secondary',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                      !col.render && 'font-mono text-xs',
                    )}
                  >
                    {col.render ? col.render(value, row) : String(value ?? '—')}
                  </td>
                )
              })}
              {rowMenu && (
                <td className="px-2 py-2 w-11" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-tollerud-text-muted hover:text-tollerud-text-primary hover:bg-tollerud-surface-raised transition-colors tollerud-focus-ring"
                        aria-label="Row actions"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {rowMenu(row).map((item, index) => {
                        if (item.sep) return <DropdownMenuSeparator key={index} />
                        if (item.heading) return <DropdownMenuLabel key={index}>{item.label}</DropdownMenuLabel>
                        return (
                          <DropdownMenuItem key={index} onSelect={() => item.onSelect?.()}>
                            {item.icon ? <span className="mr-2 inline-flex">{item.icon}</span> : null}
                            {item.label}
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              )}
            </tr>
          )
        })}
        {isRich &&
          pageSize &&
          pageRows.length < pageSize &&
          Array.from({ length: pageSize - pageRows.length }).map((_, i) => (
            <tr key={`spacer-${i}`} aria-hidden className="h-[49px]">
              <td colSpan={colSpan} />
            </tr>
          ))}
      </tbody>
    )
  }

  const table = (
    <table className="w-full min-w-[640px] text-sm">
      <thead>
        <tr className="border-b border-tollerud-border/30 bg-tollerud-noir-900">
          {selectable && (
            <th className="px-3 py-2.5 w-10">
              <Checkbox
                checked={allOnPageSelected}
                onChange={toggleAllOnPage}
                aria-label="Select all rows on page"
              />
            </th>
          )}
          {columns.map((col) => headerCell(col))}
          {rowMenu && <th className="w-11" />}
        </tr>
        {!isRich && filterableColumns.length > 0 && (
          <tr className="border-b border-tollerud-border/20">
            {columns.map((col) => (
              <th
                key={`filter-${col.key}`}
                className={cn('px-1.5 py-1', col.align === 'right' && 'text-right', col.align === 'center' && 'text-center')}
              >
                {col.filterable ? (
                  <input
                    type="text"
                    placeholder={`Filter ${col.label.toLowerCase()}…`}
                    value={filters[col.key] ?? ''}
                    onChange={(e) => updateFilter(col.key, e.target.value)}
                    className={cn(
                      'w-full px-2 py-1 text-xs rounded border transition-colors outline-none',
                      'bg-tollerud-noir-900/50 border-tollerud-border/20 text-tollerud-text-primary placeholder:text-tollerud-text-muted/40',
                      'focus:border-tollerud-yellow/40 focus:ring-1 focus:ring-tollerud-yellow/20',
                    )}
                  />
                ) : null}
              </th>
            ))}
          </tr>
        )}
      </thead>
      {tableBody()}
    </table>
  )

  if (!isRich) {
    return (
      <div ref={forwardedRef} className={cn('overflow-x-auto rounded-lg border border-tollerud-border/30', className)}>
        {table}
      </div>
    )
  }

  const showEmpty = !loading && sorted.length === 0

  return (
    <div
      ref={forwardedRef}
      className={cn(
        'overflow-hidden rounded-lg border border-tollerud-border/30 bg-tollerud-noir-900',
        className,
      )}
    >
      {(searchable || filter || toolbarRight) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-tollerud-border/30 px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-2.5">
            {searchable && (
              <div className="flex h-9 w-[230px] max-w-full items-center gap-2 rounded-lg border border-tollerud-border/30 bg-tollerud-noir-950 px-3">
                <Search size={15} className="shrink-0 text-tollerud-text-muted" aria-hidden />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setPage(1)
                  }}
                  placeholder={searchPlaceholder}
                  className="min-w-0 flex-1 border-none bg-transparent text-sm text-tollerud-text-primary outline-none placeholder:text-tollerud-text-muted"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="text-tollerud-text-muted hover:text-tollerud-text-primary"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            )}
            {filter && (
              <Segmented
                size="sm"
                value={filterValue}
                onChange={(value) => {
                  setFilterValue(value)
                  setPage(1)
                }}
                options={[
                  { value: 'all', label: filter.allLabel ?? 'All' },
                  ...filterOptions.map((opt) => ({ value: opt, label: opt })),
                ]}
              />
            )}
          </div>
          {toolbarRight}
        </div>
      )}

      {selectable && selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-tollerud-border/30 bg-tollerud-yellow/[0.07] px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm text-tollerud-text-primary">
            <Badge variant="accent">{selected.length}</Badge>
            selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant ?? 'ghost'}
                size="sm"
                onClick={() => action.onRun(selected, clearSelection)}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {showEmpty ? (
        <div className="p-2">{emptyState ?? <div className="py-12 text-center text-sm text-tollerud-text-muted">No results.</div>}</div>
      ) : (
        <div className="overflow-x-auto">{table}</div>
      )}

      {!loading && sorted.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-tollerud-border/30 px-4 py-3">
          <span className="text-xs text-tollerud-text-muted">
            {pageSize
              ? `Showing ${(currentPage - 1) * pageSize + 1}–${(currentPage - 1) * pageSize + pageRows.length} of ${sorted.length}`
              : `${sorted.length} row${sorted.length === 1 ? '' : 's'}`}
          </span>
          {pageSize && pageCount > 1 && (
            <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} siblingCount={1} />
          )}
        </div>
      )}
    </div>
  )
}

const DataTable = forwardRef(<T extends Record<string, unknown>>(
  props: DataTableProps<T>,
  ref: React.Ref<HTMLDivElement>
) => <DataTableInner {...props} forwardedRef={ref} />)

DataTable.displayName = 'DataTable'

export { DataTable }
