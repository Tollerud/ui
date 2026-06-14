# Generated component props

> Auto-generated from `components/*.tsx`. Do not edit by hand.
> Regenerate: `npm run docs:props` · Drift check: `npm run test:props`

## Accordion — `AccordionItemProps` extends extends HTMLAttributes<HTMLDivElement>

- `value: string`

## Accordion — `AccordionProps` extends extends HTMLAttributes<HTMLDivElement>

- `multiple?: boolean`
- `defaultOpen?: string | string[]`

## ActionDiff — `ActionDiffProps` extends extends HTMLAttributes<HTMLDivElement>

- `lines: DiffLine[]`
- `label?: string`
- `view?: 'unified' | 'side-by-side'`
- `loading?: boolean`

## ActionRow — `ActionRowProps` extends extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>

- `action: ActionItem`
- `highlighted?: boolean`
- `showShortcut?: boolean`

## Alert — `AlertProps` extends extends HTMLAttributes<HTMLDivElement>

- `tone?: keyof typeof toneStyles`
- `title?: string`
- `icon?: React.ReactNode`

## AlertInbox — `AlertInboxProps` extends extends HTMLAttributes<HTMLDivElement>

- `alerts: AlertItem[]`
- `filterSeverity?: IncidentSeverity | ''`
- `onAcknowledge?: (id: string) => void`
- `loading?: boolean`
- `emptyMessage?: string`

## ApprovalCard — `ApprovalCardProps` extends extends HTMLAttributes<HTMLDivElement>

- `action: string`
- `description?: string`
- `source?: string`
- `state?: ApprovalState`
- `timestamp?: string`
- `onApprove?: () => void`
- `onReject?: () => void`
- `disabled?: boolean`
- `loading?: boolean`

## AreaChart — `AreaChartProps` extends extends HTMLAttributes<HTMLDivElement>

- `data: number[]`
- `height?: number`

## Avatar — `AvatarGroupProps` extends extends HTMLAttributes<HTMLDivElement>

- `max?: number`
- `size?: keyof typeof avatarSizes | number`
- `children: React.ReactNode`

## Avatar — `AvatarProps` extends extends HTMLAttributes<HTMLSpanElement>

- `src?: string`
- `name?: string`
- `fallback?: React.ReactNode`
- `size?: keyof typeof avatarSizes | number`

## BackupStatusPanel — `BackupStatusPanelProps` extends extends HTMLAttributes<HTMLDivElement>

- `jobs: BackupJob[]`
- `totalSize?: string`
- `lastFullBackup?: string`
- `loading?: boolean`

## Badge — `BadgeProps` extends extends HTMLAttributes<HTMLSpanElement>

- `variant?: keyof typeof badgeVariants`

## BarChart — `BarChartProps` extends extends HTMLAttributes<HTMLDivElement>

- `data: BarChartDatum[]`
- `height?: number`

## BentoDashboard — `BentoDashboardProps`

- `title: string`
- `hosts?: HostCardProps[]`
- `metrics?: StatCardProps[]`
- `services?: ServiceHealthCardProps[]`
- `incidents?: { title: string; severity: IncidentSeverity; timestamp: string; service: string; description?: string; acknowledged?: boolean }[]`
- `backupJobs?: BackupJob[]`
- `className?: string`
- `renderIncidentFooter?: () => ReactNode`

## Breadcrumb — `BreadcrumbProps` extends extends Omit<HTMLAttributes<HTMLElement>, 'children'>

- `items: BreadcrumbItem[]`
- `separator?: React.ReactNode`

## Button — `ButtonProps` extends extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps

- `asChild?: boolean`

## Button — `ButtonVariantProps`

- `variant?: keyof typeof variants`
- `size?: keyof typeof sizes`

## Card — `CardProps` extends extends HTMLAttributes<HTMLDivElement>

- `accent?: boolean`
- `density?: 'comfortable' | 'compact'`

## CardGrid — `CardGridProps` extends extends HTMLAttributes<HTMLDivElement>

- `as?: 'div' | 'section'`
- `columns?: CardGridColumns`
- `gap?: CardGridGap`

