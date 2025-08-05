# 🚨 Firebase Deployment Instructions

## Environment Variables da Configurare

### OpenAI API Key
```bash
firebase functions:config:set openai.api_key="YOUR_OPENAI_API_KEY_HERE"
```

### Database Configuration (se necessario)
```bash
firebase functions:config:set database.host="your-db-host"
firebase functions:config:set database.port="5432"
firebase functions:config:set database.name="your-db-name"
firebase functions:config:set database.user="your-db-user"
firebase functions:config:set database.password="your-db-password"
```

## Verifica Configurazione
```bash
firebase functions:config:get
```

## Deploy
```bash
firebase deploy --only functions
```

## Note Importanti
- ⚠️ **NON committare mai le API keys nel codice!**
- ✅ Usare sempre environment variables per dati sensibili
- 🔄 Testare in ambiente di staging prima del deploy production
- 📝 Documentare tutte le variabili d'ambiente necessarie

## Test Post-Deploy
- [ ] Verificare che l'AI report funzioni correttamente
- [ ] Testare il sistema FMB003 mapping
- [ ] Controllare le traduzioni italiane
- [ ] Verificare connessione database