# Tia Noir — Voice & Copy

## Tone

Direct. Technical. Warm-but-not-corporate. Think terminal prompt, not marketing email.

## Labels

```
✅  "Deploy"     → short, action-first
❌  "Click here to initiate deployment" → too wordy
✅  "❯ start_building" → terminal-style is allowed
✅  "Open Dashboard"
✅  "View Logs"
```

## Terminal-style CTAs

Use `❯ ` prefix for homelab/infra actions. This adds personality without being
unprofessional — it signals "this is a tool, not a brochure".

```
❯ deploy --env production
❯ open_dashboard
❯ start_building --free
$ init
$ --help
```

Only use terminal style for technical actions — deploy, build, configure,
monitor, SSH. Not for generic stuff like "Sign up" or "Learn more".

## Error messages

```
✅  "Connection to emma.tollerud.no timed out"
✅  "Could not resolve host — check DNS"
✅  "Invalid config: missing required field 'port'"
❌  "Oops! Something went wrong on our end!"
```

Be specific. Tell the user what happened and what they can do about it.

## Confirmations

Destructive actions (delete, stop, remove) must be confirmed with clear
language:

```
✅  "Stop all containers on emma?"
    [Stop] [Cancel]

✅  "Delete config file 'docker-compose.yml'?"
    This action cannot be undone.
    [Delete] [Cancel]
```

## Empty states

```
✅  "No active sessions"
✅  "No alerts — everything looks good"
✅  "No logs match the current filter"
❌  "There are currently no items to display"
```

## What not to say

- "We" — there is no "we". It's you and the tools.
- "Our platform" — it's a homelab, not a SaaS
- "Get started" — say what they're starting
- "Leverage" — just say use
- "Solution" — vague
- "Let's" — we're not a team of consultants

## Voice examples

| Context | Right | Wrong |
|---------|-------|-------|
| Dashboard header | Tia Mission Control | Welcome to your personalized dashboard |
| Empty state | No containers running | There are no containers running at this time |
| Deploy button | ❯ deploy | Submit deployment request |
| Error | Port 8080 is in use | We encountered an error while binding the port |
| Success | emma — deployment complete | Your deployment has been successfully completed |
