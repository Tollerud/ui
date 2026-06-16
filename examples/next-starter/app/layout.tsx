import type { Metadata } from 'next'
import { Toaster } from '@tollerud/ui'
import { ButtonGlowRoot } from './button-glow-root'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tollerud UI — Next.js starter',
  description: 'Minimal Next.js app using @tollerud/ui',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-tollerud-noir-950 text-tollerud-text-primary">
        <ButtonGlowRoot />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
