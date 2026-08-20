import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

describe('Accordion', () => {
  it('toggles a single item open and closed', async () => {
    const user = userEvent.setup()

    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Section B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    const triggerA = screen.getByRole('button', { name: 'Section A' })
    expect(triggerA).toHaveAttribute('aria-expanded', 'false')

    await user.click(triggerA)
    expect(triggerA).toHaveAttribute('aria-expanded', 'true')

    await user.click(triggerA)
    expect(triggerA).toHaveAttribute('aria-expanded', 'false')
  })

  it('only allows one open item by default (accordion, not multi-expand)', async () => {
    const user = userEvent.setup()

    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Section B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    await user.click(screen.getByRole('button', { name: 'Section A' }))
    await user.click(screen.getByRole('button', { name: 'Section B' }))

    expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Section B' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('allows multiple open items when multiple is set', async () => {
    const user = userEvent.setup()

    render(
      <Accordion multiple>
        <AccordionItem value="a">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Section B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    await user.click(screen.getByRole('button', { name: 'Section A' }))
    await user.click(screen.getByRole('button', { name: 'Section B' }))

    expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Section B' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('respects defaultOpen', () => {
    render(
      <Accordion defaultOpen="a">
        <AccordionItem value="a">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'true')
  })
})
