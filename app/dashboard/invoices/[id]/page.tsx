import { db } from '@/lib/db/client'
import { invoices, payments, webhookLogs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { DEMO_MODE } from '@/lib/env'
import { getSessionMerchant } from '@/lib/session'

async function simulatePay(id: string) {
  'use server'
  await fetch(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/invoices/${id}/simulate-pay`, { method: 'POST' })
}

export default async function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const me = await getSessionMerchant()
  if (!me) return <div className="p-4">Please <a className="underline" href="/signin">sign in</a>.</div>
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1)
  const txs = await db.select().from(payments).where(eq(payments.invoiceId, id))
  const wh = await db.select().from(webhookLogs).where(eq(webhookLogs.invoiceId, id))
  if (!inv || inv.merchantId !== me.id) return <div>Not found</div>
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-semibold">Invoice {inv.id}</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded border p-4 space-y-2">
          <div className="text-sm">Asset: {inv.asset}</div>
          <div className="text-sm">Address: <code>{inv.address}</code></div>
          <div className="text-sm">URI: <code className="break-all">{inv.uri}</code></div>
          <div className="text-sm">Amount: {Number(inv.amountNative).toFixed(8)}</div>
          <div className="text-sm">Status: <span className={`badge badge-${inv.status}`}>{inv.status}</span></div>
          <div className="text-sm">Expires: {new Date(inv.expiresAt as any).toISOString?.() || ''}</div>
          {DEMO_MODE() && (
            <form action={async ()=>{ 'use server'; await simulatePay(inv.id) }}>
              <button className="mt-2 rounded bg-blue-600 px-3 py-1 text-white text-sm" type="submit">Simulate Pay</button>
            </form>
          )}
        </div>
        <div className="rounded border p-4">
          <div className="mb-2 font-medium">Payments</div>
          <ul className="text-sm space-y-1">
            {txs.map(t => (
              <li key={t.id} className="flex justify-between"><span className="truncate">{t.txid}</span><span>{t.confirmations} conf</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded border p-4">
          <div className="mb-2 font-medium">Webhooks</div>
          <ul className="text-sm space-y-1">
            {wh.map(w => (
              <li key={w.id} className="flex justify-between"><span className="truncate">{w.url}</span><span>{w.lastStatus || ''}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
