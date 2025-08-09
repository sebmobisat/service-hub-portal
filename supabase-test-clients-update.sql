-- Aggiunta campi mancanti alla tabella test_clients per Service Hub Portal
-- Esegui questa query SQL nell'Editor SQL di Supabase

-- Aggiungi i campi mancanti alla tabella test_clients
ALTER TABLE public.test_clients 
ADD COLUMN IF NOT EXISTS plate text,           -- Targa
ADD COLUMN IF NOT EXISTS year integer,         -- Anno
ADD COLUMN IF NOT EXISTS vin text,             -- VIN (max 17 caratteri)
ADD COLUMN IF NOT EXISTS serial text;          -- Serial

-- Aggiungi constraint per VIN (massimo 17 caratteri)
ALTER TABLE public.test_clients 
ADD CONSTRAINT IF NOT EXISTS test_clients_vin_length 
CHECK (vin IS NULL OR length(vin) <= 17);

-- Aggiungi constraint per anno (valori ragionevoli)
ALTER TABLE public.test_clients 
ADD CONSTRAINT IF NOT EXISTS test_clients_year_range 
CHECK (year IS NULL OR (year >= 1900 AND year <= 2030));

-- Aggiungi indici per migliorare le performance (opzionale)
CREATE INDEX IF NOT EXISTS test_clients_plate_idx ON public.test_clients(plate);
CREATE INDEX IF NOT EXISTS test_clients_vin_idx ON public.test_clients(vin);

-- Commenta per verificare la struttura aggiornata
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'test_clients' 
-- ORDER BY ordinal_position;
