This project uses Tollerud User Interface / Tollerud UI (`@tollerud/ui`).

See [AGENTS.md](../AGENTS.md) at the repo root for full guidance: install, Tailwind setup, component APIs, color tokens, layout patterns, copy voice, and accessibility rules.

Key rules at a glance:
- Dark surfaces only — background `#0A0A0A`, never white or light gray
- Yellow (`#FFFF00`, `text-tollerud-yellow`) is the single accent — CTAs, focus rings, key data only
- All components import from `@tollerud/ui` as named imports
- Tailwind v4: `@import "@tollerud/ui/globals.css"` plus `@source` to the package `dist` folder (preset optional)
- Navigation always uses the monogram + project name lockup (`gap-2`, monogram `h-5`)
