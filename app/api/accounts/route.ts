import { NextRequest } from 'next/server'
import { randomBytes } from 'crypto'
import { db } from '@/lib/db/client'
import { accounts } from '@/lib/db/schema'
import { json, withRateLimit } from '@/lib/http'

export async function POST(req: NextRequest) {
  await withRateLimit(req)
  const raw = randomBytes(12).toString('base64url') // ~16 chars
  const code = raw.slice(0, 16)
  await db.insert(accounts).values({ code })
  return json({ accountCode: code })
}

