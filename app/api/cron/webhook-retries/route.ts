import { NextRequest } from 'next/server'
import { redis } from '@/lib/redis'
import { json } from '@/lib/http'
import { signBody } from '@/lib/webhooks'
import { db } from '@/lib/db/client'
import { webhookLogs } from '@/lib/db/schema'

export async function GET(req: NextRequest) {
  // Drain a small batch to stay within Vercel limits
  let processed = 0
  for (let i=0; i<10; i++) {
    const raw = await redis.rpop('webhook_queue')
    if (!raw) break
    try {
      const item = JSON.parse(raw as string) as any
      const bodyText = typeof item.body === 'string' ? item.body : JSON.stringify(item.body)
      const ts = String(Math.floor(Date.now()/1000))
      const nonce = crypto.randomUUID()
      const signature = signBody(ts, nonce, bodyText)
      const res = await fetch(item.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-timestamp': ts, 'x-nonce': nonce, 'x-signature': signature, 'x-delivery-id': item.deliveryId, ...(item.headers||{}) },
        body: bodyText
      })
      if (!res.ok) {
        // backoff requeue
        const nextAttempt = (item.attempt || 0) + 1
        const delays = [60, 300, 900, 3600, 21600]
        const delay = delays[Math.min(nextAttempt-1, delays.length-1)]
        await new Promise(r => setTimeout(r, 50))
        await redis.lpush('webhook_queue', JSON.stringify({ ...item, attempt: nextAttempt, nextDelaySec: delay }))
        if (item.invoiceId) {
          await db.insert(webhookLogs).values({ invoiceId: item.invoiceId, url: item.url, attempts: nextAttempt, lastStatus: res.status, lastError: `${res.status}` })
        }
      }
      if (item.invoiceId) {
        await db.insert(webhookLogs).values({ invoiceId: item.invoiceId, url: item.url, attempts: (item.attempt || 0) + 1, lastStatus: res.status, updatedAt: new Date() })
      }
      processed++
    } catch(e) {
      // swallow
    }
  }
  return json({ ok: true, processed })
}
