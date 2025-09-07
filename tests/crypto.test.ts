import { describe, it, expect } from 'vitest'
import { buildBip21 } from '../lib/crypto/btc'
import { buildMoneroUri } from '../lib/crypto/xmr'
import { qrSvg } from '../lib/qr'
import { signBody } from '../lib/webhooks'

describe('URI builders', () => {
  it('builds bip21', () => {
    const u = buildBip21('tb1qxyz', 0.001, 'memo')
    expect(u.startsWith('bitcoin:')).toBe(true)
  })
  it('builds monero uri', () => {
    const u = buildMoneroUri('59abc', 1.23, 'memo')
    expect(u.startsWith('monero:')).toBe(true)
  })
})

describe('QR SVG', () => {
  it('generates svg', async () => {
    const s = await qrSvg('hello')
    expect(s.includes('<svg')).toBe(true)
  })
})

describe('Webhook sign', () => {
  it('signs', () => {
    const sig = signBody('1','n','{}')
    expect(typeof sig).toBe('string')
  })
})
