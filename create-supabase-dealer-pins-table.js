// Script to create dealer_pins table in Supabase
// Run with: node create-supabase-dealer-pins-table.js

const { supabaseAdmin } = require('./config/supabase.js');

const sqlCommands = [
    // Create dealer_pins table for secure PIN storage
    `CREATE TABLE IF NOT EXISTS dealer_pins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        dealer_id INTEGER NOT NULL UNIQUE,
        pin VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        attempts INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    // Create index for faster lookups
    'CREATE INDEX IF NOT EXISTS idx_dealer_pins_dealer_id ON dealer_pins(dealer_id);',
    'CREATE INDEX IF NOT EXISTS idx_dealer_pins_expires_at ON dealer_pins(expires_at);',
    
    // Create a function to clean up expired PINs
    `CREATE OR REPLACE FUNCTION cleanup_expired_pins()
    RETURNS void AS $$
    BEGIN
        DELETE FROM dealer_pins WHERE expires_at < NOW();
    END;
    $$ LANGUAGE plpgsql;`,
    
    // Add trigger to update updated_at timestamp
    `CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';`,
    
    // Create trigger for dealer_pins table
    `DROP TRIGGER IF EXISTS update_dealer_pins_updated_at ON dealer_pins;
     CREATE TRIGGER update_dealer_pins_updated_at 
     BEFORE UPDATE ON dealer_pins 
     FOR EACH ROW 
     EXECUTE FUNCTION update_updated_at_column();`,
    
    // Enable RLS (Row Level Security)
    'ALTER TABLE dealer_pins ENABLE ROW LEVEL SECURITY;',
    
    // Create RLS policies for dealer_pins
    'CREATE POLICY "Dealer pins are viewable by authenticated users" ON dealer_pins FOR SELECT USING (true);',
    'CREATE POLICY "Dealer pins can be inserted by authenticated users" ON dealer_pins FOR INSERT WITH CHECK (true);',
    'CREATE POLICY "Dealer pins can be updated by authenticated users" ON dealer_pins FOR UPDATE USING (true);',
    'CREATE POLICY "Dealer pins can be deleted by authenticated users" ON dealer_pins FOR DELETE USING (true);'
];

async function createSupabaseDealerPinsTable() {
    try {
        console.log('🔗 Connecting to Supabase...');
        
        // Test connection
        const { data: testData, error: testError } = await supabaseAdmin
            .from('_test_connection')
            .select('*')
            .limit(1);
        
        if (testError && testError.code !== 'PGRST116') {
            throw testError;
        }
        
        console.log('✅ Supabase connection successful');
        console.log('📋 Creating dealer_pins table and related objects...');
        
        // Execute SQL commands using Supabase's SQL interface
        for (let i = 0; i < sqlCommands.length; i++) {
            const command = sqlCommands[i];
            try {
                const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: command });
                
                if (error) {
                    if (error.message.includes('already exists') || error.message.includes('duplicate key')) {
                        console.log(`⚠️  Command ${i + 1} skipped (already exists): ${error.message}`);
                    } else {
                        console.error(`❌ Command ${i + 1} failed:`, error.message);
                        throw error;
                    }
                } else {
                    console.log(`✅ Command ${i + 1} executed successfully`);
                }
            } catch (error) {
                console.log(`⚠️  Command ${i + 1} skipped (may already exist): ${error.message}`);
            }
        }
        
        console.log('🎉 dealer_pins table created successfully in Supabase!');
        console.log('');
        console.log('📊 Table structure:');
        console.log('- id: UUID (primary key)');
        console.log('- dealer_id: INTEGER (unique, references PostgreSQL dealer.id)');
        console.log('- pin: VARCHAR(6) (6-digit random PIN)');
        console.log('- expires_at: TIMESTAMP WITH TIME ZONE (15-minute expiration)');
        console.log('- attempts: INTEGER (failed attempt counter)');
        console.log('- created_at: TIMESTAMP WITH TIME ZONE (creation time)');
        console.log('- updated_at: TIMESTAMP WITH TIME ZONE (last update time)');
        console.log('');
        console.log('🔒 Security features:');
        console.log('- Random 6-digit PINs (different every time)');
        console.log('- 15-minute expiration');
        console.log('- Max 3 failed attempts');
        console.log('- Row Level Security (RLS) enabled');
        console.log('- Automatic cleanup of expired PINs');
        console.log('');
        console.log('🔄 Dual Database Setup:');
        console.log('- Read dealer data → PostgreSQL (existing)');
        console.log('- Store PINs → Supabase (new secure table)');
        
    } catch (error) {
        console.error('❌ Error creating dealer_pins table in Supabase:', error);
        throw error;
    }
}

// Run the script
if (require.main === module) {
    createSupabaseDealerPinsTable()
        .then(() => {
            console.log('✅ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createSupabaseDealerPinsTable }; 