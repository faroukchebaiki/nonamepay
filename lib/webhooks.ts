import { createHmac, randomUUID } from 'crypto'
import { WEBHOOK_SECRET } from '@/lib/env'
import { redis } from '@/lib/redis'

export function signBody(ts: string, nonce: string, body: string) {
  const base = `${ts}.${nonce}.${body}`
  const sig = createHmac('sha256', WEBHOOK_SECRET()).update(base).digest('hex')
  return sig
}

export async function enqueueWebhook(delivery: {
  url: string
  body: any
  headers?: Record<string,string>
  deliveryId?: string
  attempt?: number
  nextDelaySec?: number
  invoiceId?: string
}) {
  const id = delivery.deliveryId || randomUUID()
  const item = {
    ...delivery,
    deliveryId: id,
    attempt: delivery.attempt || 0,
    enqueuedAt: Date.now()
  }
  await redis.lpush('webhook_queue', JSON.stringify(item))
  return id
}

export function headersFor(body: any) {
  const ts = String(Math.floor(Date.now()/1000))
  const nonce = randomUUID()
  const raw = typeof body === 'string' ? body : JSON.stringify(body)
  const sig = signBody(ts, nonce, raw)
  return {
    'x-timestamp': ts,
    'x-nonce': nonce,
    'x-signature': sig,
    'x-delivery-id': randomUUID(),
    'content-type': 'application/json'
  }
}
