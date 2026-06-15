import {
  Badge,
  Button,
  Card,
  CardGrid,
  Footer,
  PageHeader,
  PageShell,
  Section,
  Stack,
  StatCard,
  StatusDot,
} from '@tollerud/ui'

export default function Home() {
  return (
    <PageShell background="grid">
      <Section size="md" width="narrow">
        <Stack gap="lg">
          <PageHeader
            eyebrow="Starter"
            title="Tollerud UI on Next.js"
            description="Component-first page structure — PageShell, Section, Stack, and screen patterns. Tailwind is only used for small local glue."
          />

          <CardGrid columns={2}>
            <Card>
              <Stack gap="sm">
                <StatusDot status="online" label="Package resolved" />
                <Badge variant="accent">@tollerud/ui</Badge>
                <p className="text-sm text-tollerud-text-secondary">
                  Imports from the barrel. Import <code className="font-mono">cn</code> from{' '}
                  <code className="font-mono text-tollerud-yellow">@tollerud/ui</code>
                  {' '}— or <code className="font-mono">@tollerud/ui/utils</code> when tree-shaking.
                </p>
              </Stack>
            </Card>
            <Card accent>
              <Stack gap="sm">
                <StatCard label="Layout" value="PageShell" />
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="sm">
                    Primary
                  </Button>
                  <Button variant="secondary" size="sm">
                    Secondary
                  </Button>
                  <Button variant="terminal" size="sm">
                    deploy
                  </Button>
                </div>
              </Stack>
            </Card>
          </CardGrid>

          <p className="text-sm text-tollerud-text-muted">
            Docs:{' '}
            <a
              href="https://design.tollerud.dev/recipes/"
              className="text-tollerud-yellow underline-offset-2 hover:underline"
            >
              Recipes
            </a>
            {' · '}
            <a
              href="https://design.tollerud.dev/"
              className="text-tollerud-yellow underline-offset-2 hover:underline"
            >
              design.tollerud.dev
            </a>
          </p>
        </Stack>
      </Section>
      <Footer />
    </PageShell>
  )
}
