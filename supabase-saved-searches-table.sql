-- ===============================================
-- SAVED SEARCHES TABLE - Service Hub Platform
-- ===============================================
-- Tabella per salvare le ricerche avanzate dei dealer
-- Supporta criteri complessi, condivisione e organizzazione

-- Creazione tabella saved_searches
CREATE TABLE IF NOT EXISTS saved_searches (
    id SERIAL PRIMARY KEY,
    
    -- Identificazione e proprietà
    dealer_id INTEGER NOT NULL, -- ID del dealer proprietario della ricerca
    name VARCHAR(100) NOT NULL, -- Nome della ricerca salvata
    description TEXT, -- Descrizione opzionale della ricerca
    
    -- Dati della ricerca
    search_criteria JSONB NOT NULL, -- Array dei criteri di ricerca salvati
    filters_count INTEGER DEFAULT 0, -- Numero di filtri applicati (per ordinamento/UI)
    
    -- Metadati
    is_favorite BOOLEAN DEFAULT false, -- Se è una ricerca preferita
    is_shared BOOLEAN DEFAULT false, -- Se è condivisa con altri utenti del dealer
    color VARCHAR(7) DEFAULT '#6b7280', -- Colore per l'organizzazione visiva (hex)
    icon VARCHAR(50) DEFAULT 'search', -- Icona per l'identificazione rapida
    
    -- Statistiche utilizzo
    usage_count INTEGER DEFAULT 0, -- Quante volte è stata utilizzata
    last_used_at TIMESTAMP WITH TIME ZONE, -- Ultimo utilizzo
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Vincoli
    CONSTRAINT saved_searches_dealer_name_unique UNIQUE(dealer_id, name),
    CONSTRAINT saved_searches_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT saved_searches_criteria_not_empty CHECK (jsonb_array_length(search_criteria) > 0)
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_saved_searches_dealer_id ON saved_searches(dealer_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_dealer_favorite ON saved_searches(dealer_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_saved_searches_dealer_usage ON saved_searches(dealer_id, usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_saved_searches_dealer_recent ON saved_searches(dealer_id, last_used_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_searches_created_at ON saved_searches(created_at DESC);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_saved_searches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    -- Aggiorna anche il conteggio dei filtri
    NEW.filters_count = jsonb_array_length(NEW.search_criteria);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_saved_searches_updated_at
    BEFORE UPDATE ON saved_searches
    FOR EACH ROW
    EXECUTE FUNCTION update_saved_searches_updated_at();

-- Trigger per impostare filters_count alla creazione
CREATE OR REPLACE FUNCTION set_saved_searches_filters_count()
RETURNS TRIGGER AS $$
BEGIN
    NEW.filters_count = jsonb_array_length(NEW.search_criteria);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_saved_searches_filters_count
    BEFORE INSERT ON saved_searches
    FOR EACH ROW
    EXECUTE FUNCTION set_saved_searches_filters_count();

-- Commenti per documentazione
COMMENT ON TABLE saved_searches IS 'Ricerche avanzate salvate dai dealer con criteri complessi e metadati';
COMMENT ON COLUMN saved_searches.search_criteria IS 'Array JSON dei criteri di ricerca nel formato: [{"field": "client.name", "operator": "contains", "value": "test", "logicalOperator": "AND"}]';
COMMENT ON COLUMN saved_searches.filters_count IS 'Numero di filtri nella ricerca (calcolato automaticamente)';
COMMENT ON COLUMN saved_searches.usage_count IS 'Contatore utilizzi per statistiche e ordinamento per popolarità';
COMMENT ON COLUMN saved_searches.color IS 'Colore hex per organizzazione visiva (#rrggbb)';
COMMENT ON COLUMN saved_searches.icon IS 'Nome icona per identificazione rapida (es: search, star, filter)';
