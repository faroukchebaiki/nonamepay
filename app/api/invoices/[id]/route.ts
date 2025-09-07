// Using Web standard Request in Route Handlers
import { db } from '@/lib/db/client'
import { invoices, payments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { json, notFound, withRateLimit } from '@/lib/http'

export async function GET(req: Request, { params }: any) {
  await withRateLimit(req)
  const id = params.id
  const rows = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1)
  const inv = rows[0]
  if (!inv) return notFound()
  const pays = await db.select().from(payments).where(eq(payments.invoiceId, id))
  const confs = pays.reduce((m, p) => Math.max(m, p.confirmations || 0), 0)
  return json({
    id,
    status: inv.status,
    txids: pays.map(p=>p.txid),
    confirmations: confs,
    amountCrypto: Number(inv.amountNative),
    address: inv.address,
    uri: inv.uri,
    asset: inv.asset as 'BTC'|'XMR'
  })
}
