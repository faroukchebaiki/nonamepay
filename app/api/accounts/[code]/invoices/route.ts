// Using Web standard Request in Route Handlers
import { db } from '@/lib/db/client'
import { invoices } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { json, withRateLimit } from '@/lib/http'

export async function GET(req: Request, { params }: any) {
  await withRateLimit(req as any)
  const code = params.code
  const rows = await db.select().from(invoices).where(eq(invoices.accountCode, code))
  return json({ items: rows.map(r => ({
    id: r.id,
    status: r.status,
    txids: [],
    confirmations: 0,
    amountCrypto: Number(r.amountNative),
    address: r.address,
    uri: r.uri,
    asset: r.asset as 'BTC'|'XMR'
  })) })
}
