CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  api_key_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
  code text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id),
  account_code text REFERENCES accounts(code),
  asset text NOT NULL CHECK (asset IN ('BTC','XMR')),
  price_fiat numeric,
  fiat_currency text,
  rate_used numeric,
  amount_native numeric NOT NULL,
  address text NOT NULL,
  uri text NOT NULL,
  status text NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid','seen','confirmed','expired')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  memo text
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id),
  txid text NOT NULL,
  amount_native numeric NOT NULL,
  confirmations int NOT NULL DEFAULT 0,
  seen_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id),
  url text NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  last_status int,
  last_error text,
  next_attempt_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

