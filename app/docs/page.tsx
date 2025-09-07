export default function DocsPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-semibold">Docs</h1>
      <p className="text-sm text-neutral-500">Non-custodial testnet/stagenet payments. HMAC-signed webhooks. No KYC.</p>
      <section className="space-y-2">
        <h2 className="font-medium">OpenAPI</h2>
        <a className="underline" href="/api/openapi.json">/api/openapi.json</a>
      </section>
      <section className="space-y-2">
        <h2 className="font-medium">Quickstart</h2>
        <pre className="text-xs bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-x-auto">{`# 1) Create account
curl -s -X POST $APP_BASE_URL/api/accounts

# 2) Create invoice (BTC)
curl -s -X POST $APP_BASE_URL/api/invoices \
  -H "x-api-key: $API_KEY" \
  -H 'content-type: application/json' \
  -d '{"asset":"BTC","amount":{"fiat":10,"fiatCurrency":"USD"},"memo":"Test"}'

# 3) Check status
curl -s $APP_BASE_URL/api/invoices/<invoiceId>`}</pre>
      </section>
      <section className="space-y-2 text-xs text-neutral-500">
        <div>Compliance: Software only. Non-custodial. Testnet/stagenet. No KYC. No fiat ramps.</div>
      </section>
    </main>
  )
}

