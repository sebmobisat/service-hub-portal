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


