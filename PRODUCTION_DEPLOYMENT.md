# 🚀 Service Hub - Guida Deployment Produzione

## 📋 CHECKLIST PRE-PRODUZIONE

### ✅ TESTING COMPLETATO
- [x] Sistema di ricariche Stripe funzionante
- [x] Webhook automatico attivo
- [x] Balance aggiornamento automatico
- [x] UI ricariche e storico
- [ ] Test con importi diversi (5€, 50€, 100€, 1000€)
- [ ] Test cancellazione pagamento
- [ ] Test sessione scaduta

---

## 🔧 CONFIGURAZIONE STRIPE PRODUZIONE

### 1️⃣ PASSAGGIO A LIVE MODE

**Nel Stripe Dashboard:**
1. **Disattiva "Test mode"** (toggle in alto a destra) → **OFF**
2. **Passi alla modalità LIVE** (dati reali e carte vere)

### 2️⃣ CONFIGURAZIONE WEBHOOK LIVE

**Crea nuovo webhook in modalità LIVE:**
- **URL**: `https://service-hub-portal-production.up.railway.app/api/billing/stripe-webhook-direct`
- **Eventi da configurare**:
  - ✅ `checkout.session.completed` (ESSENZIALE)
  - ✅ `checkout.session.expired` (IMPORTANTE)
  - ✅ `payment_intent.payment_failed` (IMPORTANTE)
  - ✅ `payment_intent.succeeded` (RACCOMANDATO)
  - ✅ `payment_intent.canceled` (RACCOMANDATO)

### 3️⃣ CHIAVI API LIVE

**Sostituisci le chiavi su Railway:**

**Railway Dashboard → Variables:**
```env
# SOSTITUISCI CON CHIAVI LIVE
STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ IMPORTANTE:** 
- Le chiavi LIVE iniziano con `pk_live_` e `sk_live_`
- Il webhook secret LIVE inizia con `whsec_` (diverso da quello test)

---

## 🛡️ SICUREZZA PRODUZIONE

### 🔐 CONFIGURAZIONE OBBLIGATORIA

**1. Webhook Secret**
```env
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXX
```
Questo attiva la **signature validation** per sicurezza massima.

**2. HTTPS Obbligatorio**
- ✅ Railway usa già HTTPS automaticamente
- ✅ Tutte le comunicazioni sono criptate

**3. Validazioni Attive**
- ✅ Controllo dealer_id autorizzati
- ✅ Validazione importi (min 5€, max 10.000€)
- ✅ Verifica session ID su Stripe
- ✅ Prevenzione duplicati

---

## 🧪 TESTING FINALE PRE-PRODUZIONE

### TEST OBBLIGATORI

**1. Test Ricariche Multiple**
```
- Ricarica 5€ (minimo)
- Ricarica 25€ (preset)
- Ricarica 100€ (preset)
- Ricarica custom 150€
- Ricarica custom 1000€ (massimo comune)
```

**2. Test Scenari Negativi**
```
- Cancellazione pagamento
- Carta declinata
- Sessione scaduta
- Importo non valido
```

**3. Test UI**
```
- Modal ricarica funziona
- Storico ricariche aggiornato
- Balance refresh automatico
- Dialog successo elegante
- Responsive su mobile
```

### 📊 ENDPOINT DI VERIFICA

**Prima di andare LIVE, testa:**
```
# Verifica balance
GET https://service-hub-portal-production.up.railway.app/api/billing/balance/1

# Verifica webhook logs
GET https://service-hub-portal-production.up.railway.app/api/billing/webhook-logs

# Debug ricariche pending
GET https://service-hub-portal-production.up.railway.app/api/billing/debug-pending/1

