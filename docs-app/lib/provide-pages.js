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
  ToastProvider,
  useToast,
} from '../components/kit/primitives'
export { Icons, Ico } from '../components/kit/icons'
/** Docs-only DataTable with bulk actions, row menus, and pagination — richer than npm DataTable. */
export { DataTable } from '../components/blocks/rich-datatable'
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
export { GrainGradientGL } from '../components/backgrounds/grain-gl'
