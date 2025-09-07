import { z } from 'zod'

export const CreateAccountResponse = z.object({
  accountCode: z.string()
})

export const AmountInput = z.object({
  fiat: z.number().positive().optional(),
  crypto: z.number().positive().optional(),
  fiatCurrency: z.enum(['USD','EUR']).optional().default('USD')
}).refine((v) => v.fiat || v.crypto, { message: 'fiat or crypto required' })

export const CreateInvoiceInput = z.object({
  asset: z.enum(['BTC','XMR']),
  amount: AmountInput,
  memo: z.string().max(140).optional(),
  accountCode: z.string().optional(),
  webhookUrl: z.string().url().optional()
})

export const CreateInvoiceResponse = z.object({
  invoiceId: z.string().uuid(),
  uri: z.string(),
  address: z.string(),
  amountCrypto: z.number(),
  qrSvg: z.string(),
  expiresAt: z.string(),
  status: z.enum(['unpaid','seen','confirmed','expired'])
})

export const InvoiceStatusResponse = z.object({
  id: z.string().uuid(),
  status: z.enum(['unpaid','seen','confirmed','expired']),
  txids: z.array(z.string()).default([]),
  confirmations: z.number().default(0),
  amountCrypto: z.number(),
  address: z.string(),
  uri: z.string(),
  asset: z.enum(['BTC','XMR'])
})

export const WebhookTestInput = z.object({
  url: z.string().url()
})

export type TCreateInvoiceInput = z.infer<typeof CreateInvoiceInput>
