# Brand Guidelines

## Monogram

The Tollerud monogram (`brand/tollerud-logo.svg`) is the primary brand mark. It is always yellow (`#FFFF00`) on dark backgrounds — never recolored, never outlined, never placed on a light surface without explicit approval.

```tsx
import logo from '@tollerud/ui/brand/tollerud-logo.svg'
```

### Rule: monogram always left of the project name

Whenever a project name or wordmark appears in a navigation context, the monogram sits immediately to its left with `gap-2` (8px) between them. The monogram is never used as a standalone text replacement — the pairing is the lockup.

```tsx
// Correct
<div className="flex items-center gap-2">
  <img src={logo} alt="Tollerud" className="h-5 w-auto" />
  <span className="font-semibold text-sm text-white">Project Name</span>
</div>

// Wrong — monogram alone with no name
<img src={logo} alt="Tollerud" className="h-5 w-auto" />

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

### Top bar (fixed, full-width)

```tsx
import logo from '@tollerud/ui/brand/tollerud-logo.svg'

<nav className="tollerud-glass fixed top-0 inset-x-0 z-50 h-14 flex items-center px-6 gap-6">
  {/* Lockup — always far left */}
  <div className="flex items-center gap-2 shrink-0">
    <img src={logo} alt="Tollerud" className="h-5 w-auto" />
    <span className="font-semibold text-sm text-white">Dashboard</span>
  </div>

  {/* Nav links */}
  <div className="flex items-center gap-4 ml-4">
    <a href="/overview" className="text-sm text-tollerud-noir-200 hover:text-white transition-colors">Overview</a>
    <a href="/services" className="text-sm text-tollerud-noir-200 hover:text-white transition-colors">Services</a>
    <a href="/logs"     className="text-sm text-tollerud-noir-200 hover:text-white transition-colors">Logs</a>
  </div>

  {/* Right side actions */}
  <div className="ml-auto flex items-center gap-3">
    <Button variant="ghost" size="sm">Sign in</Button>
    <Button variant="primary" size="sm">Get started</Button>
  </div>
</nav>

{/* Page offset */}
<main className="pt-14">...</main>
```

### Page header (inline, not fixed)

```tsx
<header className="border-b border-tollerud-noir-600 px-6 py-4">
  <div className="flex items-center gap-2">
    <img src={logo} alt="Tollerud" className="h-5 w-auto" />
    <span className="font-semibold text-sm text-white">Project Name</span>
  </div>
</header>
```

### Sidebar — expanded

```tsx
<aside className="w-56 h-screen bg-tollerud-noir-900 border-r border-tollerud-noir-600 flex flex-col">
  {/* Lockup at top */}
  <div className="flex items-center gap-2 px-4 h-14 border-b border-tollerud-noir-600 shrink-0">
    <img src={logo} alt="Tollerud" className="h-5 w-auto" />
    <span className="font-semibold text-sm text-white">Project Name</span>
  </div>

  {/* Nav items */}
  <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
    <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded text-sm text-tollerud-noir-200 hover:bg-tollerud-noir-700 hover:text-white transition-colors">
      Dashboard
    </a>
    <a href="/services" className="flex items-center gap-2 px-3 py-2 rounded text-sm text-tollerud-noir-200 hover:bg-tollerud-noir-700 hover:text-white transition-colors">
      Services
    </a>
  </nav>
</aside>
```

### Sidebar — collapsed (icon-only)

When the sidebar collapses to icon width, hide the project name and increase the monogram slightly so it remains legible.

```tsx
<aside className="w-14 h-screen bg-tollerud-noir-900 border-r border-tollerud-noir-600 flex flex-col items-center">
  {/* Monogram only — no text */}
  <div className="flex items-center justify-center h-14 border-b border-tollerud-noir-600 w-full">
    <img src={logo} alt="Tollerud" className="h-6 w-auto" />
  </div>

  <nav className="flex-1 flex flex-col items-center gap-1 py-3">
    {/* Icon-only nav items */}
  </nav>
</aside>
```

### Responsive sidebar (expanded → collapsed)

```tsx
'use client'
import { useState } from 'react'
import logo from '@tollerud/ui/brand/tollerud-logo.svg'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`h-screen bg-tollerud-noir-900 border-r border-tollerud-noir-600 flex flex-col transition-all duration-200 ${collapsed ? 'w-14' : 'w-56'}`}>
      <div className={`flex items-center h-14 border-b border-tollerud-noir-600 shrink-0 ${collapsed ? 'justify-center px-0' : 'gap-2 px-4'}`}>
        <img src={logo} alt="Tollerud" className={collapsed ? 'h-6 w-auto' : 'h-5 w-auto'} />
        {!collapsed && <span className="font-semibold text-sm text-white truncate">Project Name</span>}
      </div>
      {/* ... nav items ... */}
    </aside>
  )
}
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