## Checkbox — `CheckboxProps` extends extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

- `label?: string`

## Cluster — `ClusterProps` extends extends HTMLAttributes<HTMLDivElement>

- `as?: 'div' | 'nav' | 'header' | 'footer'`
- `gap?: ClusterGap`
- `align?: ClusterAlign`
- `justify?: ClusterJustify`

## CodeBlock — `CodeBlockProps` extends extends HTMLAttributes<HTMLPreElement>

- `code?: string`
- `promptPrefix?: boolean`
- `showCopy?: boolean`

## Combobox — `ComboboxProps`

- `options: ComboboxOption[]`
- `value?: string`
- `defaultValue?: string`
- `onChange?: (value: string) => void`
- `placeholder?: string`
- `label?: string`
- `error?: string`
- `filter?: (option: ComboboxOption, query: string) => boolean`
- `className?: string`
- `disabled?: boolean`

## CommandMenu — `CommandMenuProps`

- `open: boolean`
- `onOpenChange: (open: boolean) => void`
- `groups: CommandGroup[]`
- `placeholder?: string`
- `emptyMessage?: string`
- `className?: string`
- `toggleShortcut?: string`
- `filter?: (query: string, groups: CommandGroup[]) => CommandGroup[]`
- `onAction?: (action: ActionItem) => void`

## Container — `ContainerProps` extends extends HTMLAttributes<HTMLDivElement>

- `as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer'`

## CTABand — `CTABandProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `title: React.ReactNode`
- `description?: React.ReactNode`
- `actions?: React.ReactNode`
- `accentBar?: boolean`

## DashboardShell — `DashboardShellProps` extends extends HTMLAttributes<HTMLDivElement>

- `projectName: ReactNode`
- `projectSubtitle?: ReactNode`
- `homeHref?: string`
- `variant?: DashboardShellVariant`
- `sidebarGroups?: SidebarNavGroup[]`
- `sidebarItems?: SidebarNavItem[]`
- `breadcrumb?: ReactNode`
- `pageTitle?: ReactNode`
- `navItems?: TopNavItem[]`
- `topActions?: ReactNode`
- `sidebar?: ReactNode`
- `header?: ReactNode`
- `density?: MainContentDensity`
- `contentWidth?: 'default' | 'wide' | 'full'`

## DashboardTopBar — `DashboardTopBarProps` extends extends HTMLAttributes<HTMLElement>

- `projectName: ReactNode`
- `homeHref?: string`
- `breadcrumb?: ReactNode`
- `pageTitle?: ReactNode`
- `actions?: ReactNode`
- `menuOpen?: boolean`
- `onMenuToggle?: () => void`
- `sticky?: boolean`

## DatePicker — `DatePickerProps`

- `value?: Date | null`
- `defaultValue?: Date | null`
- `onChange?: (date: Date | null) => void`
- `label?: string`
- `error?: string`
- `placeholder?: string`
- `formatDate?: (date: Date) => string`
- `className?: string`
- `disabled?: boolean`

## DetailPage — `DetailPageProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `eyebrow?: ReactNode`
- `title: ReactNode`
- `description?: ReactNode`
- `actions?: ReactNode`
- `meta?: ReactNode`
- `aside?: ReactNode`

## Divider — `DividerProps` extends extends HTMLAttributes<HTMLDivElement>

- `orientation?: 'horizontal' | 'vertical'`
- `label?: React.ReactNode`

## DockerStackCard — `DockerStackCardProps` extends extends HTMLAttributes<HTMLDivElement>

- `name: string`
- `services: StackService[]`
- `composePath?: string`
- `loading?: boolean`

## Donut — `DonutProps` extends extends HTMLAttributes<HTMLDivElement>

- `segments: DonutSegment[]`
- `size?: number`

## Drawer — `DrawerProps`

- `open: boolean`
- `onClose?: () => void`
- `side?: DrawerSide`
- `title?: ReactNode`
- `description?: ReactNode`
- `children?: ReactNode`
- `footer?: ReactNode`
- `width?: number`

