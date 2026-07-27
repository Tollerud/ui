import { type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Monogram } from './Monogram'
import { NoirGlowBackground } from './NoirGlowBackground'
import { PageHeader } from './PageHeader'

export interface AuthSplitLayoutProps {
  projectName: string
  eyebrow?: string
  title: string
  /** Word(s) in `title` to render with shimmer — passed straight through to `PageHeader`'s `shimmer`. */
  highlight: string
  description: string
  /** Optional decorative element in the hero panel — e.g. a product card, tilted for flourish. */
  decoration?: ReactNode
  /** Render the live NoirGlowBackground shader behind the hero panel. Default true. */
  glow?: boolean
  homeHref?: string
  children: ReactNode
}

/**
 * Two-panel auth screen: brand/hero on the left (hidden below `lg`), form on
 * the right. Composes `Monogram` + `PageHeader` + `NoirGlowBackground` — the
 * pattern most Tollerud apps hand-build for sign-in/sign-up/reset screens.
 */
const AuthSplitLayout = forwardRef<HTMLDivElement, AuthSplitLayoutProps>(
  (
    { projectName, eyebrow, title, highlight, description, decoration, glow = true, homeHref = '/', children },
    ref
  ) => {
    return (
      <div ref={ref} className="grid min-h-screen lg:grid-cols-2">
        <div
          className={cn(
            'relative hidden flex-col justify-center overflow-hidden border-r border-tollerud-noir-800 p-12 lg:flex',
            !glow && 'bg-tollerud-noir-900/40'
          )}
        >
          {glow && (
            <NoirGlowBackground
              shape="corners"
              intensity="subtle"
              speed="slow"
              grain="soft"
              inert
              scale={1.1}
              className="absolute inset-0"
            />
          )}

          <a href={homeHref} className="absolute left-12 top-10 flex items-center gap-3">
            <Monogram color="yellow" size={50} />
            <span className="text-2xl font-bold">{projectName}</span>
          </a>

          <div className="relative max-w-md">
            <PageHeader
              eyebrow={eyebrow}
              title={`${title} ${highlight}`}
              shimmer={highlight}
              className="mb-0"
            />
            <p className="mt-4 text-base text-white">{description}</p>

            {decoration && <div className="mt-8">{decoration}</div>}
          </div>
        </div>

        <div className="flex flex-col bg-tollerud-noir-950 p-6 lg:p-10">
          <a href={homeHref} className="mb-12 flex items-center gap-3 lg:hidden">
            <Monogram color="yellow" size={50} />
            <span className="text-2xl font-bold">{projectName}</span>
          </a>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </div>
      </div>
    )
  }
)
AuthSplitLayout.displayName = 'AuthSplitLayout'

export { AuthSplitLayout }
