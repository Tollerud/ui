import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { Input } from './Input'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './Dialog'
import { CommandMenu } from './CommandMenu'
import { Combobox } from './Combobox'
import { DatePicker } from './DatePicker'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './Sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const commandGroups = [
  {
    label: 'Actions',
    items: [{ id: 'deploy', label: 'Deploy stack', onSelect: vi.fn() }],
  },
]

describe('accessibility', () => {
  it('Button has no axe violations', async () => {
    const { container } = render(<Button variant="primary">Deploy</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Input with label has no axe violations', async () => {
    const { container } = render(<Input label="Hostname" placeholder="emma" />)
    expect(await axe(container)).toHaveNoViolations()
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

  it('DatePicker with label has no axe violations when closed', async () => {
    const { container } = render(
      <DatePicker label="Maintenance window" placeholder="Pick a date" />
    )
    expect(await axe(container)).toHaveNoViolations()
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
})
