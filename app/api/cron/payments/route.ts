import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { invoices, payments } from '@/lib/db/schema'
import { and, eq, inArray, ne } from 'drizzle-orm'
import { json } from '@/lib/http'
import { BTC_CONFIRMATIONS } from '@/lib/env'
import { enqueueWebhook } from '@/lib/webhooks'
import { webhookLogs } from '@/lib/db/schema'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fetch ${url} -> ${res.status}`)
  return res.json() as Promise<T>
}

export async function GET(req: NextRequest) {
  // Poll BTC testnet via Blockstream
  const target = await db.select().from(invoices).where(inArray(invoices.status, ['unpaid','seen'] as any)).limit(50)
  for (const inv of target) {
    if (inv.asset === 'BTC') {
      try {
        const txs = await fetchJson<any[]>(`https://blockstream.info/testnet/api/address/${inv.address}/txs`)
        if (!Array.isArray(txs) || txs.length === 0) continue
        const seen = txs[0]
        const txid = seen.txid || seen.tx_hash
        const status = await fetchJson<{ block_height?: number, confirmations?: number, confirmed?: boolean }>(`https://blockstream.info/testnet/api/tx/${txid}/status`)
        const confs = status.confirmations || (status.confirmed ? 1 : 0) || 0
        const need = BTC_CONFIRMATIONS()
        const exists = await db.select().from(payments).where(and(eq(payments.invoiceId, inv.id), eq(payments.txid, txid))).limit(1)
        if (!exists[0]) {
          await db.insert(payments).values({ invoiceId: inv.id, txid, amountNative: inv.amountNative, confirmations: confs })
        } else {
          await db.update(payments).set({ confirmations: confs }).where(and(eq(payments.invoiceId, inv.id), eq(payments.txid, txid)))
        }
        if (confs >= need && inv.status !== 'confirmed') {
          await db.update(invoices).set({ status: 'confirmed', confirmedAt: new Date() }).where(eq(invoices.id, inv.id))
          if (inv.webhookUrl) {
            await enqueueWebhook({ url: inv.webhookUrl, body: { event: 'invoice.confirmed', data: { id: inv.id } }, invoiceId: inv.id })
            await db.insert(webhookLogs).values({ invoiceId: inv.id, url: inv.webhookUrl, attempts: 0 })
          }
        } else if (confs === 0 && inv.status === 'unpaid') {
          await db.update(invoices).set({ status: 'seen' }).where(eq(invoices.id, inv.id))
          if (inv.webhookUrl) {
            await enqueueWebhook({ url: inv.webhookUrl, body: { event: 'invoice.seen', data: { id: inv.id } }, invoiceId: inv.id })
            await db.insert(webhookLogs).values({ invoiceId: inv.id, url: inv.webhookUrl, attempts: 0 })
          }
        }
      } catch (e) {
        // ignore per-invoice errors
      }
    }
  }
  return json({ ok: true, checked: target.length })
}
