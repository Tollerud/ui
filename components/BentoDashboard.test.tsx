import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BentoDashboard } from './BentoDashboard'

describe('BentoDashboard', () => {
  it('renders title, summary, and section content from props', () => {
    render(
      <BentoDashboard
        title="Mission Control"
        hosts={[
          { hostname: 'emma', ip: '10.0.10.10', status: 'online', cpu: '23%', memory: '6/16 GB', disk: '45%', uptime: '14d', containers: 4 },
          { hostname: 'pia', ip: '10.0.10.11', status: 'online', cpu: '51%', memory: '4/16 GB', disk: '71%', uptime: '9d', containers: 2 },
        ]}
        metrics={[
          { label: 'Active Sessions', value: 42 },
          { label: 'Avg CPU', value: '38%' },
        ]}
        services={[
          { service: 'emma.tollerud.no', status: 'online', uptime: '14d', responseTime: '23ms' },
        ]}
        incidents={[
          {
            title: 'High CPU on iris',
            severity: 'high',
            timestamp: '14:32',
            service: 'iris',
            description: 'CPU at 88% for 5 min',
          },
        ]}
      />
    )

    expect(screen.getByRole('heading', { name: 'Mission Control' })).toBeInTheDocument()
    expect(screen.getByText(/2 hosts · 1 services · 1 active incident/)).toBeInTheDocument()
    expect(screen.getByText('emma')).toBeInTheDocument()
    expect(screen.getByText('pia')).toBeInTheDocument()
    expect(screen.getByText('Active Sessions')).toBeInTheDocument()
    expect(screen.getByText('emma.tollerud.no')).toBeInTheDocument()
    expect(screen.getByText('High CPU on iris')).toBeInTheDocument()
    expect(screen.getByText('Metrics')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Recent Incidents')).toBeInTheDocument()
  })

  it('omits empty sections', () => {
    render(<BentoDashboard title="Empty board" />)

    expect(screen.getByRole('heading', { name: 'Empty board' })).toBeInTheDocument()
    expect(screen.getByText(/0 hosts · 0 services/)).toBeInTheDocument()
    expect(screen.queryByText('Metrics')).not.toBeInTheDocument()
    expect(screen.queryByText('Recent Incidents')).not.toBeInTheDocument()
  })
})