# Storico ricariche
GET https://service-hub-portal-production.up.railway.app/api/billing/recharges/1
```

---

## 🚀 PROCEDURA DEPLOYMENT

### STEP 1: Backup
```bash
git add .
git commit -m "Pre-produzione: sistema billing completo"
git push
```

### STEP 2: Configurazione Railway
```env
# Aggiungi/Aggiorna variabili Railway
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### STEP 3: Configurazione Stripe
1. **Disattiva Test Mode**
2. **Crea webhook LIVE** con URL e eventi
3. **Testa con carta reale** (importo piccolo)

### STEP 4: Verifica Post-Deployment
1. **Test ricarica 5€** con carta reale
2. **Verifica balance aggiornato**
3. **Controlla webhook logs**
4. **Test storico ricariche**

---

## 🛠️ TROUBLESHOOTING PRODUZIONE

### Webhook Non Funziona
```bash
# Controlla webhook logs
curl https://service-hub-portal-production.up.railway.app/api/billing/webhook-logs

# Processa manualmente ricariche pending
curl https://service-hub-portal-production.up.railway.app/api/billing/process-pending-recharges

# Debug ricariche specifiche
curl https://service-hub-portal-production.up.railway.app/api/billing/debug-pending/1
```

### Balance Errato
```bash
# Ricalcola balance corretto
curl https://service-hub-portal-production.up.railway.app/api/billing/recalculate-balance/1
```

### Test Webhook Manuale
```bash
# Simula webhook (solo per test)
curl -X POST https://service-hub-portal-production.up.railway.app/webhooks/stripe/simulate
```

---

## 📱 CONFIGURAZIONE EVENTI STRIPE

### Eventi Minimi (OBBLIGATORI)
```
checkout.session.completed  → Ricarica completata
checkout.session.expired    → Sessione scaduta
payment_intent.payment_failed → Pagamento fallito
```

### Eventi Raccomandati
```
payment_intent.succeeded    → Conferma pagamento
payment_intent.canceled     → Pagamento annullato
charge.succeeded           → Addebito riuscito
charge.failed              → Addebito fallito
```

---

## 🎯 ENDPOINT PRODUZIONE

### Principali
```
POST /api/billing/create-recharge     → Crea sessione Stripe
GET  /api/billing/balance/:dealerId   → Balance attuale
GET  /api/billing/recharges/:dealerId → Storico ricariche
POST /api/billing/stripe-webhook-direct → Webhook Stripe (NUOVO)
```

### Debug (Rimuovere in produzione)
```
GET /api/billing/process-pending-recharges  → Processa manualmente
GET /api/billing/debug-pending/:dealerId    → Debug ricariche
GET /api/billing/webhook-logs               → Log webhook
GET /api/billing/recalculate-balance/:dealerId → Ricalcola balance
```

---

## ⚠️ CHECKLIST SICUREZZA

### Obbligatorio prima di LIVE
- [ ] `STRIPE_WEBHOOK_SECRET` configurato su Railway
- [ ] Test con carte reali (importi piccoli)
- [ ] Verifica tutti gli eventi webhook configurati
- [ ] Backup database prima del deployment
- [ ] Test scenari di errore

### Raccomandato
- [ ] Rimuovi endpoint di debug in produzione
- [ ] Configura monitoring/alerting
- [ ] Test con diversi browser
- [ ] Test responsive mobile

---

## 📞 CONTATTI SUPPORTO

**In caso di problemi:**
- **Stripe Dashboard** → Support
- **Railway Dashboard** → Help
- **Database**: Supabase Dashboard

---

## 🎉 POST-DEPLOYMENT

### Verifica Funzionamento
1. **Test ricarica piccola** (5€)
2. **Verifica balance aggiornato**
3. **Test storico ricariche**
4. **Test cancellazione pagamento**

### Monitoring
- **Stripe Dashboard** → Payments (monitoraggio transazioni)
- **Railway Logs** → Verifica webhook calls
- **Supabase** → Monitoraggio database

---

*Documento creato: $(date)*
*Ultimo aggiornamento: Sistema billing con webhook automatico funzionante*
