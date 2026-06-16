'use client'

export * from './ui-merged'
export { toast } from 'sonner'
export {
  highlight,
  CopyButton,
  Demo,
  CodeSnippet,
  PageHeader,
  Section,
  SubHead,
  Swatch,
  TokenTable,
  PropTable,
} from '../components/kit/primitives'
export { Icons, Ico } from '../components/kit/icons'
/** Docs DataTable — deprecated shim; resolves icon strings only. Prefer PackageDataTable / @tollerud/ui. */
export { DataTable } from './docs-adapters'
export { initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED } from '../components/kit/motion'
export {
  slugify,
  jumpToSection,
  goToSection,
  buildSectionCommands,
  matchesCommandQuery,
} from '../components/kit/cmd-registry'
export {
  Squares,
  GrainGradient,
  PageBackgrounds,
  BgFrame,
  GradientReadabilityDemo,
} from '../components/pages/page-backgrounds'