import { db } from '@/lib/db/client'
import { merchants } from '@/lib/db/schema'
import { setSession } from '@/lib/session'
import { createHash } from 'crypto'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

async function signIn(formData: FormData) {
  'use server'
  const apiKey = String(formData.get('apiKey') || '')
  if (!apiKey) return
  const apiKeyHash = createHash('sha256').update(apiKey).digest('hex')
  const [m] = await db.select().from(merchants).where(eq(merchants.apiKeyHash, apiKeyHash)).limit(1)
  if (m) {
    await setSession(m.id)
    redirect('/dashboard')
  }
}

export default function SigninPage() {
  return (
    <main className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <form action={signIn} className="rounded border p-4 space-y-3">
        <label className="block text-sm">API Key</label>
        <input name="apiKey" className="w-full rounded border bg-transparent p-2" placeholder="paste your API key" />
        <button type="submit" className="mt-2 rounded bg-blue-600 px-4 py-2 text-white">Sign in</button>
      </form>
      <div className="text-sm text-neutral-500">Don’t have a key? <a className="underline" href="/signup">Create a merchant</a>.</div>
    </main>
  )
}

