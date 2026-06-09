'use client'

import { type HTMLAttributes, createContext, forwardRef, useContext, useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionContextValue {
  openItems: Set<string>
  toggle: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordionContext(component: string) {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error(`<${component}> must be used within <Accordion>`)
  return ctx
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple items to be open at once */
  multiple?: boolean
  /** Initially open item value(s) */
  defaultOpen?: string | string[]
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, multiple = false, defaultOpen, children, ...props }, ref) => {
    const [openItems, setOpenItems] = useState<Set<string>>(() => {
      if (!defaultOpen) return new Set()
      return new Set(Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen])
    })

    const toggle = (value: string) => {
      setOpenItems((prev) => {
        const next = multiple ? new Set(prev) : new Set<string>()
        if (prev.has(value)) {
          next.delete(value)
        } else {
          next.add(value)
        }
        return next
      })
    }

    return (
      <AccordionContext.Provider value={{ openItems, toggle }}>
        <div ref={ref} className={cn('flex flex-col divide-y divide-tollerud-border rounded-lg border border-tollerud-border', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = 'Accordion'

interface AccordionItemContextValue {
  value: string
  open: boolean
  triggerId: string
  contentId: string
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { openItems } = useAccordionContext('AccordionItem')
    const autoId = useId()
    const open = openItems.has(value)

    return (
      <AccordionItemContext.Provider
        value={{ value, open, triggerId: `${autoId}-trigger`, contentId: `${autoId}-content` }}
      >
        <div ref={ref} className={cn('first:rounded-t-lg last:rounded-b-lg', className)} {...props}>
          {children}
        </div>
      </AccordionItemContext.Provider>
    )
  }
)
AccordionItem.displayName = 'AccordionItem'

function useAccordionItemContext(component: string) {
  const ctx = useContext(AccordionItemContext)
  if (!ctx) throw new Error(`<${component}> must be used within <AccordionItem>`)
  return ctx
}

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { toggle } = useAccordionContext('AccordionTrigger')
    const { value, open, triggerId, contentId } = useAccordionItemContext('AccordionTrigger')

    return (
      <button
        ref={ref}
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => toggle(value)}
        className={cn(
          'flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium',
          'text-tollerud-text-primary hover:bg-tollerud-surface-hover transition-colors duration-[150ms]',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          size={16}
          className={cn('shrink-0 text-tollerud-text-muted transition-transform duration-[200ms]', open && 'rotate-180')}
        />
      </button>
    )
  }
)
AccordionTrigger.displayName = 'AccordionTrigger'

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, triggerId, contentId } = useAccordionItemContext('AccordionContent')

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        className={cn('px-4 pb-4 text-sm text-tollerud-text-secondary', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
