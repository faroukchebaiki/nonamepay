import './globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

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
            <header className="flex items-center justify-between mb-6">
              <a href="/" className="font-bold">nonamepay</a>
              <nav className="flex gap-4 text-sm">
                <a href="/docs">Docs</a>
                <a href="/dashboard">Dashboard</a>
              </nav>
            </header>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

