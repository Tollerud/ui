'use client'

import React, { useState } from 'react'
import {
  Tabs as NpmTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Segmented as NpmSegmented,
  Tooltip as NpmTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Alert as NpmAlert,
  Accordion as NpmAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Breadcrumb as NpmBreadcrumb,
  Pagination as NpmPagination,
  Slider as NpmSlider,
  DropdownMenu as NpmDropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Dialog as NpmDialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Empty,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  LogViewer,
  Panel as NpmPanel,
  Meter as NpmMeter,
  Stepper as NpmStepper,
  Combobox,
  Select,
  Avatar,
  AvatarGroup as NpmAvatarGroup,
  Timeline as NpmTimeline,
  DatePicker,
  FileUpload,
  TagInput,
  Divider as NpmDivider,
  cn,
} from '@tollerud/ui'
import { Icons } from '../components/icons'

export { LogViewer, Combobox, Select, DatePicker, FileUpload, TagInput }

function Divider({ accent, className, ...props }) {
  return (
    <NpmDivider
      className={cn(accent && 'bg-tollerud-yellow/50', className)}
      {...props}
    />
  )
}

function Timeline({ items, ...props }) {
  const normalized = items.map((item, index) => ({
    id: item.id ?? `timeline-${index}`,
    ...item,
  }))
  return <NpmTimeline items={normalized} {...props} />
}

function Tabs({ tabs, variant, defaultTab }) {
  const defaultValue = defaultTab || tabs[0]?.id
  return (
    <NpmTabs defaultValue={defaultValue}>
      <TabsList
        className={cn(
          variant === 'underline' &&
            'h-auto rounded-none bg-transparent p-0 gap-6 border-b border-tollerud-border',
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              variant === 'underline' &&
                'rounded-none border-b-2 border-transparent px-0 pb-2 data-[state=active]:border-tollerud-yellow data-[state=active]:bg-transparent data-[state=active]:shadow-none',
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(
        (tab) =>
          tab.content && (
            <TabsContent key={tab.id} value={tab.id} className="pt-4 text-sm text-tollerud-text-secondary leading-relaxed">
              {tab.content}
            </TabsContent>
          ),
      )}
    </NpmTabs>
  )
}

function Segmented({ options, value, onChange, ...props }) {
  const [internal, setInternal] = useState(options[0]?.value)
  const controlled = value !== undefined
  const current = controlled ? value : internal
  const handleChange = (next) => {
    if (!controlled) setInternal(next)
    onChange?.(next)
  }
  return <NpmSegmented options={options} value={current} onChange={handleChange} {...props} />
}

function Tooltip({ label, children, side = 'top' }) {
  return (
    <TooltipProvider>
      <NpmTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{label}</TooltipContent>
      </NpmTooltip>
    </TooltipProvider>
  )
}

function Alert({ tone = 'default', title, children, icon }) {
  const toneIcons = {
    default: Icons.info,
    accent: Icons.zap,
    error: Icons.alert,
    success: Icons.checkCircle,
    info: Icons.info,
  }
  const Icon = typeof icon === 'string' ? Icons[icon] : toneIcons[tone] || Icons.info
  const iconNode = icon && typeof icon !== 'string' ? icon : <Icon size={18} />
  return (
    <NpmAlert tone={tone} title={title} icon={iconNode}>
      {children}
    </NpmAlert>
  )
}

function Accordion({ items }) {
  return (
    <NpmAccordion defaultOpen="item-0">
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </NpmAccordion>
  )
}

function Breadcrumb({ items }) {
  const normalized = items.map((item) => (typeof item === 'string' ? { label: item } : item))
  return <NpmBreadcrumb items={normalized} />
}

function Pagination({ total, current, page, pageCount, onChange, ...props }) {
  const count = pageCount ?? total ?? 7
  const [internal, setInternal] = useState(current ?? page ?? 1)
  const controlled = page !== undefined
  const activePage = controlled ? page : internal
  const handleChange = (next) => {
    if (!controlled) setInternal(next)
    onChange?.(next)
  }
  return <NpmPagination page={activePage} pageCount={count} onChange={handleChange} {...props} />
}

function Slider({ min = 0, max = 100, defaultValue = 50, onChange, ...props }) {
  const [value, setValue] = useState(defaultValue)
  const handleChange = (next) => {
    setValue(next)
    onChange?.(next)
  }
  return <NpmSlider min={min} max={max} value={value} showValue onChange={handleChange} {...props} />
}

function DropdownMenu({ trigger, items }) {
  return (
    <NpmDropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, index) => {
          if (item.sep) return <DropdownMenuSeparator key={index} />
          if (item.heading) return <DropdownMenuLabel key={index}>{item.label}</DropdownMenuLabel>
          const Icon = item.icon ? Icons[item.icon] : null
          return (
            <DropdownMenuItem key={index} onSelect={() => item.onSelect?.()}>
              {Icon ? <Icon size={14} className="mr-2" /> : null}
              {item.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </NpmDropdownMenu>
  )
}

function Dialog({ open, onClose, title, description, children, footer }) {
  return (
    <NpmDialog open={open} onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent>
        {(title || description) && (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        )}
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </NpmDialog>
  )
}

function Drawer({ open, onClose, side = 'right', title, description, children, footer, width = 380 }) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose?.()}>
      <SheetContent side={side} style={{ maxWidth: width }}>
        {(title || description) && (
          <SheetHeader>
            {title ? <SheetTitle>{title}</SheetTitle> : null}
            {description ? <SheetDescription>{description}</SheetDescription> : null}
          </SheetHeader>
        )}
        <div className="flex-1 overflow-y-auto py-4">{children}</div>
        {footer ? <div className="flex items-center justify-end gap-2 border-t border-tollerud-border pt-4">{footer}</div> : null}
      </SheetContent>
    </Sheet>
  )
}

