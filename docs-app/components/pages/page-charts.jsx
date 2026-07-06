'use client'
import React, { useMemo, useState } from 'react'
import * as __p from '@/lib/provide-pages'
const {
  Card,
  Demo,
  CodeSnippet,
  PageHeader,
  Section,
  SubHead,
  TokenTable,
  Sparkline,
  TimeSeriesChart,
  TIME_SERIES_PRESETS,
  formatChartDecimal,
  BarChart,
  AreaChart,
  Donut,
} = __p

/* @tollerud/ui docs — Charts */

const CHART_IMPORT = `import {
  TimeSeriesChart,
  TIME_SERIES_PRESETS,
  BarChart,
  AreaChart,
  Donut,
  Sparkline,
} from '@tollerud/ui'`

const TIME_SERIES_BASIC = `<TimeSeriesChart
  data={[
    { date: '2026-03-23', value: 13999, label: 'Bygghjemme', meta: ['Vaskemaskin Miele WWR860'] },
    { date: '2026-04-06', value: 14250, label: 'Obs BYGG' },
    { date: '2026-04-13', value: 13800, label: 'Maxbo' },
  ]}
  curve="step"
  height={300}
  ranges={TIME_SERIES_PRESETS}
  range="3m"
/>`

const TIME_SERIES_CONTROLLED = `'use client'
import { useState } from 'react'
import { TimeSeriesChart, TIME_SERIES_PRESETS } from '@tollerud/ui'

export function PriceChart({ data }) {
  const [range, setRange] = useState('3m')

  return (
    <TimeSeriesChart
      data={data}
      curve="step"
      height={300}
      ranges={TIME_SERIES_PRESETS}
      range={range}
      onRangeChange={setRange}
      toolbarLeft={<span className="text-sm text-tollerud-text-secondary">Price history</span>}
    />
  )
}`

const TIME_SERIES_CUSTOM_RANGES = `const MS_DAY = 24 * 60 * 60 * 1000

// Norwegian UI — pass custom ranges; pair with locale="nb-NO" for date/number formatting
const RANGES_NB = [
  { value: '3m', label: '3 mnd', durationMs: 90 * MS_DAY },
  { value: '6m', label: '6 mnd', durationMs: 180 * MS_DAY },
  { value: '1y', label: '1 år', durationMs: 365 * MS_DAY },
  { value: '2y', label: '2 år', durationMs: 730 * MS_DAY },
  { value: 'all', label: 'Alt' },
]

<TimeSeriesChart
  data={points}
  curve="step"
  ranges={RANGES_NB}
  range="3m"
  locale="nb-NO"
/>`

const TIME_SERIES_TOOLTIP = `<TimeSeriesChart
  data={points}
  curve="step"
  renderTooltip={(point, _index, formattedValue) => (
    <div className="rounded-lg border border-tollerud-noir-600 bg-tollerud-noir-800 px-3 py-2 shadow-lg">
      <div className="text-lg font-semibold text-tollerud-text-primary">{formattedValue}</div>
      <div className="text-xs text-tollerud-text-secondary">{point.label}</div>
    </div>
  )}
/>`

const TIME_SERIES_VALUE_AFFIX = `<TimeSeriesChart
  data={points}
  curve="step"
  valueSuffix=" $/gal"
/>`

const TIME_SERIES_FORMAT_VALUE = `import { TimeSeriesChart, formatChartDecimal } from '@tollerud/ui'

<TimeSeriesChart
  data={points}
  curve="step"
  formatValue={(value) => formatChartDecimal(value, 'en-US', { suffix: ' $/gal' })}
/>`

const SPARKLINE_BASIC = `<Sparkline data={[12, 18, 14, 22, 19]} width={84} height={26} color="var(--tollerud-yellow-warm, #E8D500)" />`

const SPARKLINE_STEP = `<Sparkline
  data={[17200, 16800, 17100, 16500, 13999]}
  curve="step"
  fill
  interactive
  width={160}
  height={36}
/>`

