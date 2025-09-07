import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import {
  CreateAccountResponse,
  CreateInvoiceInput,
  CreateInvoiceResponse,
  InvoiceStatusResponse,
  WebhookTestInput,
} from './schemas'

export function generateOpenApi(baseUrl: string) {
  const reg = new OpenAPIRegistry()
  reg.registerPath({
    method: 'post',
    path: '/api/accounts',
    description: 'Create a numbered account',
    responses: {
      200: {
        description: 'Account created',
        content: { 'application/json': { schema: reg.register('CreateAccountResponse', CreateAccountResponse) } },
      }
    }
  })
  reg.registerPath({
    method: 'post',
    path: '/api/invoices',
    description: 'Create invoice',
    request: { body: { content: { 'application/json': { schema: reg.register('CreateInvoiceInput', CreateInvoiceInput) } } } },
    responses: {
      200: { description: 'Invoice created', content: { 'application/json': { schema: reg.register('CreateInvoiceResponse', CreateInvoiceResponse) } } }
    }
  })
  reg.registerPath({
    method: 'get',
    path: '/api/invoices/{id}',
    description: 'Get invoice status',
    request: { params: z.object({ id: z.string().uuid() }) },
    responses: {
      200: { description: 'Invoice', content: { 'application/json': { schema: reg.register('InvoiceStatusResponse', InvoiceStatusResponse) } } }
    }
  })
  reg.registerPath({
    method: 'get',
    path: '/api/accounts/{code}/invoices',
    description: 'List invoices for account',
    request: { params: z.object({ code: z.string() }) },
    responses: { 200: { description: 'List', content: { 'application/json': { schema: z.object({ items: z.array(InvoiceStatusResponse) }) } } } }
  })
  reg.registerPath({
    method: 'post',
    path: '/api/webhooks/test',
    description: 'Send a sample signed webhook',
    request: { body: { content: { 'application/json': { schema: WebhookTestInput } } } },
    responses: { 200: { description: 'Enqueued' } }
  })

  const gen = new OpenApiGeneratorV31(reg.definitions)
  const doc = gen.generateDocument({
    openapi: '3.1.0',
    info: { title: 'nonamepay API', version: '0.1.0' },
    servers: [{ url: baseUrl }]
  })
  return doc
}
