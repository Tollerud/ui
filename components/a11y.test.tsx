import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { Input } from './Input'
import { Checkbox } from './Checkbox'
import { Switch } from './Switch'
import { Radio, RadioGroup } from './RadioGroup'
import { Slider } from './Slider'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './Dialog'
import { CommandMenu } from './CommandMenu'
import { Combobox } from './Combobox'
import { Select } from './Select'
import { DatePicker } from './DatePicker'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './Sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './Sidebar'
import { DashboardShell } from './DashboardShell'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'
import { TopNav } from './TopNav'
import { TimeSeriesChart } from './TimeSeriesChart'
import { AreaChart } from './AreaChart'
import { BarChart } from './BarChart'
import { Donut } from './Donut'
import { Sparkline } from './Sparkline'

function mockMobile(matches: boolean) {
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: query === '(max-width: 767px)' ? matches : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as MediaQueryList
  )
}

const commandGroups = [
  {
    label: 'Actions',
    items: [{ id: 'deploy', label: 'Deploy stack', onSelect: vi.fn() }],
  },
]

describe('accessibility', () => {
  beforeEach(() => {
    mockMobile(false)
  })

  it('Button has no axe violations', async () => {
    const { container } = render(<Button variant="primary">Deploy</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Input with label has no axe violations', async () => {
    const { container } = render(<Input label="Hostname" placeholder="emma" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Checkbox has no axe violations, including indeterminate', async () => {
    const { container, rerender } = render(<Checkbox label="Enable backups" />)
    expect(await axe(container)).toHaveNoViolations()

    rerender(<Checkbox label="Enable backups" indeterminate />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Switch has no axe violations', async () => {
    const { container } = render(<Switch label="Auto-restart" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('RadioGroup has no axe violations', async () => {
    const { container } = render(
      <RadioGroup label="Restart policy" value="always">
        <Radio value="always" label="Always" />
        <Radio value="never" label="Never" />
      </RadioGroup>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Slider has no axe violations', async () => {
    const { container } = render(<Slider label="Concurrency" defaultValue={4} min={0} max={10} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Accordion has no axe violations, closed and open', async () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Backup schedule</AccordionTrigger>
          <AccordionContent>Nightly at 02:00</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(await axe(container)).toHaveNoViolations()

    await userEvent.click(screen.getByRole('button', { name: 'Backup schedule' }))
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Select has no axe violations, closed and open', async () => {
    const { container } = render(
      <Select
        label="Region"
        value="eu"
        options={[
          { value: 'eu', label: 'EU' },
          { value: 'us', label: 'US' },
        ]}
      />
    )
    expect(await axe(container)).toHaveNoViolations()

    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    // Base UI portals the popup to document.body, outside the render `container` —
    // scan the whole body to cover it. `region` is a page-landmark rule that's
    // irrelevant to an isolated component fragment with no page shell.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })

  it('Dialog with title has no axe violations', async () => {
    const { container } = render(
      <Dialog open>
        <DialogTrigger asChild>
          <Button variant="secondary">Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm restart</DialogTitle>
          <DialogDescription>Restart emma:hermes?</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('CommandMenu has no axe violations when open', async () => {
    const { container } = render(
      <CommandMenu open onOpenChange={vi.fn()} groups={commandGroups} />
    )
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Combobox with label has no axe violations when closed', async () => {
    const { container } = render(
      <Combobox
        label="Host"
        value=""
        onChange={vi.fn()}
        options={[{ value: 'emma', label: 'emma.tollerud.no' }]}
      />
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Combobox has no axe violations when open, in both searchPlacement modes', async () => {
    const options = [
      { value: 'emma', label: 'emma.tollerud.no' },
      { value: 'iris', label: 'iris.tollerud.no' },
    ]

    const first = render(<Combobox label="Host" value="" onChange={vi.fn()} options={options} />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations()
    first.unmount()

    render(<Combobox label="Host" value="" onChange={vi.fn()} options={options} searchPlacement="dropdown" />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })

  it('DatePicker with label has no axe violations when closed', async () => {
    const { container } = render(
      <DatePicker label="Maintenance window" placeholder="Pick a date" />
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('DatePicker has no axe violations when open', async () => {
    render(<DatePicker label="Maintenance window" placeholder="Pick a date" />)
    await userEvent.click(screen.getByRole('button', { name: /maintenance window/i }))
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument()
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })

  it('Sheet with title has no axe violations when open', async () => {
    const { container } = render(
      <Sheet open>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Deploy logs</SheetTitle>
          </SheetHeader>
          <p>Streaming output</p>
        </SheetContent>
      </Sheet>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('TopNav mobile menu with a flyout group has no axe violations when open', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <TopNav
        projectName="Mission Control"
        navItems={[
          { label: 'Overview', href: '/overview', active: true },
          {
            label: 'Services',
            items: [
              { label: 'API', href: '/services/api' },
              { label: 'Worker', href: '/services/worker' },
            ],
          },
        ]}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Toggle navigation menu' }))
    const menu = screen.getByRole('dialog', { name: 'Navigation menu' })
    await user.click(within(menu).getByRole('button', { name: 'Services' }))
    expect(within(menu).getByRole('link', { name: 'API' })).toBeInTheDocument()

    expect(await axe(container)).toHaveNoViolations()
  })

  it('TopNav desktop flyout has no axe violations when open', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <TopNav
        projectName="Mission Control"
        navItems={[
          {
            label: 'Services',
            items: [
              { label: 'API', href: '/services/api' },
              { label: 'Worker', href: '/services/worker' },
            ],
          },
        ]}
      />
    )

    const trigger = screen.getByRole('button', { name: 'Services' })
    trigger.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('link', { name: 'API' })).toBeInTheDocument()

    expect(await axe(container)).toHaveNoViolations()
  })

  it('Sidebar (desktop, expanded) has no axe violations', async () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar mobileTitle="Navigation menu">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Servers</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>Emma</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Miriam</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Sidebar (mobile, open) has no axe violations', async () => {
    mockMobile(true)
    const user = userEvent.setup()
    const { container } = render(
      <SidebarProvider>
        <Sidebar mobileTitle="Navigation menu">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Emma</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
    expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('DashboardShell (mobile nav open) has no axe violations', async () => {
    mockMobile(true)
    const user = userEvent.setup()
    const { container } = render(
      <DashboardShell
        projectName="Mission Control"
        sidebarItems={[
          { id: 'overview', label: 'Overview', href: '/overview', active: true },
          { id: 'services', label: 'Services', href: '/services' },
        ]}
      >
        content
      </DashboardShell>
    )

    await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Tabs has no axe violations', async () => {
    const { container } = render(
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="logs">Logs panel</TabsContent>
      </Tabs>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('DatePicker calendar has no axe violations when open', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <DatePicker label="Schedule" placeholder="Select a date" />
    )

    await user.click(screen.getByRole('button', { name: /schedule/i }))
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('TimeSeriesChart (with SR data table) has no axe violations', async () => {
    const { container } = render(
      <TimeSeriesChart
        data={[
          { date: '2026-01-01', value: 10 },
          { date: '2026-02-01', value: 20 },
        ]}
        ariaLabel="Prices over time"
      />
    )
    expect(screen.getByRole('table', { name: 'Prices over time' })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('interactive AreaChart has no axe violations', async () => {
    const { container } = render(
      <AreaChart
        interactive
        ariaLabel="Requests"
        data={[
          { value: 10, label: 'Jan' },
          { value: 20, label: 'Feb' },
        ]}
      />
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('interactive BarChart has no axe violations', async () => {
    const { container } = render(
      <BarChart
        interactive
        ariaLabel="Sales"
        data={[
          { label: 'Oslo', value: 42 },
          { label: 'Bergen', value: 28 },
        ]}
      />
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('interactive Donut (palette defaults) has no axe violations', async () => {
    const { container } = render(
      <Donut
        interactive
        ariaLabel="Fuel mix"
        segments={[
          { label: 'Diesel', value: 60 },
          { label: 'El', value: 40 },
        ]}
      />
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('interactive Sparkline has no axe violations', async () => {
    const { container } = render(
      <Sparkline interactive ariaLabel="Trend" data={[1, 3, 2, 5, 4]} />
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
