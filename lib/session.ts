import { cookies } from 'next/headers'
import { createHmac, randomUUID } from 'crypto'
import { SESSION_SECRET } from '@/lib/env'
import { db } from '@/lib/db/client'
import { merchants } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const COOKIE_NAME = 'sid'

function sign(value: string) {
  return createHmac('sha256', SESSION_SECRET()).update(value).digest('hex')
}

export async function setSession(merchantId: string) {
  const payload = `${merchantId}.${Date.now()}`
  const sig = sign(payload)
  const token = `${payload}.${sig}`
  const jar = await cookies()
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSession() {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}

export async function getSessionMerchant() {
  const jar = await cookies()
  const raw = jar.get(COOKIE_NAME)?.value
  if (!raw) return null
  const parts = raw.split('.')
  if (parts.length < 3) return null
  const [merchantId, ts, sig] = [parts[0], parts[1], parts.slice(2).join('.')]
  const payload = `${merchantId}.${ts}`
  const expected = sign(payload)
  if (expected !== sig) return null
  const [m] = await db.select().from(merchants).where(eq(merchants.id, merchantId)).limit(1)
  return m || null
}

