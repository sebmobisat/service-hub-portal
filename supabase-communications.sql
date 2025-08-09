-- Service Hub Portal - Communications Tables (Supabase)
-- Run this SQL in Supabase SQL Editor for your project

-- Enable pgcrypto for gen_random_uuid if not enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Dealer Signatures
CREATE TABLE IF NOT EXISTS public.dealer_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id integer NOT NULL,
  company_name text,
  address1 text,
  address2 text,
  city text,
  provincia text,
  postcode text,
  phone text,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index for fast lookup by dealer
CREATE INDEX IF NOT EXISTS dealer_signatures_dealer_id_idx ON public.dealer_signatures(dealer_id);

-- Test Clients
CREATE TABLE IF NOT EXISTS public.test_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id integer NOT NULL,
  first_name text,
  last_name text,
  company text,
  address1 text,
  address2 text,
  city text,
  provincia text,
  postcode text,
  phone text,
  email text,
  vehicle_brand text,
  vehicle_model text,
  fuel_type text,
  odometer numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS test_clients_dealer_id_idx ON public.test_clients(dealer_id);

-- Row Level Security (optional: adapt as needed)
ALTER TABLE public.dealer_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_clients ENABLE ROW LEVEL SECURITY;

-- Simple permissive policies for service role usage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'dealer_signatures' AND policyname = 'allow_all_service_role'
  ) THEN
    CREATE POLICY allow_all_service_role ON public.dealer_signatures FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'test_clients' AND policyname = 'allow_all_service_role'
  ) THEN
    CREATE POLICY allow_all_service_role ON public.test_clients FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END$$;


-- BILLING RECHARGES (Top-up payments via Stripe) -----------------------------
CREATE TABLE IF NOT EXISTS public.billing_recharges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id integer NOT NULL,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  currency text DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','succeeded','failed','canceled','refunded','requires_action')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS billing_recharges_pi_uidx
  ON public.billing_recharges(stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS billing_recharges_cs_uidx
  ON public.billing_recharges(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS billing_recharges_dealer_created_idx
  ON public.billing_recharges(dealer_id, created_at DESC);

ALTER TABLE public.billing_recharges ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='billing_recharges' AND policyname='allow_all_service_role'
  ) THEN
    CREATE POLICY allow_all_service_role ON public.billing_recharges FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END$$;


-- BILLING / USAGE TABLES -----------------------------------------------------

-- Dealers billing accounts (Stripe linkage)
CREATE TABLE IF NOT EXISTS public.dealer_billing_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id integer NOT NULL,
  stripe_customer_id text, -- maps to Stripe Customer
  balance_cents bigint DEFAULT 0, -- positive = credit, negative = debt
  currency text DEFAULT 'EUR',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dealer_billing_accounts_dealer_idx
  ON public.dealer_billing_accounts(dealer_id);

-- Pricing configuration (per-dealer override; null dealer_id = default)
CREATE TABLE IF NOT EXISTS public.billing_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id integer, -- nullable => global default
  email_price_cents integer NOT NULL DEFAULT 5, -- 0.05€ per email
  whatsapp_price_cents integer NOT NULL DEFAULT 10, -- 0.10€ per WhatsApp
  openai_markup_multiplier numeric NOT NULL DEFAULT 20, -- 20x OpenAI cost
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS billing_pricing_dealer_idx
  ON public.billing_pricing(dealer_id);

-- Usage events (immutable ledger)
CREATE TABLE IF NOT EXISTS public.billing_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id integer NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('email','whatsapp','openai')),
  quantity integer NOT NULL DEFAULT 1, -- usually 1 per event
  -- monetary amounts stored in cents (EUR)
  unit_cost_cents integer NOT NULL, -- the applied unit cost for this event
  total_cost_cents integer NOT NULL, -- quantity * unit_cost_cents
  -- openai specifics
  openai_model text, -- e.g., gpt-4o
  openai_input_tokens integer,
  openai_output_tokens integer,
  openai_provider_cost_cents integer, -- our raw OpenAI cost in cents
  -- metadata
  related_entity text, -- optional reference (email id, whatsapp id, request id)
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS billing_usage_events_dealer_created_idx
  ON public.billing_usage_events(dealer_id, created_at DESC);

-- Daily aggregates for quick graphs (optional, can be built via views)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.v_billing_usage_daily AS
SELECT
  dealer_id,
  date_trunc('day', created_at) AS day,
  SUM(CASE WHEN event_type='email' THEN quantity ELSE 0 END) AS emails,
  SUM(CASE WHEN event_type='whatsapp' THEN quantity ELSE 0 END) AS whatsapps,
  SUM(CASE WHEN event_type='openai' THEN quantity ELSE 0 END) AS openai_calls,
  SUM(total_cost_cents) AS total_cost_cents
FROM public.billing_usage_events
GROUP BY dealer_id, date_trunc('day', created_at);

-- RLS enabling
ALTER TABLE public.dealer_billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_usage_events ENABLE ROW LEVEL SECURITY;

-- Policies for service role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='dealer_billing_accounts' AND policyname='allow_all_service_role'
  ) THEN
    CREATE POLICY allow_all_service_role ON public.dealer_billing_accounts FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='billing_pricing' AND policyname='allow_all_service_role'
  ) THEN
    CREATE POLICY allow_all_service_role ON public.billing_pricing FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='billing_usage_events' AND policyname='allow_all_service_role'
  ) THEN
    CREATE POLICY allow_all_service_role ON public.billing_usage_events FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END$$;