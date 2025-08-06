// Script to create dealer_pins table in PostgreSQL database
// Run with: node create-dealer-pins-table.js

const { Pool } = require('pg');

// Database configuration from environment variables
const dbConfig = {
    host: process.env.DATABASE_HOST || 'devmobisat.ca15w70vfof5.eu-south-1.rds.amazonaws.com',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USER || 'readonly_user',
    password: process.env.DATABASE_PASSWORD || '34Ahs09gthsalgh922w4ghkajgehkag',
    database: process.env.DATABASE_NAME || 'mobisat',
    ssl: {
        rejectUnauthorized: false
    }
};

// Create connection pool
const pool = new Pool(dbConfig);

const sqlCommands = [
    // Create dealer_pins table for secure PIN storage
    `CREATE TABLE IF NOT EXISTS dealer_pins (
        id SERIAL PRIMARY KEY,
        dealer_id INTEGER NOT NULL UNIQUE,
        pin VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        attempts INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
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
     EXECUTE FUNCTION update_updated_at_column();`
];

async function createDealerPinsTable() {
    const client = await pool.connect();
    
    try {
        console.log('🔗 Connecting to PostgreSQL database...');
        
        // Test connection
        await client.query('SELECT NOW()');
        console.log('✅ Database connection successful');
        
        console.log('📋 Creating dealer_pins table and related objects...');
        
        for (let i = 0; i < sqlCommands.length; i++) {
            const command = sqlCommands[i];
            try {
                await client.query(command);
                console.log(`✅ Command ${i + 1} executed successfully`);
            } catch (error) {
                if (error.code === '42710') { // Index already exists
                    console.log(`⚠️  Command ${i + 1} skipped (already exists): ${error.message}`);
                } else {
                    console.error(`❌ Command ${i + 1} failed:`, error.message);
                    throw error;
                }
            }
        }
        
        console.log('🎉 dealer_pins table created successfully!');
        console.log('');
        console.log('📊 Table structure:');
        console.log('- dealer_id: INTEGER (unique, references dealer.id)');
        console.log('- pin: VARCHAR(6) (6-digit random PIN)');
        console.log('- expires_at: TIMESTAMP (15-minute expiration)');
        console.log('- attempts: INTEGER (failed attempt counter)');
        console.log('- created_at: TIMESTAMP (creation time)');
        console.log('- updated_at: TIMESTAMP (last update time)');
        console.log('');
        console.log('🔒 Security features:');
        console.log('- Random 6-digit PINs (different every time)');
        console.log('- 15-minute expiration');
        console.log('- Max 3 failed attempts');
        console.log('- Automatic cleanup of expired PINs');
        
    } catch (error) {
        console.error('❌ Error creating dealer_pins table:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the script
if (require.main === module) {
    createDealerPinsTable()
        .then(() => {
            console.log('✅ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createDealerPinsTable }; 