# 📱 SMS Fallback Setup Guide

## 🎯 Overview

Il sistema Service Hub supporta il **fallback automatico da WhatsApp a SMS** quando WhatsApp non è disponibile per un determinato numero di telefono.

## 🔄 Come funziona

1. **WhatsApp First**: Il sistema prova sempre prima WhatsApp
2. **SMS Fallback**: Se WhatsApp fallisce con errori specifici, passa automaticamente a SMS
3. **Billing Accurato**: Addebita il costo corretto in base al canale utilizzato

### Errori che attivano il fallback:
- **21910**: From and To number not on same channel (numero non autorizzato WhatsApp)
- **63016**: WhatsApp number not available

## 📋 Setup Twilio SMS

### 1. Acquistare numero italiano
1. Vai su [Twilio Console > Phone Numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)
2. Clicca **"Buy a number"**
3. Seleziona:
   - **Country**: Italy (+39) 🇮🇹
   - **Capabilities**: SMS ✅ + Voice ✅ (consigliato)
   - **Number type**: Mobile o Geographic
4. **Acquista** (~€3-5/mese)

### 2. Configurare variabili ambiente

#### Local (.env.local):
```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_SMS_FROM=+39xxxxxxxxx  # Il numero italiano acquistato
```

#### Production (Railway):
Aggiungi la stessa variabile nel dashboard Railway:
```
TWILIO_SMS_FROM=+39xxxxxxxxx
```

## 💰 Costi

### Billing automatico:
- **WhatsApp**: €0.10 per messaggio
- **SMS**: €0.08 per messaggio  
- **Email**: €0.05 per messaggio

### Costi Twilio stimati:
- **Numero italiano**: ~€3-5/mese
- **SMS in Italia**: ~€0.06-0.08 per messaggio
- **SMS internazionali**: €0.10-0.30 per messaggio

## 🔧 Configurazione tecnica

### Logica di fallback implementata:
```javascript
try {
    // Prova WhatsApp
    const whatsappMessage = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${phone}`
    });
    return { success: true, channel: 'whatsapp', sid: whatsappMessage.sid };
    
} catch (whatsappError) {
    // Fallback SMS per errori specifici
    if ((whatsappError.code === 21910 || whatsappError.code === 63016) && process.env.TWILIO_SMS_FROM) {
        const smsMessage = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_SMS_FROM,
            to: phone  // NO "whatsapp:" prefix
        });
        return { success: true, channel: 'sms', sid: smsMessage.sid, fallback: true };
    }
    throw whatsappError;
}
```

## ✅ Vantaggi

- **Copertura universale**: SMS funziona su tutti i telefoni
- **Nessuna autorizzazione**: Non serve Sandbox WhatsApp
- **Affidabilità**: 99.9% di deliverability SMS
- **Billing accurato**: Costi separati per WhatsApp vs SMS
- **Trasparente**: Il cliente riceve sempre il messaggio

## ❌ Limitazioni

- **Costo aggiuntivo**: Numero mensile + costo SMS
- **160 caratteri**: Limite SMS vs illimitato WhatsApp
- **Solo testo**: No formattazione/media in SMS

## 🧪 Test

### Per testare il fallback:
1. Configura `TWILIO_SMS_FROM` con numero italiano
2. Invia WhatsApp a numero non autorizzato nel Sandbox
3. Il sistema dovrebbe automaticamente passare a SMS
4. Controlla i log per confermare il fallback
5. Verifica il billing corretto (€0.08 per SMS)

## 🚀 Deployment

1. **Local**: Aggiungi `TWILIO_SMS_FROM` al tuo `.env.local`
2. **Production**: Aggiungi `TWILIO_SMS_FROM` nelle variabili Railway
3. **Test**: Invia messaggio a numero non-WhatsApp
4. **Monitor**: Controlla logs e billing

## 📊 Monitoring

### Log da monitorare:
```
WhatsApp failed for +39xxx (21910), trying SMS fallback...
SMS fallback successful for +39xxx
billing sms event failed
```

### Billing events da verificare:
- `event_type: 'whatsapp'` - €0.10
- `event_type: 'sms'` - €0.08
- Balance aggiornato correttamente

---

**✨ Il fallback SMS garantisce che i tuoi clienti ricevano sempre i messaggi, indipendentemente dalla disponibilità WhatsApp!**
