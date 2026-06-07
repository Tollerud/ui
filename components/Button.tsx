import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-tollerud-yellow text-tollerud-black border-tollerud-yellow hover:bg-tollerud-yellow-bright hover:shadow-tollerud-glow',
  secondary: 'bg-transparent text-tollerud-text-primary border-tollerud-border hover:border-tollerud-text-secondary hover:bg-tollerud-surface-hover',
  ghost: 'bg-transparent text-tollerud-text-secondary border-transparent hover:text-tollerud-text-primary hover:bg-tollerud-surface-hover',
  destructive: 'bg-tollerud-error text-white border-tollerud-error hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]',
  terminal: 'font-mono text-tollerud-yellow border-[rgba(232,213,0,0.25)] bg-transparent before:content-["❯_"] before:opacity-70 hover:border-tollerud-yellow hover:shadow-tollerud-glow hover:bg-[rgba(232,213,0,0.05)]',
} as const

const sizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded transition-all duration-[150ms] focus-visible:outline-2 focus-visible:outline-tollerud-yellow focus-visible:outline-offset-2',
          'border cursor-pointer',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
