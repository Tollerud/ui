# Brand Guidelines

## Monogram

The Tollerud monogram is the primary brand mark. Use the `Monogram` component in React apps, or `@tollerud/ui/brand/tollerud-logo.svg` for static assets. It is always yellow (`#FFFF00`) on dark backgrounds — never recolored, never outlined, never placed on a light surface without explicit approval.

```tsx
import { Monogram } from '@tollerud/ui'
```

### Rule: monogram always left of the project name

Whenever a project name or wordmark appears in a navigation context, the monogram sits immediately to its left with `gap-2` (8px) between them. The monogram is never used as a standalone text replacement — the pairing is the lockup.

```tsx
// Correct
<div className="flex items-center gap-2">
  <Monogram color="yellow" className="h-5 w-auto" />
  <span className="font-semibold text-sm text-white">Project Name</span>
</div>

// Wrong — monogram alone with no name
<Monogram color="yellow" className="h-5 w-auto" />

// Wrong — name without monogram
<span className="font-semibold text-sm text-white">Project Name</span>
```

### Sizing

| Context | Monogram height | Name size |
|---------|----------------|-----------|
| Top bar / header | `h-5` (20px) | `text-sm font-semibold` |
| Sidebar (expanded) | `h-5` (20px) | `text-sm font-semibold` |
| Sidebar (collapsed) | `h-6` (24px) | hidden |
| Footer | `h-4` (16px) | `text-xs` |

---

## Usage Examples

### Top bar

```tsx
import { Button, TopNav } from '@tollerud/ui'

<TopNav
  projectName="Dashboard"
  navItems={[
    { label: 'Overview', href: '/', active: true },
    { label: 'Services', href: '/services' },
    { label: 'Logs', href: '/logs' },
  ]}
  actions={<Button size="sm" variant="primary">Deploy</Button>}
/>
```

### Page header (inline, not fixed)

```tsx
import { PageHeader } from '@tollerud/ui'

<PageHeader
  eyebrow="mission control"
  title="Dashboard"
  description="Fleet health at a glance."
/>
```

### App shell with sidebar

```tsx
import { Button, DashboardShell, PageHeader, Stack } from '@tollerud/ui'

<DashboardShell
  projectName="Dashboard"
  projectSubtitle="workspace"
  pageTitle="Overview"
  sidebarItems={[
    { id: 'overview', label: 'Overview', href: '/', active: true },
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'settings', label: 'Settings', href: '/settings' },
  ]}
  header={<PageHeader title="Overview" description="Fleet health at a glance." />}
>
  {/* page content */}
</DashboardShell>
```

### Footer

The `Footer` component handles the monogram automatically — no manual placement needed.

**Using the full design system** — import from `@tollerud/ui`:

```tsx
import { Footer } from '@tollerud/ui'

<Footer />
<Footer layout="row" />
<Footer accent />
```

**Standalone** — if the project doesn't use `@tollerud/ui`, install the footer package on its own (React only, no Tailwind dependency):

```bash
npm install @tollerud/footer
```

```tsx
import { Footer } from '@tollerud/footer'

<Footer />
<Footer layout="row" labels={{ attribution: 'for Acme AS.' }} />
```

See [COMPONENTS.md](COMPONENTS.md#footer) for all `Footer` props.

---

## Don'ts

| | Reason |
|--|--------|
| Don't recolor the monogram | Yellow is non-negotiable — it's the brand signal |
| Don't place on light backgrounds | The mark is designed for dark surfaces only |
| Don't show a project name without the monogram | The lockup is the brand, not the text alone |
| Don't scale below `h-4` (16px) | The mark loses legibility at smaller sizes |
| Don't add drop shadows or glows to the monogram | Glow is reserved for interactive UI elements |
