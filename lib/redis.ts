import { REDIS_REST_URL, REDIS_REST_TOKEN } from '@/lib/env'

type RedisResult<T=any> = { result: T }

async function redisFetch<T=any>(path: string[], body?: any): Promise<T | null> {
  const base = REDIS_REST_URL()
  if (!base) return null
  const url = [base, ...path].join('/')
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(REDIS_REST_TOKEN() ? { 'Authorization': `Bearer ${REDIS_REST_TOKEN()}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) throw new Error(`Redis error ${res.status}`)
  const json = await res.json() as RedisResult<T>
  return json.result
}

export const redis = {
  async get(key: string) {
    return redisFetch<string>(['get', encodeURIComponent(key)])
  },
  async setex(key: string, seconds: number, value: string) {
    return redisFetch(['setex', encodeURIComponent(key), String(seconds)], { value })
  },
  async incrBy(key: string, amount: number) {
    return redisFetch<number>(['incrby', encodeURIComponent(key), String(amount)])
  },
  async ttl(key: string) {
    return redisFetch<number>(['ttl', encodeURIComponent(key)])
  },
  async lpush(key: string, value: string) {
    return redisFetch<number>(['lpush', encodeURIComponent(key)], { value })
  },
  async rpop(key: string) {
    return redisFetch<string>(['rpop', encodeURIComponent(key)])
  },
}
