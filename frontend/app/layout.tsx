import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

// Force all pages to be dynamic (not statically generated at build time)
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export const metadata: Metadata = {
  title: 'ERP-MCP - AI-Powered Enterprise System',
  description: 'Intelligent ERP system with AI capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