## EmptyPage — `EmptyPageProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `icon?: EmptyStateIconName | ReactNode`
- `title: ReactNode`
- `description?: ReactNode`
- `action?: ReactNode`
- `secondaryAction?: ReactNode`
- `background?: PageShellBackground`
- `accent?: boolean`

## EmptyState — `EmptyStateProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `icon?: EmptyStateIconName | ReactNode`
- `title?: ReactNode`
- `description?: ReactNode`
- `action?: ReactNode`
- `secondaryAction?: ReactNode`
- `compact?: boolean`
- `accent?: boolean`

## FeatureCard — `FeatureCardProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `icon?: React.ReactNode`
- `title: React.ReactNode`
- `description: React.ReactNode`

## FeatureSection — `FeatureSectionProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `eyebrow?: ReactNode`
- `title: ReactNode`
- `description?: ReactNode`
- `actions?: ReactNode`
- `features: FeatureSectionItem[]`
- `columns?: CardGridColumns`

## FileUpload — `FileUploadProps`

- `label?: string`
- `description?: React.ReactNode`
- `error?: string`
- `accept?: string`
- `multiple?: boolean`
- `onFilesChange?: (files: File[]) => void`
- `className?: string`
- `disabled?: boolean`

## FormPanel — `FormPanelProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `title: ReactNode`
- `description?: ReactNode`
- `actions?: ReactNode`
- `footer?: ReactNode`

## FormRow — `FormRowProps` extends extends HTMLAttributes<HTMLDivElement>

- `label?: React.ReactNode`
- `description?: React.ReactNode`
- `hint?: React.ReactNode`
- `error?: React.ReactNode`
- `required?: boolean`
- `htmlFor?: string`
- `layout?: 'settings' | 'stack'`

## GlowCard — `GlowCardProps`

- `children: ReactNode`
- `className?: string`
- `glowColor?: string`
- `intensity?: number`

## Grid — `GridProps` extends extends HTMLAttributes<HTMLDivElement>

- `as?: 'div' | 'section'`
- `columns?: GridColumns`
- `gap?: GridGap`

## HeroBlock — `HeroBlockProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `eyebrow?: React.ReactNode`
- `title: React.ReactNode`
- `description?: React.ReactNode`
- `actions?: React.ReactNode`
- `media?: React.ReactNode`
- `minHeight?: number`
- `intense?: boolean`

## HostCard — `HostCardProps` extends extends HTMLAttributes<HTMLDivElement>

- `hostname: string`
- `ip?: string`
- `status?: Status`
- `cpu?: string`
- `memory?: string`
- `disk?: string`
- `uptime?: string`
- `containers?: number`
- `loading?: boolean`

## IncidentCard — `IncidentCardProps` extends extends HTMLAttributes<HTMLDivElement>

- `title: string`
- `severity: IncidentSeverity`
- `timestamp: string`
- `description?: string`
- `service?: string`
- `acknowledged?: boolean`
- `loading?: boolean`

## Input — `InputProps` extends extends InputHTMLAttributes<HTMLInputElement>

- `label?: string`
- `error?: string`

## Kbd — `KbdProps` extends extends HTMLAttributes<HTMLSpanElement>

- `* The keys to display. Separate by + for chords.`
- `* @example "⌘K", "⌘⇧S", "⌘K", "Esc"`
- `*/`
- `keys: string | string[]`
- `size?: 'sm' | 'md'`

## LogViewer — `LogViewerProps` extends extends HTMLAttributes<HTMLDivElement>

- `lines: LogLine[]`
- `maxLines?: number`
- `showLineNumbers?: boolean`
- `showTimestamps?: boolean`
- `follow?: boolean`
- `searchable?: boolean`
- `height?: string`
- `loading?: boolean`

## MainContent — `MainContentProps` extends extends HTMLAttributes<HTMLDivElement>

- `as?: 'main' | 'div'`
- `width?: MainContentWidth`
- `spacing?: MainContentSpacing`
- `density?: MainContentDensity`

## Meter — `MeterProps` extends extends HTMLAttributes<HTMLDivElement>

