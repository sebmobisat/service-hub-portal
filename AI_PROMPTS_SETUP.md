# 🤖 AI Prompts System Setup

## 📋 **SETUP RICHIESTO**

### **1. Creare tabella ai_prompts in Supabase**

#### **Passo 1: Accedi a Supabase Dashboard**
1. Vai su: https://supabase.com/dashboard/projects
2. Seleziona il tuo progetto Service Hub
3. Clicca su **"SQL Editor"** nel menu laterale

#### **Passo 2: Esegui SQL di creazione**
1. Copia **tutto il contenuto** del file: `supabase-ai-prompts-table.sql`
2. Incolla nel SQL Editor di Supabase
3. Clicca **"Run"** per eseguire

#### **Passo 3: Verifica creazione**
Dopo l'esecuzione dovresti vedere:
- ✅ Tabella `ai_prompts` creata
- ✅ Indici e trigger configurati  
- ✅ 4 prompt iniziali inseriti

### **2. Verifica setup**
Esegui questo comando per verificare:
```bash
node create-ai-prompts-api.js
```

Se tutto è andato bene vedrai:
```
✅ Table ai_prompts exists!
📊 Found 4 prompt records
```

## 🗄️ **Struttura tabella ai_prompts**

### **Campi principali:**
- `prompt_key` - Chiave univoca (es: 'communication_email')
- `category` - Categoria (es: 'communication', 'certificate')
- `subcategory` - Sottocategoria (es: 'email', 'whatsapp')
- `title_it/en` - Titolo in italiano/inglese
- `prompt_it/en` - Testo prompt in italiano/inglese
- `variables` - Array variabili disponibili
- `is_system` - Flag per prompt di sistema
- `max_tokens` - Limite token risposta AI
- `temperature` - Creatività AI (0.0-1.0)

### **Prompt iniziali inclusi:**
1. **communication_email** - Email clienti
2. **email_subject** - Oggetti email
3. **communication_whatsapp** - WhatsApp clienti
4. **certificate_reminder** - Promemoria certificati

## 🔧 **Utilizzo nel codice**

### **Recuperare prompt:**
```javascript
// Ottieni prompt per email
const { data: prompt } = await supabaseAdmin
    .from('ai_prompts')
    .select('prompt_it, variables, max_tokens, temperature')
    .eq('prompt_key', 'communication_email')
    .eq('is_active', true)
    .single();

// Sostituisci variabili
let finalPrompt = prompt.prompt_it
    .replace('{context}', contextData)
    .replace('{clientInfo}', clientData)
    .replace('{vehicleData}', vehicleData);
```

### **Chiamata AI con prompt:**
```javascript
const aiResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: finalPrompt }],
    max_tokens: prompt.max_tokens,
    temperature: prompt.temperature
});
```

## 🌍 **Gestione multilingue**

I prompt supportano italiano e inglese:
```javascript
// Rileva lingua utente
const userLang = req.headers['accept-language']?.includes('en') ? 'en' : 'it';
const promptField = userLang === 'en' ? 'prompt_en' : 'prompt_it';
const titleField = userLang === 'en' ? 'title_en' : 'title_it';

// Usa prompt nella lingua corretta
const { data: prompt } = await supabaseAdmin
    .from('ai_prompts')
    .select(`${promptField}, ${titleField}, variables`)
    .eq('prompt_key', 'communication_email')
    .single();
```

## 📊 **Gestione prompt personalizzati**

### **Aggiungere nuovo prompt:**
```javascript
const { data, error } = await supabaseAdmin
    .from('ai_prompts')
    .insert([{
        prompt_key: 'custom_reminder',
        category: 'reminder',
        title_it: 'Promemoria Personalizzato',
        title_en: 'Custom Reminder',
        prompt_it: 'Il tuo prompt in italiano...',
        prompt_en: 'Your prompt in English...',
        variables: ['clientName', 'dueDate'],
        is_system: false,
        created_by: dealerId
    }]);
```

### **Modificare prompt esistente:**
```javascript
const { data, error } = await supabaseAdmin
    .from('ai_prompts')
    .update({
        prompt_it: 'Nuovo testo prompt...',
        updated_by: dealerId,
        version: currentVersion + 1
    })
    .eq('prompt_key', 'communication_email');
```

## 🚀 **Prossimi passi**

Dopo aver creato la tabella:
1. ✅ Verificare con `node create-ai-prompts-api.js`
2. ✅ Implementare UI comunicazione AI
3. ✅ Aggiungere gestione prompt nel pannello admin
4. ✅ Testare generazione AI con prompt personalizzati

---

**🎯 La tabella ai_prompts centralizza tutti i prompt AI della piattaforma, permettendo modifiche senza toccare il codice!**
