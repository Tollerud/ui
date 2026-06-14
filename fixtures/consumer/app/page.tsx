/* @tollerud/ui fixture — tarball install smoke test (layout + screen pattern imports) */
import {
  Badge,
  Button,
  Card,
  PageHeader,
  PageShell,
  Section,
  Stack,
  StatusDot,
} from '@tollerud/ui'

export default function Home() {
  return (
    <PageShell background="plain">
      <Section size="sm" width="narrow">
        <Stack gap="md">
          <PageHeader title="@tollerud/ui install check" description="Layout primitives resolve from the packed tarball." />
          <Card accent>
            <Stack gap="sm">
              <StatusDot status="online" label="Package resolved" />
              <Badge variant="accent">PageShell · Section · Stack</Badge>
              <Button variant="primary">Build passed</Button>
            </Stack>
          </Card>
        </Stack>
      </Section>
    </PageShell>
  )
}
