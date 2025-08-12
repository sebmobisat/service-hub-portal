// Script to create AI prompts table in Supabase
// Run with: node create-supabase-ai-prompts-table.js

const { supabaseAdmin } = require('./config/supabase.js');
const fs = require('fs');

async function createAiPromptsTable() {
    try {
        console.log('🤖 Creating AI Prompts table in Supabase...');
        console.log('================================================\n');
        
        // Read SQL file
        const sqlContent = fs.readFileSync('./supabase-ai-prompts-table.sql', 'utf8');
        
        // Split SQL commands (simple split by semicolon, handling multi-line)
        const sqlCommands = sqlContent
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('/*'));
        
        console.log(`📋 Found ${sqlCommands.length} SQL commands to execute\n`);
        
        // Test connection
        console.log('🔗 Testing Supabase connection...');
        const { data: testData, error: testError } = await supabaseAdmin
            .from('_test_connection')
            .select('*')
            .limit(1);
        
        if (testError && testError.code !== 'PGRST116') {
            throw testError;
        }
        
        console.log('✅ Supabase connection successful\n');
        
        // Execute SQL commands
        for (let i = 0; i < sqlCommands.length; i++) {
            const command = sqlCommands[i].trim();
            
            // Skip empty commands and comments
            if (!command || command.startsWith('--') || command.startsWith('/*')) {
                continue;
            }
            
            try {
                console.log(`⚡ Executing command ${i + 1}/${sqlCommands.length}...`);
                console.log(`   ${command.substring(0, 80)}${command.length > 80 ? '...' : ''}`);
                
                // Try to execute using rpc if available, otherwise use direct query
                const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: command });
                
                if (error) {
                    if (error.message.includes('already exists') || 
                        error.message.includes('duplicate key') ||
                        error.message.includes('relation') && error.message.includes('already exists')) {
                        console.log(`   ⚠️  Skipped (already exists)`);
                    } else if (error.message.includes('function exec_sql(sql => text) does not exist')) {
                        // Fallback: try direct SQL execution for simple commands
                        console.log(`   ⚠️  exec_sql not available, command may need manual execution`);
                    } else {
                        console.error(`   ❌ Failed: ${error.message}`);
                        // Don't throw, continue with next command
                    }
                } else {
                    console.log(`   ✅ Success`);
                }
            } catch (error) {
                console.log(`   ⚠️  Skipped: ${error.message}`);
            }
            
            console.log(''); // Empty line for readability
        }
        
        // Verify table creation
        console.log('🔍 Verifying ai_prompts table...');
        const { data: tableData, error: tableError } = await supabaseAdmin
            .from('ai_prompts')
            .select('count', { count: 'exact' })
            .limit(1);
        
        if (tableError) {
            console.log('⚠️  Could not verify table creation:', tableError.message);
            console.log('📝 Please run the SQL manually in Supabase Dashboard:');
            console.log('   1. Go to https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql');
            console.log('   2. Copy and paste the content of supabase-ai-prompts-table.sql');
            console.log('   3. Execute the SQL');
        } else {
            console.log('✅ ai_prompts table verified successfully!');
            console.log(`📊 Table contains ${tableData?.[0]?.count || 0} initial prompt records`);
        }
        
        console.log('\n🎉 AI Prompts table setup completed!');
        console.log('\n📋 Next steps:');
        console.log('   1. Check Supabase Dashboard to verify table structure');
        console.log('   2. Review initial prompt data');
        console.log('   3. Proceed with AI communication implementation');
        
    } catch (error) {
        console.error('\n❌ Error creating AI prompts table:', error);
        console.log('\n🔧 Manual setup required:');
        console.log('   1. Go to Supabase Dashboard SQL Editor');
        console.log('   2. Run the content of supabase-ai-prompts-table.sql');
        process.exit(1);
    }
}

// Run the script
createAiPromptsTable();
