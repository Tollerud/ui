# @tollerud/email

On-brand, client-tested **HTML email** for the Tollerud design system, built on
[React Email](https://react.email/).

Email is a different render target from the browser — table-based layout,
inline-only styles, no CSS custom properties, and aggressive client quirks
(Outlook's Word engine, Gmail, corporate webmail). So this package **shares
Tollerud's design tokens, not the `@tollerud/ui` web components**. Token values
are inlined as literals (via the generated `lib/tokens.ts` in the monorepo root),
because `var(--tollerud-*)` does not resolve in mail clients.

> Do **not** render `@tollerud/ui` React components into email. They rely on
> flexbox/grid, external stylesheets, and CSS variables that break in many
> inboxes. Use the primitives here instead.

## Install

```bash
npm install @tollerud/email
```

Peer deps: `react` / `react-dom` (>=18).

## Usage

Compose a template as a React element and `render` it to an HTML string, then
hand that string to your mailer (Resend, AWS SES, Nodemailer, Postmark, …).

```tsx
import { render, WelcomeEmail } from '@tollerud/email'

const html = await render(
  <WelcomeEmail
    name="Mathias"
    productName="Graphify"
    ctaUrl="https://app.example.com/dashboard"
    header={{ productName: 'Graphify' }}
    footer={{ labels: { tollerudProject: 'A Tollerud Project' }, address: 'Oslo, Norway', unsubscribeUrl }}
  />,
)

await mailer.send({ to, subject: 'Welcome to Graphify', html })
```

Or build your own from primitives:

```tsx
import { render, EmailLayout, EmailHeader, EmailHeading, EmailText, EmailButton, EmailFooter } from '@tollerud/email'

const html = await render(
  <EmailLayout preview="Your report is ready">
    <EmailHeader productName="Graphify" />
    <EmailHeading>Weekly report</EmailHeading>
    <EmailText>Your report for last week is ready to view.</EmailText>
    <EmailButton href={reportUrl}>View report</EmailButton>
    <EmailFooter unsubscribeUrl={reportUrl} />
  </EmailLayout>,
)
```

## Exports

**Rendering** — `render`, `pretty`, `toPlainText` (re-exported from
`@react-email/render`; `render` is async-capable).

**Primitives**

| Component | Key props |
|-----------|-----------|
| `EmailLayout` | `preview?`, `lang?` — the `<Html>/<Head>/<Body>` shell (light default + dark-mode `<style>`) |
| `EmailHeader` | `productName`, `monogram?`, `logoSrc?`, `align?: 'left' \| 'center'`, `divider?` — branded top (monogram + project name large) |
| `BrandMark` | `height?`, `src?` — the monogram (hosted PNG; auto dark-on-light / yellow-in-dark, or your own via `src`) |
| `EmailButton` | `href`, `variant?: 'primary' \| 'secondary'` |
| `EmailHeading` | `as?: 'h1' \| 'h2' \| 'h3'` |
| `EmailText` | `tone?: 'default' \| 'muted' \| 'fine'` |
| `EmailDivider` | `variant?: 'default' \| 'accent'` |
| `EmailFooter` | `labels?` (`tollerudProject`/`attribution`/`allRightsReserved`), `monogram?`, `logoSrc?`, `address?`, `unsubscribeUrl?`, `links?` — the Tollerud footer, → tollerud.no |

**Templates** — `WelcomeEmail`, `VerifyEmail`, `PasswordResetEmail`,
`ReceiptEmail`. Each accepts an optional `header?: EmailHeaderProps` to render
the branded header at the top, and an overridable `copy` prop (see below).

### Configurability

- **Content + branding** are fully prop-driven (`name`, `productName`, URLs,
  `header`, `footer`, `labels`, …).
- **Copy / i18n** — every template takes a `copy` prop. Each exports a `*Copy`
  interface whose dynamic lines are functions (so interpolated values still
  flow through) and static lines are strings. Pass any subset to reword or
  localize; defaults are unchanged.

  ```tsx
  <WelcomeEmail
    name="Mathias" productName="Graphify" ctaUrl={url} ctaLabel="Åpne dashbordet"
    copy={{
      heading: (n) => `Velkommen${n ? ', ' + n : ''}.`,
      body: (p) => `Din ${p}-konto er klar. Ta en titt rundt.`,
      help: 'Trenger du hjelp? Bare svar på denne e-posten.',
    }}
  />
  ```

- **Style escape hatch** — every primitive takes an optional `style` merged
  **last**, overriding the token defaults for one-off tweaks:
  `<EmailButton href={url} style={{ borderRadius: '999px' }}>Pill</EmailButton>`.
- **Visual design** otherwise stays token-locked to the Tollerud brand by
  default — colors, fonts, spacing, and sizes come from the shared tokens, so
  emails stay on-brand unless you deliberately override via `style`.

### Monogram in email

`EmailHeader` and `EmailFooter` show the Tollerud monogram via `BrandMark`, as a
**hosted PNG** — inline SVG is stripped by Gmail and Outlook. By default it uses
the dark monogram on light backgrounds and swaps to the yellow monogram in dark
mode (`design.tollerud.dev/brand/email-monogram-{dark,yellow}.png`; regenerate
with `node scripts/gen-email-monogram.mjs`). Pass `logoSrc` to use your own
hosted image (a single image, no dark-mode swap). The large project name in the
header always renders too, so the brand reads regardless.

**Tokens** — `tokens` (raw values, synced from `@tollerud/ui`) and `emailTheme`
(email semantic mapping).

## Theme & dark mode

The email is **light by default** — a light background is the only thing that
renders predictably in every client, including Gmail. (Gmail ignores
`color-scheme`, applies its own color transforms to dark emails, and strips
inline SVG, so a dark-first email breaks there.)

- Inline styles are light (white card, dark text, yellow button); surfaces also
  carry `bgcolor` attributes.
- A `@media (prefers-color-scheme: dark)` `<style>` block restores the noir
  palette on clients that honor it — **Apple Mail, iOS Mail**. Gmail ignores it
  and keeps the safe light rendering.
- The yellow button stays `#FFFF00` with **black** text in both modes.
- Still test in [Litmus](https://litmus.com/) or
  [Email on Acid](https://www.emailonacid.com/) before a large send.

## Compliance

For bulk mail, pass `address` and `unsubscribeUrl` to `EmailFooter` (or the
template `footer` prop) to stay CAN-SPAM compliant.

## Maintenance (monorepo)

Tokens and version are synced from the root package — do not hand-edit
`src/tokens.ts` or the version in `package.json`:

```bash
npm run gen:tokens   # regenerate lib/tokens.ts from tokens.css
npm run sync:email   # copy tokens + lock version into packages/email
```

`npm run validate` runs `verify:email-sync` to enforce lockstep.
