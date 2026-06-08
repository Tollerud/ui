This project uses the Tollerud Design System (`@tollerud/ui`).

See [AGENTS.md](../AGENTS.md) at the repo root for full guidance: install, Tailwind setup, component APIs, color tokens, layout patterns, copy voice, and accessibility rules.

Key rules at a glance:
- Dark surfaces only — background `#0A0A0A`, never white or light gray
- Yellow (`#E8D500`) is the single accent color — CTAs, focus rings, key data only
- All components import from `@tollerud/ui` as named imports
- The Tailwind preset (`@tollerud/ui/preset`) must be applied — token classes won't resolve without it
- Navigation always uses the monogram + project name lockup (`gap-2`, monogram `h-5`)
