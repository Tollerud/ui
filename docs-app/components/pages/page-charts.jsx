'use client'
import React, { useMemo } from 'react'
import * as __p from '@/lib/provide-pages'
const { Card, Demo, CodeSnippet, PageHeader, Section, SubHead, Sparkline, TimeSeriesChart, TIME_SERIES_PRESETS, BarChart, Donut } = __p

/* @tollerud/ui docs — Charts */

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

  return (
    <div>
      <PageHeader
        icon="chart"
        eyebrow="Charts"
        title="Charts"
        lede="Palette-aware data visualization — stepped time series with hover, compact sparklines, bars and donuts. Yellow marks the active series; grids use low-contrast chart tokens."
      />

      <Section
        title="Time series"
        desc="Wide vector SVG charts for prices and metrics over time. Stepped curves hold values between samples; hover for crosshair and tooltip. Pair ranges with TIME_SERIES_PRESETS or pass your own durationMs filters."
      >
        <Card>
          <TimeSeriesChart
            data={priceData}
            height={300}
            curve="step"
            ranges={TIME_SERIES_PRESETS}
            range="3m"
            toolbarLeft={
              <span className="text-sm text-tollerud-text-secondary">Prishistorikk · demo</span>
            }
          />
        </Card>
        <Demo
          name="time-series"
          code={`import { TimeSeriesChart, TIME_SERIES_PRESETS } from '@tollerud/ui'

<TimeSeriesChart
  data={[
    { date: '2026-03-23', value: 13999, label: 'Bygghjemme', meta: ['Product line 1'] },
    { date: '2026-04-06', value: 14250, label: 'Obs BYGG' },
  ]}
  curve="step"
  ranges={TIME_SERIES_PRESETS}
  range="3m"
/>`}
        />
      </Section>

      <Section title="Sparklines" desc='Inline trends for tables and stat rows. Add curve="step" and fill for price-style micro charts; interactive shows a hover dot.'>
        <Card>
          <SubHead>Table row metrics</SubHead>
          <div className="ds-col" style={{ gap: 14, marginTop: 4 }}>
            {[
              ['Network in', [4, 8, 6, 12, 9, 14, 11, 18], 'var(--tollerud-yellow-warm, #E8D500)', 'linear'],
              ['Ølpris trend', [17200, 16800, 17100, 16500, 15900, 16200, 15800, 15400, 14900, 13999], 'var(--tollerud-yellow-warm, #E8D500)', 'step'],
              ['Errors', [2, 1, 3, 1, 0, 2, 1, 0], '#EF4444', 'linear'],
            ].map(([label, series, color, curve]) => (
              <div key={label} className="ds-row" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                <Sparkline
                  data={series}
                  color={color}
                  curve={curve}
                  fill={curve === 'step'}
                  interactive={curve === 'step'}
                  width={160}
                  height={36}
                />
              </div>
            ))}
          </div>
        </Card>
        <CodeSnippet code={`<Sparkline
  data={[17200, 16800, 13999]}
  curve="step"
  fill
  interactive
  width={160}
  height={36}
/>`} />
      </Section>

      <Section title="Static charts" desc="Simple bar and donut charts for dashboards without interaction.">
        <div className="ds-grid-2" style={{ alignItems: 'start' }}>
          <Card>
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
        </div>
      </Section>
    </div>
  )
}
export default PageCharts
