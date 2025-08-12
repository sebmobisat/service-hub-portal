# 📋 PIANO DI SVILUPPO - INTEGRAZIONE TEMPLATE COMUNICAZIONI

## 🎯 OBIETTIVO
Integrare il sistema di template di comunicazione nei dialog "Contatta con AI" e "Contatta senza AI" della pagina Certificates, permettendo ai dealer di salvare e riutilizzare template personalizzati.

## 📊 SITUAZIONE ATTUALE

### ✅ GIÀ IMPLEMENTATO:
- **Database**: Tabella `communication_templates` con struttura completa
- **API Backend**: Endpoint CRUD completi (`/api/templates/*`)
- **Dialog AI**: Form per generazione comunicazioni AI (`bulkContactDialog`)
- **Dialog Manuale**: Form per comunicazioni manuali (`bulkContactWithoutAIDialog`)
- **Sistema Placeholder**: Sostituzione dinamica `{NOME}`, `{VEICOLO}`, etc.

### ❌ DA IMPLEMENTARE:
- Dropdown "Usa Template" nei dialog
- Pulsante "Salva Template" nei dialog  
- Interfaccia gestione template in Settings
- Integrazione template con sistema esistente

## 🏗️ ARCHITETTURA TEMPLATE

### Struttura Database (`communication_templates`):
```sql
- id: UUID (chiave primaria)
- dealer_id: INTEGER (isolamento per dealer)
- name: TEXT (nome template)
- description: TEXT (descrizione opzionale)
- channel: ENUM ('email', 'whatsapp', 'sms')
- style: ENUM ('informal', 'formal', 'professional')
- template_type: ENUM ('ai', 'manual', 'hybrid')
- prompt: TEXT (prompt AI, NULL per manuali)
- message_content: TEXT (contenuto messaggio)
- email_subject: TEXT (oggetto email, NULL per non-email)
- is_favorite: BOOLEAN (template preferiti)
- usage_count: INTEGER (contatore utilizzi)
- created_at/updated_at: TIMESTAMP
```

### Tipi di Template:
- **AI**: Contiene prompt per AI + contenuto di esempio
- **Manual**: Solo contenuto messaggio (senza prompt)
- **Hybrid**: Utilizzabile sia con AI che manualmente

## 🚀 PIANO DI IMPLEMENTAZIONE

### FASE 1: DROPDOWN "USA TEMPLATE" 
**Priorità: ALTA**

#### 1.1 Dialog "Contatta senza AI" (`certificates.html`)
- **File**: `certificates.html` (righe 1273-1364)
- **Posizione**: Sopra il form esistente, dopo la selezione canale
- **Funzionalità**:
  - Dropdown con template filtrati per canale selezionato
  - Filtro per `template_type IN ('manual', 'hybrid')`
  - Al cambio template: pre-compila oggetto + messaggio
  - Integrazione con sistema placeholder esistente

#### 1.2 Dialog "Contatta con AI" (`certificates.html`)  
- **File**: `certificates.html` (righe 1165-1271)
- **Posizione**: Sopra il form prompt AI
- **Funzionalità**:
  - Dropdown con template filtrati per canale selezionato
  - Filtro per `template_type IN ('ai', 'hybrid')`
  - Al cambio template: pre-compila prompt + stile
  - Supporto template ibridi (carica contenuto come esempio)

### FASE 2: PULSANTE "SALVA TEMPLATE"
**Priorità: ALTA**

#### 2.1 Dialog "Contatta senza AI"
- **Posizione**: Accanto ai pulsanti di invio esistenti
- **Funzionalità**:
  - Popup form: Nome, Descrizione, Tipo (manual/hybrid)
  - Salva: oggetto + messaggio + canale + stile
  - Validazione campi obbligatori

#### 2.2 Dialog "Contatta con AI"
- **Posizione**: Dopo la generazione AI, accanto ai risultati
- **Funzionalità**:
  - Popup form: Nome, Descrizione, Tipo (ai/hybrid)
  - Salva: prompt + contenuto generato + canale + stile
  - Opzione per salvare solo prompt o prompt + contenuto

### FASE 3: GESTIONE TEMPLATE IN SETTINGS
**Priorità: MEDIA**

#### 3.1 Nuova Sezione in `settings.html`
- **Posizione**: Accanto a "Firma Dealer" e "Clienti Test"
- **Layout**: Griglia responsiva con card per ogni template
- **Funzionalità**:
  - Lista template con filtri (canale, tipo, preferiti)
  - Ricerca per nome/descrizione
  - Ordinamento (nome, data, utilizzi)

#### 3.2 CRUD Template
- **Crea**: Form completo per nuovo template
- **Modifica**: Edit in-place o modal
- **Elimina**: Conferma + soft delete
- **Duplica**: Copia template con nuovo nome
- **Preferiti**: Toggle stella per template frequenti

#### 3.3 Anteprima Template
- **Preview Live**: Mostra contenuto con placeholder evidenziati
- **Dati Esempio**: Usa dati sample per preview realistica
- **Contatore Utilizzi**: Mostra quante volte è stato usato

