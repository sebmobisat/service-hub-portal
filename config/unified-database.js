// Service Hub Portal - Unified Database Manager
// Handles both Mobisat (read-only) and Supabase (read/write) databases

const { DatabaseManager } = require('./database.js');
const { SupabaseManager } = require('./supabase.js');

class UnifiedDatabaseManager {
    
    constructor() {
        this.currentDb = 'mobisat'; // Current database in use
        this.supabaseEnabled = true; // Supabase is enabled for new features
    }
    
    // Test both database connections
    static async testConnections() {
        console.log('Testing database connections...');
        
        // Test Mobisat connection
        try {
            const mobisatTest = await DatabaseManager.executeQuery('SELECT 1 as test');
            console.log('✅ Mobisat database connection: OK');
        } catch (error) {
            console.error('❌ Mobisat database connection failed:', error.message);
        }
        
        // Test Supabase connection
        try {
            const supabaseTest = await SupabaseManager.testConnection();
            if (supabaseTest.success) {
                console.log('✅ Supabase database connection: OK');
            } else {
                console.error('❌ Supabase database connection failed:', supabaseTest.error);
            }
        } catch (error) {
            console.error('❌ Supabase database connection failed:', error.message);
        }
    }
    
    // Get dealer by email (from Mobisat - read-only)
    static async getDealerByEmail(email) {
        console.log(`[READ-ONLY] Fetching dealer from Mobisat: ${email}`);
        return await DatabaseManager.getDealerByEmail(email);
    }
    
    // Validate dealer PIN (from Mobisat - read-only)
    static async validateDealerPin(email, pin) {
        console.log(`[READ-ONLY] Validating dealer PIN from Mobisat: ${email}`);
        return await DatabaseManager.validateDealerPin(email, pin);
    }
    
    // Get all dealers (from Mobisat - read-only)
    static async getAllDealers() {
        console.log('[READ-ONLY] Fetching all dealers from Mobisat');
        return await DatabaseManager.getAllDealers();
    }
    
    // Get dealer's vehicle groups (combines Mobisat dealer data + Supabase groups)
    static async getDealerVehicleGroups(dealerId) {
        console.log(`[UNIFIED] Fetching vehicle groups for dealer: ${dealerId}`);
        
        try {
            // Get dealer information from Mobisat
            const dealerQuery = `
                SELECT id, "companyLoginEmail", "companyName", "companyTaxCode", 
                       "companyCity", "companyProvincia", "brand", "createdAt"
                FROM dealer 
                WHERE id = $1
            `;
            
            const dealerResults = await DatabaseManager.executeQuery(dealerQuery, [dealerId]);
            if (dealerResults.length === 0) {
                console.log(`[MOBISAT] Dealer not found: ${dealerId}`);
                return { dealer: null, groups: [] };
            }
            
            const dealer = dealerResults[0];
            
            // Get vehicle groups from Supabase
            const groupsResult = await SupabaseManager.getVehicleGroupsByDealer(dealerId);
            const groups = groupsResult.success ? groupsResult.data : [];
            
            console.log(`[UNIFIED] Found ${groups.length} groups for dealer ${dealerId}`);
            
            return {
                dealer: dealer,
                groups: groups
            };
            
        } catch (error) {
            console.error('Error fetching dealer vehicle groups:', error);
            return { dealer: null, groups: [] };
        }
    }
    
    // Get dealer's vehicles with their groups
    static async getDealerVehiclesWithGroups(dealerId) {
        console.log(`[UNIFIED] Fetching vehicles with groups for dealer: ${dealerId}`);
        
        try {
            // CORRECT DATA FLOW: Certificate → Device → Vehicle
            const vehiclesQuery = `
                SELECT DISTINCT v.id, v.vin, v.plate as license_plate, v.brand, v.model, v.year, 
                       v."fuelType" as fuel_type,
                       c.id as certificate_id,
                       dev.id as device_id,
                       d."companyName" as dealer_name
                FROM certificate c
                LEFT JOIN device dev ON c."deviceId" = dev.id
                LEFT JOIN vehicle v ON dev."vehicleId" = v.id
                LEFT JOIN dealer d ON c."dealerId" = d.id
                WHERE c."dealerId" = $1 
                  AND v.id IS NOT NULL
                ORDER BY c."createdAt" DESC
            `;
            
            const vehicles = await DatabaseManager.executeQuery(vehiclesQuery, [dealerId]);
            
            // For each vehicle, get its groups from Supabase
            const vehiclesWithGroups = await Promise.all(
                vehicles.map(async (vehicle) => {
                    const groupsResult = await SupabaseManager.getVehicleGroupMembers(vehicle.id);
                    return {
                        ...vehicle,
                        groups: groupsResult.success ? groupsResult.data : []
                    };
                })
            );
            
            console.log(`[UNIFIED] Found ${vehicles.length} vehicles with groups for dealer ${dealerId}`);
            return vehiclesWithGroups;
            
        } catch (error) {
            console.error('Error fetching dealer vehicles with groups:', error);
            return [];
        }
    }
    
