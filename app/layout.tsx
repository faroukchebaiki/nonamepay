import './globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata = {
  title: 'nonamepay',
  description: 'Non-custodial crypto payments (testnet/stagenet)'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
