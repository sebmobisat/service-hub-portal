-- ===============================================
-- AI PROMPTS TABLE - Service Hub Platform
-- ===============================================
-- Tabella centralizzata per tutti i prompt AI utilizzati nella piattaforma
-- Supporta multilingue, versioning e categorizzazione

-- Creazione tabella ai_prompts
CREATE TABLE IF NOT EXISTS ai_prompts (
    id SERIAL PRIMARY KEY,
    
    -- Identificazione prompt
    prompt_key VARCHAR(100) NOT NULL UNIQUE, -- Chiave univoca per identificare il prompt (es: 'communication_email', 'certificate_reminder')
    category VARCHAR(50) NOT NULL, -- Categoria del prompt (es: 'communication', 'certificate', 'reminder', 'support')
    subcategory VARCHAR(50), -- Sottocategoria opzionale (es: 'email', 'whatsapp', 'sms')
    
    -- Contenuto multilingue
    title_it VARCHAR(200) NOT NULL, -- Titolo in italiano
    title_en VARCHAR(200) NOT NULL, -- Titolo in inglese
    prompt_it TEXT NOT NULL, -- Prompt in italiano
    prompt_en TEXT NOT NULL, -- Prompt in inglese
    
    -- Metadati
    description_it TEXT, -- Descrizione del prompt in italiano
    description_en TEXT, -- Descrizione del prompt in inglese
    variables JSONB DEFAULT '[]'::jsonb, -- Array delle variabili disponibili nel prompt (es: ['clientName', 'vehicleModel', 'certificateDate'])
    
    -- Configurazione
    is_active BOOLEAN DEFAULT true, -- Se il prompt è attivo
    is_system BOOLEAN DEFAULT false, -- Se è un prompt di sistema (non modificabile via UI)
    max_tokens INTEGER DEFAULT 1000, -- Limite token per la risposta AI
    temperature DECIMAL(2,1) DEFAULT 0.7, -- Temperatura per la creatività AI (0.0-1.0)
    
    -- Versioning e tracking
    version INTEGER DEFAULT 1, -- Versione del prompt
    created_by INTEGER, -- ID del dealer che ha creato il prompt (NULL per prompt di sistema)
    updated_by INTEGER, -- ID del dealer che ha modificato il prompt
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_ai_prompts_key ON ai_prompts(prompt_key);
CREATE INDEX IF NOT EXISTS idx_ai_prompts_category ON ai_prompts(category);
CREATE INDEX IF NOT EXISTS idx_ai_prompts_active ON ai_prompts(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_prompts_system ON ai_prompts(is_system);

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_ai_prompts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ai_prompts_updated_at
    BEFORE UPDATE ON ai_prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_prompts_updated_at();

-- ===============================================
-- PROMPT INIZIALI DI SISTEMA
-- ===============================================

-- Prompt per comunicazioni email
INSERT INTO ai_prompts (
    prompt_key, 
    category, 
    subcategory,
    title_it, 
    title_en,
    prompt_it, 
    prompt_en,
    description_it,
    description_en,
    variables,
    is_system,
    max_tokens,
    temperature
) VALUES (
    'communication_email',
    'communication',
    'email',
    'Comunicazione Email Clienti',
    'Client Email Communication',
    'Sei un assistente professionale per un''azienda di servizi automobilistici. Scrivi una comunicazione email professionale e cordiale per i clienti.

Contesto: {context}
Informazioni cliente: {clientInfo}
Dati veicolo: {vehicleData}
Istruzioni dealer: {dealerInstructions}

ISTRUZIONI IMPORTANTI:
- Usa SOLO i placeholder forniti in {clientInfo}
- Struttura il messaggio con paragrafi separati (usa \\n\\n per separare)
- NON aggiungere firme, saluti finali o informazioni di contatto (vengono aggiunti automaticamente dal sistema)
- NON inventare placeholder non forniti
- Mantieni un tono professionale ma cordiale
- Includi tutte le informazioni rilevanti dal contesto

Genera SOLO il contenuto del messaggio, senza firme o chiusure.',
    'You are a professional assistant for an automotive services company. Write a professional and friendly email communication for clients.

Context: {context}
Client information: {clientInfo}
Vehicle data: {vehicleData}
Dealer instructions: {dealerInstructions}

IMPORTANT INSTRUCTIONS:
- Use ONLY the placeholders provided in {clientInfo}
- Structure the message with separate paragraphs (use \\n\\n to separate)
- DO NOT add signatures, final greetings, or contact information (added automatically by the system)
- DO NOT invent placeholders not provided
- Maintain a professional but friendly tone
- Include all relevant information from the context

Generate ONLY the message content, without signatures or closings.',
    'Prompt per generare comunicazioni email professionali ai clienti',
    'Prompt for generating professional email communications to clients',
    '["context", "clientInfo", "vehicleData", "clientName", "vehicleModel", "licensePlate"]'::jsonb,
    true,
    800,
    0.7
);

-- Prompt per oggetti email
INSERT INTO ai_prompts (
    prompt_key, 
    category, 
    subcategory,
    title_it, 
    title_en,
    prompt_it, 
    prompt_en,
    description_it,
    description_en,
    variables,
    is_system,
    max_tokens,
    temperature
) VALUES (
    'email_subject',
    'communication',
    'email',
    'Oggetto Email',
    'Email Subject',
    'Genera un oggetto email professionale e accattivante per questa comunicazione:

Contenuto email: {emailContent}
Contesto: {context}

L''oggetto deve essere:
- Chiaro e descrittivo
- Massimo 60 caratteri
- Professionale
- Accattivante ma non clickbait

Genera SOLO l''oggetto, senza virgolette o prefissi.',
    'Generate a professional and engaging email subject for this communication:

Email content: {emailContent}
Context: {context}

The subject should be:
- Clear and descriptive
- Maximum 60 characters
- Professional
- Engaging but not clickbait

Generate ONLY the subject, without quotes or prefixes.',
    'Prompt per generare oggetti email professionali',
    'Prompt for generating professional email subjects',
    '["emailContent", "context", "clientName", "vehicleModel"]'::jsonb,
    true,
    100,
    0.5
);

-- Prompt per comunicazioni WhatsApp
INSERT INTO ai_prompts (
    prompt_key, 
    category, 
    subcategory,
    title_it, 
    title_en,
    prompt_it, 
    prompt_en,
    description_it,
    description_en,
    variables,
    is_system,
    max_tokens,
    temperature
) VALUES (
    'communication_whatsapp',
    'communication',
    'whatsapp',
    'Comunicazione WhatsApp Clienti',
    'Client WhatsApp Communication',
    'Sei un assistente professionale per un''azienda di servizi automobilistici. Scrivi un messaggio WhatsApp professionale ma informale per i clienti.

Contesto: {context}
Informazioni cliente: {clientInfo}
Dati veicolo: {vehicleData}

Scrivi un messaggio WhatsApp che:
- Sia professionale ma più informale rispetto all''email
- Sia conciso e diretto (massimo 300 caratteri)
- Includa le informazioni essenziali
- Usi un tono amichevole
- Includa emoji appropriate se necessario

Genera SOLO il contenuto del messaggio.',
    'You are a professional assistant for an automotive services company. Write a professional but informal WhatsApp message for clients.

Context: {context}
Client information: {clientInfo}
Vehicle data: {vehicleData}

Write a WhatsApp message that:
- Is professional but more informal than email
- Is concise and direct (maximum 300 characters)
- Includes essential information
- Uses a friendly tone
- Includes appropriate emojis if necessary

Generate ONLY the message content.',
    'Prompt per generare comunicazioni WhatsApp ai clienti',
    'Prompt for generating WhatsApp communications to clients',
    '["context", "clientInfo", "vehicleData", "clientName", "vehicleModel", "licensePlate"]'::jsonb,
    true,
    500,
    0.8
);

-- Prompt per promemoria certificati
INSERT INTO ai_prompts (
    prompt_key, 
    category, 
    subcategory,
    title_it, 
    title_en,
    prompt_it, 
    prompt_en,
    description_it,
    description_en,
    variables,
    is_system,
    max_tokens,
    temperature
) VALUES (
    'certificate_reminder',
    'certificate',
    'reminder',
    'Promemoria Scadenza Certificato',
    'Certificate Expiration Reminder',
    'Sei un assistente professionale per un''azienda di servizi automobilistici. Scrivi un promemoria professionale per la scadenza di un certificato.

Dati certificato:
- Cliente: {clientName}
- Veicolo: {vehicleModel} - {licensePlate}
- Tipo certificato: {certificateType}
- Data scadenza: {expirationDate}
- Giorni rimanenti: {daysRemaining}

Scrivi un messaggio che:
- Informi cortesemente della scadenza imminente
- Inviti a prenotare il rinnovo
- Sia professionale e utile
- Includa le informazioni essenziali
- Mantenga un tono di servizio clienti

Genera SOLO il contenuto del messaggio.',
    'You are a professional assistant for an automotive services company. Write a professional reminder for certificate expiration.

Certificate data:
- Client: {clientName}
- Vehicle: {vehicleModel} - {licensePlate}
- Certificate type: {certificateType}
- Expiration date: {expirationDate}
- Days remaining: {daysRemaining}

Write a message that:
- Politely informs about upcoming expiration
- Invites to book renewal
- Is professional and helpful
- Includes essential information
- Maintains a customer service tone

Generate ONLY the message content.',
    'Prompt per generare promemoria di scadenza certificati',
    'Prompt for generating certificate expiration reminders',
    '["clientName", "vehicleModel", "licensePlate", "certificateType", "expirationDate", "daysRemaining"]'::jsonb,
    true,
    600,
    0.6
);

-- ===============================================
-- COMMENTI E DOCUMENTAZIONE
-- ===============================================

COMMENT ON TABLE ai_prompts IS 'Tabella centralizzata per tutti i prompt AI utilizzati nella piattaforma Service Hub';
COMMENT ON COLUMN ai_prompts.prompt_key IS 'Chiave univoca per identificare il prompt nel codice';
COMMENT ON COLUMN ai_prompts.category IS 'Categoria principale del prompt (communication, certificate, reminder, etc.)';
COMMENT ON COLUMN ai_prompts.subcategory IS 'Sottocategoria opzionale per organizzare meglio i prompt';
COMMENT ON COLUMN ai_prompts.variables IS 'Array JSON delle variabili disponibili nel prompt per sostituzione dinamica';
COMMENT ON COLUMN ai_prompts.is_system IS 'Flag per identificare prompt di sistema non modificabili via UI';
COMMENT ON COLUMN ai_prompts.temperature IS 'Parametro creatività AI: 0.0 = deterministico, 1.0 = molto creativo';

-- Query di esempio per recuperare prompt
-- SELECT prompt_it, variables FROM ai_prompts WHERE prompt_key = 'communication_email' AND is_active = true;

-- Query per ottenere tutti i prompt di una categoria
-- SELECT * FROM ai_prompts WHERE category = 'communication' AND is_active = true ORDER BY subcategory, title_it;
