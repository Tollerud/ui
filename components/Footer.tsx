'use client'

import type { CSSProperties, ReactElement } from 'react'
import { cn } from '@/lib/utils'

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

const MONOGRAM_PATH =
  'M82.4839273,140.272626 L95.1738252,140.272626 L95.1738252,143 L34.8114657,143 L34.8114657,140.272626 L47.5013636,140.272626 L47.5013636,28.2924381 C40.1277806,26.4177752 32.9252955,25.2241422 26.4088393,25.2241422 C12.1757856,25.2241422 4.11617359,34.5982703 4.11617359,39.8821508 C4.11617359,40.9049161 4.63028596,41.5867596 5.65932936,41.5867596 C7.20248513,41.5867596 7.37440169,40.3931266 8.06043062,38.8593855 C10.4615319,33.575505 15.6059302,31.5307881 20.4073141,31.5307881 C29.152955,31.5307881 35.1552988,38.5184637 35.1552988,47.2107482 C35.1552988,56.2447681 28.8107592,62.8907084 18.0070315,62.8907084 C7.5454996,62.891522 0,53.6882617 0,43.8023442 C0,30.8497582 11.3178401,21.986606 26.5799372,21.986606 C51.1026062,21.986606 84.1989996,39.2011209 104.948509,39.2011209 C118.495534,39.2011209 126.384048,31.7016558 126.384048,19.4300996 C126.384048,10.3968933 118.667451,4.60203698 115.580321,4.60203698 C114.552096,4.60203698 113.69415,5.1130128 113.69415,6.13577809 C113.69415,7.49946515 114.552096,7.6695192 115.409223,8.01044097 C115.752237,8.18049502 122.268693,10.5669474 122.268693,19.2592319 C122.268693,28.2924381 115.238125,34.0872945 107.177694,34.0872945 C97.7460244,34.0872945 91.0584702,26.4177752 91.0584702,17.8955448 C91.0584702,6.64675391 99.9760277,0 109.749893,0 C122.268693,0 129.642276,9.88510384 129.642276,19.6001536 C129.642276,34.2581622 119.181563,42.4386572 104.947691,42.4386572 C98.0890388,42.4386572 90.5443579,40.9049161 82.4839273,38.6901451 L82.4839273,140.272626 Z'

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

  const logoColor = unstyled
    ? ''
    : accent
      ? 'text-tollerud-yellow'
      : 'text-tollerud-text-muted'

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
          <svg
            width="24"
            height="24"
            viewBox="0 0 130 143"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className={cn('h-5 w-5', logoColor, classNameLogo)}
            role="img"
          >
            <title>Tollerud Logo</title>
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="Tollerud-Monogram" transform="translate(-86.000000, -109.000000)" fill="currentColor">
                <g id="Group-2" transform="translate(32.000000, 55.000000)">
                  <g id="Group" transform="translate(54.000000, 54.000000)">
                    <path d={MONOGRAM_PATH} id="Monogram" />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>

        <div className={textWrapperClasses}>
          <p className={cn(textLayoutClasses, classNameText)}>
            <span>
              <a
                href="https://tollerud.no"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'underline decoration-tollerud-yellow decoration-[3px] underline-offset-[4px] hover:opacity-80 transition-opacity',
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