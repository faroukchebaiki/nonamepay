import { NextRequest } from 'next/server'
import { z } from 'zod'
import { CreateInvoiceInput } from '@/lib/api/schemas'
import { authenticate, verifyRequestHmac } from '@/lib/auth'
import { json, unauthorized, withRateLimit, badRequest } from '@/lib/http'
import { db } from '@/lib/db/client'
import { invoices } from '@/lib/db/schema'
import { getRate } from '@/lib/rates'
import { MERCHANT_BTC_TESTNET_XPUB } from '@/lib/env'
import { deriveTestnetAddressFromXpub, buildBip21 } from '@/lib/crypto/btc'
import { simulateStagenetSubaddress, buildMoneroUri } from '@/lib/crypto/xmr'
import { qrSvg } from '@/lib/qr'

export async function POST(req: NextRequest) {
  const merchant = await authenticate(req)
  if (!merchant) return unauthorized()
  await withRateLimit(req, merchant.id)
  const text = await req.text().catch(() => '')
  if (!verifyRequestHmac(req, text, req.headers.get('x-api-key') || '')) {
    return badRequest('Invalid HMAC headers')
  }
  const body = JSON.parse(text || '{}')
  const parse = CreateInvoiceInput.safeParse(body)
  if (!parse.success) return badRequest(parse.error.issues.map(i=>i.message).join('; '))
  const { asset, amount, memo, accountCode, webhookUrl } = parse.data

  let amountCrypto = amount.crypto
  let rateUsed: number | undefined
  let priceFiat: number | undefined
  const fiatCurrency = amount.fiatCurrency || 'USD'
  if (!amountCrypto) {
    const rate = await getRate(asset, fiatCurrency)
    rateUsed = rate
    priceFiat = amount.fiat!
    amountCrypto = priceFiat / rate
  }

  let address = ''
  let uri = ''
  if (asset === 'BTC') {
    const xpub = MERCHANT_BTC_TESTNET_XPUB()
    if (!xpub) return badRequest('MERCHANT_BTC_TESTNET_XPUB not set')
    const der = deriveTestnetAddressFromXpub(xpub, `${merchant.id}:${Date.now()}`)
    address = der.address
    uri = buildBip21(address, amountCrypto, memo)
  } else {
    const sub = simulateStagenetSubaddress(`${merchant.id}:${Date.now()}`)
    address = sub.address
    uri = buildMoneroUri(address, amountCrypto, memo)
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
  const [row] = await db.insert(invoices).values({
    merchantId: merchant.id,
    accountCode,
    asset,
    priceFiat: priceFiat ? String(priceFiat) : undefined,
    fiatCurrency,
    rateUsed: rateUsed ? String(rateUsed) : undefined,
    amountNative: String(amountCrypto!),
    address,
    uri,
    expiresAt,
    memo,
    webhookUrl
  }).returning()

  const svg = await qrSvg(uri)
  return json({
    invoiceId: row.id,
    uri,
    address,
    amountCrypto: Number(amountCrypto),
    qrSvg: svg,
    expiresAt: row.expiresAt?.toISOString?.() || expiresAt.toISOString(),
    status: row.status
  })
}
