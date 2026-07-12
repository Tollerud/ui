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
| `EmailLayout` | `preview?`, `lang?` — the `<Html>/<Head>/<Body>` shell + dark surface |
| `EmailHeader` | `productName`, `monogram?`, `logoSrc?`, `color?`, `align?: 'left' \| 'center'`, `divider?` — branded top (monogram + project name large) |
| `BrandMark` | `color?: 'yellow' \| 'white' \| 'black'`, `height?`, `src?` — the monogram (inline SVG, or hosted image via `src`) |
| `EmailButton` | `href`, `variant?: 'primary' \| 'secondary'` |
| `EmailHeading` | `as?: 'h1' \| 'h2' \| 'h3'` |
| `EmailText` | `tone?: 'default' \| 'muted' \| 'fine'` |
| `EmailDivider` | `variant?: 'default' \| 'accent'` |
| `EmailFooter` | `labels?` (`tollerudProject`/`attribution`/`allRightsReserved`), `monogram?`, `logoSrc?`, `address?`, `unsubscribeUrl?`, `links?` — the Tollerud footer, → tollerud.no |

**Templates** — `WelcomeEmail`, `VerifyEmail`, `PasswordResetEmail`,
`ReceiptEmail`. Each accepts an optional `header?: EmailHeaderProps` to render
the branded header at the top.

### Monogram in email

`EmailHeader` and `EmailFooter` show the Tollerud monogram via `BrandMark`. By
default it's an **inline SVG** — crisp in Apple Mail / iOS Mail / some webmail,
but **stripped by Outlook desktop and Gmail**. Where full coverage matters, host
a PNG/GIF of the monogram and pass its URL as `logoSrc` (header) or `logoSrc`
(footer). The large project name in the header always renders, so the brand
reads even where the mark doesn't.

**Tokens** — `tokens` (raw values, synced from `@tollerud/ui`) and `emailTheme`
(email semantic mapping).

## Dark mode caveat

Tollerud's palette is dark (near-black surface, yellow accent). Email dark-mode
support is genuinely uneven:

- Primitives set explicit `bgcolor` + inline `background-color` on every surface,
  plus `color-scheme` / `supported-color-schemes` meta so Apple Mail and iOS Mail
  respect the palette instead of re-inverting it.
- The primary button is yellow with **black** text — a deliberately
  high-contrast pairing that survives clients that force inversion.
- Outlook.com and some Gmail contexts may still nudge colors. Test in
  [Litmus](https://litmus.com/) or [Email on Acid](https://www.emailonacid.com/)
  before a large send.

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
