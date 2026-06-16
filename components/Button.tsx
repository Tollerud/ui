import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-tollerud-yellow text-tollerud-black border-tollerud-yellow hover:bg-tollerud-yellow hover:shadow-tollerud-glow',
  secondary:
    'text-tollerud-text-primary [background:var(--surface-raised,var(--tollerud-surface-raised))] [border-color:var(--border,var(--tollerud-border))] hover:[border-color:var(--text-secondary,var(--tollerud-text-secondary))] hover:[background:var(--surface-hover,var(--tollerud-surface-hover))]',
  ghost: 'text-tollerud-text-secondary border-transparent hover:text-tollerud-text-primary hover:bg-tollerud-surface-hover',
  destructive: 'bg-tollerud-error text-white border-tollerud-error hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]',
  terminal: 'font-mono text-tollerud-yellow border-[rgba(255,255,0,0.25)] bg-transparent hover:border-tollerud-yellow hover:shadow-tollerud-glow hover:bg-[rgba(255,255,0,0.05)]',
} as const

/** Layer classes from globals-layers.css — ❯ prefix, hover glow, magnetic glow in docs */
const variantLayers = {
  primary: 'tollerud-btn--primary',
  secondary: 'tollerud-btn--secondary',
  ghost: 'tollerud-btn--ghost',
  destructive: 'tollerud-btn--destructive',
  terminal: 'tollerud-btn--terminal',
} as const

const sizes = {
  sm: 'tollerud-btn--sm',
  md: 'tollerud-btn--md',
  lg: 'tollerud-btn--lg',
} as const

export interface ButtonVariantProps {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function buttonVariants({ variant = 'secondary', size = 'md', className }: ButtonVariantProps & { className?: string } = {}) {
  return cn(
    'tollerud-btn inline-flex items-center justify-center gap-2 font-semibold leading-none rounded transition-all duration-[150ms] focus-visible:outline-2 focus-visible:outline-tollerud-yellow focus-visible:outline-offset-2',
    'border cursor-pointer',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    variantLayers[variant],
    sizes[size],
    className
  )
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  /** Render as the single child element (e.g. a `<Link>`) instead of a `<button>`, merging props and styles onto it. */
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