### FASE 4: FUNZIONI JAVASCRIPT
**Priorità: ALTA**

#### 4.1 Funzioni Core Template
```javascript
// Caricamento template
async function loadTemplates(dealerId, channel = null, templateType = null)
async function loadTemplateById(templateId)

// Gestione dropdown
function populateTemplateDropdown(templates, dropdownId)
function onTemplateSelected(templateId, dialogType)

// Salvataggio template
async function saveTemplateFromAI(prompt, content, metadata)
async function saveTemplateFromManual(subject, message, metadata)

// Applicazione template
function applyTemplateToAIDialog(template)
function applyTemplateToManualDialog(template)

// Sistema placeholder
function replaceTemplatePlaceholders(content, vehicleData, clientData)
function getAvailablePlaceholders()
```

#### 4.2 Integrazione con Sistema Esistente
- **Dialog AI**: Integra con `generateSmartCommunications()`
- **Dialog Manuale**: Integra con `updateManualMessagePreview()`
- **Placeholder**: Estende sistema esistente con nuovi placeholder

## 🔧 DETTAGLI TECNICI

### Placeholder Supportati:
```
Cliente:     {NOME}, {COGNOME}, {SALUTATION}, {EMAIL}, {TELEFONO}
Veicolo:     {VEICOLO}, {TARGA}, {ANNO}, {KM}, {CARBURANTE}, {COLORE}
Dealer:      {CONCESSIONARIA}, {INDIRIZZO}, {TELEFONO_DEALER}
Sistema:     {DATA}, {ORA}, {PUNTEGGIO_SALUTE}
AI:          {INSIGHTS}, {RACCOMANDAZIONI}, {URGENZA}
```

### Filtri Template per Dialog:
```javascript
// Dialog AI
WHERE template_type IN ('ai', 'hybrid') 
  AND channel = selectedChannel
  AND dealer_id = currentDealerId

// Dialog Manuale  
WHERE template_type IN ('manual', 'hybrid')
  AND channel = selectedChannel
  AND dealer_id = currentDealerId
```

### Struttura UI Template Dropdown:
```html
<div class="mb-4">
  <label class="text-xs text-gray-400 mb-2">📋 Usa Template</label>
  <select id="templateSelector" class="w-full rounded bg-gray-800 border border-gray-700 p-2 text-sm">
    <option value="">-- Seleziona Template --</option>
    <option value="uuid">📧 Promemoria Tagliando (Email - Professionale)</option>
    <option value="uuid">💬 Benvenuto Cliente (WhatsApp - Informale)</option>
  </select>
</div>
```

## 📅 TIMELINE DI IMPLEMENTAZIONE

### Sprint 1 (2-3 ore):
- [x] Dropdown "Usa Template" dialog manuale
- [x] Funzioni caricamento template base
- [x] Integrazione con form esistente

### Sprint 2 (2-3 ore):
- [x] Pulsante "Salva Template" dialog manuale
- [x] Form popup salvataggio template
- [x] Validazione e salvataggio database

### Sprint 3 (3-4 ore):
- [x] Dropdown "Usa Template" dialog AI
- [x] Integrazione con generazione AI
- [x] Gestione template ibridi

### Sprint 4 (2-3 ore):
- [x] Pulsante "Salva Template" dialog AI
- [x] Salvataggio prompt + contenuto generato
- [x] Opzioni salvataggio avanzate

### Sprint 5 (4-5 ore):
- [x] Sezione gestione template in Settings
- [x] CRUD completo template
- [x] Anteprima e filtri avanzati

## 🧪 TESTING

### Test Cases:
1. **Salvataggio Template**: Da entrambi i dialog
2. **Caricamento Template**: Filtri corretti per tipo/canale
3. **Placeholder**: Sostituzione corretta in tutti i contesti
4. **Template Ibridi**: Funzionano in entrambi i dialog
5. **Isolamento Dealer**: Ogni dealer vede solo i suoi template
6. **Performance**: Caricamento veloce anche con molti template

### Dati di Test:
- Template di esempio già inseriti nel database
- Clienti test configurati in Settings
- Dati veicolo realistici per placeholder

## 🔒 SICUREZZA

### Row Level Security:
- Template isolati per dealer (RLS già implementato)
- Validazione dealer_id in tutte le API
- Sanitizzazione input per prevenire XSS

### Validazione:
- Campi obbligatori: name, channel, style, template_type, message_content
- Lunghezza massima contenuti
- Formato email_subject solo per channel='email'

## 📈 METRICHE DI SUCCESSO

### KPI:
- **Adozione**: % dealer che usano template
- **Efficienza**: Tempo medio creazione comunicazione
- **Riutilizzo**: Utilizzi medi per template
- **Qualità**: Feedback dealer su template

### Analytics:
- Tracciamento utilizzo template (usage_count)
- Template più popolari per canale
- Tempo di creazione comunicazioni pre/post template

---

**PROSSIMO STEP**: Iniziare implementazione dal dropdown "Usa Template" nel dialog "Contatta senza AI" (più semplice e diretto).
