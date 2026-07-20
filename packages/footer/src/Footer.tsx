'use client'

import type { CSSProperties, ReactElement } from 'react'
import { cn } from './utils'
import { Monogram } from './Monogram'

export type FooterLabels = {
  /** Text for the tollerud.no link (e.g. "A Tollerud Project"). */
  tollerudProject: string
  /**
   * Optional middle segment after the link, before the rights line.
   * Example for Advania: `"for Advania Norge AS."`
   */
  attribution?: string
  allRightsReserved: string
}

const defaultLabels: FooterLabels = {
  tollerudProject: 'A Tollerud Project',
  allRightsReserved: 'All rights reserved.',
}

export type FooterProps = {
  labels?: Partial<FooterLabels>
  /** Layout behavior: responsive keeps mobile-first stacking, row forces horizontal layout. */
  layout?: 'responsive' | 'row'
  /** Merged onto <footer>. Use for extra layout, padding, etc. */
  className?: string
  /** Merged onto <footer> (wins over conflicting backgroundColor from classes when needed). */
  style?: CSSProperties
  /**
   * When true, skips all default surface styling so className/style fully control the bar
   * (avoids fighting default background/border).
   */
  unstyled?: boolean
  /** When true, uses accent (yellow) surface instead of neutral dark. */
  accent?: boolean
  classNameInner?: string
  classNameLogo?: string
  classNameText?: string
  classNameLink?: string
}

export function Footer({
  labels,
  layout = 'responsive',
  className,
  style,
  unstyled = false,
  accent = false,
  classNameInner,
  classNameLogo,
  classNameText,
  classNameLink,
}: FooterProps): ReactElement {
  const t = { ...defaultLabels, ...labels }
  const attribution = t.attribution?.trim()

  const footerSurface = unstyled
    ? ''
    : accent
      ? 'border-t border-tollerud-yellow/20 bg-tollerud-yellow/5'
      : 'border-t border-tollerud-border bg-tollerud-noir-900/80'

  const innerLayoutClasses =
    layout === 'row'
      ? 'max-w-7xl mx-auto px-8 flex flex-row items-center justify-between gap-4'
      : 'max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0'

  const textWrapperClasses =
    layout === 'row' ? 'flex-1 text-right ml-4' : 'flex-1 text-center md:text-right md:ml-4'

  const textLayoutClasses =
    layout === 'row'
      ? 'text-sm text-tollerud-text-secondary inline-flex flex-row items-center justify-end text-right gap-0'
      : 'text-sm text-tollerud-text-secondary flex flex-col md:flex-row md:inline gap-0'

  return (
    <footer className={cn('w-full pt-4 pb-4', footerSurface, className)} style={style}>
      <div className={cn(innerLayoutClasses, classNameInner)}>
        <div className="flex-shrink-0 md:flex-shrink-0">
          <Monogram color="yellow" className={cn('h-5 w-auto', classNameLogo)} />
        </div>

        <div className={textWrapperClasses}>
          <p className={cn(textLayoutClasses, classNameText)}>
            <span>
              <a
                href="https://tollerud.no"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'underline decoration-tollerud-yellow decoration-[3px] underline-offset-[4px] hover:opacity-80 transition-opacity duration-fast',
                  classNameLink,
                )}
                style={{
                  textDecorationThickness: '3px',
                  textUnderlineOffset: '4px',
                }}
              >
                {t.tollerudProject}
              </a>
              {attribution ? (
                <>
                  {' '}
                  <span>{attribution}</span>
                </>
              ) : null}{' '}
            </span>
            <span className={layout === 'row' ? 'ml-1' : 'md:ml-1'}>{t.allRightsReserved}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}