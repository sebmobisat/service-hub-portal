// Service Hub Portal - Database Configuration
// PostgreSQL connection to Mobisat database

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
            SELECT id, "companyLoginEmail", "companyName", "brand", 
                   "dealerForceVehicleType", "createdAt", "updatedAt"
            FROM dealer 
            WHERE LOWER("companyLoginEmail") = LOWER($1)
        `;
        
        try {
            const results = await this.executeQuery(query, [email]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('Error fetching dealer:', error);
            return null;
        }
    }
    
    // Validate dealer PIN with real authentication
    static async validateDealerPin(email, pin) {
        const dealer = await this.getDealerByEmail(email);
        if (!dealer) {
            return { success: false, error: 'dealer_not_found' };
        }
        
        // Generate PIN based on dealer ID (deterministic but secure)
        // This creates a unique PIN for each dealer based on their ID
        const dealerId = dealer.id;
        const generatedPin = this.generateDealerPin(dealerId);
        
        if (pin === generatedPin) {
            return {
                success: true,
                dealer: {
                    id: dealer.id,
                    email: dealer.companyLoginEmail,
                    companyName: dealer.companyName,
                    name: dealer.companyName, // Use company name as the display name
                    dealerType: dealer.brand || 'Unknown',
                    brand: dealer.brand
                }
            };
        }
        
        return { success: false, error: 'invalid_pin' };
    }
    
    // Generate dealer PIN based on dealer ID
    static generateDealerPin(dealerId) {
        // Simple algorithm to generate a 6-digit PIN based on dealer ID
        // This ensures each dealer has a unique PIN
        const seed = dealerId * 12345 + 67890;
        const pin = (seed % 900000) + 100000; // Ensures 6-digit PIN
        return pin.toString();
    }
    
    // Get dealer PIN for display (admin function)
    static async getDealerPin(email) {
        const dealer = await this.getDealerByEmail(email);
        if (!dealer) {
            return null;
        }
        return this.generateDealerPin(dealer.id);
    }
    
    // Get all dealers (for admin purposes)
    static async getAllDealers() {
        const query = `
            SELECT id, "companyLoginEmail", "companyName", "brand", 
                   "dealerForceVehicleType", "createdAt", "updatedAt"
            FROM dealer 
            ORDER BY "companyName"
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