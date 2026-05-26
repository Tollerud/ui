'use client'

import { Toaster as SonnerToaster, type ToasterProps } from 'sonner'
import { useTheme } from 'next-themes'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'dark' } = useTheme()

  return (
    <SonnerToaster
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-tia-noir-900 group-[.toaster]:text-tia-foreground ' +
            'group-[.toaster]:border group-[.toaster]:border-tia-border/30 ' +
            'group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-tia-text-muted text-xs',
          actionButton:
            'group-[.toast]:bg-tia-yellow group-[.toast]:text-tia-black group-[.toast]:text-xs ' +
            'group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:rounded',
          cancelButton:
            'group-[.toast]:bg-tia-noir-800 group-[.toast]:text-tia-text-muted ' +
            'group-[.toast]:text-xs group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:rounded',
          success: 'group-[.toast]:border-l-tia-success group-[.toast]:border-l-2',
          error: 'group-[.toast]:border-l-tia-error group-[.toast]:border-l-2',
          warning: 'group-[.toast]:border-l-tia-yellow group-[.toast]:border-l-2',
          info: 'group-[.toast]:border-l-tia-info group-[.toast]:border-l-2',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }