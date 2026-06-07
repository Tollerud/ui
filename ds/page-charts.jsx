/* Tollerud DS — Charts page. → window.PageCharts
   Chart components (BarChart, AreaChart, Donut, Sparkline) live in ds/charts.jsx. */

function PageCharts() {
  return (
    <div>
      <PageHeader icon="chart" eyebrow="Charts" title="Charts"
        lede="Palette-aware data visualization — bar, area, donut and sparkline. Yellow is the highlight series; everything else stays monochrome. Grid and axis use dedicated low-contrast tokens, so every chart is theme-aware."/>

      <Section title="Charts" desc="Drop in an array of data; the components inherit the system palette and grid. Use accent sparingly to mark the one series that matters.">
        <div className="ds-grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <SubHead>Requests / weekday</SubHead>
            <BarChart data={[
              { label: 'Mon', value: 32 }, { label: 'Tue', value: 48 }, { label: 'Wed', value: 41 },
              { label: 'Thu', value: 67, accent: true }, { label: 'Fri', value: 55 }, { label: 'Sat', value: 22 }, { label: 'Sun', value: 18 },
            ]}/>
          </Card>
          <Card>
            <SubHead>CPU load · 24h</SubHead>
            <AreaChart data={[28, 35, 30, 44, 52, 48, 63, 58, 71, 65, 80, 62]}/>
          </Card>
          <Card>
            <SubHead>Storage by host</SubHead>
            <Donut segments={[
              { label: 'emma', value: 45, color: '#E8D500' },
              { label: 'pia', value: 25, color: '#FFB800' },
              { label: 'iris', value: 18, color: '#666666' },
              { label: 'free', value: 12, color: '#333333' },
            ]}/>
          </Card>
          <Card>
            <SubHead>Sparklines</SubHead>
            <div className="ds-col" style={{ gap: 14, marginTop: 4 }}>
              {[['Network in', [4, 8, 6, 12, 9, 14, 11, 18], '#E8D500'], ['Memory', [40, 42, 39, 45, 44, 48, 46, 50], '#FFB800'], ['Errors', [2, 1, 3, 1, 0, 2, 1, 0], '#EF4444']].map(([l, d, c], i) => (
                <div key={i} className="ds-row" style={{ justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l}</span>
                  <Sparkline data={d} color={c}/>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
window.PageCharts = PageCharts;
