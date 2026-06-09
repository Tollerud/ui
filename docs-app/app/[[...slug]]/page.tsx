import { DocsShell } from '@/components/docs-shell'
import { ALL_ROUTES } from '@/lib/docs-routes'

export const dynamicParams = false

export function generateStaticParams() {
  return [{ slug: [] }, ...ALL_ROUTES.map((id) => ({ slug: [id] }))]
}

export default async function DocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  const route = slug?.[0] || 'overview'
  return <DocsShell route={route} />
}
