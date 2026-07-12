# Claude Code — Project Instructions

## Release checklist (mandatory on every version bump)

When changing any component API, fixing a bug, or bumping the version, ALL of these must be done in the same commit — not separately, not skipped:

1. `package.json` — bump `version`
2. `CHANGELOG.md` — new entry at top: `## version — YYYY-MM-DD — Title` with blank lines between every block
3. `COMPLETENESS_ROADMAP.md` — update `### npm package (components/*.tsx) — vX.X.X` header
4. `SKILL.md` — update prop docs for changed components + add a version note bullet in the Version notes section
5. `AGENTS.md` — update usage examples for any changed components
6. `COMPONENTS.md` — update version header + add/update component sections for any new or changed components
7. `docs-app/` — update relevant page(s): add/update `desc` on the `Section`, add a `Demo` with a code snippet for any new prop or behaviour

Then run:
```bash
npm run sync:registry   # syncs registry.json + packages/footer/package.json + packages/email/package.json
npm run docs:props      # regenerates PROPS.generated.md + docs-app/lib/props-data.json
npm run validate        # also updates fixtures/consumer/package.json + package-lock.json
```

If any `@tollerud/email` template or primitive changed, also regenerate the docs email previews:
```bash
npm run gen:email-previews   # rewrites docs-app/public/email/*.html (embedded in the docs Email page)
```

Stage all generated files — CI fails if they are stale.

This is enforced by a git pre-commit hook (`scripts/pre-commit-release-check.mjs`). The hook will block a commit that bumps the version without touching all required files.

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
