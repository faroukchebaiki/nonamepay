"use client"
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SignupSuccessInner() {
  const sp = useSearchParams()
  const apiKey = sp.get('apiKey')
  return (
    <main className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Your API key</h1>
      <div className="rounded border p-4">
        {apiKey ? (
          <div className="space-y-2">
            <div className="text-sm">Copy and store this API key safely. You won’t see it again.</div>
            <code className="block break-all p-2 bg-neutral-100 dark:bg-neutral-900 text-sm rounded">{apiKey}</code>
          </div>
        ) : (
          <div className="text-sm text-neutral-500">No API key available.</div>
        )}
      </div>
      <a className="inline-block rounded bg-blue-600 text-white px-4 py-2" href="/dashboard">Go to dashboard</a>
    </main>
  )
}

export default function SignupSuccess() {
  return (
    <Suspense fallback={null}>
      <SignupSuccessInner />
    </Suspense>
  )
}
