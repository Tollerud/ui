# Getting Started

## Quick Install

```bash
# In your Next.js project:
npm install clsx tailwind-merge

# Optional — for NoirGlowBackground:
npm install @paper-design/shaders-react

# Copy the design system into your project:
cp -r /path/to/tia-noir/globals.css src/app/
cp /path/to/tia-noir/tia-preset.js .
cp -r /path/to/tia-noir/components src/components/ui
```

## Tailwind Setup

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import tiaPreset from './tia-preset'

const config: Config = {
  presets: [tiaPreset],
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
@import "./tia-noir.css";
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