const BAR_CHART = `<BarChart
  data={[
    { label: 'Mon', value: 32 },
    { label: 'Tue', value: 48 },
    { label: 'Thu', value: 67, accent: true },
  ]}
  height={180}
/>`

const AREA_CHART = `<AreaChart data={[28, 35, 30, 44, 52, 48, 63]} height={150} />`

const DONUT_CHART = `<Donut
  segments={[
    { label: 'emma', value: 45, color: '#E8D500' },
    { label: 'pia', value: 25, color: '#FFB800' },
    { label: 'iris', value: 18, color: '#666666' },
    { label: 'free', value: 12, color: '#333333' },
  ]}
  size={160}
/>`

const MS_DAY = 24 * 60 * 60 * 1000

const BASIC_SAMPLE = [
  { date: '2026-03-23', value: 13999, label: 'Bygghjemme', meta: ['Vaskemaskin Miele WWR860'] },
  { date: '2026-04-06', value: 14250, label: 'Obs BYGG' },
  { date: '2026-04-13', value: 13800, label: 'Maxbo' },
]

const RATE_SAMPLE = [
  { date: '2026-03-23', value: 58.2, label: 'Store A' },
  { date: '2026-04-06', value: 57.0, label: 'Store B' },
  { date: '2026-04-13', value: 56.4, label: 'Store C' },
]

const RANGES_NB = [
  { value: '3m', label: '3 mnd', durationMs: 90 * MS_DAY },
  { value: '6m', label: '6 mnd', durationMs: 180 * MS_DAY },
  { value: '1y', label: '1 år', durationMs: 365 * MS_DAY },
  { value: '2y', label: '2 år', durationMs: 730 * MS_DAY },
  { value: 'all', label: 'Alt' },
]

function buildPriceSeries() {
  const start = new Date('2025-12-23')
  const points = []
  let price = 17200
  const stores = ['Bygghjemme', 'Obs BYGG', 'Maxbo', 'XL-BYGG']
  for (let i = 0; i < 52; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i * 7)
    if (i > 0) price += Math.round((Math.random() - 0.55) * 420)
    price = Math.max(11800, Math.min(18500, price))
    points.push({
      date,
      value: price,
      label: stores[i % stores.length],
      meta: [
        'Vaskemaskin/Tørketrommel Miele WWR860 WPS',
        '8 kg · 1600 o/min',
      ],
    })
  }
  return points
}

