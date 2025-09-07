import { redis } from '@/lib/redis'

export async function rateLimit(key: string, maxTokens: number, refillSeconds: number) {
  // Simple token bucket via key counters with TTL
  const bucketKey = `rl:${key}`
  const currentTtl = await redis.ttl(bucketKey)
  if (currentTtl === null) return { allowed: true }
  if (currentTtl < 0) {
    await redis.setex(bucketKey, refillSeconds, '1')
    return { allowed: true }
  } else {
    const count = await redis.incrBy(bucketKey, 1)
    if (count! === 1) {
      // set TTL on first increment in window
      await redis.setex(bucketKey, refillSeconds, String(count))
    }
    const allowed = (count || 0) <= maxTokens
    return { allowed, remaining: Math.max(0, maxTokens - (count || 0)) }
  }
}

export function keyFromRequest(req: Request, apiKey?: string | null) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'ip:unknown'
  return `${ip}:${apiKey || 'anon'}`
}

