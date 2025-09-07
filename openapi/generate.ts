import { writeFileSync, mkdirSync } from 'fs'
import { generateOpenApi } from '../lib/api/openapi'
import { APP_BASE_URL } from '../lib/env'

const doc = generateOpenApi(APP_BASE_URL())
mkdirSync('public', { recursive: true })
writeFileSync('public/openapi.json', JSON.stringify(doc, null, 2))
console.log('Generated public/openapi.json')
