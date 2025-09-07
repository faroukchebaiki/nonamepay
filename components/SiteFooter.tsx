export function SiteFooter() {
  return (
    <footer className="mt-12 border-t pt-6 text-xs text-neutral-500 flex items-center justify-between">
      <div>© {new Date().getFullYear()} nonamepay — Testnet/Stagenet only.</div>
      <nav className="flex gap-4">
        <a href="/docs" className="underline">Docs</a>
        <a href="/api/openapi.json" className="underline">OpenAPI</a>
        <a href="https://vercel.com" target="_blank" rel="noreferrer" className="underline">Vercel</a>
      </nav>
    </footer>
  )
}

