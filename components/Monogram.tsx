import { forwardRef, type SVGAttributes } from 'react'
import { cn } from '@/lib/utils'
import { MONOGRAM_PATH, MONOGRAM_VIEW_BOX } from './monogram-geometry'

export type MonogramColor = 'yellow' | 'black' | 'white'

const colorClasses: Record<MonogramColor, string> = {
  yellow: 'text-tollerud-yellow',
  black: 'text-tollerud-noir-950',
  white: 'text-white',
}

export interface MonogramProps extends SVGAttributes<SVGSVGElement> {
  /**
   * Fill color via `currentColor`.
   * - `yellow` — default on dark surfaces (#FFFF00)
   * - `black` — light-mode surfaces (#0A0A0A)
   * - `white` — on tinted or photographic backgrounds
   */
  color?: MonogramColor
  /** Height in px; width scales from the 130×143 viewBox. */
  size?: number
  /** Accessible name — rendered as `<title>` and `aria-label`. */
  title?: string
}

const Monogram = forwardRef<SVGSVGElement, MonogramProps>(
  ({ color = 'yellow', size, className, title = 'Tollerud', style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox={MONOGRAM_VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title}
        className={cn(
          'inline-block shrink-0',
          colorClasses[color],
          !size && 'h-5 w-auto',
          className
        )}
        style={size ? { height: size, width: 'auto', ...style } : style}
        {...props}
      >
        <title>{title}</title>
        <g fill="currentColor" fillRule="evenodd">
          <g transform="translate(-86.000000, -109.000000)">
            <g transform="translate(32.000000, 55.000000)">
              <g transform="translate(54.000000, 54.000000)">
                <path d={MONOGRAM_PATH} />
              </g>
            </g>
          </g>
        </g>
      </svg>
    )
  }
)
Monogram.displayName = 'Monogram'

export { Monogram }
