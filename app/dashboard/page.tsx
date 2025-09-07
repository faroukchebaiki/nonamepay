import { db } from '@/lib/db/client'
import { invoices, accounts } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { DEMO_MODE } from '@/lib/env'
import { getSessionMerchant } from '@/lib/session'

async function createAccount() {
  'use server'
  const me = await getSessionMerchant()
  if (!me) return
  const code = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6)
  await db.insert(accounts).values({ code })
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const me = await getSessionMerchant()
  if (!me) {
    return (
      <main className="space-y-4">
        <h1 className="text-xl font-semibold">Please sign in</h1>
        <a className="px-4 py-2 rounded bg-blue-600 text-white inline-block" href="/signin">Go to sign in</a>
      </main>
    )
  }
  const { status } = await searchParams
  const rows = await db.select().from(invoices).where(eq(invoices.merchantId, me.id)).orderBy(desc(invoices.createdAt)).limit(50)
  const acct = await db.select().from(accounts).orderBy(desc(accounts.createdAt)).limit(5)
  const items = status ? rows.filter(r => r.status === status) : rows
  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <form action={createAccount}>
          <button className="px-3 py-1 rounded border text-sm" type="submit">Create Account</button>
        </form>
      </div>
      <div className="rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Asset</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2"><Link className="underline" href={`/dashboard/invoices/${r.id}`}>{r.id.slice(0,8)}…</Link></td>
                <td className="p-2">{r.asset}</td>
                <td className="p-2">{Number(r.amountNative).toFixed(8)}</td>
                <td className="p-2">
                  <span className={`badge badge-${r.status}`}>{r.status}</span>
                </td>
                <td className="p-2">{r.createdAt?.toISOString?.() || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded border p-4 space-y-2">
        <div className="font-medium mb-1">Accounts</div>
        {acct.length === 0 ? (
          <div className="text-sm text-neutral-500">No accounts yet. Click "Create Account" to generate one.</div>
        ) : (
          <ul className="text-sm grid md:grid-cols-3 gap-2">
            {acct.map(a => (
              <li key={a.code} className="rounded border p-2 bg-neutral-50 dark:bg-neutral-900">
                <div className="font-mono text-xs break-all">{a.code}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {DEMO_MODE() && (
        <div className="text-xs text-neutral-500">DEMO simulator enabled — use the button on invoice details to simulate a payment.</div>
      )}
    </main>
  )
}
