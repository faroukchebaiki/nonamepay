import Link from 'next/link'

export default function DocsPage() {
  return (
    <main className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Docs</h1>
      <p className="text-sm text-neutral-500">Non‑custodial payments with Bitcoin testnet and Monero stagenet. HMAC auth, signed webhooks, webhook retries.</p>

      <section className="space-y-2">
        <h2 className="font-medium">OpenAPI</h2>
        <p className="text-sm">Explore the API schema:</p>
        <a className="underline" href="/api/openapi.json">/api/openapi.json</a>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Authentication</h2>
        <p className="text-sm">Use your API key via <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-900">x-api-key</code> and sign requests with HMAC:</p>
        <pre className="text-xs bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-x-auto">{`TS=$(node -e "console.log(Math.floor(Date.now()/1000))"); NONCE=$(node -e "console.log(require('crypto').randomUUID())")
SIG=$(node -e "const c=require('crypto');console.log(c.createHmac('sha256',process.env.K).update(process.env.T+'.'+process.env.N+'.'+process.env.B).digest('hex'))" K=$API_KEY T=$TS N=$NONCE B="$BODY")`}</pre>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Endpoints</h2>
        <ul className="list-disc pl-6 text-sm">
          <li>POST <code>/api/accounts</code> – create numbered account</li>
          <li>POST <code>/api/invoices</code> – create invoice (BTC or XMR)</li>
          <li>GET <code>/api/invoices/[id]</code> – invoice status</li>
          <li>GET <code>/api/accounts/[code]/invoices</code> – list invoices by account</li>
          <li>POST <code>/api/webhooks/test</code> – send sample webhook</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Quickstart</h2>
        <pre className="text-xs bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-x-auto">{`# Create account
curl -s -X POST $APP_BASE_URL/api/accounts

# Create invoice (XMR demo)
API_KEY=... BODY='{"asset":"XMR","amount":{"fiat":10,"fiatCurrency":"USD"}}'
TS=$(node -e "console.log(Math.floor(Date.now()/1000))"); NONCE=$(node -e "console.log(require('crypto').randomUUID())")
SIG=$(node -e "const c=require('crypto');console.log(c.createHmac('sha256',process.env.K).update(process.env.T+'.'+process.env.N+'.'+process.env.B).digest('hex'))" K=$API_KEY T=$TS N=$NONCE B="$BODY")
curl -s -X POST $APP_BASE_URL/api/invoices -H "x-api-key: $API_KEY" -H "x-timestamp: $TS" -H "x-nonce: $NONCE" -H "x-signature: $SIG" -H 'content-type: application/json' -d "$BODY"

# Get status
curl -s $APP_BASE_URL/api/invoices/<invoiceId>`}</pre>
      </section>

      <section className="space-y-1 text-xs text-neutral-500">
        <div>Compliance: Software only. Non‑custodial. Testnet/stagenet. No KYC. No fiat ramps.</div>
        <div>Next step: <Link href="/signup" className="underline">Create your merchant</Link>.</div>
      </section>
    </main>
  )
}
