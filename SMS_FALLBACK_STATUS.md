# 📱 SMS Fallback - Status Implementation

## ✅ **IMPLEMENTATO (Completato)**

### **Codice fallback SMS:**
- ✅ **Primo endpoint** (certificati): Fallback implementato
- ✅ **Secondo endpoint** (comunicazioni): Fallback implementato  
- ✅ **Billing separato**: WhatsApp €0.10, SMS €0.08
- ✅ **Error handling**: Gestisce errori 21910 e 63016
- ✅ **Logging**: Log dettagliati per debugging
- ✅ **Documentazione**: SMS_FALLBACK_SETUP.md creata

### **Logica implementata:**
```javascript
// Prova WhatsApp prima
try {
    const whatsappMessage = await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${phone}`
    });
    return { success: true, channel: 'whatsapp' };
} catch (whatsappError) {
    // Fallback SMS per errori specifici
    if ((whatsappError.code === 21910 || whatsappError.code === 63016) && process.env.TWILIO_SMS_FROM) {
        const smsMessage = await twilioClient.messages.create({
            from: process.env.TWILIO_SMS_FROM,
            to: phone
        });
        return { success: true, channel: 'sms', fallback: true };
    }
}
```

## ⏳ **PENDING (In attesa)**

### **Numero SMS Twilio:**
- 📅 **Data richiesta**: ${new Date().toLocaleDateString('it-IT')}
- 🏢 **Tipo**: Numero locale italiano (+39)
- 💰 **Costo**: $1.25/mese (~€1.15)
- ⏱️ **Tempo stimato**: 1-3 giorni lavorativi
- 📋 **Status**: Richiesta inviata, attendere approvazione

## 🔧 **PROSSIMI PASSI (Quando numero sarà approvato)**

### **1. Configurazione locale:**
```bash
# Aggiungere a .env.local
TWILIO_SMS_FROM=+39xxxxxxxxx  # Il numero ricevuto da Twilio
```

### **2. Configurazione produzione:**
```bash
# Aggiungere in Railway dashboard
TWILIO_SMS_FROM=+39xxxxxxxxx
```

### **3. Test fallback:**
1. Inviare WhatsApp a numero non autorizzato
2. Verificare fallback automatico a SMS
3. Controllare billing corretto (€0.08 per SMS)
4. Verificare log: "WhatsApp failed, trying SMS fallback..."

## 📊 **Monitoring da verificare:**

### **Log di successo:**
```
WhatsApp failed for +39xxx (21910), trying SMS fallback...
SMS fallback successful for +39xxx
billing sms event: 8 cents
```

### **Billing events:**
- `event_type: 'whatsapp'` - 10 cents
- `event_type: 'sms'` - 8 cents

## 🚨 **IMPORTANTE:**

Il fallback SMS è **già implementato** nel codice e **funzionerà automaticamente** non appena:
1. ✅ Numero SMS sarà approvato da Twilio
2. ✅ Variabile `TWILIO_SMS_FROM` configurata
3. ✅ Deploy in produzione (già fatto, serve solo la variabile)

---

**🎯 Il sistema è pronto! Serve solo il numero SMS per attivare tutto automaticamente.**
