export interface ChartPadding {
  top: number
  right: number
  bottom: number
  left: number
}

export const DEFAULT_CHART_PADDING: ChartPadding = {
  top: 16,
  right: 56,
  bottom: 32,
  left: 12,
}

export function parseChartDate(input: Date | string | number): Date {
  if (input instanceof Date) return input
  if (typeof input === 'number') return new Date(input)
  return new Date(input)
}

export function sortPointsByDate<T extends { date: Date | string | number }>(points: T[]): T[] {
  return [...points].sort(
    (a, b) => parseChartDate(a.date).getTime() - parseChartDate(b.date).getTime(),
  )
}

export function filterPointsByDuration<T extends { date: Date | string | number }>(
  points: T[],
  durationMs?: number,
): T[] {
  if (!durationMs || points.length === 0) return points
  const sorted = sortPointsByDate(points)
  const latest = parseChartDate(sorted[sorted.length - 1]!.date).getTime()
  const cutoff = latest - durationMs
  return sorted.filter((p) => parseChartDate(p.date).getTime() >= cutoff)
}

export interface YDomain {
  min: number
  max: number
}

export function computeYDomain(values: number[], paddingRatio = 0.08): YDomain {
  if (values.length === 0) return { min: 0, max: 1 }
  const rawMin = Math.min(...values)
  const rawMax = Math.max(...values)
  const span = rawMax - rawMin || Math.abs(rawMax) || 1
  const pad = span * paddingRatio
  return { min: rawMin - pad, max: rawMax + pad }
}

export function yScale(value: number, domain: YDomain, plotTop: number, plotHeight: number): number {
  const span = domain.max - domain.min || 1
  return plotTop + plotHeight - ((value - domain.min) / span) * plotHeight
}

export function xScaleIndex(index: number, count: number, plotLeft: number, plotWidth: number): number {
  if (count <= 1) return plotLeft + plotWidth / 2
  return plotLeft + (index / (count - 1)) * plotWidth
}

export function buildLinearPath(
  values: number[],
  xAt: (index: number) => number,
  yAt: (value: number) => number,
): string {
  if (values.length === 0) return ''
  return values
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index)} ${yAt(value)}`)
    .join(' ')
}

/** Step-after path — horizontal hold then vertical jump (price / discrete samples). */
export function buildStepPath(
  values: number[],
  xAt: (index: number) => number,
  yAt: (value: number) => number,
): string {
  if (values.length === 0) return ''
  const firstX = xAt(0)
  const firstY = yAt(values[0]!)
  let path = `M ${firstX} ${firstY}`
  for (let i = 1; i < values.length; i++) {
    const x = xAt(i)
    const y = yAt(values[i]!)
    path += ` H ${x} V ${y}`
  }
  return path
}

export function buildStepAreaPath(
  values: number[],
  xAt: (index: number) => number,
  yAt: (value: number) => number,
  baselineY: number,
): string {
  if (values.length === 0) return ''
  const firstX = xAt(0)
  const lastX = xAt(values.length - 1)
  let path = `M ${firstX} ${baselineY} L ${firstX} ${yAt(values[0]!)}`
  for (let i = 1; i < values.length; i++) {
    const x = xAt(i)
    const y = yAt(values[i]!)
    path += ` H ${x} V ${y}`
  }
  path += ` L ${lastX} ${baselineY} Z`
  return path
}

export function buildLinearAreaPath(
  values: number[],
  xAt: (index: number) => number,
  yAt: (value: number) => number,
  baselineY: number,
): string {
  if (values.length === 0) return ''
  const firstX = xAt(0)
  const lastX = xAt(values.length - 1)
  let path = `M ${firstX} ${baselineY} L ${firstX} ${yAt(values[0]!)}`
  for (let i = 1; i < values.length; i++) {
    path += ` L ${xAt(i)} ${yAt(values[i]!)}`
  }
  path += ` L ${lastX} ${baselineY} Z`
  return path
}

export function indexFromPointer(
  clientX: number,
  rect: DOMRect,
  count: number,
  paddingLeft: number,
  paddingRight: number,
): number {
  if (count <= 1) return 0
  const plotLeft = rect.left + paddingLeft
  const plotWidth = rect.width - paddingLeft - paddingRight
  const ratio = Math.max(0, Math.min(1, (clientX - plotLeft) / plotWidth))
  return Math.round(ratio * (count - 1))
}

export function niceTicks(min: number, max: number, count = 4): number[] {
  const span = max - min || 1
  const step = span / Math.max(count - 1, 1)
  return Array.from({ length: count }, (_, i) => min + step * i)
}

export function formatChartNumber(value: number, locale = 'nb-NO'): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value))} ,-`
}

export function formatChartDateShort(date: Date, locale = 'nb-NO'): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date)
}

export function formatChartDateLong(date: Date, locale = 'nb-NO'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
