import { rateLimit, keyFromRequest } from '@/lib/ratelimit'

export function json(data: any, init: number | ResponseInit = 200) {
  const status = typeof init === 'number' ? init : (init as ResponseInit).status || 200
  const resInit: ResponseInit = typeof init === 'number' ? { status } : init
  return new Response(JSON.stringify(data), { ...resInit, headers: { 'content-type': 'application/json', ...(resInit.headers || {}) } })
}

export async function withRateLimit(req: Request, apiKey?: string | null) {
  const key = keyFromRequest(req, apiKey || undefined)
  const rl = await rateLimit(key, 60, 60) // 60 req per 60s
  if (!rl.allowed) throw Object.assign(new Error('Rate limit exceeded'), { status: 429 })
}

export function badRequest(message: string) {
  return json({ error: message }, 400)
}

export function unauthorized() {
  return json({ error: 'Unauthorized' }, 401)
}

export function notFound() {
  return json({ error: 'Not found' }, 404)
}

