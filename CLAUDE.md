# Claude Code — Project Instructions

## Release checklist (mandatory on every version bump)

When changing any component API — including the sibling packages `@tollerud/email` and `@tollerud/footer` — fixing a bug, or bumping the version, ALL of these must be done in the same commit. Versions are **lockstep**: `@tollerud/ui`, `@tollerud/footer`, and `@tollerud/email` always ship the same version (an email-only change is still a full release). Not separately, not skipped:

1. `package.json` — bump `version`
2. `CHANGELOG.md` — new entry at top: `## version — YYYY-MM-DD — Title` with blank lines between every block
3. `COMPLETENESS_ROADMAP.md` — update `### npm package (components/*.tsx) — vX.X.X` header
4. `SKILL.md` — update prop docs for changed components + add a version note bullet in the Version notes section
5. `AGENTS.md` — update usage examples for any changed components
6. `COMPONENTS.md` — update version header + add/update component sections for any new or changed components
7. `docs-app/` — update relevant page(s): add/update `desc` on the `Section`, add a `Demo` with a code snippet for any new prop or behaviour
8. `packages/email/README.md` — update for any `@tollerud/email` API change. If the monogram changed, re-run `node scripts/gen-email-monogram.mjs` (rewrites `brand/email-monogram-*.png`)

Then run:
```bash
npm run sync:registry      # syncs registry.json + packages/footer/package.json + packages/email/package.json
npm run docs:props         # regenerates PROPS.generated.md + docs-app/lib/props-data.json
npm run check:ignored-deps # flag Dependabot-ignored deps that are behind (e.g. @paper-design/shaders-react)
npm run validate           # also updates fixtures/consumer/package.json + package-lock.json
```

`check:ignored-deps` is the release checkpoint for **lockstep-pinned** deps: if `@paper-design/shaders-react` shows BEHIND, bump it in lockstep (peer + docs-app + fixtures + examples) as part of the release. A monthly `stale-ignore-audit` workflow does the same check and opens a tracking issue between releases.

Stage all generated files — CI fails if they are stale.

This is enforced by a git pre-commit hook (`scripts/pre-commit-release-check.mjs`). The hook will block a commit that bumps the version without touching all required files.

## After publishing (post-release follow-ups)

Publishing is done by CI on push to `main`. The docs Email configurator compiles `@tollerud/email` from **local source** (aliased in `docs-app/next.config.mjs` to `../packages/email/src`), so it always reflects the current code — **no docs-app bump is needed** after an email release.

The one thing that can only be done **after** the new version is live on npm (a **second commit**):

- **Lockstep consumers of `@paper-design/shaders-react`** — when the peer advances, `examples/next-starter` (and `fixtures/consumer`) can only install the new version after the matching `@tollerud/ui` is on npm. Align them in a follow-up commit. See the release-checkpoint note above.

## Validate before pushing

```bash
npm run validate
```

Full gate: typecheck + lint + test + build + subpath + drift + package + size + props + footer-sync + docs + consumer tests.

## CHANGELOG format rules

- Entry heading: `## version — YYYY-MM-DD — Title`
- Blank line between **every** distinct block (paragraph, heading, list, code fence)
- Section headings inside an entry: `### Heading` or `**Bold line**` on its own line after a blank line
- Never bold inline mid-paragraph as a heading substitute
