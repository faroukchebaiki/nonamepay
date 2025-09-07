import { defineConfig } from 'drizzle-kit'
import { config as loadEnv } from 'dotenv'

// Load env from .env.local first (Next-style), then fall back to .env
loadEnv({ path: '.env.local' })
loadEnv()

export default defineConfig({
  out: './drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || ''
  },
})
