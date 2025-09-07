import { networks, payments } from 'bitcoinjs-lib'
import * as bip32 from 'bip32'
import { createHash } from 'crypto'

export function deriveTestnetAddressFromXpub(xpub: string, uniqueSeed: string) {
  const hash = createHash('sha256').update(uniqueSeed).digest()
  const index = hash.readUInt32BE(0) & 0x7fffffff // non-hardened
  const node = bip32.fromBase58(xpub, networks.testnet)
  const child = node.derive(index)
  const { address } = payments.p2wpkh({ pubkey: child.publicKey, network: networks.testnet })
  if (!address) throw new Error('Failed to derive address')
  return { address, index }
}

export function buildBip21(uriAddress: string, amount?: number, memo?: string) {
  const params = new URLSearchParams()
  if (amount && amount > 0) params.set('amount', amount.toFixed(8))
  if (memo) params.set('message', memo)
  const query = params.toString()
  return `bitcoin:${uriAddress}${query ? `?${query}` : ''}`
}

