import { describe, expect, it } from 'vitest'
import {
  buildLinearPath,
  buildStepAreaPath,
  buildStepPath,
  computeYDomain,
  filterPointsByDuration,
  indexFromPointer,
  parseChartDate,
  sortPointsByDate,
} from './chart-series'

describe('chart-series', () => {
  it('sorts points by date', () => {
    const sorted = sortPointsByDate([
      { date: '2026-04-01', value: 1 },
      { date: '2026-03-01', value: 2 },
    ])
    expect(sorted[0]!.date).toBe('2026-03-01')
  })

  it('filters by duration from latest point', () => {
    const points = [
      { date: '2026-01-01', value: 1 },
      { date: '2026-02-01', value: 2 },
      { date: '2026-04-01', value: 3 },
    ]
    const day = 24 * 60 * 60 * 1000
    const filtered = filterPointsByDuration(points, 62 * day)
    expect(filtered).toHaveLength(2)
    expect(filtered[0]!.date).toBe('2026-02-01')
  })

  it('builds step path with horizontal segments', () => {
    const path = buildStepPath(
      [10, 20, 15],
      (i) => i * 10,
      (v) => 100 - v,
    )
    expect(path).toContain('H 10')
    expect(path).toContain('V 80')
  })

  it('closes step area to baseline', () => {
    const path = buildStepAreaPath(
      [10, 20],
      (i) => i * 10,
      (v) => 100 - v,
      100,
    )
    expect(path.endsWith('Z')).toBe(true)
    expect(path.startsWith('M 0 100')).toBe(true)
  })

  it('computes padded y domain', () => {
    const domain = computeYDomain([100, 200])
    expect(domain.min).toBeLessThan(100)
    expect(domain.max).toBeGreaterThan(200)
  })

  it('maps pointer x to nearest index', () => {
    const rect = { left: 0, width: 100 } as DOMRect
    expect(indexFromPointer(0, rect, 5, 0, 0)).toBe(0)
    expect(indexFromPointer(100, rect, 5, 0, 0)).toBe(4)
    expect(indexFromPointer(50, rect, 5, 0, 0)).toBe(2)
  })

  it('parses chart dates', () => {
    expect(parseChartDate('2026-04-11').getFullYear()).toBe(2026)
    expect(buildLinearPath([1, 2], () => 0, () => 0)).toBe('M 0 0 L 0 0')
  })
})
