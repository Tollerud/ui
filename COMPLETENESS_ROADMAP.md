# Tollerud User Interface — Roadmap

Last updated: 2026-06-09

## Current state — what's done

### Tokens
- ✅ Brand tokens (yellow, amber, noir scale)
- ✅ Semantic tokens (background, foreground, card, primary, secondary, muted, accent, destructive, success, warning, info, border, input, ring)
- ✅ Surface tokens (surface, surface-raised, surface-overlay, surface-hover)
- ✅ Text tokens (text-primary, text-secondary, text-muted, text-inverse)
- ✅ Chart tokens (chart-1 through chart-5, chart-grid, chart-axis)
- ✅ Motion tokens (duration-fast/normal/slow, ease-out/in/in-out)
- ✅ Elevation / z-index tokens
- ✅ Shadow scale
- ✅ Typography tokens (font-sans, font-mono, font-display)
- ✅ Light mode — full contrast-checked palette with deep gold accent text (#8A7A00)
- ✅ Dark mode default
- ✅ `prefers-reduced-motion` respected globally

### Components (docs site — docs/components.jsx)
- ✅ Button — 5 variants, 3 sizes, icon, loading, disabled, icon-only
- ✅ Card — accent, density prop
- ✅ Badge — 6 variants
- ✅ Pill — 4 variants
- ✅ StatusDot — online/warning/offline/idle
- ✅ Kbd — shortcut chips
- ✅ Input — default, filled, error, disabled, readonly
- ✅ Textarea
- ✅ Select
- ✅ Checkbox
- ✅ Switch — with pointer cursor
- ✅ RadioGroup / Radio
- ✅ Slider
- ✅ StatCard
- ✅ Progress
- ✅ Skeleton
- ✅ Avatar + AvatarGroup — in same section
- ✅ Divider — default + accent
- ✅ Tabs — pill + underline variants
- ✅ Accordion
- ✅ Tooltip — fade in/out animation
- ✅ Alert — 5 tones (default, accent, info, success, error), custom icon prop
- ✅ Breadcrumb
- ✅ Pagination
- ✅ Dropdown menu — portalled to body, closes on scroll
- ✅ Dialog — portalled to body
- ✅ Drawer / Sheet — portalled to body
- ✅ Combobox — portalled to body, closes on scroll
- ✅ DatePicker — portalled to body, closes on scroll
- ✅ EmptyState — standard + compact + accent
- ✅ LogViewer (static) + StreamingLogViewer (console page)
- ✅ Spinner
- ✅ Panel — title, icon, multiple actions, footer
- ✅ Meter — with hot threshold
- ✅ Stepper — array of strings, 0-based current index
- ✅ PasswordInput
- ✅ FormRow
- ✅ PricingCard
- ✅ Toast / useToast
- ✅ DataTable — stable height on search, sort, select, bulk, pagination
- ✅ Density — `<Card density="compact">` + `data-density` container wrapper

### npm package (components/*.tsx) — v1.1.5
- ✅ Button — defaults to secondary, `asChild` (Radix Slot) + exported `buttonVariants` since 1.0.7
- ✅ Bundle correctly marked `'use client'` for RSC/SSR safety since 1.0.8
- ✅ Card — density prop
- ✅ Badge — all 6 variants
- ✅ Alert — all 5 tones, icon prop
- ✅ Input, Textarea, Select, Checkbox, Switch, RadioGroup
- ✅ StatusDot, Kbd, StatCard, Progress, Skeleton
- ✅ Dialog, Tooltip, Tabs, DropdownMenu, Sheet, DataTable
- ✅ LogViewer, Timeline, Empty, Toaster
- ✅ Infrastructure: HostCard, ServiceHealthCard, DockerStackCard, IncidentCard, ApprovalCard, BackupStatusPanel, AlertInbox, RollbackPlan, ActionDiff
- ✅ CommandMenu, ActionRow, CodeBlock, GlowCard, BentoDashboard, Footer
- ✅ Container, NoirGlowBackground
- ✅ Divider, Pill, Avatar, AvatarGroup, Breadcrumb, Pagination, Segmented, Stepper
- ✅ Panel, Meter, FormRow, PricingCard
- ✅ Accordion, Slider, PasswordInput
- ✅ Combobox, DatePicker, FileUpload, TagInput
- ✅ Tailwind preset exposes package utilities under `tollerud.*`

### Docs site
- ✅ Light/dark theme toggle (⌘L)
- ✅ Live background switcher — 5 dark / 4 light presets
- ✅ Command palette (⌘K) with cross-page section search
- ✅ Table of contents per page
- ✅ All demos copy-pasteable
- ✅ No duplicate sections across pages
- ✅ Mobile responsive

### Other
- ✅ Scroll-reveal disableable via `window.TOLLERUD_NO_REVEAL = true` or `<html data-no-reveal>`
- ✅ Text selection — yellow highlight, dark text on both themes
- ✅ All icons are hand-written SVGs (no third-party license)

---

## Still missing / worth doing next

### Quality
- ~~Combobox / DropdownMenu don't reposition on window resize~~ — fixed in 1.1.0 (Combobox + DatePicker now close on resize, matching scroll behaviour; DropdownMenu was already handled by Radix)
- No Storybook or visual regression tests for the npm package
- `CHANGELOG.md` is manual — could be auto-generated from commits
