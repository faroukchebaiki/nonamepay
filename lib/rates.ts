import { redis } from '@/lib/redis'

type Pair = 'BTCUSD' | 'BTCEUR' | 'XMRUSD' | 'XMREUR'

const CACHE_TTL = 90

async function fetchCoinCap(symbol: 'bitcoin' | 'monero') {
  const res = await fetch(`https://api.coincap.io/v2/assets/${symbol}`)
  if (!res.ok) throw new Error('CoinCap error')
  const json = await res.json()
  const priceUsd = parseFloat(json.data.priceUsd)
  return { USD: priceUsd }
}

async function fetchCoinGecko(id: 'bitcoin' | 'monero') {
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd,eur`)
  if (!res.ok) throw new Error('CoinGecko error')
  const json = await res.json()
  return { USD: json[id].usd as number, EUR: json[id].eur as number }
}

function median(values: number[]) {
  const v = values.slice().sort((a,b)=>a-b)
  const m = Math.floor(v.length/2)
  return v.length % 2 ? v[m] : (v[m-1]+v[m])/2
}

export async function getRate(asset: 'BTC'|'XMR', fiat: 'USD'|'EUR') {
  const key = `rate:${asset}:${fiat}`
  const cached = await redis.get(key)
  if (cached) return parseFloat(cached)
  const id = asset === 'BTC' ? 'bitcoin' : 'monero'
  const [a, b] = await Promise.allSettled([
    fetchCoinCap(id as any),
    fetchCoinGecko(id as any)
  ])
  const candidates: number[] = []
  if (a.status === 'fulfilled') {
    if (fiat === 'USD' && a.value.USD) candidates.push(a.value.USD)
  }
  if (b.status === 'fulfilled') {
    const val = (b.value as any)[fiat as 'USD'|'EUR']
    if (val) candidates.push(val)
  }
  if (candidates.length === 0) throw new Error('No rate sources available')
  const rate = median(candidates)
  await redis.setex(key, CACHE_TTL, String(rate))
  return rate
}

