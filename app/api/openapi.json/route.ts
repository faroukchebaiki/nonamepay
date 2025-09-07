import { NextResponse } from 'next/server'
import { generateOpenApi } from '@/lib/api/openapi'
import { APP_BASE_URL } from '@/lib/env'

export async function GET() {
  const doc = generateOpenApi(APP_BASE_URL())
  return NextResponse.json(doc)
}

