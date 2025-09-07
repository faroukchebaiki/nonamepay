import { NextRequest } from 'next/server'
import { DEMO_MODE } from '@/lib/env'
import { db } from '@/lib/db/client'
import { invoices, payments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { json, badRequest } from '@/lib/http'

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  if (!DEMO_MODE()) return badRequest('Simulator disabled')
  const id = ctx.params.id
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1)
  if (!inv) return badRequest('Not found')
  const fake = `demo_${Math.random().toString(36).slice(2)}`
  await db.insert(payments).values({ invoiceId: id, txid: fake, amountNative: inv.amountNative, confirmations: 1 })
  await db.update(invoices).set({ status: 'confirmed', confirmedAt: new Date() }).where(eq(invoices.id, id))
  return json({ ok: true, txid: fake })
}

