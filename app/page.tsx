import { DEMO_MODE, APP_BASE_URL } from '@/lib/env'

export default function Page() {
  return (
    <main className="space-y-8">
      {DEMO_MODE() && (
        <div className="rounded border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm">DEMO_MODE enabled — testnet/stagenet only.</div>
      )}
      <section className="text-center space-y-3 py-10">
        <h1 className="text-4xl font-bold tracking-tight">Non‑custodial crypto payments</h1>
        <p className="text-base text-neutral-500">Bitcoin testnet and Monero stagenet. No KYC. No custody. Serverless‑ready.</p>
        <div className="flex items-center justify-center gap-3">
          <a href="/signup" className="px-4 py-2 rounded bg-blue-600 text-white">Get Started</a>
          <a href="/docs" className="px-4 py-2 rounded border">Read Docs</a>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border p-5 space-y-2">
          <h3 className="font-medium">No custody, No KYC</h3>
          <p className="text-sm text-neutral-500">Pay to addresses derived from your keys. Keep control.</p>
        </div>
        <div className="rounded border p-5 space-y-2">
          <h3 className="font-medium">Serverless‑friendly</h3>
          <p className="text-sm text-neutral-500">Neon Postgres + Upstash Redis via REST. Fast, free tiers.</p>
        </div>
        <div className="rounded border p-5 space-y-2">
          <h3 className="font-medium">Clean API</h3>
          <p className="text-sm text-neutral-500">OpenAPI 3.1, HMAC auth, webhooks with retry queue.</p>
        </div>
      </section>
      <section className="rounded border p-5 space-y-2">
        <h2 className="font-semibold">Quickstart (curl)</h2>
        <pre className="text-xs bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-x-auto">{`# create account
curl -s -X POST ${APP_BASE_URL()}/api/accounts

# create invoice (XMR demo)
API_KEY=... BODY='{"asset":"XMR","amount":{"fiat":10,"fiatCurrency":"USD"}}'
TS=$(node -e "console.log(Math.floor(Date.now()/1000))"); NONCE=$(node -e "console.log(require('crypto').randomUUID())")
SIG=$(node -e "const c=require('crypto');console.log(c.createHmac('sha256',process.env.K).update(process.env.T+'.'+process.env.N+'.'+process.env.B).digest('hex'))" K=$API_KEY T=$TS N=$NONCE B="$BODY")
curl -s -X POST ${APP_BASE_URL()}/api/invoices -H "x-api-key: $API_KEY" -H "x-timestamp: $TS" -H "x-nonce: $NONCE" -H "x-signature: $SIG" -H 'content-type: application/json' -d "$BODY"`}</pre>
      </section>
    </main>
  )
}
