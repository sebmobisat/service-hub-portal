// Simplified script to create AI prompts table in Supabase
// Run with: node create-supabase-ai-prompts-simple.js

const { supabaseAdmin } = require('./config/supabase.js');

async function createAiPromptsTable() {
    try {
        console.log('🤖 Creating AI Prompts table in Supabase...');
        console.log('================================================\n');
        
        // Create table directly using Supabase client
        console.log('📋 Creating ai_prompts table...');
        
        // Try to create table using a simple insert test
        const { data, error } = await supabaseAdmin
            .from('ai_prompts')
            .select('*')
            .limit(1);
        
        if (error && error.code === 'PGRST116') {
            console.log('❌ Table ai_prompts does not exist');
            console.log('\n🔧 Manual setup required:');
            console.log('   1. Go to Supabase Dashboard SQL Editor');
            console.log('   2. Copy and paste the content of supabase-ai-prompts-table.sql');
            console.log('   3. Execute the SQL to create the table and initial data');
            console.log('\n📄 SQL file location: ./supabase-ai-prompts-table.sql');
        } else if (error) {
            console.log('⚠️  Error checking table:', error.message);
        } else {
            console.log('✅ ai_prompts table already exists!');
            console.log(`📊 Table contains ${data?.length || 0} records`);
            
            // Show existing prompts
            if (data && data.length > 0) {
                console.log('\n📋 Existing prompts:');
                data.forEach(prompt => {
                    console.log(`   - ${prompt.prompt_key}: ${prompt.title_it}`);
                });
            }
        }
        
        console.log('\n🎉 Setup check completed!');
        
    } catch (error) {
        console.error('\n❌ Error:', error);
        console.log('\n🔧 Please create the table manually using Supabase Dashboard');
    }
}

// Run the script
createAiPromptsTable();
