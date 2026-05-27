# Getting Started

## Quick Install

```bash
# In your Next.js project:
npm install clsx tailwind-merge

# Optional — for NoirGlowBackground:
npm install @paper-design/shaders-react

# Copy the design system into your project:
cp -r /path/to/tollerud-noir/globals.css src/app/
cp /path/to/tollerud-noir/tollerud-preset.js .
cp -r /path/to/tollerud-noir/components src/components/ui
```

## Tailwind Setup

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import tollerudPreset from './tollerud-preset'

const config: Config = {
  presets: [tollerudPreset],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
}

export default config
```

```css
/* src/app/globals.css */
@import "tailwindcss/preflight";
@import "tailwindcss/utilities";
@import "./tollerud-noir.css";
```

## Utils

Create `src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Import Components

```tsx
import { Button, Card, Badge, Kbd } from '@/components/ui'
import { CommandMenu } from '@/components/ui'
import { LogViewer, Timeline } from '@/components/ui'
```

## Using the Registry

`s ...[truncated]