    // Get vehicles with their group information (from Mobisat + Supabase groups)
    static async getVehiclesWithGroups() {
        console.log('[UNIFIED] Fetching vehicles with group information');
        
        try {
            // CORRECT DATA FLOW: Certificate → Device → Vehicle
            const query = `
                SELECT DISTINCT v.id, v.vin, v.license_plate, v.brand, v.model, v.year, 
                       v.fuel_type, v.dealer_id, v.created_at, v.updated_at,
                       d."companyName" as dealer_name,
                       c.id as certificate_id,
                       dev.id as device_id
                FROM certificate c
                LEFT JOIN device dev ON c."deviceId" = dev.id
                LEFT JOIN vehicle v ON dev."vehicleId" = v.id
                LEFT JOIN dealer d ON v.dealer_id = d.id
                WHERE v.active = true 
                  AND v.id IS NOT NULL
                ORDER BY v.created_at DESC
            `;
            
            const vehicles = await DatabaseManager.executeQuery(query);
            
            // For each vehicle, get its groups from Supabase
            const vehiclesWithGroups = await Promise.all(
                vehicles.map(async (vehicle) => {
                    const groupsResult = await SupabaseManager.getVehicleGroupMembers(vehicle.id);
                    return {
                        ...vehicle,
                        groups: groupsResult.success ? groupsResult.data : []
                    };
                })
            );
            
            console.log(`[UNIFIED] Found ${vehicles.length} vehicles with group information`);
            return vehiclesWithGroups;
            
        } catch (error) {
            console.error('Error fetching vehicles with groups:', error);
            return [];
        }
    }
    
    // Get vehicles in a specific group
    static async getVehiclesInGroup(groupId) {
        console.log(`[UNIFIED] Fetching vehicles in group: ${groupId}`);
        
        try {
            // Get vehicle IDs in the group from Supabase
            const { data: groupMembers, error } = await supabase
                .from('vehicle_group_members')
                .select('vehicle_id')
                .eq('group_id', groupId);
            
            if (error) {
                console.error('Error fetching group members:', error);
                return [];
            }
            
            if (!groupMembers || groupMembers.length === 0) {
                return [];
            }
            
            // Get vehicle details from Mobisat for these IDs (using correct data flow)
            const vehicleIds = groupMembers.map(member => member.vehicle_id);
            const placeholders = vehicleIds.map((_, index) => `$${index + 1}`).join(',');
            
            const query = `
                SELECT DISTINCT v.id, v.vin, v.license_plate, v.brand, v.model, v.year, 
                       v.fuel_type, v.dealer_id, v.created_at, v.updated_at,
                       d."companyName" as dealer_name,
                       c.id as certificate_id,
                       dev.id as device_id
                FROM certificate c
                LEFT JOIN device dev ON c."deviceId" = dev.id
                LEFT JOIN vehicle v ON dev."vehicleId" = v.id
                LEFT JOIN dealer d ON v.dealer_id = d.id
                WHERE v.id = ANY($1) AND v.active = true
                ORDER BY v.created_at DESC
            `;
            
            const vehicles = await DatabaseManager.executeQuery(query, [vehicleIds]);
            console.log(`[UNIFIED] Found ${vehicles.length} vehicles in group ${groupId}`);
            
            return vehicles;
            
        } catch (error) {
            console.error('Error fetching vehicles in group:', error);
            return [];
        }
    }
    
    // Add vehicle to group (vehicle data stays in Mobisat, group assignment in Supabase)
    static async addVehicleToGroup(vehicleId, groupId) {
        console.log(`[SUPABASE] Adding vehicle ${vehicleId} to group ${groupId}`);
        return await SupabaseManager.addVehicleToGroup(groupId, vehicleId);
    }
    
    // Remove vehicle from group
    static async removeVehicleFromGroup(vehicleId, groupId) {
        console.log(`[SUPABASE] Removing vehicle ${vehicleId} from group ${groupId}`);
        return await SupabaseManager.removeVehicleFromGroup(groupId, vehicleId);
    }
    
    // Get vehicle by ID (from Mobisat database)
    static async getVehicleById(vehicleId) {
        console.log(`[MOBISAT] Fetching vehicle by ID: ${vehicleId}`);
        
        try {
            // CORRECT DATA FLOW: Certificate → Device → Vehicle
            const query = `
                SELECT DISTINCT v.id, v.vin, v.license_plate, v.brand, v.model, v.year, 
                       v.fuel_type, v.dealer_id, v.created_at, v.updated_at,
                       d."companyName" as dealer_name,
                       c.id as certificate_id,
                       dev.id as device_id
                FROM certificate c
                LEFT JOIN device dev ON c."deviceId" = dev.id
                LEFT JOIN vehicle v ON dev."vehicleId" = v.id
                LEFT JOIN dealer d ON v.dealer_id = d.id
                WHERE v.id = $1 AND v.active = true
            `;
            
            const results = await DatabaseManager.executeQuery(query, [vehicleId]);
            if (results.length > 0) {
                // Get groups for this vehicle from Supabase
                const groupsResult = await SupabaseManager.getVehicleGroupMembers(vehicleId);
                const vehicle = results[0];
                vehicle.groups = groupsResult.success ? groupsResult.data : [];
                
                return vehicle;
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching vehicle by ID:', error);
            return null;
        }
    }
    
    // Create new table structures in Supabase
    static async initializeSupabaseTables() {
        console.log('[SUPABASE] Initializing table structures');
        
        const vehiclesResult = await SupabaseManager.createVehiclesTable();
        const dealersResult = await SupabaseManager.createDealersTable();
        
        return {
            vehicles: vehiclesResult,
            dealers: dealersResult
        };
    }
    
    // Migration status
    static getMigrationStatus() {
        return {
            currentPhase: 'Phase 1 - Supabase Setup',
            mobisatStatus: 'read-only',
            supabaseStatus: 'active',
            nextPhase: 'Phase 2 - Table Creation and Testing'
        };
    }
}

module.exports = {
    UnifiedDatabaseManager
}; 