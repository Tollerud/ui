import { type HTMLAttributes, forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepperStep {
  label: React.ReactNode
  description?: React.ReactNode
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: StepperStep[]
  /** 0-indexed current step */
  current: number
  orientation?: 'horizontal' | 'vertical'
}

const Stepper = forwardRef<HTMLOListElement, StepperProps>(
  ({ className, steps, current, orientation = 'horizontal', ...props }, ref) => {
    const vertical = orientation === 'vertical'

    return (
      <ol
        ref={ref}
        className={cn('flex', vertical ? 'flex-col gap-0' : 'items-start gap-0 w-full', className)}
        {...props}
      >
        {steps.map((step, i) => {
          const status = i < current ? 'complete' : i === current ? 'active' : 'upcoming'
          const isLast = i === steps.length - 1

          return (
            <li
              key={i}
              className={cn(
                'flex',
                vertical ? 'flex-row gap-3' : 'flex-col flex-1 gap-2',
                !vertical && !isLast && 'pr-2'
              )}
            >
              <div className={cn('flex items-center', vertical ? 'flex-col' : 'flex-row gap-2 w-full')}>
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-fast',
                    status === 'complete' && 'bg-tollerud-yellow text-tollerud-noir-black',
                    status === 'active' && 'border-2 border-tollerud-yellow text-tollerud-yellow',
                    status === 'upcoming' && 'border border-tollerud-border text-tollerud-text-muted'
                  )}
                >
                  {status === 'complete' ? <Check size={14} /> : i + 1}
                </span>
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'bg-tollerud-border',
                      vertical ? 'w-px flex-1 my-1' : 'h-px flex-1',
                      status === 'complete' && 'bg-tollerud-yellow'
                    )}
                  />
                )}
              </div>
              <div className={cn('flex flex-col', vertical && 'pb-6')}>
                <span
                  className={cn(
                    'text-sm font-medium',
                    status === 'upcoming' ? 'text-tollerud-text-muted' : 'text-tollerud-text-primary'
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-xs text-tollerud-text-muted">{step.description}</span>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    )
  }
)
Stepper.displayName = 'Stepper'

export { Stepper }
