'use client'

import { Toaster as SonnerToaster, type ToasterProps } from 'sonner'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'dark' } = useTheme()
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
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-tollerud-noir-900 group-[.toaster]:text-tollerud-foreground ' +
            'group-[.toaster]:border group-[.toaster]:border-tollerud-border/30 ' +
            'group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-tollerud-text-muted text-xs',
          actionButton:
            'group-[.toast]:bg-tollerud-yellow group-[.toast]:text-tollerud-black group-[.toast]:text-xs ' +
            'group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:rounded',
          cancelButton:
            'group-[.toast]:bg-tollerud-noir-800 group-[.toast]:text-tollerud-text-muted ' +
            'group-[.toast]:text-xs group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:rounded',
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