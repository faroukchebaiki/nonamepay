import { NextRequest } from 'next/server'
import { WebhookTestInput } from '@/lib/api/schemas'
import { json, badRequest, withRateLimit } from '@/lib/http'
import { headersFor, enqueueWebhook } from '@/lib/webhooks'

export async function POST(req: NextRequest) {
  await withRateLimit(req)
  const body = await req.json().catch(()=>null)
  const parsed = WebhookTestInput.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.message)
  const sample = { event: 'invoice.test', data: { hello: 'world' } }
  const headers = headersFor(sample)
  await enqueueWebhook({ url: parsed.data.url, body: sample, headers })
  return json({ enqueued: true })
}

