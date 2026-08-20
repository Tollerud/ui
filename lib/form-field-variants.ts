import { cva } from 'class-variance-authority'

/**
 * Shared trigger styling for Select, Combobox, and DatePicker — all three
 * render a similarly-shaped form-field button that opens a popup.
 */
export const formFieldTriggerVariants = cva(
  'font-sans w-full flex items-center justify-between rounded bg-tollerud-surface-raised text-tollerud-text-primary text-left transition-all duration-fast ease-out cursor-pointer border hover:border-tollerud-noir-400 focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      size: {
        md: 'px-3 py-2.5 text-base',
        sm: 'px-2.5 py-1.5 text-xs',
      },
      error: {
        true: 'border-tollerud-error/70 focus:border-tollerud-error focus:shadow-[0_0_0_1px_var(--tollerud-error,#EF4444)]',
        false: 'border-tollerud-border focus:border-tollerud-yellow focus:shadow-[0_0_0_1px_var(--tollerud-yellow-warm,#E8D500)]',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  }
)
