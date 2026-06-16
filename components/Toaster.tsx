'use client'

import { Toaster as SonnerToaster, type ToasterProps } from 'sonner'
import { useEffect, useState } from 'react'

export type TollerudToasterProps = ToasterProps & {
  /** Toast color theme. Wire to your app theme when you have one. */
  theme?: ToasterProps['theme']
}

const DEFAULT_TOAST_DURATION_MS = 4500

const Toaster = ({ theme = 'dark', duration = DEFAULT_TOAST_DURATION_MS, ...props }: TollerudToasterProps) => {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <SonnerToaster
      position={mobile ? 'top-center' : 'top-right'}
      theme={theme as ToasterProps['theme']}
      duration={duration}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-tollerud-noir-900 group-[.toaster]:text-tollerud-foreground ' +
            'group-[.toaster]:border group-[.toaster]:border-tollerud-border/30 ' +
            'group-[.toaster]:shadow-lg group-[.toaster]:p-4 group-[.toaster]:text-sm ' +
            'group-[.toaster]:min-w-[min(100%,20rem)] group-[.toaster]:max-w-[25rem]',
          title: 'group-[.toast]:text-sm group-[.toast]:font-semibold group-[.toast]:leading-snug',
          description: 'group-[.toast]:text-sm group-[.toast]:text-tollerud-text-secondary',
          actionButton:
            'group-[.toast]:bg-tollerud-yellow group-[.toast]:text-tollerud-black group-[.toast]:text-sm ' +
            'group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded',
          cancelButton:
            'group-[.toast]:bg-tollerud-noir-800 group-[.toast]:text-tollerud-text-muted ' +
            'group-[.toast]:text-sm group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded',
          success: 'group-[.toast]:border-l-tollerud-success group-[.toast]:border-l-2',
          error: 'group-[.toast]:border-l-tollerud-error group-[.toast]:border-l-2',
          warning: 'group-[.toast]:border-l-tollerud-yellow group-[.toast]:border-l-2',
          info: 'group-[.toast]:border-l-tollerud-info group-[.toast]:border-l-2',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }