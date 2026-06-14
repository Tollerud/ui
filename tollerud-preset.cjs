/**
 * Tollerud Design System — Tailwind Preset
  *
  * Drop this into any Tailwind project:
  *
  *   // tailwind.config.ts
  *   import tollerudPreset from '@tollerud/ui/preset'
 *   export default {
 *     presets: [tollerudPreset],
 *     content: ['your-source-files'],
 *   }
 *
 * Or merge manually into an existing config.
 */

const tollerudColors = {
  // Brand
  yellow:        '#FFFF00',
  'yellow-warm': '#E8D500',
  acid:          '#FFFF00',
  accent:        '#FFFF00',
  'yellow-dim':  '#B8A800',
  amber:         '#FFB800',
  'amber-glow':  '#FF8C00',

  // Noir scale
  black:         '#0A0A0A',
  'noir-black':  '#0A0A0A',
  'noir-950':    '#0A0A0A',
  'noir-900':    '#121212',
  'noir-850':    '#161616',
  'noir-800':    '#1A1A1A',
  'noir-700':    '#252525',
  'noir-600':    '#333333',
  'noir-500':    '#4A4A4A',
  'noir-400':    '#666666',
  'noir-300':    '#888888',
  'noir-200':    '#AAAAAA',
  'noir-100':    '#CCCCCC',
  'noir-50':     '#E5E5E5',
  'noir-white':  '#F5F5F5',
  white:         '#F5F5F5',

  // Surfaces
  surface:       '#0A0A0A',
  'surface-raised': '#121212',
  'surface-overlay': '#1A1A1A',
  'surface-hover':   '#252525',

  // Text
  foreground:       '#F5F5F5',
  'text-primary':   '#F5F5F5',
  'text-secondary': '#AAAAAA',
  'text-muted':     '#666666',
  'text-inverse':   '#0A0A0A',

  // Borders
  border:        '#333333',
  'border-subtle': '#252525',
  'border-accent': '#FFFF00',

  // States
  success:       '#22C55E',
  warning:       '#E8D500',
  error:         '#EF4444',
  info:          '#3B82F6',
}

const palette = {
  tollerud: tollerudColors,
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: palette,

      // ─── Typography ───
      fontFamily: {
        sans:  ['Inter', 'SF Pro', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      lineHeight: {
        tighter: '1.1',
        'display': '0.95',
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter:  '-0.035em',
        tight:    '-0.025em',
      },

      // ─── Spacing (4px grid) ───
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },

      // ─── Border Radius ───
      borderRadius: {
        none: '0',
        sm:   '0.125rem',
        DEFAULT: '0.25rem',
        md:   '0.375rem',
        lg:   '0.5rem',
        xl:   '0.75rem',
        '2xl': '1rem',
      },

      // ─── Shadows ───
      boxShadow: {
        'tollerud-sm':  '0 1px 2px 0 rgba(0,0,0,0.4)',
        'tollerud':     '0 1px 3px 0 rgba(0,0,0,0.5), 0 1px 2px -1px rgba(0,0,0,0.3)',
        'tollerud-md':  '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.3)',
        'tollerud-lg':  '0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.3)',
        'tollerud-glow':'0 0 15px rgba(255,255,0,0.3), 0 0 30px rgba(255,255,0,0.1)',
      },

      // ─── Background Images ───
      backgroundImage: {
        'tollerud-grid': `
          linear-gradient(rgba(255,255,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,0,0.03) 1px, transparent 1px)
        `,
        'tollerud-gradient-bar': `
          linear-gradient(90deg,
            transparent,
            #E8D500 35%,
            #FFB800 50%,
            #E8D500 65%,
            transparent)
        `,
        'tollerud-gradient-soft': `
          linear-gradient(135deg,
            rgba(255,255,0,0.8),
            rgba(255,184,0,0.4))
        `,
        'tollerud-noir-glow': `
          radial-gradient(circle at 0% 0%, rgba(255,255,0,0.72) 0%, rgba(255,232,0,0.38) 16%, transparent 38%),
          radial-gradient(circle at 100% 0%, rgba(255,255,0,0.58) 0%, rgba(255,184,0,0.24) 18%, transparent 40%),
          radial-gradient(circle at 0% 100%, rgba(255,255,0,0.44) 0%, rgba(255,184,0,0.18) 18%, transparent 44%),
          radial-gradient(circle at 100% 100%, rgba(255,255,0,0.34) 0%, transparent 36%),
          #000
        `,
      },
      backgroundSize: {
        'tollerud-grid': '40px 40px',
      },

      // ─── Animations ───
      animation: {
        'tollerud-glow': 'tollerud-glow 2s ease-in-out infinite alternate',
        'tollerud-fade-in': 'tollerud-fade-in 0.25s ease-out',
      },
      keyframes: {
        'tollerud-glow': {
          '0%':   { boxShadow: '0 0 5px rgba(255,255,0,0.2), 0 0 10px rgba(255,255,0,0.05)' },
          '100%': { boxShadow: '0 0 15px rgba(255,255,0,0.3), 0 0 30px rgba(255,255,0,0.1)' },
        },
        'tollerud-fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // ─── Transitions ───
      transitionDuration: {
        fast:   '150ms',
        normal: '250ms',
        slow:   '350ms',
      },
      transitionTimingFunction: {
        'tollerud-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
