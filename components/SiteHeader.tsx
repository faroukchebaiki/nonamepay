import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getSessionMerchant, clearSession } from '@/lib/session'

export async function SiteHeader() {
  const me = await getSessionMerchant()
  async function signOut() {
    'use server'
    await clearSession()
  }
  return (
    <header className="flex items-center justify-between mb-6">
      <Link href="/" className="font-bold">nonamepay</Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link href="/docs">Docs</Link>
        {me ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <form action={signOut}>
              <button className="px-2 py-1 rounded border" type="submit">Sign out</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/signin" className="px-2 py-1 rounded border">Sign in</Link>
            <Link href="/signup" className="px-2 py-1 rounded bg-blue-600 text-white">Get Started</Link>
          </>
        )}
        <ThemeToggle />
      </nav>
    </header>
  )
}

