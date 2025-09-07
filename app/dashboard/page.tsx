import { db } from '@/lib/db/client'
import { invoices } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { DEMO_MODE } from '@/lib/env'

export default async function DashboardPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status as any
  const rows = await db.select().from(invoices).orderBy(desc(invoices.createdAt)).limit(50)
  const items = status ? rows.filter(r => r.status === status) : rows
  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <div className="text-xs text-neutral-500">Newest first</div>
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
      {DEMO_MODE() && (
        <div className="text-xs text-neutral-500">DEMO simulator enabled — use the button on invoice details to simulate a payment.</div>
      )}
    </main>
  )
}

