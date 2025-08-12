// Create AI prompts table using Supabase REST API
// Run with: node create-ai-prompts-api.js

const { supabaseAdmin } = require('./config/supabase.js');

const initialPrompts = [
    {
        prompt_key: 'communication_email',
        category: 'communication',
        subcategory: 'email',
        title_it: 'Comunicazione Email Clienti',
        title_en: 'Client Email Communication',
        prompt_it: `Sei un assistente professionale per un'azienda di servizi automobilistici. Scrivi una comunicazione email professionale e cordiale per i clienti.

Contesto: {context}
Informazioni cliente: {clientInfo}
Dati veicolo: {vehicleData}

Scrivi un'email che:
- Sia professionale ma cordiale
- Includa tutte le informazioni rilevanti
- Sia chiara e diretta
- Mantenga un tono rispettoso
- Includa un saluto appropriato e una chiusura professionale

Genera SOLO il contenuto dell'email, senza intestazioni aggiuntive.`,
        prompt_en: `You are a professional assistant for an automotive services company. Write a professional and friendly email communication for clients.

Context: {context}
Client information: {clientInfo}
Vehicle data: {vehicleData}

Write an email that:
- Is professional but friendly
- Includes all relevant information
- Is clear and direct
- Maintains a respectful tone
- Includes appropriate greeting and professional closing

Generate ONLY the email content, without additional headers.`,
        description_it: 'Prompt per generare comunicazioni email professionali ai clienti',
        description_en: 'Prompt for generating professional email communications to clients',
        variables: ["context", "clientInfo", "vehicleData", "clientName", "vehicleModel", "licensePlate"],
        is_system: true,
        max_tokens: 800,
        temperature: 0.7
    },
    {
        prompt_key: 'email_subject',
        category: 'communication',
        subcategory: 'email',
        title_it: 'Oggetto Email',
        title_en: 'Email Subject',
        prompt_it: `Genera un oggetto email professionale e accattivante per questa comunicazione:

Contenuto email: {emailContent}
Contesto: {context}

L'oggetto deve essere:
- Chiaro e descrittivo
- Massimo 60 caratteri
- Professionale
- Accattivante ma non clickbait

Genera SOLO l'oggetto, senza virgolette o prefissi.`,
        prompt_en: `Generate a professional and engaging email subject for this communication:

Email content: {emailContent}
Context: {context}

The subject should be:
- Clear and descriptive
- Maximum 60 characters
- Professional
- Engaging but not clickbait

Generate ONLY the subject, without quotes or prefixes.`,
        description_it: 'Prompt per generare oggetti email professionali',
        description_en: 'Prompt for generating professional email subjects',
        variables: ["emailContent", "context", "clientName", "vehicleModel"],
        is_system: true,
        max_tokens: 100,
        temperature: 0.5
    },
    {
        prompt_key: 'communication_whatsapp',
        category: 'communication',
        subcategory: 'whatsapp',
        title_it: 'Comunicazione WhatsApp Clienti',
        title_en: 'Client WhatsApp Communication',
        prompt_it: `Sei un assistente professionale per un'azienda di servizi automobilistici. Scrivi un messaggio WhatsApp professionale ma informale per i clienti.

Contesto: {context}
Informazioni cliente: {clientInfo}
Dati veicolo: {vehicleData}

Scrivi un messaggio WhatsApp che:
- Sia professionale ma più informale rispetto all'email
- Sia conciso e diretto (massimo 300 caratteri)
- Includa le informazioni essenziali
- Usi un tono amichevole
- Includa emoji appropriate se necessario

Genera SOLO il contenuto del messaggio.`,
        prompt_en: `You are a professional assistant for an automotive services company. Write a professional but informal WhatsApp message for clients.

Context: {context}
Client information: {clientInfo}
Vehicle data: {vehicleData}

Write a WhatsApp message that:
- Is professional but more informal than email
- Is concise and direct (maximum 300 characters)
- Includes essential information
- Uses a friendly tone
- Includes appropriate emojis if necessary

Generate ONLY the message content.`,
        description_it: 'Prompt per generare comunicazioni WhatsApp ai clienti',
        description_en: 'Prompt for generating WhatsApp communications to clients',
        variables: ["context", "clientInfo", "vehicleData", "clientName", "vehicleModel", "licensePlate"],
        is_system: true,
        max_tokens: 500,
        temperature: 0.8
    }
];

async function createAiPromptsTable() {
    try {
        console.log('🤖 Setting up AI Prompts system...');
        console.log('================================================\n');
        
        console.log('⚠️  MANUAL SETUP REQUIRED:');
        console.log('\n📋 Please follow these steps to create the ai_prompts table:');
        console.log('\n1. Go to Supabase Dashboard SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql');
        console.log('\n2. Copy and paste the entire content of:');
        console.log('   📄 supabase-ai-prompts-table.sql');
        console.log('\n3. Execute the SQL to create:');
        console.log('   ✅ ai_prompts table structure');
        console.log('   ✅ Indexes and triggers');
        console.log('   ✅ Initial system prompts');
        
        console.log('\n🔍 After creating the table, run this script again to verify setup');
        
        // Try to check if table exists
        console.log('\n🔗 Checking current table status...');
        const { data, error } = await supabaseAdmin
            .from('ai_prompts')
            .select('prompt_key, title_it')
            .limit(5);
        
        if (error) {
            if (error.code === 'PGRST116') {
                console.log('❌ Table ai_prompts does not exist yet');
            } else {
                console.log('⚠️  Error checking table:', error.message);
            }
        } else {
            console.log('✅ Table ai_prompts exists!');
            console.log(`📊 Found ${data?.length || 0} prompt records`);
            
            if (data && data.length > 0) {
                console.log('\n📋 Existing prompts:');
                data.forEach(prompt => {
                    console.log(`   - ${prompt.prompt_key}: ${prompt.title_it}`);
                });
                
                console.log('\n🎉 AI Prompts system is ready!');
                console.log('\n📋 Next steps:');
                console.log('   1. Implement AI communication UI');
                console.log('   2. Add prompt management interface');
                console.log('   3. Test AI communication features');
            }
        }
        
    } catch (error) {
        console.error('\n❌ Error:', error);
    }
}

// Run the script
createAiPromptsTable();
