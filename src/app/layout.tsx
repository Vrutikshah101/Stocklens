import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Providers } from '@/components/layout/Providers'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'StockLens',
    template: '%s · StockLens',
  },
  description: 'A calm, dark-first stock analytics prototype for Indian market workflows.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html data-theme="dark" lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-base font-sans text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