function EmptyState({ icon = 'folder', title, description, action, secondaryAction, compact, accent }) {
  const I = Icons[icon] || Icons.folder
  return (
    <Empty className={cn(compact && 'py-8', accent && 'rounded-lg border border-tollerud-yellow/30')}>
      <EmptyHeader>
        <EmptyIcon className={cn(compact && 'w-10 h-10 mb-1')}>
          <I size={compact ? 20 : 24} />
        </EmptyIcon>
        {title ? <EmptyTitle>{title}</EmptyTitle> : null}
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {(action || secondaryAction) && (
        <EmptyContent>
          <div className="flex items-center justify-center gap-2.5">
            {action}
            {secondaryAction}
          </div>
        </EmptyContent>
      )}
    </Empty>
  )
}

function Spinner({ size = 16, style }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
      style={{ width: size, height: size, ...style }}
      aria-hidden
    />
  )
}

function Panel({ title, icon, actions, footer, noPadding, children, className, style }) {
  const I = icon ? Icons[icon] : null
  const titleNode =
    I && title ? (
      <span className="inline-flex items-center gap-2">
        <I size={15} />
        {title}
      </span>
    ) : (
      title
    )

  if (!footer && !icon) {
    return (
      <NpmPanel title={titleNode} actions={actions} className={className} style={style}>
        <div className={noPadding ? 'p-0' : undefined}>{children}</div>
      </NpmPanel>
    )
  }

  return (
    <div
      className={cn('rounded-lg border border-tollerud-border bg-tollerud-surface overflow-hidden', className)}
      style={style}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-tollerud-border">
          {titleNode ? <h3 className="text-sm font-medium text-tollerud-text-primary">{titleNode}</h3> : <span />}
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      )}
      <div className={noPadding ? undefined : 'p-4'}>{children}</div>
      {footer ? <div className="px-4 py-3 border-t border-tollerud-border">{footer}</div> : null}
    </div>
  )
}

function Meter({ label, value, max = 100, valueLabel, hot = 85, unlimited, tone, ...props }) {
  const pct = unlimited ? 100 : Math.max(0, Math.min(100, (value / max) * 100))
  const isHot = !unlimited && pct >= hot
  const display =
    valueLabel ?? (unlimited ? String(value) : `${value} / ${max}`)
  return (
    <div {...props}>
      <div className="flex items-center justify-between mb-1.5 text-xs">
        {label ? <span className="text-tollerud-text-muted">{label}</span> : <span />}
        <span className={cn('tabular-nums', isHot ? 'text-tollerud-error' : 'text-tollerud-text-secondary')}>
          {display}
        </span>
      </div>
      <NpmMeter
        value={unlimited ? Math.min(value, max) : value}
        max={max}
        tone={isHot ? 'error' : tone ?? 'default'}
        className={unlimited ? '[&_[role=meter]>div]:opacity-35' : undefined}
      />
    </div>
  )
}

function Stepper({ steps, current = 0, ...props }) {
  const normalized = steps.map((step) => (typeof step === 'string' ? { label: step } : step))
  return <NpmStepper steps={normalized} current={current} {...props} />
}

function avatarSizeFromPixels(size) {
  if (typeof size === 'string') return size
  if (size <= 28) return 'sm'
  if (size <= 36) return 'md'
  return 'lg'
}

function AvatarGroup({ users = [], max = 4, size = 32, ...props }) {
  const npmSize = avatarSizeFromPixels(size)
  const shown = users.slice(0, max)
  return (
    <NpmAvatarGroup max={max} size={npmSize} {...props}>
      {shown.map((user, index) => (
        <span key={index} className="relative inline-flex">
          <Avatar src={user.src} name={user.name} size={npmSize} />
          {user.status ? (
            <span
              className={cn(
                'absolute bottom-0 right-0 rounded-full ring-2 ring-tollerud-noir-900',
                user.status === 'online' && 'bg-tollerud-success',
                user.status === 'warning' && 'bg-tollerud-warning',
                user.status === 'offline' && 'bg-tollerud-text-muted',
              )}
              style={{ width: Math.max(8, (typeof size === 'number' ? size : 32) * 0.28), height: Math.max(8, (typeof size === 'number' ? size : 32) * 0.28) }}
            />
          ) : null}
        </span>
      ))}
    </NpmAvatarGroup>
  )
}

export {
  Tabs,
  Segmented,
  Tooltip,
  Alert,
  Accordion,
  Breadcrumb,
  Pagination,
  Slider,
  DropdownMenu,
  Dialog,
  EmptyState,
  Spinner,
  Panel,
  Meter,
  Stepper,
  Drawer,
  AvatarGroup,
  Divider,
  Timeline,
}
