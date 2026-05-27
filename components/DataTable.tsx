'use client'

import { useState, useMemo, forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

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

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  /** Row key extractor — defaults to `row.id` or `row.key` */
  rowKey?: keyof T | ((row: T) => string | number)
  onRowClick?: (row: T) => void
  className?: string
  emptyMessage?: string
}

interface DataTableInnerProps<T extends Record<string, unknown>> extends DataTableProps<T> {
  forwardedRef?: React.Ref<HTMLDivElement>
}

function DataTableInner<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  onRowClick,
  className,
  emptyMessage = 'No data',
  forwardedRef,
}: DataTableInnerProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    const activeFilters = Object.entries(filters).filter(([, v]) => v.trim() !== '')
    if (activeFilters.length === 0) return data

    return data.filter((row) =>
      activeFilters.every(([key, filterValue]) => {
        const cellValue = String(row[key] ?? '').toLowerCase()
        return cellValue.includes(filterValue.toLowerCase())
      })
    )
  }, [data, filters])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortable) return filtered

    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      // Handle numbers vs strings
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal ?? '')
      const bStr = String(bVal ?? '')
      const cmp = aStr.localeCompare(bStr, 'nb', { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir, columns])

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

  const hasActiveFilters = Object.values(filters).some((v) => v.trim() !== '')
  const filterableColumns = columns.filter((c) => c.filterable)

  return (
    <div ref={forwardedRef} className={cn('overflow-x-auto rounded-lg border border-tollerud-border/30', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-tollerud-border/30 bg-tollerud-noir-900">
            {columns.map((col) => (
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
                <span className="inline-flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-tollerud-accent">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                  {col.sortable && sortKey !== col.key && (
                    <span className="text-tollerud-text-muted/30">↕</span>
                  )}
                  {col.filterable && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn(
                        'opacity-40',
                        filters[col.key] && 'opacity-100 text-tollerud-yellow'
                      )}
                    >
                      <path d="M4 4h16v2.172a2 2 0 0 1-.586 1.414L15 12v7l-6 2v-8.5L4.52 7.53A2 2 0 0 1 4 6.16V4z" />
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
          {/* Filter row — only if at least one column is filterable */}
          {filterableColumns.length > 0 && (
            <tr className="border-b border-tollerud-border/20">
              {columns.map((col) => (
                <th
                  key={`filter-${col.key}`}
                  className={cn(
                    'px-1.5 py-1',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                  )}
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
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-8 text-center text-sm text-tollerud-text-muted"
              >
                {hasActiveFilters ? 'No matching rows' : emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={getRowKey(row, i)}
                className={cn(
                  'border-b border-tollerud-border/20 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-tollerud-surface-raised/50',
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => {
                  const value = row[col.key]
                  return (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 py-2.5 text-tollerud-text-secondary',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                        'font-mono text-xs',
                      )}
                    >
                      {col.render ? col.render(value, row) : String(value ?? '—')}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const DataTable = forwardRef(<T extends Record<string, unknown>>(
  props: DataTableProps<T>,
  ref: React.Ref<HTMLDivElement>
) => <DataTableInner {...props} forwardedRef={ref} />)

DataTable.displayName = 'DataTable'

export { DataTable }