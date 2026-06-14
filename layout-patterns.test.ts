import { describe, expect, it } from 'vitest'
import {
  CardGrid,
  Cluster,
  DashboardShell,
  DetailPage,
  EmptyPage,
  FeatureSection,
  FormPanel,
  Grid,
  MainContent,
  PageHeader,
  PageShell,
  ResourceList,
  Section,
  SettingsLayout,
  Split,
  Stack,
  StatsSection,
  TopNav,
} from './components'

const layoutAndScreenPatterns = [
  ['PageShell', PageShell],
  ['Section', Section],
  ['Stack', Stack],
  ['Cluster', Cluster],
  ['Grid', Grid],
  ['CardGrid', CardGrid],
  ['Split', Split],
  ['MainContent', MainContent],
  ['PageHeader', PageHeader],
  ['TopNav', TopNav],
  ['DashboardShell', DashboardShell],
  ['SettingsLayout', SettingsLayout],
  ['FormPanel', FormPanel],
  ['ResourceList', ResourceList],
  ['DetailPage', DetailPage],
  ['EmptyPage', EmptyPage],
  ['FeatureSection', FeatureSection],
  ['StatsSection', StatsSection],
] as const

describe('layout and screen pattern exports', () => {
  it.each(layoutAndScreenPatterns)('exports %s from the package barrel', (_name, Component) => {
    expect(Component).toBeTruthy()
  })
})
