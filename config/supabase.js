// Service Hub Portal - Supabase Configuration
// Supabase client for new database structure development

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Polyfill fetch for Node.js
global.fetch = fetch;

// Supabase configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://ivgzcwnmjeetdiccijmp.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Z3pjd25tamVldGRpY2Npam1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDc2ODksImV4cCI6MjA2OTIyMzY4OX0.ThFPu3_1kBiCF472QXjuH93SScql3i7NzF6Sg6wjMac';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Z3pjd25tamVldGRpY2Npam1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0NzY4OSwiZXhwIjoyMDY5MjIzNjg5fQ.pg_P_KKVq_ATan8YR5btGAK0HUe0TVzILHx_VwCmWPs';

// Create Supabase client for client-side operations (anon key)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase client for server-side operations (service role key)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Supabase Database Manager for new structure development
class SupabaseManager {
    
    // Test connection
    static async testConnection() {
        try {
            const { data, error } = await supabase
                .from('_test_connection')
                .select('*')
                .limit(1);
            
            if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist
                throw error;
            }
            
            console.log('Supabase connection successful');
            return { success: true };
        } catch (error) {
            console.error('Supabase connection error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Create new table structure for vehicles
    static async createVehiclesTable() {
        try {
            // This will be executed via SQL in Supabase dashboard
            // For now, we'll create the table structure definition
            const tableStructure = {
                name: 'vehicles',
                columns: [
                    { name: 'id', type: 'uuid', primaryKey: true, default: 'gen_random_uuid()' },
                    { name: 'vin', type: 'varchar(17)', unique: true, notNull: true },
                    { name: 'license_plate', type: 'varchar(20)' },
                    { name: 'brand', type: 'varchar(50)' },
                    { name: 'model', type: 'varchar(100)' },
                    { name: 'year', type: 'integer' },
                    { name: 'fuel_type', type: 'varchar(20)' },
                    { name: 'dealer_id', type: 'uuid', foreignKey: 'dealers(id)' },
                    { name: 'created_at', type: 'timestamp', default: 'now()' },
                    { name: 'updated_at', type: 'timestamp', default: 'now()' }
                ]
            };
            
            console.log('Vehicles table structure defined:', tableStructure);
            return { success: true, structure: tableStructure };
        } catch (error) {
            console.error('Error creating vehicles table structure:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Create new table structure for dealers
    static async createDealersTable() {
        try {
            const tableStructure = {
                name: 'dealers',
                columns: [
                    { name: 'id', type: 'uuid', primaryKey: true, default: 'gen_random_uuid()' },
                    { name: 'email', type: 'varchar(255)', unique: true, notNull: true },
                    { name: 'company_name', type: 'varchar(255)', notNull: true },
                    { name: 'first_name', type: 'varchar(100)' },
                    { name: 'last_name', type: 'varchar(100)' },
                    { name: 'dealer_type', type: 'varchar(50)' },
                    { name: 'active', type: 'boolean', default: true },
                    { name: 'created_at', type: 'timestamp', default: 'now()' },
                    { name: 'updated_at', type: 'timestamp', default: 'now()' }
                ]
            };
            
            console.log('Dealers table structure defined:', tableStructure);
            return { success: true, structure: tableStructure };
        } catch (error) {
            console.error('Error creating dealers table structure:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Get vehicle group members by vehicle ID (from PostgreSQL database)
    static async getVehicleGroupMembers(vehicleId) {
        try {
            const { data, error } = await supabase
                .from('vehicle_group_members')
                .select(`
                    group_id,
                    vehicle_groups (*)
                `)
                .eq('vehicle_id', vehicleId);
            
            if (error) throw error;
            
            const groups = data.map(item => item.vehicle_groups);
            return { success: true, data: groups };
        } catch (error) {
            console.error('Error fetching vehicle group members:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    // Check if vehicle is in a specific group
    static async isVehicleInGroup(vehicleId, groupId) {
        try {
            const { data, error } = await supabase
                .from('vehicle_group_members')
                .select('*')
                .eq('vehicle_id', vehicleId)
                .eq('group_id', groupId)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            
            return { success: true, isInGroup: !!data };
        } catch (error) {
            console.error('Error checking vehicle group membership:', error);
            return { success: false, error: error.message, isInGroup: false };
        }
    }
    
    // VEHICLE GROUPS FUNCTIONALITY
    
    // Create a new vehicle group
    static async createVehicleGroup(groupData) {
        try {
            const { data, error } = await supabase
                .from('vehicle_groups')
                .insert([groupData])
                .select();
            
            if (error) throw error;
            
            console.log('Vehicle group created:', data[0]);
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating vehicle group:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Get all vehicle groups for a dealer
    static async getVehicleGroupsByDealer(dealerId) {
        try {
            const { data, error } = await supabase
                .from('vehicle_groups')
                .select('*')
                .eq('dealer_id', dealerId)
                .eq('is_active', true)
                .order('name');
            
            if (error) throw error;
            
            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error fetching vehicle groups:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    // Add vehicle to group
    static async addVehicleToGroup(groupId, vehicleId) {
        try {
            const { data, error } = await supabase
                .from('vehicle_group_members')
                .insert([{
                    group_id: groupId,
                    vehicle_id: vehicleId
                }])
                .select();
            
            if (error) throw error;
            
            console.log('Vehicle added to group:', data[0]);
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error adding vehicle to group:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Remove vehicle from group
    static async removeVehicleFromGroup(groupId, vehicleId) {
        try {
            const { error } = await supabase
                .from('vehicle_group_members')
                .delete()
                .eq('group_id', groupId)
                .eq('vehicle_id', vehicleId);
            
            if (error) throw error;
            
            console.log('Vehicle removed from group');
            return { success: true };
        } catch (error) {
            console.error('Error removing vehicle from group:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Get vehicles in a specific group
    static async getVehiclesInGroup(groupId) {
        try {
            const { data, error } = await supabase
                .from('vehicle_group_members')
                .select(`
                    vehicle_id,
                    vehicles (*)
                `)
                .eq('group_id', groupId);
            
            if (error) throw error;
            
            const vehicles = data.map(item => item.vehicles);
            return { success: true, data: vehicles };
        } catch (error) {
            console.error('Error fetching vehicles in group:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    // Get all groups for a vehicle
    static async getGroupsForVehicle(vehicleId) {
        try {
            const { data, error } = await supabase
                .from('vehicle_group_members')
                .select(`
                    group_id,
                    vehicle_groups (*)
                `)
                .eq('vehicle_id', vehicleId);
            
            if (error) throw error;
            
            const groups = data.map(item => item.vehicle_groups);
            return { success: true, data: groups };
        } catch (error) {
            console.error('Error fetching groups for vehicle:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    // Update vehicle group
    static async updateVehicleGroup(groupId, updateData) {
        try {
            const { data, error } = await supabase
                .from('vehicle_groups')
                .update(updateData)
                .eq('id', groupId)
                .select();
            
            if (error) throw error;
            
            console.log('Vehicle group updated:', data[0]);
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error updating vehicle group:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Delete vehicle group (soft delete)
    static async deleteVehicleGroup(groupId) {
        try {
            const { data, error } = await supabase
                .from('vehicle_groups')
                .update({ is_active: false })
                .eq('id', groupId)
                .select();
            
            if (error) throw error;
            
            console.log('Vehicle group deleted:', data[0]);
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error deleting vehicle group:', error);
            return { success: false, error: error.message };
        }
    }

    // COMMUNICATIONS TABLES (dealer_signatures, test_clients)
    static async getDealerSignatures(dealerId) {
        try {
            const { data, error } = await supabase
                .from('dealer_signatures')
                .select('*')
                .eq('dealer_id', dealerId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message, data: [] };
        }
    }

    static async upsertDealerSignature(signature) {
        try {
            const payload = { ...signature };
            const { data, error } = await supabase
                .from('dealer_signatures')
                .upsert([payload], { onConflict: 'id' })
                .select()
                .single();
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deleteDealerSignature(id, dealerId) {
        try {
            const { error } = await supabase
                .from('dealer_signatures')
                .delete()
                .eq('id', id)
                .eq('dealer_id', dealerId);
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getTestClients(dealerId) {
        try {
            const { data, error } = await supabase
                .from('test_clients')
                .select('*')
                .eq('dealer_id', dealerId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message, data: [] };
        }
    }

    static async upsertTestClient(client) {
        try {
            const { data, error } = await supabase
                .from('test_clients')
                .upsert([client], { onConflict: 'id' })
                .select()
                .single();
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deleteTestClient(id, dealerId) {
        try {
            const { error } = await supabase
                .from('test_clients')
                .delete()
                .eq('id', id)
                .eq('dealer_id', dealerId);
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = {
    supabase,
    supabaseAdmin,
    SupabaseManager
}; 