- `value: number`
- `max?: number`
- `label?: React.ReactNode`
- `showValue?: boolean`
- `tone?: keyof typeof meterTones`

## Monogram — `MonogramProps` extends extends SVGAttributes<SVGSVGElement>

- `* Fill color via `currentColor`.`
- `* - `yellow` — default on dark surfaces (#FFFF00)`
- `* - `black` — light-mode surfaces (#0A0A0A)`
- `* - `white` — on tinted or photographic backgrounds`
- `*/`
- `color?: MonogramColor`
- `size?: number`
- `title?: string`

## NoirGlowBackground — `NoirGlowBackgroundProps`

- `className?: string`
- `style?: CSSProperties`
- `shape?: ShaderShape`
- `intensity?: Intensity`
- `speed?: Speed`
- `grain?: Grain`
- `softness?: number`
- `colorBack?: string`
- `colors?: string[]`
- `preserveCenter?: boolean`
- `noiseOverlay?: boolean`
- `forceCssFallback?: boolean`
- `inert?: boolean`
- `offsetX?: number`
- `offsetY?: number`
- `scale?: number`

## PageHeader — `PageHeaderProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `eyebrow?: ReactNode`
- `title: ReactNode`
- `description?: ReactNode`
- `actions?: ReactNode`
- `meta?: ReactNode`
- `align?: PageHeaderAlign`
- `size?: PageHeaderSize`

## PageShell — `PageShellProps` extends extends HTMLAttributes<HTMLDivElement>

- `as?: 'div' | 'main'`
- `background?: PageShellBackground`
- `density?: PageShellDensity`

## Pagination — `PaginationProps` extends extends Omit<HTMLAttributes<HTMLElement>, 'onChange'>

- `page: number`
- `pageCount: number`
- `onChange: (page: number) => void`
- `siblingCount?: number`

## Panel — `PanelProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `title?: React.ReactNode`
- `description?: React.ReactNode`
- `actions?: React.ReactNode`

## PasswordInput — `PasswordInputProps` extends extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

- `label?: string`
- `error?: string`

## Pill — `PillProps` extends extends HTMLAttributes<HTMLSpanElement>

- `variant?: keyof typeof pillVariants`

## PricingCard — `PricingCardProps` extends extends HTMLAttributes<HTMLDivElement>

- `name: React.ReactNode`
- `price: React.ReactNode`
- `period?: React.ReactNode`
- `description?: React.ReactNode`
- `features?: React.ReactNode[]`
- `ctaLabel?: React.ReactNode`
- `onCtaClick?: () => void`
- `featured?: boolean`
- `badge?: React.ReactNode`

## RadioGroup — `RadioGroupProps`

- `label?: string`
- `error?: string`
- `value?: string`
- `onChange?: (value: string) => void`
- `name?: string`
- `children?: React.ReactNode`
- `className?: string`

## RadioGroup — `RadioProps` extends extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

- `label?: string`

## ResourceList — `ResourceListProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `title: ReactNode`
- `description?: ReactNode`
- `actions?: ReactNode`
- `filters?: ReactNode`
- `count?: ReactNode`
- `emptyState?: ReactNode`

## RollbackPlan — `RollbackPlanProps` extends extends HTMLAttributes<HTMLDivElement>

- `name: string`
- `steps: RollbackStep[]`
- `executing?: boolean`
- `loading?: boolean`

## Section — `SectionProps` extends extends HTMLAttributes<HTMLDivElement>

- `as?: 'section' | 'div' | 'article' | 'header' | 'footer'`
- `size?: SectionSize`
- `width?: SectionWidth`

## Segmented — `SegmentedProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>

- `options: SegmentedOption[]`
- `value: string`
- `onChange: (value: string) => void`
- `size?: 'sm' | 'md'`

## Select — `SelectProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>

- `label?: string`
- `error?: string`
- `placeholder?: string`
- `options?: SelectOption[]`
- `value?: string`
- `onChange?: (value: string) => void`

