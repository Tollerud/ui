import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tollerud UI',
  description: 'Dark, monochrome design system with yellow accent.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  )
}
