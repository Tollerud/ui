import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tollerud UI registry smoke test',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-tollerud-noir-950 text-tollerud-text-primary min-h-screen p-8">
        {children}
      </body>
    </html>
  )
}
