-- Service Hub Portal - Communication Templates Table
-- Run this SQL in Supabase SQL Editor for your project

-- Enable pgcrypto for gen_random_uuid if not enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Communication Templates Table
CREATE TABLE IF NOT EXISTS public.communication_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id integer NOT NULL,
  name text NOT NULL,
  description text,
  channel text NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms')),
  style text NOT NULL CHECK (style IN ('informal', 'formal', 'professional')),
  
  -- SEPARAZIONE CONTENUTI AI vs MANUALE
  prompt text, -- Solo per template AI (può essere NULL per template manuali)
  message_content text, -- Contenuto del messaggio (NULL per template AI-only)
  email_subject text, -- Oggetto email (solo per channel='email')
  
  -- TIPO TEMPLATE
  template_type text NOT NULL DEFAULT 'ai' CHECK (template_type IN ('ai', 'manual', 'hybrid')),
  -- 'ai': template con prompt per AI
  -- 'manual': template solo messaggio manuale
  -- 'hybrid': template utilizzabile in entrambi i modi
  
  -- METADATA
  is_favorite boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- VINCOLI
  UNIQUE(dealer_id, name, channel),
  
  -- Constraint condizionale per message_content
  CONSTRAINT check_message_content_for_type CHECK (
    (template_type = 'ai' AND message_content IS NULL) OR 
    (template_type IN ('manual', 'hybrid') AND message_content IS NOT NULL)
  )
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS communication_templates_dealer_idx ON public.communication_templates(dealer_id);
CREATE INDEX IF NOT EXISTS communication_templates_channel_idx ON public.communication_templates(channel);
CREATE INDEX IF NOT EXISTS communication_templates_type_idx ON public.communication_templates(template_type);
CREATE INDEX IF NOT EXISTS communication_templates_favorite_idx ON public.communication_templates(dealer_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS communication_templates_usage_idx ON public.communication_templates(dealer_id, usage_count DESC);

-- Row Level Security
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;

-- Policy per service role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'communication_templates' AND policyname = 'allow_all_service_role'
  ) THEN
    CREATE POLICY allow_all_service_role ON public.communication_templates FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END$$;

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_communication_templates_updated_at BEFORE UPDATE
    ON public.communication_templates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Template di esempio per testing
INSERT INTO public.communication_templates (dealer_id, name, description, channel, style, template_type, prompt, message_content, email_subject, is_favorite) VALUES
(1, 'Promemoria Tagliando AI', 'Template AI-only per promemoria manutenzione veicolo', 'email', 'professional', 'ai', 
 'Scrivi un promemoria professionale per il tagliando del veicolo, menzionando i chilometri raggiunti e l''importanza della manutenzione preventiva. Includi i placeholder {SALUTATION}, {VEICOLO}, {TARGA} e {KM}.',
 NULL, -- AI-only template non ha message_content
 'Promemoria Tagliando - {VEICOLO} {TARGA}',
 true),

(1, 'Benvenuto Nuovo Cliente', 'Messaggio di benvenuto per nuovi clienti', 'whatsapp', 'informal', 'manual',
 NULL,
 'Ciao {NOME}! 👋

Benvenuto nella famiglia {CONCESSIONARIA}! 

Siamo felicissimi di averti come nuovo cliente. Il tuo {VEICOLO} è in ottime mani con noi.

Se hai domande o hai bisogno di assistenza, non esitare a contattarci. Siamo sempre qui per te!

A presto! 🚗✨',
 NULL,
 false),

(1, 'Controllo Scadenza Revisione', 'Avviso per scadenza revisione', 'email', 'formal', 'hybrid',
 'Scrivi un avviso formale per la scadenza della revisione del veicolo, includendo le conseguenze legali del mancato rispetto.',
 '{SALUTATION},

La informiamo che la revisione del suo veicolo {VEICOLO} con targa {TARGA} è in scadenza.

La revisione periodica è obbligatoria per legge e deve essere effettuata entro le date stabilite dal Codice della Strada.

La invitiamo a prenotare la revisione presso la nostra officina autorizzata.

Cordiali saluti',
 'IMPORTANTE: Scadenza Revisione {TARGA}',
 true);

-- Commenti sulla tabella
COMMENT ON TABLE public.communication_templates IS 'Template per comunicazioni AI e manuali del Service Hub';
COMMENT ON COLUMN public.communication_templates.template_type IS 'Tipo template: ai (solo AI), manual (solo manuale), hybrid (entrambi)';
COMMENT ON COLUMN public.communication_templates.prompt IS 'Prompt per AI (NULL per template manuali)';
COMMENT ON COLUMN public.communication_templates.message_content IS 'Contenuto del messaggio con placeholder (NULL per template AI-only)';
