import { DEMO_MODE, APP_BASE_URL } from '@/lib/env'

export default function Page() {
  return (
    <main className="space-y-6">
      {DEMO_MODE() && (
        <div className="rounded border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm">DEMO_MODE enabled — testnet/stagenet only.</div>
      )}
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">Non-custodial crypto payments</h1>
        <p className="text-sm text-neutral-500">Bitcoin testnet and Monero stagenet. No KYC. No custody. Built for serverless.</p>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border p-4">
          <h3 className="font-medium mb-1">1. Create API key</h3>
          <p className="text-sm text-neutral-500">Seed a merchant locally and set envs.</p>
        </div>
        <div className="rounded border p-4">
          <h3 className="font-medium mb-1">2. Create account</h3>
          <code className="text-xs">curl -X POST {APP_BASE_URL()}/api/accounts</code>
        </div>
        <div className="rounded border p-4">
          <h3 className="font-medium mb-1">3. Create invoice</h3>
          <code className="text-xs">curl -X POST {APP_BASE_URL()}/api/invoices ...</code>
        </div>
      </section>
    </main>
  )
}

