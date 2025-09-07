import { createHash } from 'crypto'
import { DEMO_MODE } from '@/lib/env'

export type XmrAddress = { address: string, isSimulator: boolean }

export function simulateStagenetSubaddress(uniqueSeed: string): XmrAddress {
  // This is a simulator: generate deterministic-looking address
  const h = createHash('sha256').update(uniqueSeed).digest('hex')
  const addr = `59${h.slice(0,93)}` // Monero addresses are long; this is a label only
  return { address: addr, isSimulator: true }
}

export function buildMoneroUri(address: string, amount?: number, memo?: string) {
  const params = new URLSearchParams()
  if (amount && amount > 0) params.set('tx_amount', amount.toFixed(12))
  if (memo) params.set('tx_description', memo)
  const query = params.toString()
  return `monero:${address}${query ? `?${query}` : ''}`
}

