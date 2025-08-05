# Service Hub Portal

Un portale web completo per i concessionari Mobisat che fornisce autenticazione, dashboard, gestione certificati e analisi veicoli.

## 🚀 Caratteristiche

- **Autenticazione Sicura**: Sistema di login con email e PIN
- **Dashboard Interattiva**: Visualizzazione dati in tempo reale
- **Gestione Certificati**: Filtri avanzati e visualizzazione certificati
- **Analisi Veicoli**: Dettagli completi con grafici e metriche
- **Tema Dinamico**: Supporto per tema chiaro/scuro
- **Internazionalizzazione**: Supporto multilingua (IT/EN)
- **Responsive Design**: Ottimizzato per desktop e mobile

## 🛠️ Tecnologie

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Supabase
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **AI**: OpenAI API

## 📋 Prerequisiti

- Node.js (versione 16 o superiore)
- npm o yarn
- Account Supabase
- Account OpenAI (per le funzionalità AI)

## 🔧 Installazione Locale

1. **Clona il repository**
   ```bash
   git clone https://github.com/tuo-username/service-hub-portal.git
   cd service-hub-portal
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**
   Crea un file `.env` nella root del progetto:
   ```env
   # OpenAI API Key (Required for AI features)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Environment
   NODE_ENV=development
   
   # Database Configuration (PostgreSQL)
   DATABASE_HOST=your_database_host
   DATABASE_PORT=5432
   DATABASE_USER=your_database_user
   DATABASE_PASSWORD=your_database_password
   DATABASE_NAME=your_database_name
   
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   
   # Server Configuration
   PORT=3000
   ```
   
   **⚠️ IMPORTANTE**: Copia il file `env.example` come riferimento per tutte le variabili necessarie.

4. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

5. **Apri il browser**
   Naviga su `http://localhost:3000`

## 🚀 Deploy su Railway

### 1. Push su GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy su Railway
1. Vai su [Railway.app](https://railway.app)
2. Connetti il tuo account GitHub
3. Crea un nuovo progetto
4. Seleziona il repository `service-hub-portal`
5. Railway rileverà automaticamente la configurazione Node.js
6. Configura le variabili d'ambiente nella sezione "Variables"
7. Il deploy inizierà automaticamente

### Variabili d'ambiente per Railway
Assicurati di configurare queste variabili nel dashboard Railway:

**Obbligatorie:**
- `OPENAI_API_KEY` - La tua chiave API OpenAI
- `NODE_ENV=production`

**Database (se vuoi usare credenziali personalizzate):**
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_NAME`

**Supabase (se vuoi usare credenziali personalizzate):**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

**⚠️ NOTA**: Se non configuri le variabili del database e Supabase, il sistema userà le credenziali di default per lo sviluppo.

## 📁 Struttura del Progetto

```
service-hub-portal/
├── api/                    # API endpoints
├── config/                 # Configurazioni database
├── css/                    # File CSS
├── icons/                  # Icone SVG
├── images/                 # Immagini e asset
├── js/                     # JavaScript client-side
├── pages/                  # Pagine HTML
├── server.js              # Server principale
├── package.json           # Dipendenze Node.js
└── railway.json           # Configurazione Railway
```

## 🔐 Autenticazione

Il sistema utilizza un flusso di autenticazione a due step:
1. **Richiesta PIN**: L'utente inserisce l'email
2. **Verifica PIN**: L'utente inserisce il PIN ricevuto

## 📊 Funzionalità Principali

### Dashboard
- Panoramica generale dei dati
- Statistiche in tempo reale
- Navigazione rapida

### Certificati
- Lista completa dei certificati
- Filtri avanzati per gruppo
- Ricerca intelligente
- Visualizzazione dettagliata

### Analisi Veicoli
- Dettagli completi del veicolo
- Grafici di performance
- Dati OBD in tempo reale
- Report AI generati

## 🎨 Temi e Lingue

- **Temi**: Chiaro/Scuro con switch automatico
- **Lingue**: Italiano/Inglese
- **Responsive**: Ottimizzato per tutti i dispositivi

## 🔧 Script Disponibili

- `npm start`: Avvia il server di produzione
- `npm run dev`: Avvia il server di sviluppo con nodemon

## 📝 Licenza

MIT License - vedi il file [LICENSE](LICENSE) per i dettagli.

## 🤝 Contributi

1. Fork il progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📞 Supporto

Per supporto tecnico o domande, contatta il team di sviluppo Mobisat.

---

**Service Hub Portal** - Sviluppato da Mobisat Team 
