export function env(name: string, fallback?: string) {
  const v = process.env[name]
  if (v === undefined || v === '') {
    if (fallback !== undefined) return fallback
  }
  return v
}

export const APP_BASE_URL = () => env('APP_BASE_URL', 'http://localhost:3000')!
export const DATABASE_URL = () => env('DATABASE_URL')!
export const REDIS_REST_URL = () => env('REDIS_REST_URL')
export const REDIS_REST_TOKEN = () => env('REDIS_REST_TOKEN')
export const DEMO_MODE = () => env('DEMO_MODE', 'true') === 'true'
export const MERCHANT_BTC_TESTNET_XPUB = () => env('MERCHANT_BTC_TESTNET_XPUB')
export const WEBHOOK_SECRET = () => env('WEBHOOK_SECRET', 'dev-secret')!
export const SESSION_SECRET = () => env('SESSION_SECRET', WEBHOOK_SECRET())!
export const BTC_CONFIRMATIONS = () => parseInt(env('BTC_CONFIRMATIONS', '1')!)
export const XMR_CONFIRMATIONS = () => parseInt(env('XMR_CONFIRMATIONS', '10')!)
export const XMR_STAGENET_RPC_URL = () => env('XMR_STAGENET_RPC_URL')
export const RATES_PRIMARY_URL = () => env('RATES_PRIMARY_URL')
export const RATES_FALLBACK_URL = () => env('RATES_FALLBACK_URL')
