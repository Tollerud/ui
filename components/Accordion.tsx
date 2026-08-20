'use client'

import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple items to be open at once */
  multiple?: boolean
  /** Initially open item value(s) */
  defaultOpen?: string | string[]
  children?: ReactNode
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, multiple = false, defaultOpen, children, ...props }, ref) => {
    const defaultValue = defaultOpen === undefined ? [] : Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen]

    return (
      <BaseAccordion.Root
        {...props}
        ref={ref}
        multiple={multiple}
        defaultValue={defaultValue}
        className={cn(
          'flex flex-col divide-y divide-tollerud-border rounded-lg border border-tollerud-border',
          className
        )}
      >
        {children}
      </BaseAccordion.Root>
    )
  }
)
Accordion.displayName = 'Accordion'

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    return (
      <BaseAccordion.Item
        ref={ref}
        value={value}
        className={cn('first:rounded-t-lg last:rounded-b-lg', className)}
        {...props}
      >
        {children}
      </BaseAccordion.Item>
    )
  }
)
AccordionItem.displayName = 'AccordionItem'

export type AccordionTriggerProps = HTMLAttributes<HTMLButtonElement>

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BaseAccordion.Trigger
        ref={ref}
        className={cn(
          'flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium',
          'text-tollerud-text-primary hover:bg-tollerud-surface-hover transition-colors duration-fast',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          size={16}
          className="shrink-0 text-tollerud-text-muted transition-transform duration-fast [[data-panel-open]_&]:rotate-180"
        />
      </BaseAccordion.Trigger>
    )
  }
)
AccordionTrigger.displayName = 'AccordionTrigger'

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BaseAccordion.Panel
        ref={ref}
        keepMounted
        className={cn('px-4 pb-4 text-sm text-tollerud-text-secondary', className)}
        {...props}
      >
        {children}
      </BaseAccordion.Panel>
    )
  }
)
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
