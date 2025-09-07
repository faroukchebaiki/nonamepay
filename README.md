nonamepay — Non-custodial Crypto Payments (Testnet/Stagenet)

Overview
- Next.js 14 (App Router) on Vercel
- Postgres (Neon) via Drizzle ORM
- Upstash Redis (REST) for rate limiting + webhook retry queue
- BTC testnet (xpub derivation) + XMR stagenet (simulator fallback)
- OpenAPI 3.1 served at /api/openapi.json
- Tailwind UI, dark mode

Environment Variables
- `DATABASE_URL` Neon Postgres connection string
- `REDIS_REST_URL` Upstash REST URL (with token)
- `APP_BASE_URL` Public base URL (e.g., https://your-vercel-app.vercel.app)
- `MERCHANT_BTC_TESTNET_XPUB` Testnet xpub (BIP32)
- `BTC_CONFIRMATIONS` default 1–3 (e.g., 1)
- `XMR_CONFIRMATIONS` default 10–20 (e.g., 10)
- `DEMO_MODE` true|false
- `WEBHOOK_SECRET` HMAC secret for webhooks

Quickstart (Local)
1) Install deps
   pnpm install

2) Configure env
   cp .env.example .env.local  # fill values

3) Run migrations (one-time)
   pnpm exec drizzle-kit migrate

4) Seed a merchant (prints API key)
   pnpm exec ts-node scripts/seed.ts

5) Dev server
   pnpm dev

6) Create an account
   curl -s -X POST "$APP_BASE_URL/api/accounts"

7) Create an invoice
   curl -s -X POST "$APP_BASE_URL/api/invoices" \
     -H "x-api-key: $API_KEY" \
     -H 'content-type: application/json' \
     -d '{"asset":"BTC","amount":{"fiat":10,"fiatCurrency":"USD"},"memo":"Test"}'

8) Check status
   curl -s "$APP_BASE_URL/api/invoices/<invoiceId>"

Deployment (Vercel)
- Import the repo in Vercel
- Set env vars listed above
- Add Cron jobs (every 10–15 min):
  - GET /api/cron/payments
  - GET /api/cron/webhook-retries
- Deploy

Architecture
- API endpoints: app/api/*
- Cron workers: app/api/cron/*
- DB: lib/db/* with Drizzle schema at lib/db/schema.ts and migrations in /drizzle
- Redis (REST): lib/redis.ts
- Rate limiting: lib/ratelimit.ts (token bucket per IP+key)
- Price feed: lib/rates.ts (CoinCap + CoinGecko medianized; cached 60–120s)
- BTC addresses: lib/crypto/btc.ts (derive from xpub; testnet)
- XMR addresses: lib/crypto/xmr.ts (stagenet simulator if no RPC)
- Webhooks: lib/webhooks.ts (HMAC SHA-256 signing; Upstash queue)
- OpenAPI: lib/api/openapi.ts served at /api/openapi.json; generator script writes public/openapi.json

Notes
- Privacy: minimal logs, no PII; redact secrets in responses
- Security: HMAC API keys hashed at rest; rate limit by IP+API key
- Compliance: software only, non-custodial, testnet/stagenet; no KYC; no fiat ramps

Testing
- Unit tests (vitest) in /tests
- E2E demo: create account → create BTC invoice → use DEMO simulate-pay button → webhook enqueued
