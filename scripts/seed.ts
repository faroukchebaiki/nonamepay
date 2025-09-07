#!/usr/bin/env ts-node
import { db } from '../lib/db/client'
import { merchants } from '../lib/db/schema'
import { randomBytes, createHash } from 'crypto'

async function main() {
  const apiKey = randomBytes(24).toString('base64url')
  const apiKeyHash = createHash('sha256').update(apiKey).digest('hex')
  const [m] = await db.insert(merchants).values({ apiKeyHash, name: 'Demo Merchant' }).returning()
  console.log('Merchant created:')
  console.log('  id=', m.id)
  console.log('  API_KEY=', apiKey)
}

main().catch((e)=>{ console.error(e); process.exit(1) })
