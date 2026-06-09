'use client'

export * from './ui-merged'
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
} from '../components/primitives'
export { Icons, Ico } from '../components/icons'
/** Docs-only DataTable with bulk actions, row menus, and pagination — richer than npm DataTable. */
export { DataTable } from '../components/rich-datatable'
export { BarChart, AreaChart, Donut, Sparkline } from '../components/charts'
export { HeroBlock, FeatureCard, CTABand } from '../components/marketing'
export { initMotion, CountUp, Typewriter, PageTOC, MOTION_REDUCED } from '../components/motion'
export {
  slugify,
  jumpToSection,
  goToSection,
  buildSectionCommands,
  matchesCommandQuery,
} from '../components/cmd-registry'
export {
  Squares,
  GrainGradient,
  PageBackgrounds,
  BgFrame,
  GradientReadabilityDemo,
} from '../components/backgrounds'
export { GrainGradientGL } from '../components/grain-gl'