## ServiceHealthCard — `ServiceHealthCardProps` extends extends HTMLAttributes<HTMLDivElement>

- `service: string`
- `status?: Status`
- `uptime?: string`
- `responseTime?: string`
- `version?: string`
- `loading?: boolean`

## SettingsLayout — `SettingsLayoutProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `title: ReactNode`
- `description?: ReactNode`
- `actions?: ReactNode`
- `navItems?: SettingsNavItem[]`
- `activeId?: string`
- `onNavSelect?: (id: string) => void`

## Sheet — `SheetProps`

- `open?: boolean`
- `onOpenChange?: (open: boolean) => void`
- `children: ReactNode`

## SidebarNav — `SidebarNavProps` extends extends HTMLAttributes<HTMLElement>

- `projectName: ReactNode`
- `projectSubtitle?: ReactNode`
- `homeHref?: string`
- `groups?: SidebarNavGroup[]`
- `items?: SidebarNavItem[]`
- `onItemSelect?: (item: SidebarNavItem) => void`
- `children?: ReactNode`

## Skeleton — `SkeletonProps` extends extends React.HTMLAttributes<HTMLDivElement>

- `h?: number | string`
- `w?: number | string`
- `r?: number | string`

## Slider — `SliderProps` extends extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'>

- `label?: string`
- `showValue?: boolean`
- `onChange?: (value: number) => void`

## Sparkline — `SparklineProps` extends extends HTMLAttributes<HTMLDivElement>

- `data: number[]`
- `width?: number`
- `height?: number`
- `w?: number`
- `h?: number`
- `color?: string`

## Spinner — `SpinnerProps` extends extends HTMLAttributes<HTMLSpanElement>

- `size?: number`
- `style?: CSSProperties`

## Split — `SplitProps` extends extends HTMLAttributes<HTMLDivElement>

- `as?: 'div' | 'section'`
- `ratio?: SplitRatio`
- `gap?: SplitGap`
- `align?: SplitAlign`
- `reverse?: boolean`

## Stack — `StackProps` extends extends HTMLAttributes<HTMLDivElement>

- `as?: 'div' | 'section' | 'article' | 'header' | 'footer'`
- `gap?: StackGap`
- `align?: StackAlign`

## StatCard — `StatCardProps` extends extends HTMLAttributes<HTMLDivElement>

- `label: string`
- `value: string | number`
- `change?: { value: string; direction: 'up' | 'down' }`
- `accent?: boolean`

## StatsSection — `StatsSectionProps` extends extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>

- `eyebrow?: ReactNode`
- `title?: ReactNode`
- `description?: ReactNode`
- `actions?: ReactNode`
- `stats: StatCardProps[]`
- `columns?: GridColumns`

## StatusDot — `StatusDotProps` extends extends HTMLAttributes<HTMLSpanElement>

- `status?: Status`
- `label?: string`
- `noPulse?: boolean`

## Stepper — `StepperProps` extends extends HTMLAttributes<HTMLOListElement>

- `steps: StepperStep[]`
- `current: number`
- `orientation?: 'horizontal' | 'vertical'`

## Switch — `SwitchProps` extends extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

- `label?: string`

## TagInput — `TagInputProps`

- `value?: string[]`
- `defaultValue?: string[]`
- `onChange?: (tags: string[]) => void`
- `label?: string`
- `error?: string`
- `placeholder?: string`
- `max?: number`
- `className?: string`
- `disabled?: boolean`

## Textarea — `TextareaProps` extends extends TextareaHTMLAttributes<HTMLTextAreaElement>

- `label?: string`
- `error?: string`

## Timeline — `TimelineProps` extends extends HTMLAttributes<HTMLDivElement>

- `items: TimelineItemData[]`
- `active?: boolean`
- `loading?: boolean`

## Toast — `ToastProviderProps`

- `children: ReactNode`

## TopNav — `TopNavProps` extends extends HTMLAttributes<HTMLElement>

- `projectName: ReactNode`
- `homeHref?: string`
- `navItems?: TopNavItem[]`
- `actions?: ReactNode`
- `sticky?: boolean`
