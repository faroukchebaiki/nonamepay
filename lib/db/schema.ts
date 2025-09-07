import { pgTable, text, timestamp, uuid, integer, numeric } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const merchants = pgTable('merchants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  apiKeyHash: text('api_key_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const accounts = pgTable('accounts', {
  code: text('code').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  merchantId: uuid('merchant_id').references(() => merchants.id).notNull(),
  accountCode: text('account_code').references(() => accounts.code),
  asset: text('asset', { enum: ['BTC', 'XMR'] }).notNull(),
  priceFiat: numeric('price_fiat'),
  fiatCurrency: text('fiat_currency'),
  rateUsed: numeric('rate_used'),
  amountNative: numeric('amount_native').notNull(),
  address: text('address').notNull(),
  uri: text('uri').notNull(),
  status: text('status', { enum: ['unpaid', 'seen', 'confirmed', 'expired'] }).notNull().default('unpaid'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
  memo: text('memo'),
  webhookUrl: text('webhook_url'),
})

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').references(() => invoices.id).notNull(),
  txid: text('txid').notNull(),
  amountNative: numeric('amount_native').notNull(),
  confirmations: integer('confirmations').default(0).notNull(),
  seenAt: timestamp('seen_at', { withTimezone: true }).defaultNow().notNull(),
})

export const webhookLogs = pgTable('webhook_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').references(() => invoices.id).notNull(),
  url: text('url').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  lastStatus: integer('last_status'),
  lastError: text('last_error'),
  nextAttemptAt: timestamp('next_attempt_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type InvoiceStatus = 'unpaid' | 'seen' | 'confirmed' | 'expired'
