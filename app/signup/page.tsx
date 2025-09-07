import { db } from '@/lib/db/client'
import { merchants } from '@/lib/db/schema'
import { setSession } from '@/lib/session'
import { randomBytes, createHash } from 'crypto'
import { redirect } from 'next/navigation'

async function createMerchant(formData: FormData) {
  'use server'
  const name = String(formData.get('name') || '')
  const apiKey = randomBytes(24).toString('base64url')
  const apiKeyHash = createHash('sha256').update(apiKey).digest('hex')
  const [m] = await db.insert(merchants).values({ name: name || null, apiKeyHash }).returning()
  await setSession(m.id)
  // Store the API key on redirect via URL param (only once) — not stored in DB
  redirect(`/signup/success?apiKey=${encodeURIComponent(apiKey)}`)
}

export default function SignupPage() {
  return (
    <main className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Create your merchant</h1>
      <form action={createMerchant} className="rounded border p-4 space-y-3">
        <div className="text-sm text-neutral-500">We’ll generate an API key and sign you in to view the dashboard.</div>
        <label className="block text-sm">Merchant name (optional)</label>
        <input name="name" className="w-full rounded border bg-transparent p-2" placeholder="My Shop" />
        <button type="submit" className="mt-2 rounded bg-blue-600 px-4 py-2 text-white">Create merchant</button>
      </form>
      <div className="text-xs text-neutral-500">Keys are shown once. Keep them secure.</div>
    </main>
  )
}

