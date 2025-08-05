// Service Hub Portal - Database Configuration
// PostgreSQL connection to Mobisat database

const { Pool } = require('pg');

// Database configuration based on mobisat-db-reader reference
const dbConfig = {
    host: 'devmobisat.ca15w70vfof5.eu-south-1.rds.amazonaws.com',
    port: 5432,
    user: 'readonly_user',
    password: '34Ahs09gthsalgh922w4ghkajgehkag',
    database: 'mobisat',
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 10
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test connection
pool.on('connect', () => {
    console.log('Connected to Mobisat PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

// Database helper functions
class DatabaseManager {
    
    // Execute query with error handling
    static async executeQuery(query, params = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        } finally {
            client.release();
        }
    }
    
    // Get dealer by email
    static async getDealerByEmail(email) {
        const query = `
            SELECT id, "companyLoginEmail", "companyName", "firstName", "lastName", 
                   "dealerType", active, created_at, updated_at
            FROM dealer 
            WHERE LOWER("companyLoginEmail") = LOWER($1) 
            AND active = true
        `;
        
        try {
            const results = await this.executeQuery(query, [email]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('Error fetching dealer:', error);
            return null;
        }
    }
    
    // Validate dealer PIN (assuming PIN is stored or generated)
    static async validateDealerPin(email, pin) {
        const dealer = await this.getDealerByEmail(email);
        if (!dealer) {
            return { success: false, error: 'dealer_not_found' };
        }
        
        // For now, we'll use a simple PIN validation
        // In production, this should be more secure
        const validPin = '123456'; // Demo PIN
        
        if (pin === validPin) {
            return {
                success: true,
                dealer: {
                    id: dealer.id,
                    email: dealer.companyLoginEmail,
                    companyName: dealer.companyName,
                    name: `${dealer.firstName} ${dealer.lastName}`,
                    dealerType: dealer.dealerType
                }
            };
        }
        
        return { success: false, error: 'invalid_pin' };
    }
    
    // Get all dealers (for admin purposes)
    static async getAllDealers() {
        const query = `
            SELECT id, companyLoginEmail, companyName, firstName, lastName, 
                   dealerType, active, created_at, updated_at
            FROM dealer 
            WHERE active = true
            ORDER BY companyName
        `;
        
        try {
            return await this.executeQuery(query);
        } catch (error) {
            console.error('Error fetching dealers:', error);
            return [];
        }
    }
    
    // Close all connections
    static async closePool() {
        await pool.end();
        console.log('Database connection pool closed');
    }
}

module.exports = {
    pool,
    DatabaseManager
}; 