function PageCharts() {
  const priceData = useMemo(() => buildPriceSeries(), [])
  const [range, setRange] = useState('3m')
  const [rangeNb, setRangeNb] = useState('3m')

  return (
    <div>
      <PageHeader
        icon="chart"
        eyebrow="Charts"
        title="Charts"
        lede="Palette-aware SVG charts — no Recharts dependency. Yellow marks the highlight series; grids and axes use --chart-grid and --chart-axis tokens."
      />

      <Section
        title="Overview"
        desc="All chart components ship from @tollerud/ui. They inherit Tollerud tokens from globals.css — no extra charting library install."
      >
        <CodeSnippet code={CHART_IMPORT} />
        <TokenTable
          cols={['Component', 'Use when']}
          rows={[
            ['<code>TimeSeriesChart</code>', 'Wide price/metric history — stepped/linear curves, hover + keyboard crosshair, range selector, one or many series'],
            ['<code>Sparkline</code>', 'Inline trends in tables, stat rows, or cards — optional interactive tooltip'],
            ['<code>AreaChart</code>', 'Simple trend — static by default, or interactive with tooltip + keyboard nav'],
            ['<code>BarChart</code>', 'Category comparison — static, or interactive focusable bars with tooltips'],
            ['<code>Donut</code>', 'Part-to-whole breakdown — palette-cycled legend, optionally interactive'],
          ]}
        />
        <TokenTable
          cols={['Interaction', 'Applies to']}
          rows={[
            ['<code>interactive</code> — crosshair/tooltip + keyboard (Tab, ←/→, Home/End, Esc), SR announcements', '<code>AreaChart</code>, <code>Sparkline</code>, <code>BarChart</code>, <code>Donut</code> (opt-in); <code>TimeSeriesChart</code> (always)'],
            ['<code>srTable</code> — visually-hidden data table for screen readers', '<code>TimeSeriesChart</code> (default on), <code>AreaChart</code> (default = interactive)'],
            ['<code>formatValue</code> / <code>ariaLabel</code> — value formatting + accessible name', 'all interactive charts'],
            ['<code>CHART_SERIES_COLORS</code> — the <code>--chart-1…5</code> palette cycle', '<code>Donut</code> segments &amp; <code>TimeSeriesChart</code> series without an explicit color'],
          ]}
        />
      </Section>

      <Section
        title="TimeSeriesChart"
        component="TimeSeriesChart"
        permalink="charts/time-series-chart"
        desc='Interactive wide SVG chart for dates + values. Fully keyboard accessible (≥ 4.8.42): Tab focuses the chart and activates the latest point, ←/→ step through points with the crosshair and tooltip following, Home/End jump to the ends, Esc clears — and screen readers hear each keyboard-selected point. A visually-hidden data table (srTable, on by default; ≥ 4.8.45) exposes every point to screen readers. Pass series instead of data for multiple lines (≥ 4.8.46) — shared crosshair, stacked tooltip, palette-cycled colors. Use curve="step" for prices held between samples. Pass ranges with TIME_SERIES_PRESETS or custom durationMs filters, or filter data yourself and omit ranges.'
      >
        <Card>
          <TimeSeriesChart
            data={priceData}
            height={300}
            curve="step"
            ranges={TIME_SERIES_PRESETS}
            range={range}
            onRangeChange={setRange}
            toolbarLeft={
              <span className="text-sm text-tollerud-text-secondary">Price history · demo</span>
            }
          />
        </Card>
        <SubHead>Basic</SubHead>
        <Demo name="time-series-basic" variant="col" code={TIME_SERIES_BASIC}>
          <TimeSeriesChart
            data={BASIC_SAMPLE}
            curve="step"
            height={220}
            ranges={TIME_SERIES_PRESETS}
            range="3m"
          />
        </Demo>
        <SubHead>Controlled range</SubHead>
        <p className="ds-section__desc" style={{ marginTop: 0 }}>
          Pair <code className="ds-mono">range</code> with <code className="ds-mono">onRangeChange</code> when the parent owns filter state — e.g. alongside a store selector in <code className="ds-mono">toolbarLeft</code>.
        </p>
        <Demo name="time-series-controlled" variant="col" code={TIME_SERIES_CONTROLLED}>
          <TimeSeriesChart
            data={priceData}
            curve="step"
            height={220}
            ranges={TIME_SERIES_PRESETS}
            range={range}
            onRangeChange={setRange}
            toolbarLeft={
              <span className="text-sm text-tollerud-text-secondary">Price history</span>
            }
          />
        </Demo>
        <SubHead>Custom ranges (Norwegian)</SubHead>
        <p className="ds-section__desc" style={{ marginTop: 0 }}>
          <code className="ds-mono">TIME_SERIES_PRESETS</code> ships English labels. For Norwegian UI, pass your own <code className="ds-mono">ranges</code> and set <code className="ds-mono">locale="nb-NO"</code> for axis/tooltip formatting.
        </p>
        <Demo name="time-series-ranges" variant="col" code={TIME_SERIES_CUSTOM_RANGES}>
          <TimeSeriesChart
            data={priceData}
            curve="step"
            height={220}
            ranges={RANGES_NB}
            range={rangeNb}
            onRangeChange={setRangeNb}
            locale="nb-NO"
            toolbarLeft={
              <span className="text-sm text-tollerud-text-secondary">Prishistorikk</span>
            }
          />
        </Demo>
        <SubHead>valuePrefix / valueSuffix</SubHead>
        <p className="ds-section__desc" style={{ marginTop: 0 }}>
          Quick affixes for tooltip, Y-axis, and latest-value badge — without a custom <code className="ds-mono">formatValue</code>. Ignored when <code className="ds-mono">formatValue</code> is set. For decimal unit rates, prefer <code className="ds-mono">formatChartDecimal</code> via <code className="ds-mono">formatValue</code>.
        </p>
        <Demo name="time-series-value-affix" variant="col" code={TIME_SERIES_VALUE_AFFIX}>
          <TimeSeriesChart
            data={RATE_SAMPLE}
            curve="step"
            height={220}
            valueSuffix=" $/gal"
          />
        </Demo>
        <SubHead>formatValue</SubHead>
        <p className="ds-section__desc" style={{ marginTop: 0 }}>
          <code className="ds-mono">formatValue</code> formats Y-axis ticks, the latest-value badge, and the default tooltip. It is independent of <code className="ds-mono">locale</code> (dates only). Use <code className="ds-mono">formatChartDecimal</code> for unit rates like $/gal.
        </p>
        <Demo name="time-series-format-value" variant="col" code={TIME_SERIES_FORMAT_VALUE}>
          <TimeSeriesChart
            data={RATE_SAMPLE}
            curve="step"
            height={220}
            formatValue={(value) => formatChartDecimal(value, 'en-US', { suffix: ' $/gal' })}
          />
        </Demo>
        <SubHead>Custom tooltip</SubHead>
        <Demo name="time-series-tooltip" variant="col" code={TIME_SERIES_TOOLTIP}>
          <TimeSeriesChart
            data={BASIC_SAMPLE}
            curve="step"
            height={220}
            formatValue={(value) => new Intl.NumberFormat('en-US').format(value)}
            renderTooltip={(point, _index, formattedValue) => (
              <div className="rounded-lg border border-tollerud-noir-600 bg-tollerud-noir-800 px-3 py-2 shadow-lg">
                <div className="text-lg font-semibold text-tollerud-text-primary">{formattedValue}</div>
                <div className="text-xs text-tollerud-text-secondary">{point.label}</div>
              </div>
            )}
          />
        </Demo>
        <SubHead>Multiple series — shared crosshair, stacked tooltip</SubHead>
        <Demo
          name="time-series-multi"
          variant="col"
          desc="Pass series instead of data: each series gets a palette-cycled line (or its own color), one crosshair and stacked tooltip span all series, and the SR data table gains a column per series. Series should share dates by position. Area fill and the latest-value badge are single-series only."
          code={`<TimeSeriesChart
  ariaLabel="Fuel prices by type"
  curve="linear"
  height={240}
  valueSuffix=" kr"
  series={[
    { label: 'Diesel', points: dieselPoints },
    { label: 'Petrol', points: petrolPoints },
    { label: 'Electric', points: electricPoints, color: 'var(--chart-3)' },
  ]}
/>`}
        >
          <TimeSeriesChart
            ariaLabel="Fuel prices by type"
            curve="linear"
            height={240}
            valueSuffix=" kr"
            series={[
              { label: 'Diesel', points: BASIC_SAMPLE },
              { label: 'Petrol', points: BASIC_SAMPLE.map((p) => ({ ...p, value: Math.round(p.value * 0.82) })) },
              { label: 'Electric', points: BASIC_SAMPLE.map((p) => ({ ...p, value: Math.round(p.value * 0.55) })) },
            ]}
          />
        </Demo>
        <TokenTable
          cols={['Type', 'Shape']}
          rows={[
            ['<code>TimeSeriesPoint</code>', '<code>{ date, value, label?, meta? }</code> — <code>date</code> accepts <code>Date</code>, ISO string, or timestamp'],
            ['<code>TimeSeriesSeries</code>', '<code>{ label, points, color? }</code> — pass an array as <code>series</code> for multi-line charts (≥ 4.8.46); omit <code>color</code> to cycle <code>--chart-1…5</code>'],
            ['<code>TimeSeriesRange</code>', '<code>{ value, label, durationMs?, disabled? }</code> — omit <code>durationMs</code> for all time'],
            ['<code>TIME_SERIES_PRESETS</code>', 'English defaults: 3 mo · 6 mo · 1 yr · 2 yr · All'],
          ]}
        />
      </Section>

      <Section
        title="Sparkline"
        component="Sparkline"
        permalink="charts/sparkline"
        desc='Compact inline SVG trend. Add curve="step", fill, and interactive for price-style micro charts — common in DataTable cells. Interactive sparklines (≥ 4.8.43) get a tooltip and keyboard navigation (Tab, ←/→, Home/End, Esc) with screen-reader announcements; pass formatValue and ariaLabel for meaningful output. The SVG is clipped to its viewBox so stroke bleed at small sizes (e.g. 84×26) is prevented.'
      >
        <Card>
          <div className="ds-col" style={{ gap: 14 }}>
            {[
              ['Network in', [4, 8, 6, 12, 9, 14, 11, 18], 'var(--tollerud-yellow-warm, #E8D500)', 'linear', false],
              ['Price trend', [17200, 16800, 17100, 16500, 15900, 16200, 15800, 15400, 14900, 13999], 'var(--tollerud-yellow-warm, #E8D500)', 'step', true],
              ['Errors', [2, 1, 3, 1, 0, 2, 1, 0], '#EF4444', 'linear', false],
            ].map(([label, series, color, curve, interactive]) => (
              <div key={label} className="ds-row" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                <Sparkline
                  data={series}
                  color={color}
                  curve={curve}
                  fill={curve === 'step'}
                  interactive={interactive}
                  width={160}
                  height={36}
                />
              </div>
            ))}
          </div>
        </Card>
        <SubHead>Linear</SubHead>
        <Demo name="sparkline-linear" variant="center" code={SPARKLINE_BASIC}>
          <Sparkline data={[12, 18, 14, 22, 19]} width={84} height={26} color="var(--tollerud-yellow-warm, #E8D500)" />
        </Demo>
        <SubHead>Stepped with fill and hover</SubHead>
        <Demo name="sparkline-step" variant="center" code={SPARKLINE_STEP}>
          <Sparkline
            data={[17200, 16800, 17100, 16500, 13999]}
            curve="step"
            fill
            interactive
            width={160}
            height={36}
          />
        </Demo>
        <SubHead>Small size — step+fill at 84×26 (list row usage)</SubHead>
        <Demo name="sparkline-step-small" variant="center" code={`<Sparkline data={[58, 57, 59, 56, 54, 53]} curve="step" fill width={84} height={26} />`}>
          <Sparkline data={[58, 57, 59, 56, 54, 53]} curve="step" fill width={84} height={26} />
        </Demo>
        <SubHead>Fluid — fills its container (≥ 4.8.48)</SubHead>
        <Demo
          name="sparkline-fluid"
          variant="col"
          desc="Add fluid to fill the container width instead of a fixed width; dots stay round (pixel-plotted). height still applies."
          code={`<Sparkline data={[12, 18, 14, 22, 19, 26, 23, 31]} fluid height={48} fill curve="step" />`}
        >
          <div style={{ width: '100%' }}>
            <Sparkline data={[12, 18, 14, 22, 19, 26, 23, 31]} fluid height={48} fill curve="step" />
          </div>
        </Demo>
      </Section>

      <Section
        title="AreaChart"
        component="AreaChart"
        permalink="charts/area-chart"
        desc="Area/line chart for simple dashboards. Static and decorative by default; add interactive (≥ 4.8.43) for a crosshair, tooltip, and full keyboard navigation (Tab, ←/→, Home/End, Esc) with screen-reader announcements plus a visually-hidden data table (srTable; ≥ 4.8.45). Pass labeled points ({ value, label }) so tooltips, announcements, and the table name each point; plain number arrays keep working. Fluid width with round markers at any size (≥ 4.8.47 — plotted in real pixels, not a stretched viewBox). Use TimeSeriesChart when you need dates, ranges, or axes."
      >
        <Demo name="area-chart" variant="center" code={AREA_CHART}>
          <Card style={{ width: '100%', maxWidth: 480 }}>
            <SubHead>CPU load · 24h</SubHead>
            <AreaChart data={[28, 35, 30, 44, 52, 48, 63, 58, 71, 65, 80, 62]} height={150} />
          </Card>
        </Demo>
        <SubHead>Interactive — labeled points, keyboard accessible</SubHead>
        <Demo
          name="area-chart-interactive"
          variant="center"
          code={`<AreaChart
  interactive
  ariaLabel="Requests per hour"
  formatValue={(v) => \`\${v} req\`}
  data={[
    { value: 420, label: '09:00' },
    { value: 560, label: '10:00' },
    { value: 610, label: '11:00' },
    { value: 540, label: '12:00' },
    { value: 720, label: '13:00' },
    { value: 680, label: '14:00' },
  ]}
  height={150}
/>`}
        >
          <Card style={{ width: '100%', maxWidth: 480 }}>
            <SubHead>Requests per hour</SubHead>
            <AreaChart
              interactive
              ariaLabel="Requests per hour"
              formatValue={(v) => `${v} req`}
              data={[
                { value: 420, label: '09:00' },
                { value: 560, label: '10:00' },
                { value: 610, label: '11:00' },
                { value: 540, label: '12:00' },
                { value: 720, label: '13:00' },
                { value: 680, label: '14:00' },
              ]}
              height={150}
            />
          </Card>
        </Demo>
      </Section>

      <Section
        title="BarChart"
        component="BarChart"
        permalink="charts/bar-chart"
        desc="Vertical bars with optional yellow accent on one series. Values render above each bar; pass formatValue to format them. Add interactive (≥ 4.8.44) for focusable bars: Tab reaches the chart, ←/→ move between bars, Home/End jump, Esc dismisses — each bar announces its label and value to screen readers, and hover or focus shows a tooltip. Bar-height transitions respect prefers-reduced-motion. For multiple series (≥ 4.8.49), pass series + categories for grouped bars, or add stacked for stacked bars — palette-cycled with a legend."
      >
        <Demo name="bar-chart" variant="center" code={BAR_CHART}>
          <Card style={{ width: '100%', maxWidth: 480 }}>
            <SubHead>Requests / weekday</SubHead>
            <BarChart
              data={[
                { label: 'Mon', value: 32 },
                { label: 'Tue', value: 48 },
                { label: 'Wed', value: 41 },
                { label: 'Thu', value: 67, accent: true },
                { label: 'Fri', value: 55 },
                { label: 'Sat', value: 22 },
                { label: 'Sun', value: 18 },
              ]}
            />
          </Card>
        </Demo>
        <SubHead>Interactive — focusable bars with tooltips</SubHead>
        <Demo
          name="bar-chart-interactive"
          variant="center"
          code={`<BarChart
  interactive
  ariaLabel="Sales by city"
  formatValue={(v) => \`\${v} kr\`}
  data={[
    { label: 'Oslo', value: 420, accent: true },
    { label: 'Bergen', value: 280 },
    { label: 'Tromsø', value: 150 },
  ]}
/>`}
        >
          <Card style={{ width: '100%', maxWidth: 480 }}>
            <SubHead>Sales by city</SubHead>
            <BarChart
              interactive
              ariaLabel="Sales by city"
              formatValue={(v) => `${v} kr`}
              data={[
                { label: 'Oslo', value: 420, accent: true },
                { label: 'Bergen', value: 280 },
                { label: 'Tromsø', value: 150 },
              ]}
            />
          </Card>
        </Demo>
        <SubHead>Grouped series (≥ 4.8.49)</SubHead>
        <Demo
          name="bar-chart-grouped"
          variant="center"
          desc="Pass series + categories for side-by-side bars per category; colors cycle the palette, legend renders above. Each bar is focusable when interactive."
          code={`<BarChart
  interactive
  ariaLabel="Resource use by host"
  formatValue={(v) => \`\${v}%\`}
  categories={['emma', 'pia', 'iris']}
  series={[
    { label: 'CPU', values: [30, 60, 45] },
    { label: 'Memory', values: [50, 40, 70] },
  ]}
/>`}
        >
          <Card style={{ width: '100%', maxWidth: 480 }}>
            <SubHead>Resource use by host</SubHead>
            <BarChart
              interactive
              ariaLabel="Resource use by host"
              formatValue={(v) => `${v}%`}
              categories={['emma', 'pia', 'iris']}
              series={[
                { label: 'CPU', values: [30, 60, 45] },
                { label: 'Memory', values: [50, 40, 70] },
              ]}
            />
          </Card>
        </Demo>
        <SubHead>Stacked series (≥ 4.8.49)</SubHead>
        <Demo
          name="bar-chart-stacked"
          variant="center"
          desc="Add stacked to stack series into one bar per category. Each column is focusable; the tooltip lists every series."
          code={`<BarChart
  stacked
  interactive
  ariaLabel="Spend by category"
  formatValue={(v) => \`\${v}k\`}
  categories={['Q1', 'Q2', 'Q3', 'Q4']}
  series={[
    { label: 'Compute', values: [12, 15, 14, 18] },
    { label: 'Storage', values: [6, 7, 9, 8] },
    { label: 'Network', values: [3, 4, 3, 5] },
  ]}
/>`}
        >
          <Card style={{ width: '100%', maxWidth: 480 }}>
            <SubHead>Spend by category</SubHead>
            <BarChart
              stacked
              interactive
              ariaLabel="Spend by category"
              formatValue={(v) => `${v}k`}
              categories={['Q1', 'Q2', 'Q3', 'Q4']}
              series={[
                { label: 'Compute', values: [12, 15, 14, 18] },
                { label: 'Storage', values: [6, 7, 9, 8] },
                { label: 'Network', values: [3, 4, 3, 5] },
              ]}
            />
          </Card>
        </Demo>
      </Section>

      <Section
        title="Donut"
        component="Donut"
        permalink="charts/donut"
        desc="Donut chart with segment legend and percentages. Segment colors are optional (≥ 4.8.44) — omitted colors cycle the --chart-1…5 palette (also exported as CHART_SERIES_COLORS). Add interactive for a focusable legend: Tab reaches it, ↑/↓ move between rows, hover or focus highlights the arc, dims the others, and reveals the raw value — each row announces label, value, and share to screen readers. Add fluid (≥ 4.8.48) to scale the ring down to fit narrow containers (capped at size, stays circular; legend wraps below)."
      >
        <Demo name="donut-chart" variant="center" code={DONUT_CHART}>
          <Card>
            <SubHead>Storage by host</SubHead>
            <Donut
              segments={[
                { label: 'emma', value: 45, color: '#E8D500' },
                { label: 'pia', value: 25, color: '#FFB800' },
                { label: 'iris', value: 18, color: '#666666' },
                { label: 'free', value: 12, color: '#333333' },
              ]}
            />
          </Card>
        </Demo>
        <SubHead>Palette defaults + interactive legend</SubHead>
        <Demo
          name="donut-chart-interactive"
          variant="center"
          code={`// No colors needed — segments cycle CHART_SERIES_COLORS (--chart-1…5)
<Donut
  interactive
  ariaLabel="Fuel mix"
  segments={[
    { label: 'Diesel', value: 420 },
    { label: 'Bensin', value: 380 },
    { label: 'El', value: 200 },
    { label: 'Hybrid', value: 120 },
  ]}
/>`}
        >
          <Card>
            <SubHead>Fuel mix</SubHead>
            <Donut
              interactive
              ariaLabel="Fuel mix"
              segments={[
                { label: 'Diesel', value: 420 },
                { label: 'Bensin', value: 380 },
                { label: 'El', value: 200 },
                { label: 'Hybrid', value: 120 },
              ]}
            />
          </Card>
        </Demo>
      </Section>
    </div>
  )
}
export default PageCharts
