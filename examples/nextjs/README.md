# Next.js Example

Quickest way to start:

```bash
# In your Next.js project root:
npm install @paper-design/shaders-react
cp design-system/tia-preset.js .
cp design-system/globals.css src/app/
cp -r design-system/components src/
```

Then in `tailwind.config.ts`:

```ts
import tiaPreset from './tia-preset'
export default {
  presets: [tiaPreset],
  content: ['./src/**/*.{ts,tsx}'],
}
```

And in `src/app/globals.css`:

```css
@import './globals.css';
```

Open `app/page.tsx` for a full example page with:
- Tollerud.no-inspired `NoirGlowBackground` hero
- Glass nav bar
- Server status cards with StatusDot
- Terminal-style CTAs
- Gradient accent bars
- CodeBlock component
- Responsive layout
- All available components
