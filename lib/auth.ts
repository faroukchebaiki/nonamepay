import { db } from '@/lib/db/client'
import { merchants } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { createHash, timingSafeEqual, createHmac } from 'crypto'

function hashApiKey(key: string) {
  return createHash('sha256').update(key).digest('hex')
}

export async function authenticate(req: Request) {
  const apiKey = req.headers.get('x-api-key') || ''
  if (!apiKey) return null
  const apiKeyHash = hashApiKey(apiKey)
  const res = await db.select().from(merchants).where(eq(merchants.apiKeyHash, apiKeyHash)).limit(1)
  return res[0] || null
}

export function verifyRequestHmac(req: Request, bodyText: string, secret: string) {
  const sig = req.headers.get('x-signature')
  const ts = req.headers.get('x-timestamp')
  const nonce = req.headers.get('x-nonce')
  if (!sig || !ts || !nonce) return false
  const data = `${ts}.${nonce}.${bodyText}`
  const expected = createHmac('sha256', secret).update(data).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}

export function hashForStorage(value: string) {
  return createHash('sha256').update(value).digest('hex')
}
