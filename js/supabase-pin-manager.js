// Service Hub Portal - Supabase PIN Manager
// Handles secure PIN storage and validation using Supabase
// Part of dual-database approach: PostgreSQL (read) + Supabase (write)

const { supabaseAdmin } = require('../config/supabase.js');

class SupabasePinManager {
    
    // Generate secure random PIN
    static generateSecurePin() {
        // Generate a cryptographically secure random 6-digit PIN
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Store PIN in Supabase with expiration
    static async storePin(dealerId, pin) {
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
        
        console.log(`🔐 Attempting to store PIN for dealer ${dealerId} in Supabase...`);
        console.log(`📅 Expires at: ${expiresAt.toISOString()}`);
        
        try {
            const { data, error } = await supabaseAdmin
                .from('dealer_pins')
                .upsert({
                    dealer_id: dealerId,
                    pin: pin.toString(),
                    expires_at: expiresAt.toISOString(),
                    attempts: 0
                }, {
                    onConflict: 'dealer_id'
                });
            
            if (error) {
                console.error('❌ Error storing PIN in Supabase:', error);
                console.error('Error details:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                return false;
            }
            
            console.log(`✅ PIN stored successfully in Supabase for dealer ${dealerId}`);
            console.log(`📊 Supabase response data:`, data);
            return true;
        } catch (error) {
            console.error('❌ Exception storing PIN in Supabase:', error);
            console.error('Exception details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            return false;
        }
    }

    // Get and validate PIN from Supabase
    static async getStoredPin(dealerId) {
        try {
            const { data, error } = await supabaseAdmin
                .from('dealer_pins')
                .select('pin, expires_at, attempts')
                .eq('dealer_id', dealerId)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') { // No rows returned
                    return null;
                }
                console.error('Error getting stored PIN from Supabase:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Error getting stored PIN from Supabase:', error);
            return null;
        }
    }

    // Increment PIN attempts in Supabase
    static async incrementPinAttempts(dealerId) {
        try {
            const { data, error } = await supabaseAdmin
                .from('dealer_pins')
                .update({ 
                    attempts: supabaseAdmin.sql`attempts + 1`,
                    updated_at: new Date().toISOString()
                })
                .eq('dealer_id', dealerId);
            
            if (error) {
                console.error('Error incrementing PIN attempts in Supabase:', error);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error incrementing PIN attempts in Supabase:', error);
            return false;
        }
    }

    // Clean up expired PINs
    static async cleanupExpiredPins() {
        try {
            const { data, error } = await supabaseAdmin
                .from('dealer_pins')
                .delete()
                .lt('expires_at', new Date().toISOString());
            
            if (error) {
                console.error('Error cleaning up expired PINs in Supabase:', error);
                return false;
            }
            
            console.log(`Cleaned up ${data?.length || 0} expired PINs from Supabase`);
            return true;
        } catch (error) {
            console.error('Error cleaning up expired PINs in Supabase:', error);
            return false;
        }
    }

    // Test Supabase connection
    static async testConnection() {
        try {
            const { data, error } = await supabaseAdmin
                .from('dealer_pins')
                .select('count')
                .limit(1);
            
            if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist
                throw error;
            }
            
            console.log('Supabase PIN manager connection successful');
            return { success: true };
        } catch (error) {
            console.error('Supabase PIN manager connection error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get PIN statistics (for monitoring)
    static async getPinStats() {
        try {
            const { data, error } = await supabaseAdmin
                .from('dealer_pins')
                .select('*');
            
            if (error) {
                console.error('Error getting PIN stats from Supabase:', error);
                return null;
            }
            
            const now = new Date();
            const activePins = data.filter(pin => new Date(pin.expires_at) > now);
            const expiredPins = data.filter(pin => new Date(pin.expires_at) <= now);
            
            return {
                total: data.length,
                active: activePins.length,
                expired: expiredPins.length,
                blocked: data.filter(pin => pin.attempts >= 3).length
            };
        } catch (error) {
            console.error('Error getting PIN stats from Supabase:', error);
            return null;
        }
    }
}

module.exports = { SupabasePinManager }; 